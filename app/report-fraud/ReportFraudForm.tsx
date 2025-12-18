"use client";

import { useState, useEffect } from "react";
import { useToast } from '@/contexts/ToastContext'
import { useRouter, usePathname } from 'next/navigation'
import Link from "next/link";
import dynamic from 'next/dynamic'
const ReCAPTCHA = dynamic(() => import('react-google-recaptcha'), { ssr: false })

export default function ReportFraudForm() {
  const FORM_STORAGE_KEY = 'reportFraudFormData'
  const STEP_STORAGE_KEY = 'reportFraudCurrentStep'
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

    // Fraudster Details (who committed the fraud)
    fraudsterName: "",
    fraudsterType: "",
    fraudsterCompany: "",
    fraudsterEmail: "",
    fraudsterGender: "",
    fraudsterContact: "",
    fraudsterAddress: "",
    fraudsterDescription: "",

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
  const [submitting, setSubmitting] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [evidenceError, setEvidenceError] = useState<string | null>(null)
  const { showToast } = useToast()
  const router = useRouter()
  const pathname = usePathname()
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''

  // Restore saved progress on mount
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(FORM_STORAGE_KEY) : null
      if (raw) {
        const saved = JSON.parse(raw)
        // Do not attempt to restore File objects; keep current evidenceFiles
        const { evidenceFiles: _ignored, ...rest } = saved || {}
        setFormData(prev => ({ ...prev, ...rest }))
      }
      const savedStep = typeof window !== 'undefined' ? localStorage.getItem(STEP_STORAGE_KEY) : null
      if (savedStep) {
        const num = parseInt(savedStep, 10)
        if (!Number.isNaN(num) && num >= 1 && num <= 5) setCurrentStep(num)
      }
    } catch {}
  }, [])

  // Persist progress whenever it changes (excluding files)
  useEffect(() => {
    try {
      const { evidenceFiles: _ignored, ...toSave } = formData
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(toSave))
    } catch {}
  }, [formData])

  useEffect(() => {
    try {
      localStorage.setItem(STEP_STORAGE_KEY, String(currentStep))
    } catch {}
  }, [currentStep])

  const markTouched = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const getError = (field: string): string => {
    switch (field) {
      // Step 1
      case 'fraudType':
        return touched.fraudType && !formData.fraudType ? 'Fraud type is required' : ''
      case 'incidentDate':
        if (!touched.incidentDate) return ''
        if (!formData.incidentDate) return 'Date of incident is required'
        return isFutureDate(formData.incidentDate) ? 'Date cannot be in the future' : ''
      case 'reportTitle':
        return touched.reportTitle && !formData.reportTitle ? 'Report title is required' : ''
      case 'reporterType':
        return touched.reporterType && !formData.reporterType ? 'Reporter type is required' : ''
      case 'reporterName':
        return touched.reporterName && !formData.reporterName ? 'Your name is required' : ''
      case 'reporterEmail':
        if (!touched.reporterEmail) return ''
        if (!formData.reporterEmail) return 'Email is required'
        return isValidEmail(formData.reporterEmail) ? '' : 'Enter a valid email address'
      case 'reporterPhone':
        if (!touched.reporterPhone) return ''
        return formData.reporterPhone && !isValidPhone(formData.reporterPhone) ? 'Enter a valid phone number' : ''
      // Step 2
      case 'fraudsterName':
        return touched.fraudsterName && !formData.fraudsterName ? 'Fraudster name is required' : ''
      case 'fraudsterType':
        return touched.fraudsterType && !formData.fraudsterType ? 'Fraudster type is required' : ''
      case 'fraudsterEmail':
        if (!touched.fraudsterEmail) return ''
        return formData.fraudsterEmail && !isValidEmail(formData.fraudsterEmail) ? 'Enter a valid email address' : ''
      // Step 3
      case 'actualLoss':
        if (!touched.actualLoss) return ''
        return isValidAmount(formData.actualLoss) ? '' : 'Enter a valid amount'
      case 'attemptedLoss':
        if (!touched.attemptedLoss) return ''
        return formData.attemptedLoss !== '' && !isValidAmount(formData.attemptedLoss) ? 'Enter a valid amount' : ''
      case 'currency':
        return touched.currency && !formData.currency ? 'Currency is required' : ''
      // Step 4
      case 'detailedDescription':
        if (!touched.detailedDescription) return ''
        if (!formData.detailedDescription) return 'Description is required'
        return formData.detailedDescription.length > 50 ? 'Max 50 characters allowed' : ''
      default:
        return ''
    }
  }

  const markStepTouched = (step: number) => {
    const fieldsByStep: Record<number, string[]> = {
      1: ['fraudType', 'incidentDate', 'reportTitle', 'reporterType', 'reporterName', 'reporterEmail', 'reporterPhone'],
      2: ['victimName', 'victimType', 'victimEmail'],
      3: ['actualLoss', 'attemptedLoss', 'currency'],
      4: ['detailedDescription']
    }
    const fields = fieldsByStep[step] || []
    setTouched(prev => fields.reduce((acc, f) => ({ ...acc, [f]: true }), { ...prev }))
  }

  const isValidEmail = (value: string) => {
    if (!value) return false
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  const getTodayDateString = () => {
    const d = new Date()
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }

  const isFutureDate = (value: string) => {
    if (!value) return false
    return value > getTodayDateString()
  }

  const isValidPhone = (value: string) => {
    if (!value) return true // optional
    return /^\+?[0-9\s()\-]{7,20}$/.test(value)
  }

  const isValidAmount = (value: string) => {
    if (value === '' || value === undefined || value === null) return false
    const n = Number(value)
    return Number.isFinite(n) && n >= 0
  }

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
    { code: "NZD", name: "NZD - New Zealand Dollar" },
    { code: "Other", name: "Other Currency" }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return

    const MAX_BYTES = 10 * 1024 * 1024 // 10MB
    const allowedMimeTypes = new Set([
      'application/pdf',
      'image/png',
      'image/jpeg',
    ])

    const allowedExtensions = new Set(['.pdf', '.png', '.jpg', '.jpeg'])

    const isAllowed = (file: File) => {
      if (allowedMimeTypes.has(file.type)) return true
      const name = file.name.toLowerCase()
      for (const ext of allowedExtensions) {
        if (name.endsWith(ext)) return true
      }
      return false
    }

    const invalidType: string[] = []
    const tooLarge: string[] = []
    const accepted: File[] = []

    setEvidenceError(null)

    Array.from(files).forEach(file => {
      if (!isAllowed(file)) {
        invalidType.push(file.name)
        return
      }
      if (file.size > MAX_BYTES) {
        tooLarge.push(`${file.name} (${(file.size / (1024*1024)).toFixed(1)}MB)`) 
        return
      }
      accepted.push(file)
    })

    if (invalidType.length) {
      showToast(`Unsupported file type: ${invalidType.join(', ')}. Allowed: PDF, PNG, JPG, JPEG.`, 'error')
      setEvidenceError('Unsupported file type. Allowed: PDF, PNG, JPG, JPEG.')
    }
    if (tooLarge.length) {
      showToast(`File(s) exceed 10MB: ${tooLarge.join(', ')}`, 'error')
      setEvidenceError('One or more files exceed the 10MB limit. Please upload smaller files.')
    }

    if (accepted.length) {
      setFormData((prev) => ({
        ...prev,
        evidenceFiles: [...prev.evidenceFiles, ...accepted],
      }))
    }
  };

  const handlePhoneChange = (raw: string) => {
    // Allow +, digits, spaces, dashes, and parentheses only
    const sanitized = raw.replace(/[^0-9+\-()\s]/g, '')
    handleInputChange("reporterPhone", sanitized)
  }

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
          !isFutureDate(formData.incidentDate) &&
          formData.reportTitle &&
          formData.reporterType &&
          formData.reporterName &&
          isValidEmail(formData.reporterEmail) &&
          isValidPhone(formData.reporterPhone)
        );
      case 2:
        return (
          !!formData.fraudsterName &&
          !!formData.fraudsterType &&
          (!formData.fraudsterEmail || isValidEmail(formData.fraudsterEmail))
        );
      case 3:
        return isValidAmount(formData.actualLoss) && !!formData.currency;
      case 4:
        return formData.detailedDescription.length > 0 && formData.detailedDescription.length <= 50;
      case 5:
        return formData.agreeToTerms;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < 5) {
      if (!isStepValid(currentStep)) {
        markStepTouched(currentStep)
        return
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStepValid(5)) {
      markStepTouched(5)
      return
    }
    if (!recaptchaToken) {
      showToast('Please complete the reCAPTCHA challenge.', 'error')
      return
    }
    setSubmitting(true)
    try {
      // Build multipart form data
      const fd = new FormData()
      // Basic
      fd.append('fraudType', formData.fraudType)
      fd.append('incidentDate', formData.incidentDate)
      fd.append('reportTitle', formData.reportTitle)
      // Reporter
      fd.append('reporterType', formData.reporterType)
      fd.append('reporterName', formData.reporterName)
      fd.append('reporterEmail', formData.reporterEmail)
      fd.append('reporterPhone', formData.reporterPhone)
      fd.append('reporterGender', formData.reporterGender)
      fd.append('reporterLocation', formData.reporterLocation)
      // Fraudster
      fd.append('fraudsterName', formData.fraudsterName)
      fd.append('fraudsterType', formData.fraudsterType)
      fd.append('fraudsterCompany', formData.fraudsterCompany)
      fd.append('fraudsterEmail', formData.fraudsterEmail)
      fd.append('fraudsterGender', formData.fraudsterGender)
      fd.append('fraudsterContact', formData.fraudsterContact)
      fd.append('fraudsterAddress', formData.fraudsterAddress)
      fd.append('fraudsterDescription', formData.fraudsterDescription)
      // Financial
      fd.append('actualLoss', String(formData.actualLoss))
      fd.append('attemptedLoss', String(formData.attemptedLoss))
      fd.append('currency', formData.currency)
      fd.append('paymentMethods', formData.paymentMethods)
      fd.append('transactionDetails', formData.transactionDetails)
      // Evidence
      fd.append('detailedDescription', formData.detailedDescription)
      fd.append('websitesSocialMedia', formData.websitesSocialMedia)
      fd.append('evidenceDescription', formData.evidenceDescription)
      formData.evidenceFiles.forEach((file) => fd.append('evidenceFiles', file))
      // Additional
      fd.append('additionalComments', formData.additionalComments)
      // reCAPTCHA
      if (recaptchaToken) fd.append('recaptchaToken', recaptchaToken)

      const res = await fetch('/api/fraud', {
        method: 'POST',
        body: fd,
      })
      const data = await res.json()
      if (res.ok) {
        const id = data?.id
        if (id) {
          const isDashboard = pathname?.startsWith('/dashboard')
          const target = isDashboard ? `/dashboard/report-fraud/success/${id}` : `/report-fraud/success/${id}`
          // Clear saved progress on successful submit
          try {
            localStorage.removeItem(FORM_STORAGE_KEY)
            localStorage.removeItem(STEP_STORAGE_KEY)
          } catch {}
          try { setRecaptchaToken(null) } catch {}
          router.push(target)
          return
        }
        // Fallback if no id returned
        router.push('/report-fraud')
      } else {
        showToast(data.error || 'Failed to submit report', 'error')
        setSubmitting(false)
      }
    } catch (err) {
      showToast('Network error. Please try again.', 'error')
      setSubmitting(false)
    }
  };

  const steps = [
    {
      number: 1,
      title: "Basic Information",
      description:
        "Provide details about the fraud type, incident date, and your contact information.",
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
      title: "Fraudster Details",
      description: "Provide information about the person or entity who committed the fraud.",
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
      description: "Share details about financial losses, amounts, and payment methods used.",
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
        "Upload evidence files and provide detailed description of the fraud incident.",
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
    <div className="min-h-screen bg-gray-50 py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Report <span className="text-gray-900">Fraud</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Help protect the community by reporting fraudulent activities to our database. Your
            information will be kept secure and confidential, and verified reports will be added to our searchable fraud database.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`rounded-xl border-2 p-5 transition-all duration-300 shadow-sm hover:shadow-md ${
                  currentStep === step.number
                    ? "border-[#006d5b] bg-gradient-to-br from-[#d7f6ea] to-[#e8faf3] shadow-md"
                    : currentStep > step.number
                    ? "border-[#43d49d] bg-[#43d49d]/10"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold mr-3 transition-all duration-300 ${
                      currentStep === step.number
                        ? "bg-[#006d5b] text-white shadow-lg scale-110"
                        : currentStep > step.number
                        ? "bg-[#43d49d] text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {currentStep > step.number ? (
                      <svg
                        className="w-5 h-5"
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
                    className={`text-sm font-bold ${
                      currentStep === step.number
                        ? "text-[#006d5b]"
                        : currentStep > step.number
                        ? "text-[#43d49d]"
                        : "text-gray-500"
                    }`}
                  >
                    Step {step.number}
                  </span>
                </div>
                <h3
                  className={`font-bold text-sm mb-2 ${
                    currentStep === step.number
                      ? "text-[#1c2736]"
                      : "text-gray-900"
                  }`}
                >
                  {step.title}
                </h3>
                <p
                  className={`text-xs leading-relaxed ${
                    currentStep === step.number
                      ? "text-[#006d5b]"
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
          className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-10"
        >
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type of Fraud <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={formData.fraudType}
                    onChange={(e) =>
                      handleInputChange("fraudType", e.target.value)
                    }
                    onBlur={() => markTouched('fraudType')}
                    className={`w-full px-4 py-3 border ${getError('fraudType') ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-[#006d5b] focus:border-[#006d5b] text-gray-900 bg-white placeholder-gray-400 transition-all hover:border-gray-400`}
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
                  {getError('fraudType') && (
                    <p className="mt-1 text-sm text-red-600">{getError('fraudType')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Incident <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.incidentDate}
                    onChange={(e) =>
                      handleInputChange("incidentDate", e.target.value)
                    }
                    onBlur={() => markTouched('incidentDate')}
                    max={getTodayDateString()}
                    className={`w-full px-4 py-3 border ${getError('incidentDate') ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-[#006d5b] focus:border-[#006d5b] text-gray-900 bg-white placeholder-gray-400 transition-all hover:border-gray-400`}
                    required
                  />
                  {getError('incidentDate') && (
                    <p className="mt-1 text-sm text-red-600">{getError('incidentDate')}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Title <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.reportTitle}
                  onChange={(e) =>
                    handleInputChange("reportTitle", e.target.value)
                  }
                  onBlur={() => markTouched('reportTitle')}
                  placeholder="Brief title describing the fraud incident"
                  className={`w-full px-4 py-3 border ${getError('reportTitle') ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-[#006d5b] focus:border-[#006d5b] text-gray-900 bg-white placeholder-gray-400 transition-all hover:border-gray-400`}
                  required
                />
                {getError('reportTitle') && (
                  <p className="mt-1 text-sm text-red-600">{getError('reportTitle')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reporter Type <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.reporterType}
                  onChange={(e) =>
                    handleInputChange("reporterType", e.target.value)
                  }
                  onBlur={() => markTouched('reporterType')}
                  className={`w-full px-4 py-3 border ${getError('reporterType') ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-[#006d5b] focus:border-[#006d5b] text-gray-900 bg-white placeholder-gray-400 transition-all hover:border-gray-400`}
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
                {getError('reporterType') && (
                  <p className="mt-1 text-sm text-red-600">{getError('reporterType')}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.reporterName}
                    onChange={(e) =>
                      handleInputChange("reporterName", e.target.value)
                    }
                    onBlur={() => markTouched('reporterName')}
                    placeholder="Your full name"
                    className={`w-full px-4 py-3 border ${getError('reporterName') ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-[#006d5b] focus:border-[#006d5b] text-gray-900 bg-white placeholder-gray-400 transition-all hover:border-gray-400`}
                    required
                  />
                  {getError('reporterName') && (
                    <p className="mt-1 text-sm text-red-600">{getError('reporterName')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.reporterEmail}
                    onChange={(e) =>
                      handleInputChange("reporterEmail", e.target.value)
                    }
                    onBlur={() => markTouched('reporterEmail')}
                    placeholder="your.email@example.com"
                    className={`w-full px-4 py-3 border ${getError('reporterEmail') ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-[#006d5b] focus:border-[#006d5b] text-gray-900 bg-white placeholder-gray-400 transition-all hover:border-gray-400`}
                    required
                  />
                  {getError('reporterEmail') && (
                    <p className="mt-1 text-sm text-red-600">{getError('reporterEmail')}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Phone Number
                  </label>
                  <input
                    type="tel"
                    inputMode="tel"
                    pattern="[0-9()+\-\s]{7,20}"
                    value={formData.reporterPhone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    onBlur={() => markTouched('reporterPhone')}
                    placeholder="+1 (555) 123-4567"
                    className={`w-full px-4 py-3 border ${getError('reporterPhone') ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-[#006d5b] focus:border-[#006d5b] text-gray-900 bg-white placeholder-gray-400 transition-all hover:border-gray-400`}
                  />
                  {getError('reporterPhone') && (
                    <p className="mt-1 text-sm text-red-600">{getError('reporterPhone')}</p>
                  )}
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006d5b] focus:border-[#006d5b] text-gray-900 bg-white placeholder-gray-400 transition-all hover:border-gray-400"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006d5b] focus:border-[#006d5b] text-gray-900 bg-white placeholder-gray-400 transition-all hover:border-gray-400"
                />
              </div>
            </div>
          )}

          {/* Step 2: Fraudster Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fraudster Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fraudsterName}
                    onChange={(e) =>
                      handleInputChange("fraudsterName", e.target.value)
                    }
                    onBlur={() => markTouched('fraudsterName')}
                    placeholder="Name of person or organization who committed fraud"
                    className={`w-full px-4 py-3 border ${getError('fraudsterName') ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-[#006d5b] focus:border-[#006d5b] text-gray-900 bg-white placeholder-gray-400 transition-all hover:border-gray-400`}
                    required
                  />
                  {getError('fraudsterName') && (
                    <p className="mt-1 text-sm text-red-600">{getError('fraudsterName')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fraudster Type <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={formData.fraudsterType}
                    onChange={(e) =>
                      handleInputChange("fraudsterType", e.target.value)
                    }
                    onBlur={() => markTouched('fraudsterType')}
                    className={`w-full px-4 py-3 border ${getError('fraudsterType') ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-[#006d5b] focus:border-[#006d5b] text-gray-900 bg-white placeholder-gray-400 transition-all hover:border-gray-400`}
                    required
                  >
                    <option value="" className="text-gray-500">
                      Select fraudster type
                    </option>
                    {targetTypes.map((type) => (
                      <option key={type} value={type} className="text-gray-900">
                        {type}
                      </option>
                    ))}
                  </select>
                  {getError('fraudsterType') && (
                    <p className="mt-1 text-sm text-red-600">{getError('fraudsterType')}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fraudster Company/Organization
                  </label>
                  <input
                    type="text"
                    value={formData.fraudsterCompany}
                    onChange={(e) =>
                      handleInputChange("fraudsterCompany", e.target.value)
                    }
                    placeholder="Company or organization name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006d5b] focus:border-[#006d5b] text-gray-900 bg-white placeholder-gray-400 transition-all hover:border-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fraudster Email
                  </label>
                  <input
                    type="email"
                    value={formData.fraudsterEmail}
                    onChange={(e) =>
                      handleInputChange("fraudsterEmail", e.target.value)
                    }
                    onBlur={() => markTouched('fraudsterEmail')}
                    placeholder="fraudster@example.com"
                    className={`w-full px-4 py-3 border ${getError('fraudsterEmail') ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-[#006d5b] focus:border-[#006d5b] text-gray-900 bg-white placeholder-gray-400 transition-all hover:border-gray-400`}
                  />
                  {getError('fraudsterEmail') && (
                    <p className="mt-1 text-sm text-red-600">{getError('fraudsterEmail')}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fraudster Gender
                  </label>
                  <select
                    value={formData.fraudsterGender}
                    onChange={(e) =>
                      handleInputChange("fraudsterGender", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006d5b] focus:border-[#006d5b] text-gray-900 bg-white placeholder-gray-400 transition-all hover:border-gray-400"
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
                    Fraudster Contact Information
                  </label>
                  <input
                    type="text"
                    value={formData.fraudsterContact}
                    onChange={(e) =>
                      handleInputChange("fraudsterContact", e.target.value)
                    }
                    placeholder="Phone, email, or other contact info"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006d5b] focus:border-[#006d5b] text-gray-900 bg-white placeholder-gray-400 transition-all hover:border-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fraudster Address
                </label>
                <input
                  type="text"
                  value={formData.fraudsterAddress}
                  onChange={(e) =>
                    handleInputChange("fraudsterAddress", e.target.value)
                  }
                  placeholder="Full address of the fraudster"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006d5b] focus:border-[#006d5b] text-gray-900 bg-white placeholder-gray-400 transition-all hover:border-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fraudster Description
                </label>
                <textarea
                  rows={4}
                  value={formData.fraudsterDescription}
                  onChange={(e) =>
                    handleInputChange("fraudsterDescription", e.target.value)
                  }
                  placeholder="Additional details about the fraudster (demographics, modus operandi, etc.)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006d5b] focus:border-[#006d5b] text-gray-900 bg-white placeholder-gray-400 transition-all hover:border-gray-400"
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
                    Actual Loss Amount <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.actualLoss}
                    onChange={(e) =>
                      handleInputChange("actualLoss", e.target.value)
                    }
                    onBlur={() => markTouched('actualLoss')}
                    placeholder="0.00"
                    className={`w-full px-4 py-3 border ${getError('actualLoss') ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-[#006d5b] focus:border-[#006d5b] text-gray-900 bg-white placeholder-gray-400 transition-all hover:border-gray-400`}
                    required
                  />
                  {getError('actualLoss') && (
                    <p className="mt-1 text-sm text-red-600">{getError('actualLoss')}</p>
                  )}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006d5b] focus:border-[#006d5b] text-gray-900 bg-white placeholder-gray-400 transition-all hover:border-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) =>
                    handleInputChange("currency", e.target.value)
                  }
                  onBlur={() => markTouched('currency')}
                  className={`w-full px-4 py-3 border ${getError('currency') ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-[#006d5b] focus:border-[#006d5b] text-gray-900 bg-white transition-all hover:border-gray-400`}
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
                {getError('currency') && (
                  <p className="mt-1 text-sm text-red-600">{getError('currency')}</p>
                )}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006d5b] focus:border-[#006d5b] text-gray-900 bg-white placeholder-gray-400 transition-all hover:border-gray-400"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006d5b] focus:border-[#006d5b] text-gray-900 bg-white placeholder-gray-400 transition-all hover:border-gray-400"
                />
              </div>
            </div>
          )}

          {/* Step 4: Evidence & Documentation */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Description <span className="text-red-600">*</span>
                </label>
                <textarea
                  rows={8}
                  value={formData.detailedDescription}
                  onChange={(e) =>
                    handleInputChange("detailedDescription", e.target.value)
                  }
                  onBlur={() => markTouched('detailedDescription')}
                  placeholder="Provide a detailed description of the fraud incident. Include timeline, what happened, how it unfolded, and any communication details..."
                  className={`w-full px-4 py-3 border ${getError('detailedDescription') ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-[#006d5b] focus:border-[#006d5b] text-gray-900 bg-white placeholder-gray-400 transition-all hover:border-gray-400`}
                  maxLength={50}
                  required
                />
                {getError('detailedDescription') && (
                  <p className="mt-1 text-sm text-red-600">{getError('detailedDescription')}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Max 50 characters ({formData.detailedDescription.length}/50)
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006d5b] focus:border-[#006d5b] text-gray-900 bg-white placeholder-gray-400 transition-all hover:border-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Evidence Files
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-all bg-gray-50/50">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.png,.jpg,.jpeg"
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
                        Supported: PDF, JPG, JPEG, PNG. Max 10MB per file.
                      </p>
                      {evidenceError && (
                        <p className="text-xs text-rose-600 mt-2" aria-live="assertive">{evidenceError}</p>
                      )}
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
                          className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006d5b] focus:border-[#006d5b] text-gray-900 bg-white placeholder-gray-400 transition-all hover:border-gray-400"
                />
              </div>
            </div>
          )}

          {/* Step 5: Review & Submit */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Report Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  {/* Basic Information */}
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Basic Information</p>
                    <div className="space-y-1">
                      <div><span className="font-medium text-gray-700">Report Title:</span> <span className="text-gray-800">{formData.reportTitle || '—'}</span></div>
                      <div><span className="font-medium text-gray-700">Fraud Type:</span> <span className="text-gray-800">{formData.fraudType || '—'}</span></div>
                      <div><span className="font-medium text-gray-700">Incident Date:</span> <span className="text-gray-800">{formData.incidentDate || '—'}</span></div>
                    </div>
                  </div>
                  {/* Financial */}
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Financial</p>
                    <div className="space-y-1">
                      <div><span className="font-medium text-gray-700">Actual Loss:</span> <span className="text-gray-800">{formData.actualLoss !== '' ? `${formData.currency} ${formData.actualLoss}` : '—'}</span></div>
                      <div><span className="font-medium text-gray-700">Attempted Loss:</span> <span className="text-gray-800">{formData.attemptedLoss !== '' ? `${formData.currency} ${formData.attemptedLoss}` : '—'}</span></div>
                      <div><span className="font-medium text-gray-700">Currency:</span> <span className="text-gray-800">{formData.currency || '—'}</span></div>
                    </div>
                  </div>
                  {/* Reporter */}
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Reporter</p>
                    <div className="space-y-1">
                      <div><span className="font-medium text-gray-700">Type:</span> <span className="text-gray-800">{formData.reporterType || '—'}</span></div>
                      <div><span className="font-medium text-gray-700">Name:</span> <span className="text-gray-800">{formData.reporterName || '—'}</span></div>
                      <div><span className="font-medium text-gray-700">Email:</span> <span className="text-gray-800">{formData.reporterEmail || '—'}</span></div>
                      <div><span className="font-medium text-gray-700">Phone:</span> <span className="text-gray-800">{formData.reporterPhone || '—'}</span></div>
                      <div><span className="font-medium text-gray-700">Gender:</span> <span className="text-gray-800">{formData.reporterGender || '—'}</span></div>
                      <div><span className="font-medium text-gray-700">Location:</span> <span className="text-gray-800">{formData.reporterLocation || '—'}</span></div>
                    </div>
                  </div>
                  {/* Fraudster */}
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Fraudster Details</p>
                    <div className="space-y-1">
                      <div><span className="font-medium text-gray-700">Name:</span> <span className="text-gray-800">{formData.fraudsterName || '—'}</span></div>
                      <div><span className="font-medium text-gray-700">Type:</span> <span className="text-gray-800">{formData.fraudsterType || '—'}</span></div>
                      <div><span className="font-medium text-gray-700">Company/Org:</span> <span className="text-gray-800">{formData.fraudsterCompany || '—'}</span></div>
                      <div><span className="font-medium text-gray-700">Email:</span> <span className="text-gray-800">{formData.fraudsterEmail || '—'}</span></div>
                      <div><span className="font-medium text-gray-700">Gender:</span> <span className="text-gray-800">{formData.fraudsterGender || '—'}</span></div>
                      <div><span className="font-medium text-gray-700">Contact:</span> <span className="text-gray-800">{formData.fraudsterContact || '—'}</span></div>
                      <div><span className="font-medium text-gray-700">Address:</span> <span className="text-gray-800">{formData.fraudsterAddress || '—'}</span></div>
                      <div><span className="font-medium text-gray-700">Description:</span> <span className="text-gray-800">{formData.fraudsterDescription || '—'}</span></div>
                    </div>
                  </div>
                  {/* Payments */}
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Payments</p>
                    <div className="space-y-1">
                      <div><span className="font-medium text-gray-700">Methods Used:</span> <span className="text-gray-800">{formData.paymentMethods || '—'}</span></div>
                      <div><span className="font-medium text-gray-700">Transaction Details:</span> <span className="text-gray-800">{formData.transactionDetails || '—'}</span></div>
                    </div>
                  </div>
                  {/* Evidence */}
                  <div className="md:col-span-2">
                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Evidence</p>
                    <div className="space-y-1">
                      <div><span className="font-medium text-gray-700">Detailed Description:</span> <span className="text-gray-800">{formData.detailedDescription || '—'}</span></div>
                      <div><span className="font-medium text-gray-700">Websites/Social:</span> <span className="text-gray-800">{formData.websitesSocialMedia || '—'}</span></div>
                      <div><span className="font-medium text-gray-700">Evidence Description:</span> <span className="text-gray-800">{formData.evidenceDescription || '—'}</span></div>
                      <div>
                        <span className="font-medium text-gray-700">Files:</span>
                        {formData.evidenceFiles.length ? (
                          <ul className="list-disc ml-6 text-gray-800">
                            {formData.evidenceFiles.map((f, i) => (
                              <li key={i}>{f.name}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className="ml-2 text-gray-800">—</span>
                        )}
                      </div>
                    </div>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006d5b] focus:border-[#006d5b] text-gray-900 bg-white placeholder-gray-400 transition-all hover:border-gray-400"
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
                  className="mt-1 mr-3 h-4 w-4 text-[#006d5b] border-gray-300 rounded focus:ring-[#006d5b]"
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-[#006d5b] hover:text-[#1c2736] underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Terms of Service
                  </Link>{" "}
                  and confirm that the information provided is accurate to the
                  best of my knowledge.
                </label>
              </div>
            </div>
          )}

          {/* reCAPTCHA above navigation */}
          {currentStep === 5 && RECAPTCHA_SITE_KEY ? (
            <div className="pt-6">
              <div className="inline-block">
                <ReCAPTCHA
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={(token) => setRecaptchaToken(token)}
                  onExpired={() => setRecaptchaToken(null)}
                />
              </div>
            </div>
          ) : null}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8 border-t border-gray-200 mt-8">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                currentStep === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md"
              }`}
            >
              Previous
            </button>

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid(currentStep)}
                className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isStepValid(currentStep)
                    ? "btn-primary hover:shadow-lg"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={!isStepValid(5) || submitting || !recaptchaToken}
                className={`px-10 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isStepValid(5) && !!recaptchaToken
                    ? "btn-primary hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {submitting ? (
                  <span className="inline-flex items-center">
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                    Submitting...
                  </span>
                ) : (
                  'Submit Report'
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
