"use client"

import { useEffect, useMemo, useState } from 'react'
import { useToast } from '@/contexts/ToastContext'

type Params = Promise<{ id: string }>

export default function EnterpriseRequestDetail({ params }: { params: Params }) {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'payment' | 'signup'>('overview')
  const [item, setItem] = useState<any | null>(null)
  const [enterpriseId, setEnterpriseId] = useState<string>('')
  const [signupTtl, setSignupTtl] = useState<number>(72)
  const [stripeOpen, setStripeOpen] = useState(false)
  const [manualOpen, setManualOpen] = useState(false)
  const [stripeForm, setStripeForm] = useState<{ pricingAmount?: string | number; pricingCurrency?: string; allowanceSearches?: string | number; allowanceUsers?: string | number }>({})
  const [payments, setPayments] = useState<any[]>([])
  const [manualForm, setManualForm] = useState<{ paymentMethod?: string; paymentTxnId?: string; paymentTxnDate?: string; paymentNotes?: string; paymentReceived?: boolean; pricingAmount?: string | number; pricingCurrency?: string; allowanceSearches?: string | number; allowanceUsers?: string | number }>({})

  useEffect(() => {
    (async () => {
      const p = await params
      setEnterpriseId(p.id)
      await reload(p.id)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function reload(id = enterpriseId) {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/enterprise/${id}`, { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to load')
      setItem(data.item)
      try {
        const pres = await fetch(`/api/admin/enterprise/${id}/payments`, { headers: { 'x-user-role': 'super_admin' } })
        const pdata = await pres.json()
        if (pres.ok) setPayments(Array.isArray(pdata.items) ? pdata.items : [])
      } catch {}
    } catch (e: any) {
      showToast(e.message || 'Failed to load', 'error')
      setItem(null)
    } finally {
      setLoading(false)
    }
  }

  async function patch(payload: any) {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/enterprise/${enterpriseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-user-role': 'super_admin' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to save')
      setItem(data.item)
      return data
    } finally {
      setSaving(false)
    }
  }

  const statusBadge = useMemo(() => {
    const st = item?.status
    return st === 'new' ? 'bg-blue-100 text-blue-700' : st === 'in_review' ? 'bg-amber-100 text-amber-700' : st === 'contacted' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
  }, [item?.status])

  const lastManualPayment = useMemo(() => {
    return payments.find((p) => p?.method && p.method !== 'stripe')
  }, [payments])

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold text-gray-900">Enterprise Request</h1>
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold text-gray-900">Enterprise Request</h1>
        <p className="mt-2 text-gray-600">Not found.</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-xl font-semibold text-gray-900">Enterprise Request</h1>
        <div className="flex items-center gap-2">
          <select
            value={item.status}
            onChange={async (e) => {
              await patch({ status: e.target.value })
              showToast('Status updated', 'success')
            }}
            className={`text-xs px-2 py-1 rounded border bg-white ${statusBadge}`}
          >
            <option value="new">New</option>
            <option value="in_review">In Review</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="w-full bg-gray-100 rounded-md p-1">
        <div className="grid grid-cols-3 gap-2">
          <button onClick={() => setActiveTab('overview')} className={`w-full text-center py-2 rounded-md text-sm font-medium transition ${activeTab === 'overview' ? 'bg-white text-blue-700 shadow' : 'text-gray-600 hover:text-gray-900'}`}>Overview</button>
          <button onClick={() => setActiveTab('payment')} className={`w-full text-center py-2 rounded-md text-sm font-medium transition ${activeTab === 'payment' ? 'bg-white text-blue-700 shadow' : 'text-gray-600 hover:text-gray-900'}`}>Payment</button>
          <button onClick={() => setActiveTab('signup')} className={`w-full text-center py-2 rounded-md text-sm font-medium transition ${activeTab === 'signup' ? 'bg-white text-blue-700 shadow' : 'text-gray-600 hover:text-gray-900'}`}>Signup</button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg border p-4">
            <h2 className="font-medium text-gray-900 mb-2">Company</h2>
            <dl className="text-sm text-gray-700 space-y-2">
              <div>
                <dt className="text-gray-600">Company Name</dt>
                <dd className="text-black">{item.companyName}</dd>
              </div>
              <div>
                <dt className="text-gray-600">Industry</dt>
                <dd className="text-black">{item.industry || '-'}</dd>
              </div>
              <div>
                <dt className="text-gray-600">Requested</dt>
                <dd className="text-black">{new Date(item.createdAt).toLocaleString()}</dd>
              </div>
            </dl>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <h2 className="font-medium text-gray-900 mb-2">Contact</h2>
            <dl className="text-sm text-gray-700 space-y-2">
              <div>
                <dt className="text-gray-600">Contact Name</dt>
                <dd className="text-black">{item.contactName}</dd>
              </div>
              <div>
                <dt className="text-gray-600">Business Email</dt>
                <dd className="text-black">{item.businessEmail}</dd>
              </div>
              <div>
                <dt className="text-gray-600">Phone Number</dt>
                <dd className="text-black">{item.phoneNumber}</dd>
              </div>
            </dl>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <h2 className="font-medium text-gray-900 mb-2">Requirements</h2>
            <dl className="text-sm text-gray-700 space-y-2">
              <div>
                <dt className="text-gray-600">When Needed</dt>
                <dd className="text-black">{item.whenNeeded}</dd>
              </div>
              <div>
                <dt className="text-gray-600">Number of Searches</dt>
                <dd className="text-black">{item.numberOfSearches}</dd>
              </div>
              <div>
                <dt className="text-gray-600">Number of Users</dt>
                <dd className="text-black">{item.numberOfUsers}</dd>
              </div>
            </dl>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <h2 className="font-medium text-gray-900 mb-2">Message</h2>
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{item.message || '-'}</p>
          </div>
        </div>
      )}

      {activeTab === 'payment' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg border p-6 flex flex-col justify-between">
            <div>
              <h2 className="font-medium text-gray-900">Stripe Link / Pricing</h2>
              <p className="text-sm text-gray-600 mt-1">Create a Stripe checkout link with pricing and allowances.</p>
              <div className="mt-3 text-sm text-gray-700 space-y-1">
                <p>Amount: <span className="font-medium">{item.pricingAmount ?? '-'}</span> {item.pricingCurrency || ''}</p>
                <p>Included Searches: <span className="font-medium">{item.allowanceSearches ?? '-'}</span></p>
                <p>Users Allowed: <span className="font-medium">{item.allowanceUsers ?? '-'}</span></p>
                {item.stripeCheckoutUrl && (
                  <p>Checkout: <a href={item.stripeCheckoutUrl} target="_blank" className="text-blue-700 underline">Open link</a></p>
                )}
              </div>
            </div>
            <div className="pt-4">
              <button onClick={() => { setStripeForm({ pricingAmount: item.pricingAmount ?? '', pricingCurrency: item.pricingCurrency || 'USD', allowanceSearches: item.allowanceSearches ?? '', allowanceUsers: item.allowanceUsers ?? '' }); setStripeOpen(true) }} className="px-4 py-2 rounded-md bg-gray-900 text-white w-full">Create / Update Stripe Link</button>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6 flex flex-col justify-between">
            <div>
              <h2 className="font-medium text-gray-900">Manual Payment</h2>
              <p className="text-sm text-gray-600 mt-1">Record a manual payment with transaction details.</p>
              <div className="mt-3 text-sm text-gray-700 space-y-1">
                {lastManualPayment ? (
                  <>
                    <p>Last manual payment:</p>
                    <p>Method: <span className="font-medium">{lastManualPayment.method}</span></p>
                    <p>Amount: <span className="font-medium">{lastManualPayment.amount} {lastManualPayment.currency}</span></p>
                    <p>Reference: <span className="font-medium">{lastManualPayment.metadata?.paymentTxnId || '-'}</span></p>
                    <p>Date: <span className="font-medium">{new Date(lastManualPayment.paidAt || lastManualPayment.createdAt).toLocaleString()}</span></p>
                    <p>Status: <span className={`font-medium ${lastManualPayment.status === 'completed' ? 'text-emerald-700' : 'text-gray-700'}`}>{lastManualPayment.status}</span></p>
                  </>
                ) : (
                  <p className="text-gray-600">No manual payments recorded yet.</p>
                )}
              </div>
            </div>
            <div className="pt-4">
              <button onClick={() => { setManualForm({ paymentMethod: '', paymentTxnId: '', paymentTxnDate: '', paymentNotes: '', paymentReceived: true, pricingAmount: item.pricingAmount ?? '', pricingCurrency: item.pricingCurrency || 'USD', allowanceSearches: item.allowanceSearches ?? '', allowanceUsers: item.allowanceUsers ?? '' }); setManualOpen(true) }} className="px-4 py-2 rounded-md bg-gray-900 text-white w-full">Record Manual Payment</button>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h2 className="font-medium text-gray-900">Payment History</h2>
            <p className="text-sm text-gray-600 mt-1">All transactions (Stripe and manual).</p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th className="py-2 pr-3">Date</th>
                    <th className="py-2 pr-3">Method</th>
                    <th className="py-2 pr-3">Amount</th>
                    <th className="py-2 pr-3">Status</th>
                    <th className="py-2 pr-3">Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length === 0 && (
                    <tr><td className="py-3 text-gray-500" colSpan={5}>No payments yet.</td></tr>
                  )}
                  {payments.map((p) => (
                    <tr key={p._id} className="border-t">
                      <td className="py-2 pr-3 text-gray-900">{p.paidAt ? new Date(p.paidAt).toLocaleString() : new Date(p.createdAt).toLocaleString()}</td>
                      <td className="py-2 pr-3 text-gray-900">{p.method || (p.stripeSessionId ? 'stripe' : (p.metadata?.source === 'manual_update' ? 'bank_transfer' : '-'))}</td>
                      <td className="py-2 pr-3 text-gray-900">{p.amount} {p.currency}</td>
                      <td className="py-2 pr-3"><span className={`px-2 py-0.5 rounded text-xs ${p.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : p.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}`}>{p.status}</span></td>
                      <td className="py-2 pr-3 text-gray-900">{p.stripePaymentIntentId || p.metadata?.paymentTxnId || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'signup' && (
        <div className="bg-white rounded-lg border p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Enterprise Admin Email</label>
              <input defaultValue={item.enterpriseAdminEmail || ''} onBlur={async(e)=>{ const v=(e.target as HTMLInputElement).value; await patch({ enterpriseAdminEmail: v }); showToast('Saved admin email','success') }} className="w-full border rounded-md px-3 py-2 text-sm text-black" placeholder="admin@company.com" />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Signup token TTL (hours)</label>
              <input type="number" min={1} value={signupTtl} onChange={(e)=> setSignupTtl(Number(e.target.value) || 1)} className="w-full border rounded-md px-3 py-2 text-sm text-black" />
            </div>
            <div className="flex items-end">
              <button disabled={saving || !item.paymentReceived} title={!item.paymentReceived ? 'Complete payment first' : ''} onClick={async()=>{
                const resp = await patch({ action: 'generate_signup_token', signupTokenTtlHours: signupTtl, enterpriseAdminEmail: item.enterpriseAdminEmail })
                if (resp?.signupLink) {
                  try { await navigator.clipboard.writeText(resp.signupLink); showToast('Signup link copied to clipboard', 'success') } catch { showToast('Signup link generated', 'success') }
                }
              }} className="px-4 py-2 rounded-md bg-gray-900 text-white disabled:opacity-60">{saving ? 'Generating...' : 'Generate & Copy Link'}</button>
            </div>
          </div>

          {item.signupToken && (
            <div className="text-sm text-gray-700">
              <p>Signup token set. Expires: {item.signupTokenExpiresAt ? new Date(item.signupTokenExpiresAt).toLocaleString() : 'N/A'}</p>
            </div>
          )}
        </div>
      )}

      {saving && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-4 right-4 text-xs bg-black text-white px-3 py-1 rounded-md opacity-80">Saving...</div>
        </div>
      )}

      {/* Stripe Modal */}
      {stripeOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Create / Update Stripe Link</h3>
              <button onClick={()=> setStripeOpen(false)} className="w-8 h-8 rounded-full border text-black">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Amount</label>
                <input value={String(stripeForm.pricingAmount ?? '')} onChange={(e)=> setStripeForm(f=>({...f, pricingAmount: e.target.value}))} className="w-full border rounded-md px-3 py-2 text-sm text-black" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Currency</label>
                <input value={stripeForm.pricingCurrency || ''} onChange={(e)=> setStripeForm(f=>({...f, pricingCurrency: e.target.value}))} className="w-full border rounded-md px-3 py-2 text-sm text-black" placeholder="USD" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Searches Included</label>
                <input value={String(stripeForm.allowanceSearches ?? '')} onChange={(e)=> setStripeForm(f=>({...f, allowanceSearches: e.target.value}))} className="w-full border rounded-md px-3 py-2 text-sm text-black" placeholder="e.g. 10000" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Users Allowed</label>
                <input value={String(stripeForm.allowanceUsers ?? '')} onChange={(e)=> setStripeForm(f=>({...f, allowanceUsers: e.target.value}))} className="w-full border rounded-md px-3 py-2 text-sm text-black" placeholder="e.g. 25" />
              </div>
              
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={()=> setStripeOpen(false)} className="px-4 py-2 rounded-md border text-gray-700">Cancel</button>
              <button onClick={async()=>{
                const payload = {
                  pricingAmount: Number(stripeForm.pricingAmount || 0),
                  pricingCurrency: (stripeForm.pricingCurrency || 'USD').toUpperCase(),
                  allowanceSearches: Number(stripeForm.allowanceSearches || 0),
                  allowanceUsers: Number(stripeForm.allowanceUsers || 0),
                  enterpriseAdminEmail: item.enterpriseAdminEmail || item.businessEmail,
                }
                const res = await fetch(`/api/admin/enterprise/${enterpriseId}/create-checkout`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-user-role': 'super_admin' }, body: JSON.stringify(payload) })
                const data = await res.json()
                if (!res.ok) { showToast(data?.error || 'Failed to create Stripe session', 'error'); return }
                setItem(data.item)
                setStripeOpen(false)
                if (data.sessionUrl) {
                  try { await navigator.clipboard.writeText(data.sessionUrl); showToast('Checkout link copied to clipboard', 'success') } catch { showToast('Checkout link created', 'success') }
                }
              }} className="px-4 py-2 rounded-md bg-gray-900 text-white">Create Link</button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Payment Modal */}
      {manualOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Record Manual Payment</h3>
              <button onClick={()=> setManualOpen(false)} className="w-8 h-8 rounded-full border text-black">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Amount</label>
                <input value={String(manualForm.pricingAmount ?? '')} onChange={(e)=> setManualForm(f=>({...f, pricingAmount: e.target.value}))} className="w-full border rounded-md px-3 py-2 text-sm text-black" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Currency</label>
                <input value={manualForm.pricingCurrency || 'USD'} onChange={(e)=> setManualForm(f=>({...f, pricingCurrency: e.target.value}))} className="w-full border rounded-md px-3 py-2 text-sm text-black" placeholder="USD" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Searches Included</label>
                <input value={String(manualForm.allowanceSearches ?? '')} onChange={(e)=> setManualForm(f=>({...f, allowanceSearches: e.target.value}))} className="w-full border rounded-md px-3 py-2 text-sm text-black" placeholder="e.g. 10000" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Users Allowed</label>
                <input value={String(manualForm.allowanceUsers ?? '')} onChange={(e)=> setManualForm(f=>({...f, allowanceUsers: e.target.value}))} className="w-full border rounded-md px-3 py-2 text-sm text-black" placeholder="e.g. 25" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Payment Method</label>
                <select value={manualForm.paymentMethod || ''} onChange={(e)=> setManualForm(f=>({...f, paymentMethod: e.target.value}))} className="w-full border rounded-md px-3 py-2 text-sm text-black bg-white">
                  <option value="">Select</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cash">Cash</option>
                  <option value="cheque">Cheque</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Transaction ID</label>
                <input value={manualForm.paymentTxnId || ''} onChange={(e)=> setManualForm(f=>({...f, paymentTxnId: e.target.value}))} className="w-full border rounded-md px-3 py-2 text-sm text-black" placeholder="Reference" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Transaction Date</label>
                <input type="date" value={manualForm.paymentTxnDate || ''} onChange={(e)=> setManualForm(f=>({...f, paymentTxnDate: e.target.value}))} className="w-full border rounded-md px-3 py-2 text-sm text-black bg-white" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Notes</label>
                <input value={manualForm.paymentNotes || ''} onChange={(e)=> setManualForm(f=>({...f, paymentNotes: e.target.value}))} className="w-full border rounded-md px-3 py-2 text-sm text-black" placeholder="Optional" />
              </div>
              <div className="col-span-2">
                <label className="inline-flex items-center gap-2 text-sm text-gray-800"><input type="checkbox" checked={!!manualForm.paymentReceived} onChange={(e)=> setManualForm(f=>({...f, paymentReceived: (e.target as HTMLInputElement).checked}))} /> Payment received</label>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={()=> setManualOpen(false)} className="px-4 py-2 rounded-md border text-gray-700">Cancel</button>
              <button onClick={async()=>{
                await patch({
                  paymentMethod: manualForm.paymentMethod || null,
                  paymentTxnId: manualForm.paymentTxnId || '',
                  paymentTxnDate: manualForm.paymentTxnDate || '',
                  paymentNotes: manualForm.paymentNotes || '',
                  paymentReceived: !!manualForm.paymentReceived,
                  pricingAmount: Number(manualForm.pricingAmount || 0),
                  pricingCurrency: (manualForm.pricingCurrency || 'USD').toUpperCase(),
                  allowanceSearches: Number(manualForm.allowanceSearches || 0),
                  allowanceUsers: Number(manualForm.allowanceUsers || 0)
                })
                showToast('Manual payment saved', 'success')
                setManualOpen(false)
              }} className="px-4 py-2 rounded-md bg-gray-900 text-white">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

