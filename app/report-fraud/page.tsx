import { Metadata } from "next";
import ReportFraudForm from "./ReportFraudForm";

export const metadata: Metadata = {
  title: "Report Fraud - Wise DB | Submit Fraud Report",
  description:
    "Report fraudulent activities securely and anonymously. Help protect others by sharing your fraud experience with our global community.",
  keywords:
    "report fraud, fraud reporting, scam report, anonymous reporting, fraud alert, business fraud, online fraud",
  openGraph: {
    title: "Report Fraud - Wise DB | Submit Fraud Report",
    description:
      "Report fraudulent activities securely to help protect the community.",
    url: "https://wisedb.com/report-fraud",
    type: "website",
  },
};

export default function ReportFraud() {
  return <ReportFraudForm />;
}
