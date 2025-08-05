"use client";

import { useState } from "react";

export default function HelpForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    issueType: "",
    priority: "",
    message: "",
  });

  const issueTypes = [
    "General Question",
    "Technical Issue",
    "Fraud Reporting Help",
    "Account Issues",
    "Billing & Payments",
    "Feature Request",
    "Bug Report",
    "Other",
  ];

  const priorities = [
    "Low - General inquiry",
    "Medium - Non-urgent issue",
    "High - Affecting my work",
    "Urgent - Critical issue",
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Help form submitted:", formData);
    alert(
      "Thank you for contacting us! We'll get back to you within 24 hours."
    );
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      email: "",
      subject: "",
      issueType: "",
      priority: "",
      message: "",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Contact Support
        </h2>
        <p className="text-gray-600">
          Describe your issue or question in detail. The more information you
          provide, the better we can assist you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="John Doe"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="john@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject *
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => handleInputChange("subject", e.target.value)}
            placeholder="Brief description of your issue"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue Type *
            </label>
            <select
              value={formData.issueType}
              onChange={(e) => handleInputChange("issueType", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              required
            >
              <option value="" className="text-gray-500">
                Select issue type
              </option>
              {issueTypes.map((type) => (
                <option key={type} value={type} className="text-gray-900">
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority *
            </label>
            <select
              value={formData.priority}
              onChange={(e) => handleInputChange("priority", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              required
            >
              <option value="" className="text-gray-500">
                Select priority
              </option>
              {priorities.map((priority) => (
                <option
                  key={priority}
                  value={priority}
                  className="text-gray-900"
                >
                  {priority}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message *
          </label>
          <textarea
            rows={6}
            value={formData.message}
            onChange={(e) => handleInputChange("message", e.target.value)}
            placeholder="Please describe your issue in detail. Include any error messages, steps to reproduce the problem, or specific questions you have..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Minimum 20 characters ({formData.message.length}/20)
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-green-600 mr-3 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-green-800 text-sm font-medium">
                Response Time
              </p>
              <p className="text-green-700 text-sm">
                We typically respond to support requests within 24 hours. Urgent
                issues are prioritized and handled within 2-4 hours.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            type="submit"
            className="btn-primary flex-1 sm:flex-initial px-8 py-3"
          >
            Send Message
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="btn-secondary flex-1 sm:flex-initial px-8 py-3"
          >
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
}
