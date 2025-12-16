"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

// Reuse dashboard-like header for sub-admin
function SubAdminHeader({
  user,
  onLogout,
}: {
  user: any;
  onLogout: () => void;
}) {
  const pathname = usePathname();
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {pathname !== "/manage" && (
            <Link
              href="/manage"
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
              <span className="font-medium">Manage</span>
            </Link>
          )}
          {/* Logo */}
          <Link href={"/"}>
            <div className="md:h-16 md:w-16 h-12 w-12">
              <img src="/logo.png" alt="logo" />
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.role?.replace("_", " ")}
            </p>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default function SubAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/user/profile");
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setUser(data.user);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const onLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/login");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <SubAdminHeader user={user} onLogout={onLogout} />
      <main className="p-6">{children}</main>
    </div>
  );
}
