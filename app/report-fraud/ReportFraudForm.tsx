"use client";

import { useState } from "react";
import Link from "next/link";

export default function ReportFraudForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Information
    fraudType: "",
    incidentDate: "",
    reportTitle: "",
    reporterType: "",
    reporterName: "",
    reporterEmail: "",
    reporterPhone: "",
    reporterGender: "",
    reporterLocation: "",

    // Victim Details
    victimName: "",
    victimType: "",
    victimCompany: "",
    victimEmail: "",
    victimGender: "",
    victimContact: "",
    victimAddress: "",
    victimDescription: "",

    // Financial Impact
    actualLoss: "",
    attemptedLoss: "",
    currency: "USD",
    paymentMethods: "",
    transactionDetails: "",

    // Evidence & Documentation
    detailedDescription: "",
    websitesSocialMedia: "",
    evidenceFiles: [] as File[],
    evidenceDescription: "",

    // Review & Submit
    additionalComments: "",
    agreeToTerms: false,
  });

  const fraudTypes = [
    "Investment Scam",
    "Romance Scam",
    "Business Email Compromise",
    "Identity Theft",
    "Credit Card Fraud",
    "Wire Transfer Fraud",
    "Cryptocurrency Scam",
    "Online Shopping Fraud",
    "Tech Support Scam",
    "Phishing",
    "Other",
  ];

  const reporterTypes = [
    "Individual Person",
    "Company/Organization",
    "Witness",
    "Reporting on behalf of someone",
  ];

  const targetTypes = [
    "Individual Person",
    "Business/Company",
    "Organization",
    "Multiple Individuals",
    "Unknown",
  ];

  const genderOptions = [
    "Male",
    "Female",
    "Non-binary",
    "Prefer not to say",
    "Unknown",
  ];

  const currencies = [
    { code: "USD", name: "USD - US Dollar" },
    { code: "EUR", name: "EUR - Euro" },
    { code: "GBP", name: "GBP - British Pound" },
    { code: "CAD", name: "CAD - Canadian Dollar" },
    { code: "AUD", name: "AUD - Australian Dollar" },
    { code: "JPY", name: "JPY - Japanese Yen" },
    { code: "CNY", name: "CNY - Chinese Yuan" },
    { code: "Other", name: "Other Currency" },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        evidenceFiles: [...prev.evidenceFiles, ...fileArray],
      }));
    }
  };

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      evidenceFiles: prev.evidenceFiles.filter((_, i) => i !== index),
    }));
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return (
          formData.fraudType &&
          formData.incidentDate &&
          formData.reportTitle &&
          formData.reporterType &&
          formData.reporterName &&
          formData.reporterEmail
        );
      case 2:
        return formData.victimName && formData.victimType;
      case 3:
        return formData.actualLoss !== "" && formData.currency;
      case 4:
        return formData.detailedDescription.length >= 50;
      case 5:
        return formData.agreeToTerms;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < 5 && isStepValid(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isStepValid(5)) {
      // Here you would submit the form data
      console.log("Form submitted:", formData);
      alert(
        "Thank you for your report. We will review it and take appropriate action."
      );
    }
  };

  const steps = [
    {
      number: 1,
      title: "Basic Information",
      description:
        "Tell us about the type of fraud you experienced and when it occurred.",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      number: 2,
      title: "Victim Details",
      description: "Tell us about who was targeted by this fraud.",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      number: 3,
      title: "Financial Impact",
      description: "Tell us about the financial losses and payment details.",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      number: 4,
      title: "Evidence & Documentation",
      description:
        "Provide detailed information and upload supporting evidence.",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      number: 5,
      title: "Review & Submit",
      description: "Review your information and submit the report.",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Report <span className="gradient-text">Fraud</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Help protect the community by reporting fraudulent activities. Your
            information will be kept secure and confidential.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`rounded-lg border-2 p-4 transition-all duration-200 ${
                  currentStep === step.number
                    ? "border-blue-500 bg-blue-50"
                    : currentStep > step.number
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex items-center mb-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-3 ${
                      currentStep === step.number
                        ? "bg-blue-600 text-white"
                        : currentStep > step.number
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {currentStep > step.number ? (
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      step.icon
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      currentStep === step.number
                        ? "text-blue-900"
                        : "text-gray-700"
                    }`}
                  >
                    {step.number}
                  </span>
                </div>
                <h3
                  className={`font-semibold text-sm mb-1 ${
                    currentStep === step.number
                      ? "text-blue-900"
                      : "text-gray-900"
                  }`}
                >
                  {step.title}
                </h3>
                <p
                  className={`text-xs ${
                    currentStep === step.number
                      ? "text-blue-700"
                      : "text-gray-600"
                  }`}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type of Fraud *
                  </label>
                  <select
                    value={formData.fraudType}
                    onChange={(e) =>
                      handleInputChange("fraudType", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
                    required
                  >
                    <option value="" className="text-gray-500">
                      Select fraud type
                    </option>
                    {fraudTypes.map((type) => (
                      <option key={type} value={type} className="text-gray-900">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Incident *
                  </label>
                  <input
                    type="date"
                    value={formData.incidentDate}
                    onChange={(e) =>
                      handleInputChange("incidentDate", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Title *
                </label>
                <input
                  type="text"
                  value={formData.reportTitle}
                  onChange={(e) =>
                    handleInputChange("reportTitle", e.target.value)
                  }
                  placeholder="Brief title describing the fraud incident"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reporter Type *
                </label>
                <select
                  value={formData.reporterType}
                  onChange={(e) =>
                    handleInputChange("reporterType", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="" className="text-gray-500">
                    Select reporter type
                  </option>
                  {reporterTypes.map((type) => (
                    <option key={type} value={type} className="text-gray-900">
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={formData.reporterName}
                    onChange={(e) =>
                      handleInputChange("reporterName", e.target.value)
                    }
                    placeholder="Your full name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    value={formData.reporterEmail}
                    onChange={(e) =>
                      handleInputChange("reporterEmail", e.target.value)
                    }
                    placeholder="your.email@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.reporterPhone}
                    onChange={(e) =>
                      handleInputChange("reporterPhone", e.target.value)
                    }
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Gender
                  </label>
                  <select
                    value={formData.reporterGender}
                    onChange={(e) =>
                      handleInputChange("reporterGender", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
                  >
                    <option value="" className="text-gray-500">
                      Select gender
                    </option>
                    {genderOptions.map((gender) => (
                      <option
                        key={gender}
                        value={gender}
                        className="text-gray-900"
                      >
                        {gender}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Location
                </label>
                <input
                  type="text"
                  value={formData.reporterLocation}
                  onChange={(e) =>
                    handleInputChange("reporterLocation", e.target.value)
                  }
                  placeholder="City, State/Province, Country"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Step 2: Victim Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Victim Name *
                  </label>
                  <input
                    type="text"
                    value={formData.victimName}
                    onChange={(e) =>
                      handleInputChange("victimName", e.target.value)
                    }
                    placeholder="Name of person or organization targeted"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Victim Type *
                  </label>
                  <select
                    value={formData.victimType}
                    onChange={(e) =>
                      handleInputChange("victimType", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
                    required
                  >
                    <option value="" className="text-gray-500">
                      Select victim type
                    </option>
                    {targetTypes.map((type) => (
                      <option key={type} value={type} className="text-gray-900">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Victim Company/Organization
                  </label>
                  <input
                    type="text"
                    value={formData.victimCompany}
                    onChange={(e) =>
                      handleInputChange("victimCompany", e.target.value)
                    }
                    placeholder="Company or organization name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Victim Email
                  </label>
                  <input
                    type="email"
                    value={formData.victimEmail}
                    onChange={(e) =>
                      handleInputChange("victimEmail", e.target.value)
                    }
                    placeholder="victim@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Victim Gender
                  </label>
                  <select
                    value={formData.victimGender}
                    onChange={(e) =>
                      handleInputChange("victimGender", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
                  >
                    <option value="" className="text-gray-500">
                      Select gender
                    </option>
                    {genderOptions.map((gender) => (
                      <option
                        key={gender}
                        value={gender}
                        className="text-gray-900"
                      >
                        {gender}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Victim Contact Information
                  </label>
                  <input
                    type="text"
                    value={formData.victimContact}
                    onChange={(e) =>
                      handleInputChange("victimContact", e.target.value)
                    }
                    placeholder="Phone, email, or other contact info"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Victim Address
                </label>
                <input
                  type="text"
                  value={formData.victimAddress}
                  onChange={(e) =>
                    handleInputChange("victimAddress", e.target.value)
                  }
                  placeholder="Full address of the victim"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Victim Description
                </label>
                <textarea
                  rows={4}
                  value={formData.victimDescription}
                  onChange={(e) =>
                    handleInputChange("victimDescription", e.target.value)
                  }
                  placeholder="Additional details about the victim (demographics, vulnerabilities, etc.)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Step 3: Financial Impact */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Actual Loss Amount *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.actualLoss}
                    onChange={(e) =>
                      handleInputChange("actualLoss", e.target.value)
                    }
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attempted Loss Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.attemptedLoss}
                    onChange={(e) =>
                      handleInputChange("attemptedLoss", e.target.value)
                    }
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency *
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) =>
                    handleInputChange("currency", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {currencies.map((currency) => (
                    <option
                      key={currency.code}
                      value={currency.code}
                      className="text-gray-900"
                    >
                      {currency.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Methods Used
                </label>
                <textarea
                  rows={3}
                  value={formData.paymentMethods}
                  onChange={(e) =>
                    handleInputChange("paymentMethods", e.target.value)
                  }
                  placeholder="How was the payment made? (credit card, wire transfer, cryptocurrency, gift cards, cash, etc.)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Details
                </label>
                <textarea
                  rows={4}
                  value={formData.transactionDetails}
                  onChange={(e) =>
                    handleInputChange("transactionDetails", e.target.value)
                  }
                  placeholder="Provide transaction IDs, account numbers, wallet addresses, or other relevant payment details"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Step 4: Evidence & Documentation */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Description *
                </label>
                <textarea
                  rows={8}
                  value={formData.detailedDescription}
                  onChange={(e) =>
                    handleInputChange("detailedDescription", e.target.value)
                  }
                  placeholder="Provide a detailed description of the fraud incident. Include timeline, what happened, how it unfolded, and any communication details..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Minimum 50 characters required (
                  {formData.detailedDescription.length}/50)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Websites or Social Media
                </label>
                <textarea
                  rows={3}
                  value={formData.websitesSocialMedia}
                  onChange={(e) =>
                    handleInputChange("websitesSocialMedia", e.target.value)
                  }
                  placeholder="List any websites, social media profiles, or online platforms used by the scammer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Evidence Files
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.mp3,.mp4"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                    id="evidence-files"
                  />
                  <label htmlFor="evidence-files" className="cursor-pointer">
                    <div className="text-gray-600">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400 mb-4"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="text-lg font-medium">
                        Upload Evidence Files
                      </p>
                      <p className="text-sm">
                        Screenshots, emails, documents, audio recordings, or
                        other evidence
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Supported: PDF, JPG, PNG, DOC, MP3, MP4. Max 10MB per
                        file.
                      </p>
                    </div>
                  </label>
                </div>

                {formData.evidenceFiles.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-700 mb-2">
                      Uploaded Files:
                    </h4>
                    <div className="space-y-2">
                      {formData.evidenceFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                        >
                          <span className="text-sm text-gray-700">
                            {file.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Evidence Description
                </label>
                <textarea
                  rows={4}
                  value={formData.evidenceDescription}
                  onChange={(e) =>
                    handleInputChange("evidenceDescription", e.target.value)
                  }
                  placeholder="Describe the evidence you have or uploaded (screenshots, emails, phone records, documents, etc.)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Step 5: Review & Submit */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Report Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">
                      Report Title:
                    </span>
                    <span className="ml-2 text-gray-600">
                      {formData.reportTitle || "Not specified"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      Fraud Type:
                    </span>
                    <span className="ml-2 text-gray-600">
                      {formData.fraudType || "Not specified"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      Incident Date:
                    </span>
                    <span className="ml-2 text-gray-600">
                      {formData.incidentDate || "Not specified"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      Actual Loss:
                    </span>
                    <span className="ml-2 text-gray-600">
                      {formData.actualLoss
                        ? `${formData.currency} ${formData.actualLoss}`
                        : "Not specified"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Reporter:</span>
                    <span className="ml-2 text-gray-600">
                      {formData.reporterName || "Not specified"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Victim:</span>
                    <span className="ml-2 text-gray-600">
                      {formData.victimName || "Not specified"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Comments
                </label>
                <textarea
                  rows={4}
                  value={formData.additionalComments}
                  onChange={(e) =>
                    handleInputChange("additionalComments", e.target.value)
                  }
                  placeholder="Any additional information you'd like to include..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.agreeToTerms}
                  onChange={(e) =>
                    handleInputChange("agreeToTerms", e.target.checked)
                  }
                  className="mt-1 mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and confirm that the information provided is accurate to the
                  best of my knowledge.
                </label>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-medium ${
                currentStep === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Previous
            </button>

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid(currentStep)}
                className={`px-6 py-3 rounded-lg font-medium ${
                  isStepValid(currentStep)
                    ? "btn-primary"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={!isStepValid(5)}
                className={`px-8 py-3 rounded-lg font-medium ${
                  isStepValid(5)
                    ? "btn-primary"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                Submit Report
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
