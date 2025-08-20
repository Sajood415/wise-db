"use client";

import { useState } from "react";
import { useToast } from "@/contexts/ToastContext";

export default function EnterpriseForm() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    businessEmail: "",
    phoneNumber: "",
    industry: "",
    numberOfSearches: "",
    numberOfUsers: "",
    whenNeeded: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const industries = [
    "Financial Services",
    "E-commerce",
    "Healthcare",
    "Technology",
    "Real Estate",
    "Insurance",
    "Legal Services",
    "Consulting",
    "Manufacturing",
    "Other",
  ];

  // Implementation Timeline removed

  const whenNeededOptions = [
    "Immediately",
    "Within 1 week",
    "Within 1 month",
    "Within 3 months",
    "Just exploring options",
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isValidEmail = (email: string) =>
    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.[A-Za-z]{2,})+$/.test(email);

  const isValidPhone = (phone: string) =>
    /^[0-9()+\-\s]{7,20}$/.test(phone);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.companyName.trim()) nextErrors.companyName = "Company name is required";
    if (!formData.contactName.trim()) nextErrors.contactName = "Contact name is required";
    if (!formData.businessEmail.trim()) nextErrors.businessEmail = "Email is required";
    else if (!isValidEmail(formData.businessEmail.trim())) nextErrors.businessEmail = "Enter a valid email";
    if (!formData.phoneNumber.trim()) nextErrors.phoneNumber = "Phone number is required";
    else if (!isValidPhone(formData.phoneNumber.trim())) nextErrors.phoneNumber = "Enter a valid phone number";
    if (!formData.industry) nextErrors.industry = "Industry is required";
    if (!formData.numberOfSearches) nextErrors.numberOfSearches = "Number of searches is required";
    if (!formData.numberOfUsers) nextErrors.numberOfUsers = "Number of users is required";
    if (!formData.whenNeeded) nextErrors.whenNeeded = "Timeframe is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSubmitting(true);
      const res = await fetch("/api/enterprise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Submission failed", "error");
        return;
      }
      showToast("Request submitted successfully. We will contact you soon.", "success");
      setFormData({
        companyName: "",
        contactName: "",
        businessEmail: "",
        phoneNumber: "",
        industry: "",
        numberOfSearches: "",
        numberOfUsers: "",
        whenNeeded: "",
        message: "",
      });
      setErrors({});
    } catch (err) {
      showToast("Network error. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      companyName: "",
      contactName: "",
      businessEmail: "",
      phoneNumber: "",
      industry: "",
      numberOfSearches: "",
      numberOfUsers: "",
      whenNeeded: "",
      message: "",
    });
    setErrors({});
  };

  const handlePhoneChange = (value: string) => {
    // Allow only digits, spaces, parentheses, plus, and dashes
    const cleaned = value.replace(/[^0-9()+\-\s]/g, "");
    handleInputChange("phoneNumber", cleaned);
  };

  const handleNumericChange = (field: "numberOfSearches" | "numberOfUsers", value: string) => {
    const cleaned = value.replace(/[^0-9]/g, "");
    handleInputChange(field, cleaned);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Request Enterprise Access
        </h2>
        <p className="text-gray-600">
          Fill out the form below and our sales team will contact you within 24
          hours to discuss pricing, technical requirements, and next steps.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => handleInputChange("companyName", e.target.value)}
              placeholder="Your Company Inc."
              className={`w-full px-3 py-2 border ${errors.companyName ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500`}
              required
            />
            {errors.companyName && (
              <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={formData.contactName}
              onChange={(e) => handleInputChange("contactName", e.target.value)}
              placeholder="John Doe"
              className={`w-full px-3 py-2 border ${errors.contactName ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500`}
              required
            />
            {errors.contactName && (
              <p className="mt-1 text-sm text-red-600">{errors.contactName}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              value={formData.businessEmail}
              onChange={(e) =>
                handleInputChange("businessEmail", e.target.value)
              }
              placeholder="john@company.com"
              className={`w-full px-3 py-2 border ${errors.businessEmail ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500`}
              required
            />
            {errors.businessEmail && (
              <p className="mt-1 text-sm text-red-600">{errors.businessEmail}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number <span className="text-red-600">*</span>
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="+1 (555) 123-4567"
              className={`w-full px-3 py-2 border ${errors.phoneNumber ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500`}
              required
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industry <span className="text-red-600">*</span>
            </label>
            <select
              value={formData.industry}
              onChange={(e) => handleInputChange("industry", e.target.value)}
              className={`w-full px-3 py-2 border ${errors.industry ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white`}
              required
            >
              <option value="" className="text-gray-500">
                Select industry
              </option>
              {industries.map((industry) => (
                <option
                  key={industry}
                  value={industry}
                  className="text-gray-900"
                >
                  {industry}
                </option>
              ))}
            </select>
            {errors.industry && (
              <p className="mt-1 text-sm text-red-600">{errors.industry}</p>
            )}
          </div>
          {/* Removed API Access Type field as requested */}
        </div>

        {/* Implementation Timeline removed */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Searches Needed <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={formData.numberOfSearches}
              onChange={(e) => handleNumericChange("numberOfSearches", e.target.value)}
              placeholder="e.g., 10000"
              className={`w-full px-3 py-2 border ${errors.numberOfSearches ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500`}
              required
            />
            {errors.numberOfSearches && (
              <p className="mt-1 text-sm text-red-600">{errors.numberOfSearches}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Users Needed <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={formData.numberOfUsers}
              onChange={(e) => handleNumericChange("numberOfUsers", e.target.value)}
              placeholder="e.g., 25"
              className={`w-full px-3 py-2 border ${errors.numberOfUsers ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500`}
              required
            />
            {errors.numberOfUsers && (
              <p className="mt-1 text-sm text-red-600">{errors.numberOfUsers}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            When do you need this? <span className="text-red-600">*</span>
          </label>
          <select
            value={formData.whenNeeded}
            onChange={(e) => handleInputChange("whenNeeded", e.target.value)}
            className={`w-full px-3 py-2 border ${errors.whenNeeded ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white`}
            required
          >
            <option value="" className="text-gray-500">
              Select timeframe
            </option>
            {whenNeededOptions.map((option) => (
              <option key={option} value={option} className="text-gray-900">
                {option}
              </option>
            ))}
          </select>
          {errors.whenNeeded && (
            <p className="mt-1 text-sm text-red-600">{errors.whenNeeded}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message
          </label>
          <textarea
            rows={4}
            value={formData.message}
            onChange={(e) => handleInputChange("message", e.target.value)}
            placeholder="Tell us about your use case, expected volume, and any specific requirements..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            <strong>Next Steps:</strong> Our sales team will contact you within
            24 hours to discuss pricing, technical requirements, and next steps.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            type="submit"
            disabled={submitting}
            className={`btn-primary flex-1 sm:flex-initial px-8 py-3 ${submitting ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {submitting ? (
              <span className="inline-flex items-center">
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                Submitting...
              </span>
            ) : (
              "Submit Request"
            )}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="btn-secondary flex-1 sm:flex-initial px-8 py-3"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
