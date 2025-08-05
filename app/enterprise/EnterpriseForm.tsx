"use client";

import { useState } from "react";

export default function EnterpriseForm() {
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    businessEmail: "",
    phoneNumber: "",
    industry: "",
    apiAccessType: "",
    implementationTimeline: "",
    numberOfSearches: "",
    numberOfUsers: "",
    whenNeeded: "",
    message: "",
  });

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

  const apiAccessTypes = [
    "Read-Only API",
    "Full API Access",
    "Custom Integration",
    "Webhook Integration",
    "Bulk Processing API",
  ];

  const timelines = [
    "Immediate (1-2 weeks)",
    "1 Month",
    "2-3 Months",
    "3-6 Months",
    "6+ Months",
  ];

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Enterprise form submitted:", formData);
    alert(
      "Thank you for your interest! Our sales team will contact you within 24 hours."
    );
  };

  const handleCancel = () => {
    setFormData({
      companyName: "",
      contactName: "",
      businessEmail: "",
      phoneNumber: "",
      industry: "",
      apiAccessType: "",
      implementationTimeline: "",
      numberOfSearches: "",
      numberOfUsers: "",
      whenNeeded: "",
      message: "",
    });
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
              Company Name *
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => handleInputChange("companyName", e.target.value)}
              placeholder="Your Company Inc."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Name *
            </label>
            <input
              type="text"
              value={formData.contactName}
              onChange={(e) => handleInputChange("contactName", e.target.value)}
              placeholder="John Doe"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Email *
            </label>
            <input
              type="email"
              value={formData.businessEmail}
              onChange={(e) =>
                handleInputChange("businessEmail", e.target.value)
              }
              placeholder="john@company.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industry *
            </label>
            <select
              value={formData.industry}
              onChange={(e) => handleInputChange("industry", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Access Type *
            </label>
            <select
              value={formData.apiAccessType}
              onChange={(e) =>
                handleInputChange("apiAccessType", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              required
            >
              <option value="" className="text-gray-500">
                Select access type
              </option>
              {apiAccessTypes.map((type) => (
                <option key={type} value={type} className="text-gray-900">
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Implementation Timeline *
          </label>
          <select
            value={formData.implementationTimeline}
            onChange={(e) =>
              handleInputChange("implementationTimeline", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            required
          >
            <option value="" className="text-gray-500">
              Select timeline
            </option>
            {timelines.map((timeline) => (
              <option key={timeline} value={timeline} className="text-gray-900">
                {timeline}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Searches Needed *
            </label>
            <input
              type="text"
              value={formData.numberOfSearches}
              onChange={(e) =>
                handleInputChange("numberOfSearches", e.target.value)
              }
              placeholder="e.g., 10,000 per month"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Users Needed *
            </label>
            <input
              type="text"
              value={formData.numberOfUsers}
              onChange={(e) =>
                handleInputChange("numberOfUsers", e.target.value)
              }
              placeholder="e.g., 25 users"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            When do you need this? *
          </label>
          <select
            value={formData.whenNeeded}
            onChange={(e) => handleInputChange("whenNeeded", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
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
            className="btn-primary flex-1 sm:flex-initial px-8 py-3"
          >
            Submit Request
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
