import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import EnterpriseRequest from "@/models/EnterpriseRequest";
import { sendMail } from "@/lib/mailer";
import { emailTemplates } from "@/lib/emailTemplates";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const {
      companyName,
      contactName,
      businessEmail,
      phoneNumber,
      industry,
      numberOfSearches,
      numberOfUsers,
      whenNeeded,
      message,
    } = body || {};

    if (
      !companyName ||
      !contactName ||
      !businessEmail ||
      !phoneNumber ||
      !industry ||
      !numberOfSearches ||
      !numberOfUsers ||
      !whenNeeded
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Ensure each email can submit only one enterprise request
    const existingRequest = await EnterpriseRequest.findOne({
      businessEmail: businessEmail.toLowerCase().trim(),
    });
    if (existingRequest) {
      return NextResponse.json(
        { error: "An enterprise request with this email already exists." },
        { status: 409 }
      );
    }

    const doc = await EnterpriseRequest.create({
      companyName,
      contactName,
      businessEmail,
      phoneNumber,
      industry,
      numberOfSearches: Number(numberOfSearches),
      numberOfUsers: Number(numberOfUsers),
      whenNeeded,
      message,
    });

    // Notify owner (SMTP_USER) of new lead (don't fail the request if email fails)
    const ownerEmail = (process.env.SMTP_USER || "").trim();
    if (ownerEmail) {
      try {
        const t = emailTemplates.enterpriseLeadNotification;
        const payload = {
          companyName,
          contactName,
          businessEmail: String(businessEmail).trim(),
          phoneNumber,
          industry,
          numberOfSearches: String(numberOfSearches),
          numberOfUsers: String(numberOfUsers),
          whenNeeded,
          message: message || "",
        };
        await sendMail({
          to: ownerEmail,
          subject: t.subject(payload),
          text: t.text(payload),
          html: t.html(payload),
        });
      } catch (emailErr) {
        console.error("Enterprise lead notification email failed:", emailErr);
      }
    }

    return NextResponse.json(
      { message: "Enterprise request submitted", id: doc._id },
      { status: 201 }
    );
  } catch (err) {
    console.error("Enterprise request error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
