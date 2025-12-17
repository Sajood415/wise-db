"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

// Dashboard Header Component (same as dashboard layout)
const DashboardHeader = ({
  user,
  onLogout,
}: {
  user: any;
  onLogout: () => void;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const role = user?.role as string | undefined;
  const homePath =
    role === "super_admin"
      ? "/admin/dashboard"
      : role === "sub_admin"
      ? "/manage"
      : role === "enterprise_admin"
      ? "/enterprise/dashboard"
      : role === "enterprise_user"
      ? "/enterprise/dashboard"
      : "/dashboard";
  
  // Check if there's a return URL in query params (from reports detail page)
  // Only individual users will have this when coming from search results
  // For all other roles, returnUrl will be null and backPath defaults to their homePath
  const returnUrl = searchParams.get('return');
  const backPath = returnUrl || homePath;

  const trialEndsAt = user?.subscription?.trialEndsAt
    ? new Date(user.subscription.trialEndsAt)
    : null;
  const packageEndsAt = user?.subscription?.packageEndsAt
    ? new Date(user.subscription.packageEndsAt)
    : null;
  const now = new Date();

  const expirationDate =
    user?.subscription?.type === "paid_package" ||
    user?.subscription?.type === "enterprise_package" ||
    user?.subscription?.type === "pay_as_you_go"
      ? packageEndsAt
      : trialEndsAt;
  const msLeft = expirationDate
    ? expirationDate.getTime() - now.getTime()
    : null;
  const daysLeft =
    typeof msLeft === "number"
      ? Math.ceil(msLeft / (1000 * 60 * 60 * 24))
      : null;

  const trialActive =
    user?.subscription?.type === "free_trial" &&
    user?.subscription?.status === "active";
  const packageActive =
    (user?.subscription?.type === "paid_package" ||
      user?.subscription?.type === "enterprise_package") &&
    user?.subscription?.status === "active";
  const shouldShowPackageCapsule =
    (user?.role === "individual" ||
      user?.role === "enterprise_admin" ||
      user?.role === "enterprise_user") &&
    (trialActive || packageActive || !!user?.subscription);

  function formatDate(d?: Date | null) {
    if (!d) return "";
    try {
      return d.toLocaleDateString();
    } catch {
      return "";
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {pathname !== homePath && (
            <Link
              href={backPath}
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <svg
                className="w-4 h-4 mr-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              <span className="font-medium">
                {returnUrl 
                  ? "Back" 
                  : role === "super_admin" 
                    ? "Admin" 
                    : role === "sub_admin"
                      ? "Manage"
                      : role === "enterprise_admin" || role === "enterprise_user"
                        ? "Enterprise"
                        : "Dashboard"}
              </span>
            </Link>
          )}
          <Link href={"/"}>
            <div className="md:h-16 md:w-16 h-12 w-12">
              <img src="/logo.png" alt="logo" />
            </div>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            {user?.role === "individual" && (
              <Link
                href="/dashboard/payment"
                className="hidden md:inline-flex items-center text-sm font-semibold border border-blue-200 text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                Upgrade Plan
              </Link>
            )}
            {user?.role === "enterprise_admin" && (
              <>
                <Link
                  href="/enterprise/dashboard/api"
                  className="hidden md:inline-flex items-center text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  API Access
                </Link>
                <Link
                  href="/enterprise/dashboard/api"
                  className="md:hidden inline-flex items-center text-sm font-semibold text-blue-700 underline"
                >
                  API Access
                </Link>
              </>
            )}
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.role?.replace("_", " ")}
              </p>
            </div>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

function ReportsLayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/user/profile", {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          // If not authenticated, redirect to login
          router.push("/login");
        }
      } catch (error) {
        console.error("Failed to load user", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
      router.push("/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} onLogout={handleLogout} />
      <main>{children}</main>
    </div>
  );
}

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <ReportsLayoutInner>{children}</ReportsLayoutInner>
    </Suspense>
  );
}
