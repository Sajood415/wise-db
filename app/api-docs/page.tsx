"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import Link from "next/link";
import "swagger-ui-react/swagger-ui.css";
import "./api-docs.css";
import spec from "@/lib/openapi-spec.json";

const SwaggerUI = dynamic(
  () => import("swagger-ui-react") as Promise<{ default: ComponentType<{ spec?: object }> }>,
  { ssr: false }
);

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#1c2736] text-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white text-sm mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">API Documentation</h1>
          <p className="mt-2 text-gray-300 max-w-2xl">
            Interactive API reference for Fraud Scan. Try endpoints, inspect schemas, and integrate with your apps.
          </p>
          <a
            href="/openapi.json"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-[#43d49d] hover:text-[#5ee7b4] text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download OpenAPI spec
          </a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 -mt-6">
        <div className="mb-6 p-5 rounded-xl border-2 border-emerald-200 bg-emerald-50/80">
          <h3 className="font-semibold text-emerald-900 mb-2">Mobile app / API clients</h3>
          <p className="text-sm text-emerald-800 mb-3">
            Use <strong>X-API-Key</strong> header (shared key from backend) and <strong>Authorization: Bearer</strong> with the JWT from login. Both required on every request. Click <strong>Authorize</strong> below to set them.
          </p>
          <ol className="text-sm text-emerald-800 list-decimal list-inside space-y-1">
            <li>Login → read <code className="bg-white/70 px-1 rounded">token</code> from response</li>
            <li>Add <code className="bg-white/70 px-1 rounded">X-API-Key</code> + <code className="bg-white/70 px-1 rounded">Authorization: Bearer &lt;token&gt;</code> to all requests</li>
          </ol>
        </div>
        <div className="api-docs-wrapper bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <SwaggerUI spec={spec as object} />
        </div>
      </div>
    </div>
  );
}
