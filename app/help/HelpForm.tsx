"use client";

import { useState } from "react";
import { useToast } from "@/contexts/ToastContext";

export default function HelpForm() {
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    issueType: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const validateField = (field: string, value: string) => {
    let error = "";
    
    switch (field) {
      case "name":
        if (!value.trim()) {
          error = "Name is required";
        } else if (value.trim().length < 2) {
          error = "Name must be at least 2 characters";
        }
        break;
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;
      case "subject":
        if (!value.trim()) {
          error = "Subject is required";
        } else if (value.trim().length < 5) {
          error = "Subject must be at least 5 characters";
        }
        break;
      case "issueType":
        if (!value) {
          error = "Please select an issue type";
        }
        break;
      case "message":
        if (!value.trim()) {
          error = "Message is required";
        } else if (value.trim().length < 20) {
          error = "Message must be at least 20 characters";
        }
        break;
    }
    
    return error;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) {
        newErrors[field] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/help", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        showToast("Help request submitted successfully! We'll get back to you within 24 hours.", "success");
        // Reset form
        setFormData({
          name: "",
          email: "",
          subject: "",
          issueType: "",
          message: "",
        });
        setErrors({});
      } else {
        showToast(data.error || "Failed to submit help request. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error submitting help request:", error);
      showToast("Network error. Please check your connection and try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      email: "",
      subject: "",
      issueType: "",
      message: "",
    });
    setErrors({});
  };

  const renderFieldError = (field: string) => {
    return errors[field] ? (
      <p className="text-red-600 text-sm mt-1">{errors[field]}</p>
    ) : null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-10">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Contact Support
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          Describe your issue or question in detail. The more information you
          provide, the better we can assist you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="John Doe"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-400 transition-all ${
                errors.name ? "border-red-500" : "border-gray-300 hover:border-gray-400"
              }`}
              required
            />
            {renderFieldError("name")}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="john@example.com"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-400 transition-all ${
                errors.email ? "border-red-500" : "border-gray-300 hover:border-gray-400"
              }`}
              required
            />
            {renderFieldError("email")}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => handleInputChange("subject", e.target.value)}
            placeholder="Brief description of your issue"
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-400 transition-all ${
              errors.subject ? "border-red-500" : "border-gray-300 hover:border-gray-400"
            }`}
            required
          />
          {renderFieldError("subject")}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Issue Type <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.issueType}
            onChange={(e) => handleInputChange("issueType", e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white transition-all ${
              errors.issueType ? "border-red-500" : "border-gray-300 hover:border-gray-400"
            }`}
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
          {renderFieldError("issueType")}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={6}
            value={formData.message}
            onChange={(e) => handleInputChange("message", e.target.value)}
            placeholder="Please describe your issue in detail. Include any error messages, steps to reproduce the problem, or specific questions you have..."
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-400 transition-all resize-none ${
              errors.message ? "border-red-500" : "border-gray-300 hover:border-gray-400"
            }`}
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Minimum 20 characters ({formData.message.length}/20)
          </p>
          {renderFieldError("message")}
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-5">
          <div className="flex items-start">
            <div className="bg-green-100 rounded-lg p-2 mr-4 shrink-0">
              <svg
                className="w-5 h-5 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p className="text-green-800 text-sm font-bold mb-1">
                Response Time
              </p>
              <p className="text-green-700 text-sm leading-relaxed">
                We typically respond to support requests within 24 hours. Urgent
                issues are prioritized and handled within 2-4 hours.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex-1 sm:flex-initial px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </div>
            ) : (
              "Send Message"
            )}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="btn-secondary flex-1 sm:flex-initial px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
}
