export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">API Documentation</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Welcome to the WiseDB API documentation. This comprehensive guide will help you integrate our fraud database into your applications with ease.
          </p>
        </div>

        <div className="grid gap-8">
          {/* Authentication Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Authentication</h2>
            </div>
            <p className="text-gray-700 mb-4">
              All API requests require authentication using your API key. Include it in the Authorization header:
            </p>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
              Authorization: Bearer YOUR_API_KEY
            </div>
          </div>

          {/* Base URL Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Base URL</h2>
            </div>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
              https://api.wisedb.com/v1
            </div>
          </div>

          {/* Search Endpoints Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Search Endpoints</h2>
            </div>
            
            <div className="space-y-8">
              <div className="border-l-4 border-purple-500 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Search Fraud Database</h3>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-4">
                  GET /search
                </div>
                <p className="text-gray-700 mb-4">Search the fraud database with various filters and parameters.</p>
                
                <h4 className="font-semibold text-gray-900 mb-3">Query Parameters:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <code className="text-blue-600 font-semibold">q</code>
                    <span className="text-gray-700 ml-2">Search query (keyword, email, phone, etc.)</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <code className="text-blue-600 font-semibold">type</code>
                    <span className="text-gray-700 ml-2">Fraud type filter</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <code className="text-blue-600 font-semibold">severity</code>
                    <span className="text-gray-700 ml-2">Risk level filter</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <code className="text-blue-600 font-semibold">amount_min</code>
                    <span className="text-gray-700 ml-2">Minimum amount lost</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <code className="text-blue-600 font-semibold">amount_max</code>
                    <span className="text-gray-700 ml-2">Maximum amount lost</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <code className="text-blue-600 font-semibold">date_from</code>
                    <span className="text-gray-700 ml-2">Start date (YYYY-MM-DD)</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <code className="text-blue-600 font-semibold">date_to</code>
                    <span className="text-gray-700 ml-2">End date (YYYY-MM-DD)</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <code className="text-blue-600 font-semibold">limit</code>
                    <span className="text-gray-700 ml-2">Results per page (max 100)</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <code className="text-blue-600 font-semibold">page</code>
                    <span className="text-gray-700 ml-2">Page number</span>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-purple-500 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Get Fraud Report Details</h3>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-4">
                  GET /reports/&#123;id&#125;
                </div>
                <p className="text-gray-700">Retrieve detailed information about a specific fraud report by its ID.</p>
              </div>
            </div>
          </div>

          {/* Reporting Endpoints Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Reporting Endpoints</h2>
            </div>
            
            <div className="border-l-4 border-orange-500 pl-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Submit Fraud Report</h3>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-4">
                POST /reports
              </div>
              <p className="text-gray-700 mb-4">Submit a new fraud report to our database.</p>
              
              <h4 className="font-semibold text-gray-900 mb-3">Request Body:</h4>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                {`{
  "title": "Fraud Report Title",
  "description": "Detailed description",
  "type": "investment_fraud",
  "severity": "high",
  "amountLost": 5000,
  "currency": "USD",
  "incidentDate": "2024-01-15",
  "location": "New York, NY",
  "evidence": {
    "screenshots": ["base64_data"],
    "documents": ["base64_data"]
  }
}`}
              </div>
            </div>
          </div>

          {/* Response Format Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Response Format</h2>
            </div>
            <p className="text-gray-700 mb-4">
              All API responses follow a standard format for consistency:
            </p>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-x-auto">
              {`{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Success message",
  "timestamp": "2024-01-15T10:30:00Z"
}`}
            </div>
          </div>

          {/* Error Handling Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Error Handling</h2>
            </div>
            <p className="text-gray-700 mb-4">
              Errors are returned with appropriate HTTP status codes and detailed error information:
            </p>
            <div className="bg-gray-900 text-red-400 p-4 rounded-lg font-mono text-xs overflow-x-auto">
              {`{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": ["Field 'title' is required"]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}`}
            </div>
          </div>

          {/* Rate Limits Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Rate Limits</h2>
            </div>
            <p className="text-gray-700 mb-4">
              API rate limits are based on your subscription plan to ensure fair usage:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Basic</h4>
                <p className="text-blue-700">100 requests per hour</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-2">Professional</h4>
                <p className="text-purple-700">1,000 requests per hour</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">Enterprise</h4>
                <p className="text-green-700">10,000 requests per hour</p>
              </div>
            </div>
          </div>

          {/* Getting Started Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Getting Started</h2>
            </div>
            <p className="text-gray-700 mb-6">
              Follow these steps to integrate our API into your applications:
            </p>
            <div className="space-y-4">
              {[
                "Contact us to set up your enterprise account",
                "Receive your API key and credentials",
                "Review our integration examples",
                "Start making API calls to our sandbox environment",
                "Move to production when ready"
              ].map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-emerald-600 font-semibold text-sm">{index + 1}</span>
                  </div>
                  <span className="text-gray-700">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Support Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Support</h2>
            </div>
            <p className="text-gray-700 mb-6">
              For technical support or questions about our API, we're here to help:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Email Support</h4>
                <p className="text-blue-600">api-support@wisedb.com</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Documentation</h4>
                <a href="/docs" className="text-blue-600 hover:underline">/docs</a>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Status Page</h4>
                <a href="/status" className="text-blue-600 hover:underline">/status</a>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Response Time</h4>
                <p className="text-gray-700">Within 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
