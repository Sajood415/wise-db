import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

export const dynamic = 'force-dynamic'

async function getUser(id: string) {
  await dbConnect()
  const user = await User.findById(id).select('-password').lean()
  if (!user) return null
  return JSON.parse(JSON.stringify(user))
}

export default async function AdminUserDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user: any = await getUser(id)
  if (!user) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">User not found</h1>
        <p className="text-black">The user you are looking for does not exist.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{user.firstName} {user.lastName}</h1>
        <p className="text-black">{user.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile</h3>
          <div className="space-y-2 text-sm text-black">
            <p><span className="text-black">Role:</span> {user.role}</p>
            <p><span className="text-black">Status:</span> {user.isActive ? 'Enabled' : 'Disabled'}</p>
            <p><span className="text-black">Joined:</span> {user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}</p>
            <p><span className="text-black">Last Updated:</span> {user.updatedAt ? new Date(user.updatedAt).toLocaleString() : '-'}</p>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription</h3>
          <div className="space-y-2 text-sm text-black">
            <p><span className="text-black">Type:</span> {user.subscription?.type || '-'}</p>
            <p><span className="text-black">Status:</span> {user.subscription?.status || '-'}</p>
            {user.subscription?.trialEndsAt && (
              <p><span className="text-black">Trial ends:</span> {new Date(user.subscription.trialEndsAt).toLocaleString()}</p>
            )}
            {user.subscription?.packageEndsAt && (
              <p><span className="text-black">Package ends:</span> {new Date(user.subscription.packageEndsAt).toLocaleString()}</p>
            )}
            {typeof user.subscription?.searchLimit !== 'undefined' && (
              <p><span className="text-black">Searches:</span> {user.subscription?.searchesUsed} / {user.subscription?.searchLimit === -1 ? 'Unlimited' : user.subscription?.searchLimit}</p>
            )}
          </div>
        </section>

        {user.company?.name && (
          <section className="bg-white rounded-lg shadow p-6 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Company</h3>
            <div className="space-y-2 text-sm text-black">
              <p><span className="text-black">Name:</span> {user.company.name}</p>
              {user.company.enterpriseId && <p><span className="text-black">Enterprise ID:</span> {String(user.company.enterpriseId)}</p>}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}


