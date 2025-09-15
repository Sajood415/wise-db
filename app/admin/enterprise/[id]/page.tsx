"use client"

import { useEffect, useMemo, useState } from 'react'
import { useToast } from '@/contexts/ToastContext'

type Params = Promise<{ id: string }>

export default function EnterpriseRequestDetail({ params }: { params: Params }) {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'payment'>('overview')
  const [item, setItem] = useState<any | null>(null)
  const [enterpriseId, setEnterpriseId] = useState<string>('')
  const [signupTtl, setSignupTtl] = useState<number>(72)
  const [stripeOpen, setStripeOpen] = useState(false)
  const [manualOpen, setManualOpen] = useState(false)
  const [sendOpen, setSendOpen] = useState(false)
  const [stripeForm, setStripeForm] = useState<{ pricingAmount?: string | number; pricingCurrency?: string; allowanceSearches?: string | number; allowanceUsers?: string | number }>({})
  const [payments, setPayments] = useState<any[]>([])
  const [manualForm, setManualForm] = useState<{ paymentMethod?: string; paymentTxnId?: string; paymentTxnDate?: string; paymentNotes?: string; paymentReceived?: boolean; pricingAmount?: string | number; pricingCurrency?: string; allowanceSearches?: string | number; allowanceUsers?: string | number }>({})
  const [sendForm, setSendForm] = useState<{ enterpriseAdminEmail?: string; paymentMethod?: 'stripe' | 'bank_transfer'; pricingAmount?: string | number; pricingCurrency?: string; allowanceSearches?: string | number; allowanceUsers?: string | number; signupTokenTtlHours?: string | number; bankAccountName?: string; bankTradingName?: string; bankAccountNumber?: string; bankName?: string; bankSwift?: string; paymentReference?: string }>({})
  const [sendBusy, setSendBusy] = useState(false)

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
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setActiveTab('overview')} className={`w-full text-center py-2 rounded-md text-sm font-medium transition ${activeTab === 'overview' ? 'bg-white text-blue-700 shadow' : 'text-gray-600 hover:text-gray-900'}`}>Overview</button>
          <button onClick={() => setActiveTab('payment')} className={`w-full text-center py-2 rounded-md text-sm font-medium transition ${activeTab === 'payment' ? 'bg-white text-blue-700 shadow' : 'text-gray-600 hover:text-gray-900'}`}>Payment</button>
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
                <dd className="text-black">{(() => {
                  const n = Number(item.numberOfSearches || 0)
                  if (n <= 100) return '0 - 100'
                  if (n <= 500) return '100 - 500'
                  if (n <= 1000) return '500 - 1,000'
                  if (n <= 5000) return '1,000 - 5,000'
                  if (n <= 10000) return '5,000 - 10,000'
                  if (n <= 50000) return '10,000 - 50,000'
                  return `${Number(n).toLocaleString()}+`
                })()}</dd>
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
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white rounded-lg border p-6 flex flex-col justify-between">
            <div>
              <h2 className="font-medium text-gray-900">Send Payment Email</h2>
              <p className="text-sm text-gray-600 mt-1">Email Stripe link or bank details along with a signup link.</p>
              <div className="mt-3 text-sm text-gray-700 space-y-1">
                <p>To: <span className="font-medium">{item.enterpriseAdminEmail || item.businessEmail || '-'}</span></p>
              </div>
            </div>
            <div className="pt-4">
              <button onClick={() => { setSendForm({ enterpriseAdminEmail: item.enterpriseAdminEmail || item.businessEmail, paymentMethod: 'stripe', pricingAmount: item.pricingAmount ?? '', pricingCurrency: item.pricingCurrency || 'USD', allowanceSearches: item.allowanceSearches ?? '', allowanceUsers: item.allowanceUsers ?? '', signupTokenTtlHours: 72 }); setSendOpen(true) }} className="px-4 py-2 rounded-md bg-gray-900 text-white w-full">Send Payment Email</button>
            </div>
          </div>
          

          <div className="bg-white rounded-lg border p-6 overflow-x-auto">
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
                    <th className="py-2 pr-3">Actions</th>
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
                      <td className="py-2 pr-3 text-gray-900">
                        {(p.method && p.method !== 'stripe' && p.status === 'pending') && (
                          <button onClick={() => {
                            setManualForm({
                              paymentMethod: p.method,
                              paymentTxnId: p.metadata?.paymentTxnId || '',
                              paymentTxnDate: p.paidAt ? new Date(p.paidAt).toISOString().slice(0,10) : '',
                              paymentNotes: p.metadata?.paymentNotes || '',
                              paymentReceived: true,
                              pricingAmount: p.amount,
                              pricingCurrency: p.currency,
                              allowanceSearches: p.allowanceSearches,
                              allowanceUsers: p.allowanceUsers,
                            });
                            setManualOpen(true);
                          }} className="text-xs px-3 py-1 rounded border">Mark received</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {saving && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-4 right-4 text-xs bg-black text-white px-3 py-1 rounded-md opacity-80">Saving...</div>
        </div>
      )}

      {/* Stripe Modal */}
      {stripeOpen && (
        <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Create / Update Stripe Link</h3>
              <button onClick={()=> setStripeOpen(false)} className="w-8 h-8 rounded-full border text-black">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Amount <span className="text-red-600">*</span></label>
                <input value={String(stripeForm.pricingAmount ?? '')} onChange={(e)=> setStripeForm(f=>({...f, pricingAmount: e.target.value}))} className="w-full border rounded-md px-3 py-2 text-sm text-black" placeholder="0.00" />
                {(!(Number(stripeForm.pricingAmount) > 0)) && <p className="mt-1 text-xs text-red-600">Enter a valid amount greater than 0.</p>}
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Currency <span className="text-red-600">*</span></label>
                <input value={stripeForm.pricingCurrency || ''} onChange={(e)=> setStripeForm(f=>({...f, pricingCurrency: e.target.value}))} className="w-full border rounded-md px-3 py-2 text-sm text-black" placeholder="USD" />
                {(!(stripeForm.pricingCurrency || '').toString().trim()) && <p className="mt-1 text-xs text-red-600">Currency is required.</p>}
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Searches Included <span className="text-red-600">*</span></label>
                <input value={String(stripeForm.allowanceSearches ?? '')} onChange={(e)=> setStripeForm(f=>({...f, allowanceSearches: e.target.value}))} className="w-full border rounded-md px-3 py-2 text-sm text-black" placeholder="e.g. 10000" />
                {(!(Number(stripeForm.allowanceSearches) >= 1)) && <p className="mt-1 text-xs text-red-600">Must be a number ≥ 1.</p>}
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Users Allowed <span className="text-red-600">*</span></label>
                <input value={String(stripeForm.allowanceUsers ?? '')} onChange={(e)=> setStripeForm(f=>({...f, allowanceUsers: e.target.value}))} className="w-full border rounded-md px-3 py-2 text-sm text-black" placeholder="e.g. 25" />
                {(!(Number(stripeForm.allowanceUsers) >= 1)) && <p className="mt-1 text-xs text-red-600">Must be a number ≥ 1.</p>}
              </div>
              
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={()=> setStripeOpen(false)} className="px-4 py-2 rounded-md border text-gray-700">Cancel</button>
              {(() => {
                const amountValid = Number(stripeForm.pricingAmount) > 0
                const currencyValid = Boolean((stripeForm.pricingCurrency || '').toString().trim())
                const searchesValid = Number(stripeForm.allowanceSearches) >= 1
                const usersValid = Number(stripeForm.allowanceUsers) >= 1
                const canSubmit = amountValid && currencyValid && searchesValid && usersValid
                return (
                  <button disabled={!canSubmit} onClick={async()=>{
                    if (!canSubmit) return
                    const payload = {
                      pricingAmount: Number(stripeForm.pricingAmount),
                      pricingCurrency: (stripeForm.pricingCurrency || 'USD').toUpperCase(),
                      allowanceSearches: Number(stripeForm.allowanceSearches),
                      allowanceUsers: Number(stripeForm.allowanceUsers),
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
                  }} className={`px-4 py-2 rounded-md text-white ${canSubmit ? 'bg-gray-900' : 'bg-gray-400 cursor-not-allowed'}`}>Create Link</button>
                )
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Manual Payment Modal */}
      {manualOpen && (
        <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center z-50">
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
                <label className="block text-xs text-gray-600 mb-1">Searches Included <span className="text-red-600">*</span></label>
                <input value={String(manualForm.allowanceSearches ?? '')} onChange={(e)=> setManualForm(f=>({...f, allowanceSearches: e.target.value}))} className="w-full border rounded-md px-3 py-2 text-sm text-black" placeholder="e.g. 10000" />
                {((Number.isNaN(Number(manualForm.allowanceSearches)) || Number(manualForm.allowanceSearches) < 1)) && (
                  <p className="mt-1 text-xs text-red-600">Must be a number ≥ 1.</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Users Allowed <span className="text-red-600">*</span></label>
                <input value={String(manualForm.allowanceUsers ?? '')} onChange={(e)=> setManualForm(f=>({...f, allowanceUsers: e.target.value}))} className="w-full border rounded-md px-3 py-2 text-sm text-black" placeholder="e.g. 25" />
                {((Number.isNaN(Number(manualForm.allowanceUsers)) || Number(manualForm.allowanceUsers) < 1)) && (
                  <p className="mt-1 text-xs text-red-600">Must be a number ≥ 1.</p>
                )}
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
              <button
                disabled={(
                  Number.isNaN(Number(manualForm.allowanceSearches)) || Number(manualForm.allowanceSearches) < 1 ||
                  Number.isNaN(Number(manualForm.allowanceUsers)) || Number(manualForm.allowanceUsers) < 1
                )}
                onClick={async()=>{
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
              }}
                className={`px-4 py-2 rounded-md text-white ${(
                  !Number.isNaN(Number(manualForm.allowanceSearches)) && Number(manualForm.allowanceSearches) >= 1 &&
                  !Number.isNaN(Number(manualForm.allowanceUsers)) && Number(manualForm.allowanceUsers) >= 1
                ) ? 'bg-gray-900' : 'bg-gray-400 cursor-not-allowed'}`}
              >Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Send Payment Email Modal */}
      {sendOpen && (
        <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-3xl mx-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Send Payment Email</h3>
                <p className="text-sm text-gray-600">Email Stripe link or bank details, plus the signup link.</p>
              </div>
              <button onClick={()=> setSendOpen(false)} className="w-8 h-8 rounded-full border text-black">✕</button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-600 mb-1">To (enterprise admin email)</label>
                  <input value={sendForm.enterpriseAdminEmail || ''} onChange={(e)=> setSendForm(f=>({...f, enterpriseAdminEmail: e.target.value }))} className="w-full border rounded-md px-3 py-2 text-sm text-black" placeholder="admin@company.com" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Token TTL (hours)</label>
                  <input type="number" min={1} value={String(sendForm.signupTokenTtlHours ?? '72')} onChange={(e)=> setSendForm(f=>({...f, signupTokenTtlHours: e.target.value }))} className="w-full border rounded-md px-3 py-2 text-sm text-black" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-2">Payment Method</label>
                <div className="inline-flex rounded-md border bg-gray-50 p-1">
                  <button onClick={()=> setSendForm(f=>({...f, paymentMethod: 'stripe' }))} className={`px-3 py-1 rounded ${sendForm.paymentMethod !== 'bank_transfer' ? 'bg-white text-blue-700 shadow' : 'text-gray-600'}`}>Stripe</button>
                  <button onClick={()=> setSendForm(f=>({
                    ...f,
                    paymentMethod: 'bank_transfer',
                    bankAccountName: 'AB Compliance Limited',
                    bankTradingName: 'AB Compliance Ltd',
                    bankAccountNumber: '03-0502-0512495-000',
                    bankName: 'Westpac NZ',
                  }))} className={`px-3 py-1 rounded ${sendForm.paymentMethod === 'bank_transfer' ? 'bg-white text-blue-700 shadow' : 'text-gray-600'}`}>Bank Transfer</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Amount</label>
                  <input value={String(sendForm.pricingAmount ?? '')} onChange={(e)=> setSendForm(f=>({...f, pricingAmount: e.target.value }))} className="w-full border rounded-md px-3 py-2 text-sm text-black" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Currency</label>
                  <input value={sendForm.pricingCurrency || 'USD'} onChange={(e)=> setSendForm(f=>({...f, pricingCurrency: e.target.value }))} className="w-full border rounded-md px-3 py-2 text-sm text-black" placeholder="USD" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Searches Included</label>
                  <input value={String(sendForm.allowanceSearches ?? '')} onChange={(e)=> setSendForm(f=>({...f, allowanceSearches: e.target.value }))} className="w-full border rounded-md px-3 py-2 text-sm text-black" placeholder="e.g. 10000" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Users Allowed</label>
                  <input value={String(sendForm.allowanceUsers ?? '')} onChange={(e)=> setSendForm(f=>({...f, allowanceUsers: e.target.value }))} className="w-full border rounded-md px-3 py-2 text-sm text-black" placeholder="e.g. 25" />
                </div>
              </div>

              {sendForm.paymentMethod === 'bank_transfer' && (
                <div className="rounded-md border p-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Account holder</label>
                      <input value={sendForm.bankAccountName || ''} disabled className="w-full border rounded-md px-3 py-2 text-sm text-black bg-gray-100" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Trading name</label>
                      <input value={sendForm.bankTradingName || ''} disabled className="w-full border rounded-md px-3 py-2 text-sm text-black bg-gray-100" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Account number</label>
                      <input value={sendForm.bankAccountNumber || ''} disabled className="w-full border rounded-md px-3 py-2 text-sm text-black bg-gray-100" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Bank</label>
                      <input value={sendForm.bankName || ''} disabled className="w-full border rounded-md px-3 py-2 text-sm text-black bg-gray-100" />
                    </div>
                    <p className="md:col-span-2 text-xs text-gray-600">These bank details will be included in the email.</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button onClick={()=> setSendOpen(false)} className="px-4 py-2 rounded-md border text-gray-700">Cancel</button>
                {(() => {
                  const emailOk = Boolean((sendForm.enterpriseAdminEmail || '').trim())
                  const amtOk = Number(sendForm.pricingAmount) > 0
                  const searchesOk = Number(sendForm.allowanceSearches) >= 1
                  const usersOk = Number(sendForm.allowanceUsers) >= 1
                  const canSubmit = emailOk && amtOk && searchesOk && usersOk && !sendBusy
                  return (
                    <button disabled={!canSubmit} onClick={async()=>{
                      if (!canSubmit) return
                      setSendBusy(true)
                      const payload: any = {
                        action: 'send_payment_email',
                        enterpriseAdminEmail: sendForm.enterpriseAdminEmail,
                        paymentMethod: sendForm.paymentMethod || 'stripe',
                        pricingAmount: Number(sendForm.pricingAmount),
                        pricingCurrency: (sendForm.pricingCurrency || 'USD').toString().toUpperCase(),
                        allowanceSearches: Number(sendForm.allowanceSearches),
                        allowanceUsers: Number(sendForm.allowanceUsers),
                        signupTokenTtlHours: Number(sendForm.signupTokenTtlHours || 72),
                        bankAccountName: sendForm.bankAccountName || '',
                        bankTradingName: sendForm.bankTradingName || 'AB Compliance Ltd',
                        bankAccountNumber: sendForm.bankAccountNumber || '03-0502-0512495-000',
                        bankName: sendForm.bankName || 'Westpac NZ',
                        bankSwift: sendForm.bankSwift || '',
                        paymentReference: sendForm.paymentReference || '',
                      }
                      try {
                        const res = await fetch(`/api/admin/enterprise/${enterpriseId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'x-user-role': 'super_admin' }, body: JSON.stringify(payload) })
                        const data = await res.json()
                        if (!res.ok) { showToast(data?.error || 'Failed to send email', 'error'); return }
                        setItem(data.item)
                        setSendOpen(false)
                        showToast('Email sent', 'success')
                        try { await reload(enterpriseId) } catch {}
                      } catch (e: any) {
                        showToast(e.message || 'Failed to send email', 'error')
                      } finally {
                        setSendBusy(false)
                      }
                    }} className={`px-4 py-2 rounded-md text-white ${canSubmit ? 'bg-gray-900' : 'bg-gray-400 cursor-not-allowed'}`}>
                      {sendBusy ? (
                        <span className="inline-flex items-center">
                          <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                          Sending...
                        </span>
                      ) : (
                        'Send Email'
                      )}
                    </button>
                  )
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

