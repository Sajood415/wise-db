"use client"

import { useEffect, useState } from 'react'
import { useToast } from '@/contexts/ToastContext'

export default function EnterpriseApiKeyPage() {
  const [token, setToken] = useState<string | null>(null)
  const [createdAt, setCreatedAt] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [showToken, setShowToken] = useState(false)
  const toast = useToast()

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/enterprise/key', { credentials: 'include', cache: 'no-store' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || 'Failed to load token')
      setToken(data.token || null)
      setCreatedAt(data.createdAt || null)
    } catch (e: any) {
      setError(e?.message || 'Failed to load token')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const regenerate = async () => {
    setError(null)
    setMessage(null)
    setSaving(true)
    try {
      const res = await fetch('/api/enterprise/key', { method: 'POST', credentials: 'include' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || 'Failed to generate token')
      setToken(data.token || null)
      setCreatedAt(data.createdAt || null)
      setMessage('Token generated successfully')
      toast.showToast('New API token generated', 'success')
    } catch (e: any) {
      setError(e?.message || 'Failed to generate token')
      toast.showToast(e?.message || 'Failed to generate token', 'error')
    } finally {
      setSaving(false)
    }
  }

  const copy = async () => {
    if (!token) return
    try {
      await navigator.clipboard.writeText(token)
      toast.showToast('Token copied to clipboard', 'success')
    } catch {
      toast.showToast('Copy failed', 'error')
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">API Access</h1>
      <div className="rounded-xl border border-gray-200 p-5 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-medium text-gray-900">API Auth Token</h2>
            <p className="text-sm text-gray-500">Use this Bearer token to call the external frauds API.</p>
          </div>
          {token ? (
            <button onClick={regenerate} disabled={saving} className={`px-3 py-2 rounded-md text-sm font-medium text-white ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1c2736] hover:bg-[#0f1a26]'}`}>
              {saving ? 'Working…' : 'Regenerate Token'}
            </button>
          ) : null}
        </div>
        <div className="mt-4">
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : token ? (
            <div className="flex items-center gap-2">
              <code className="text-sm break-all p-3 bg-gray-900 text-green-300 rounded-md border border-gray-800 flex-1">
                {showToken ? token : (token.replace(/.(?=.{4})/g, '•'))}
              </code>
              <button onClick={() => setShowToken(v => !v)} className="px-3 py-2 rounded-md text-sm font-medium text-white bg-[#1c2736] hover:bg-[#0f1a26]">
                {showToken ? 'Hide' : 'Show'}
              </button>
              <button onClick={copy} className="px-3 py-2 rounded-md text-sm font-medium text-white bg-[#1c2736] hover:bg-[#0f1a26]">Copy</button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <code className="text-sm break-all p-3 bg-gray-900 text-gray-400 rounded-md border border-gray-800 flex-1">
                Token not generated yet
              </code>
              <button onClick={regenerate} disabled={saving} className={`px-3 py-2 rounded-md text-sm font-medium text-white ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1c2736] hover:bg-[#0f1a26]'}`}>
                {saving ? 'Working…' : 'Generate Token'}
              </button>
            </div>
          )}
          {message && (
            <p className="text-xs text-green-600 mt-1">{message}</p>
          )}
          {createdAt ? (
            <p className="text-xs text-gray-400 mt-1">Created: {new Date(createdAt).toLocaleString()}</p>
          ) : null}
        </div>
      </div>

      <GuideCard token={token} />
    </div>
  )
}


function GuideCard({ token }: { token: string | null }) {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const endpoint = `${origin}/api/external/frauds`
  const curl = `curl -X GET "${endpoint}?q=acme" \\\n+-H "Authorization: Bearer ${token ? token : 'YOUR_TOKEN'}"`
  return (
    <div className="mt-6 rounded-xl border border-gray-200 p-5 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">How to call</h3>
          <p className="text-sm text-gray-500">Use your Bearer token in the Authorization header.</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-md border border-gray-200 p-3 bg-gray-50">
          <div className="text-xs text-gray-500 mb-1">Endpoint</div>
          <code className="text-sm text-gray-900">/api/external/frauds</code>
        </div>
        <div className="rounded-md border border-gray-200 p-3 bg-gray-50">
          <div className="text-xs text-gray-500 mb-1">Auth Header</div>
          <code className="text-sm text-gray-900">Authorization: Bearer {token ? '••••••••••' : 'YOUR_TOKEN'}</code>
        </div>
        <div className="rounded-md border border-gray-200 p-3 bg-gray-50 md:col-span-2">
          <div className="text-xs text-gray-500 mb-1">Optional Params</div>
          <code className="text-sm text-gray-900">?q=term&amp;email=x@example.com&amp;phone=+1...</code>
        </div>
        <div className="rounded-lg border border-gray-800 p-3 bg-gray-900 md:col-span-2">
          <div className="text-xs text-gray-400 mb-2">Example</div>
          <pre className="text-xs text-green-300 overflow-auto">{curl}</pre>
        </div>
      </div>
    </div>
  )
}


