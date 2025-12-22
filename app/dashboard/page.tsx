"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useToast } from "@/contexts/ToastContext";
import Pagination from "@/components/ui/Pagination";

type OverviewResponse = {
  totals: {
    totalReports: number;
    approvedReports: number;
    pendingReports: number;
    rejectedReports: number;
  };
  mine: { total: number; approved: number; pending: number; rejected: number };
  searches: { thisMonth: number; saved: number };
};

type FraudItem = {
  _id: string;
  title: string;
  status: "pending" | "approved" | "rejected" | "under_review";
  type: string;
  description?: string;
  severity?: "low" | "medium" | "high" | "critical";
  fraudsterDetails?: {
    amount?: number;
    currency?: string;
    suspiciousEmail?: string;
    suspiciousPhone?: string;
    suspiciousWebsite?: string;
  };
  tags?: string[];
  createdAt: string;
  updatedAt: string;
};

type MyReportsResponse = {
  items: FraudItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

type SearchStatus = {
  type?: "free_trial" | "paid_package" | "enterprise_package" | "pay_as_you_go";
  status?: "active" | "expired" | "canceled";
  canAccessRealData?: boolean;
  searchesUsed: number;
  searchLimit: number;
  remainingSearches: number | -1;
  isTrialExpired: boolean;
  packageName?: string | null;
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<OverviewResponse | null>(null);
  const [recent, setRecent] = useState<any[]>([]);
  const [myReports, setMyReports] = useState<MyReportsResponse | null>(null);
  // Check URL params for tab, default to overview
  type TabType = "overview" | "my_reports" | "search" | "users"
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const tab = params.get('tab')
      if (tab === 'search' || tab === 'my_reports' || tab === 'users' || tab === 'overview') {
        return tab as TabType
      }
    }
    return "overview" as TabType
  });
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchForm, setSearchForm] = useState({
    q: "",
    type: "",
    severity: "",
    email: "",
    phone: "",
    minAmount: "",
    maxAmount: "",
    fuzziness: 0,
  });
  const [searchResults, setSearchResults] = useState<FraudItem[] | null>(null);
  const [searchMeta, setSearchMeta] = useState<{
    source: "real" | "dummy";
    searchesUsed: number;
    searchLimit: number;
  } | null>(null);
  const [searchPagination, setSearchPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null>(null);
  const [searchCurrentPage, setSearchCurrentPage] = useState(1);
  const [searchStatus, setSearchStatus] = useState<SearchStatus | null>(null);
  const [auth, setAuth] = useState<{ role?: string } | null>(null);
  const [renewingEnterprise, setRenewingEnterprise] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [enterpriseUsers, setEnterpriseUsers] = useState<any[]>([]);
  const [createUserForm, setCreateUserForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const { showToast } = useToast();

  function formatCurrency(amount?: number, code?: string) {
    if (typeof amount !== "number" || Number.isNaN(amount)) return "$0";
    const cur = (code || "USD").toUpperCase();
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: cur,
      }).format(amount);
    } catch {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
      }).format(amount);
    }
  }

  function getCategoryLabel(item: FraudItem): string {
    const tag = item.tags && item.tags[0] ? item.tags[0] : "";
    if (tag) return tag.charAt(0).toUpperCase() + tag.slice(1);
    const map: Record<string, string> = {
      email: "Email Fraud",
      phone: "Phone Fraud",
      website: "Website Fraud",
      identity: "Identity Fraud",
      financial: "Financial Fraud",
      other: "Other",
    };
    return map[item.type] || "Fraud";
  }

  function statusPillClasses(status: FraudItem["status"]): string {
    switch (status) {
      case "approved":
        return "bg-gray-900 text-white";
      case "pending":
        return "bg-gray-200 text-gray-800";
      case "rejected":
        return "bg-rose-600 text-white";
      default:
        return "bg-blue-100 text-blue-700";
    }
  }

  // Restore search state from sessionStorage when returning from detail page
  useEffect(() => {
    if (activeTab === 'search' && typeof window !== 'undefined') {
      try {
        const savedResults = sessionStorage.getItem('searchResults')
        const savedForm = sessionStorage.getItem('searchForm')
        const savedMeta = sessionStorage.getItem('searchMeta')
        const savedPagination = sessionStorage.getItem('searchPagination')
        const savedCurrentPage = sessionStorage.getItem('searchCurrentPage')
        
        if (savedResults) {
          setSearchResults(JSON.parse(savedResults))
        }
        if (savedForm) {
          setSearchForm(JSON.parse(savedForm))
        }
        if (savedMeta) {
          setSearchMeta(JSON.parse(savedMeta))
        }
        if (savedPagination) {
          setSearchPagination(JSON.parse(savedPagination))
        }
        if (savedCurrentPage) {
          setSearchCurrentPage(parseInt(savedCurrentPage, 10))
        }
      } catch (err) {
        console.error('Failed to restore search state', err)
      }
    }
  }, [activeTab])

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const [o, r, m, s, me] = await Promise.all([
          fetch("/api/dashboard/overview").then((res) => res.json()),
          fetch("/api/dashboard/recent-activity?limit=5").then((res) =>
            res.json()
          ),
          fetch("/api/dashboard/my-reports?page=1&pageSize=5").then((res) =>
            res.json()
          ),
          fetch("/api/search/status").then((res) => res.json()),
          fetch("/api/auth/me")
            .then((res) => res.json())
            .catch(() => ({})),
        ]);
        if (!isMounted) return;
        setOverview(o);
        setRecent(r.items || []);
        setMyReports(m);
        setSearchStatus(s);
        setAuth(me?.user || me);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-load enterprise users when enterprise admin opens Users tab
  useEffect(() => {
    let isMounted = true;
    async function loadEnterpriseUsers() {
      if (auth?.role === "enterprise_admin" && activeTab === "users") {
        setUsersLoading(true);
        try {
          const res = await fetch("/api/enterprise/users", {
            credentials: "include",
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data?.error || "Failed to load");
          if (isMounted) setEnterpriseUsers(data.items || []);
        } catch (e: any) {
          showToast(e.message || "Failed to load users", "error");
        } finally {
          if (isMounted) setUsersLoading(false);
        }
      }
    }
    loadEnterpriseUsers();
    return () => {
      isMounted = false;
    };
  }, [activeTab, auth?.role]);

  const stats = useMemo(() => {
    const allStats = [
      {
        label: "Total Reports",
        value: overview?.totals.totalReports ?? 0,
        sub: "In database",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        icon: "📚",
      },
      {
        label: "My Reports",
        value: overview?.mine.total ?? 0,
        sub: "Submitted by you",
        iconBg: "bg-emerald-100",
        iconColor: "text-emerald-600",
        icon: "🧾",
      },
      {
        label: "Searches",
        value: (overview as any)?.searches?.used ?? 0,
        sub: "",
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
        icon: "🔎",
      },
    ];
    const role = auth?.role || "";
    const canSeeTotal = role === "sub_admin" || role === "super_admin";
    return canSeeTotal
      ? allStats
      : allStats.filter((s) => s.label !== "Total Reports");
  }, [overview, auth?.role]);

  const statsGridCols = useMemo(() => {
    const n = (stats || []).length;
    if (n <= 1) return "grid-cols-1 md:grid-cols-1 lg:grid-cols-1";
    if (n === 2) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-2";
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  }, [stats]);

  const limitReached = useMemo(() => {
    if (!searchStatus) return false;
    // Same logic for all plans: check remainingSearches
    if (typeof searchStatus.remainingSearches === "number") {
      if (searchStatus.remainingSearches === -1) return false;
      return searchStatus.remainingSearches <= 0;
    }
    if (
      typeof searchStatus.searchLimit === "number" &&
      typeof searchStatus.searchesUsed === "number"
    ) {
      if (searchStatus.searchLimit < 0) return false;
      return (
        searchStatus.searchLimit > 0 &&
        searchStatus.searchesUsed >= searchStatus.searchLimit
      );
    }
    return false;
  }, [searchStatus]);

  const searchBlocked = useMemo(() => {
    const trialExpired = !!(
      searchStatus &&
      searchStatus.type === "free_trial" &&
      searchStatus.isTrialExpired
    );
    return trialExpired || limitReached;
  }, [searchStatus, limitReached]);

  async function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSearchCurrentPage(1);
    await performSearch(1);
  }

  async function handleSearchPageChange(page: number) {
    setSearchCurrentPage(page);
    await performSearch(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function performSearch(page: number = 1) {
    if (searchBlocked) {
      showToast(
        "Your free trial has expired. Upgrade to continue searching.",
        "error"
      );
      return;
    }
    setSearchLoading(true);
    try {
      const payload: any = {
        q: searchForm.q || undefined,
        type: searchForm.type || undefined,
        severity: searchForm.severity || undefined,
        email: searchForm.email || undefined,
        phone: searchForm.phone || undefined,
        page,
        limit: 10,
      };
      if (
        typeof searchForm.fuzziness === "number" &&
        searchForm.fuzziness > 0
      ) {
        payload.fuzziness = Math.max(
          0,
          Math.min(100, Math.floor(searchForm.fuzziness))
        );
      }
      const min = parseFloat(searchForm.minAmount);
      const max = parseFloat(searchForm.maxAmount);
      if (!Number.isNaN(min)) payload.minAmount = min;
      if (!Number.isNaN(max)) payload.maxAmount = max;
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Search failed");
      setSearchResults(data.items || []);
      setSearchMeta({
        source: data.source,
        searchesUsed: data.searchesUsed,
        searchLimit: data.searchLimit,
      });
      if (data.pagination) {
        setSearchPagination(data.pagination);
        setSearchCurrentPage(data.pagination.page);
      }
      // Live update search status so credits/usage update without refresh
      setSearchStatus((prev) => {
        const limit =
          typeof data.searchLimit === "number"
            ? data.searchLimit
            : prev?.searchLimit ?? 0;
        const used =
          typeof data.searchesUsed === "number"
            ? data.searchesUsed
            : prev?.searchesUsed ?? 0;
        const remaining = limit >= 0 ? Math.max(0, limit - used) : -1;
        return {
          ...(prev || {}),
          searchLimit: limit,
          searchesUsed: used,
          remainingSearches: remaining,
          isTrialExpired: prev?.isTrialExpired ?? false,
        };
      });
    } catch (err: any) {
      showToast(err.message || "Search failed", "error");
    } finally {
      setSearchLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 bg-white rounded-lg shadow p-6 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
        <p className="text-gray-600 mt-2">
          Here’s what’s happening with your fraud reports and searches.
        </p>
      </div>

      {/* Tabs - full width, expanded, 3 segments */}
      <div className="w-full bg-gray-100 rounded-md p-1">
        <div
          className={`grid gap-2 ${
            auth?.role === "enterprise_admin" ? "grid-cols-4" : "grid-cols-3"
          }`}
        >
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full text-center py-2 rounded-md text-sm font-medium transition ${
              activeTab === "overview"
                ? "bg-white text-blue-700 shadow"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("my_reports")}
            className={`w-full text-center py-2 rounded-md text-sm font-medium transition ${
              activeTab === "my_reports"
                ? "bg-white text-blue-700 shadow"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            My Reports
          </button>
          <button
            onClick={() => setActiveTab("search")}
            className={`w-full text-center py-2 rounded-md text-sm font-medium transition ${
              activeTab === "search"
                ? "bg-white text-blue-700 shadow"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Search Database
          </button>
          {auth?.role === "enterprise_admin" && (
            <button
              onClick={() => setActiveTab("users")}
              className={`w-full text-center py-2 rounded-md text-sm font-medium transition ${
                activeTab === "users"
                  ? "bg-white text-blue-700 shadow"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Users
            </button>
          )}
        </div>
      </div>

      {/* Package Information - only for Overview */}
      {activeTab === "overview" && searchStatus && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {searchStatus.packageName ||
                    (searchStatus.type === "free_trial"
                      ? "Free Trial Plan"
                      : searchStatus.type === "paid_package"
                      ? "Paid Package"
                      : searchStatus.type === "enterprise_package"
                      ? "Enterprise Package"
                      : searchStatus.type === "pay_as_you_go"
                      ? "Pay As You Go"
                      : "Current Plan")}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    {searchStatus.type === "pay_as_you_go"
                      ? `${
                          searchStatus.remainingSearches || 0
                        } credits remaining (${
                          searchStatus.searchesUsed || 0
                        } used)`
                      : `${searchStatus.searchesUsed} / ${
                          searchStatus.searchLimit === -1
                            ? "∞"
                            : searchStatus.searchLimit
                        } searches used`}
                  </span>
                  {/* removed explicit real/dummy data access indicator */}
                </div>
              </div>
            </div>
            <div className="text-right">
              {searchStatus.type === "free_trial" && (
                <div className="text-sm text-gray-600">
                  <div>
                    {searchStatus.isTrialExpired
                      ? "Trial Expired"
                      : "Trial Active"}
                  </div>
                  {searchStatus.packageName && (
                    <div className="text-xs text-blue-600 mt-1">
                      Previous: {searchStatus.packageName}
                    </div>
                  )}
                </div>
              )}
              {searchStatus.type === "paid_package" && (
                <div className="text-sm text-gray-600">
                  <div className="font-medium text-green-600">
                    ✓ Active Package
                  </div>
                  <div className="text-xs">
                    {searchStatus.packageName || "Unlimited searches"}
                  </div>
                </div>
              )}
              {searchStatus.type === "pay_as_you_go" && (
                <div className="text-sm text-gray-600">
                  <div className="font-medium text-green-600">
                    ✓ Pay As You Go
                  </div>
                  <div className="text-xs">
                    ${((searchStatus.remainingSearches || 0) * 2).toFixed(2)} in
                    credits
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stat cards - only for Overview */}
      {activeTab === "overview" && (
        <div className={`grid ${statsGridCols} gap-6`}>
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div
                  className={`w-9 h-9 ${s.iconBg} rounded-lg flex items-center justify-center`}
                >
                  <span className={`${s.iconColor} text-lg`}>{s.icon}</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{s.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  {"sub" in s && (s as any).sub !== undefined && (
                    <p className="text-xs text-emerald-600 mt-1">
                      {(s as any).sub}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions + Recent Activity */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <section className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Quick Actions
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Common tasks and shortcuts
            </p>
            <div className="space-y-3">
              <Link
                href="/dashboard/report-fraud"
                className="w-full inline-flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 bg-gray-900 text-white hover:bg-gray-800 transition"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6" />
                </svg>
                <span className="font-medium">Report New Fraud</span>
              </Link>
              <button
                onClick={() => setActiveTab("search")}
                className="w-full flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 hover:bg-gray-50 text-gray-900 transition"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <span className="font-medium">Search Database</span>
              </button>
              {auth?.role === "enterprise_admin" && searchStatus?.type === "enterprise_package" && (
                <button
                  onClick={async () => {
                    if (renewingEnterprise) return;
                    setRenewingEnterprise(true);
                    try {
                      const res = await fetch("/api/payment/enterprise/create-checkout", {
                        method: "POST",
                        credentials: "include",
                      });
                      const data = await res.json().catch(() => ({}));
                      if (!res.ok || !data?.sessionUrl) {
                        throw new Error(data?.error || "Failed to start renewal");
                      }
                      window.location.href = data.sessionUrl;
                    } catch (e: any) {
                      showToast(e?.message || "Failed to start renewal", "error");
                    } finally {
                      setRenewingEnterprise(false);
                    }
                  }}
                  className="w-full flex items-center gap-3 rounded-lg border border-blue-200 px-4 py-3 bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12a9 9 0 1 1-3-6.708" />
                    <polyline points="21 3 21 9 15 9" />
                  </svg>
                  <span className="font-medium">
                    {renewingEnterprise ? "Redirecting to payment…" : "Renew Enterprise Plan"}
                  </span>
                </button>
              )}
              <button
                onClick={() =>
                  showToast("Export will be available soon", "info")
                }
                className="w-full flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 hover:bg-gray-50 text-gray-900 transition"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span className="font-medium">Export My Data</span>
              </button>
            </div>
          </section>

          {/* Recent Activity */}
          <section className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Activity
              </h3>
              <Link
                href="/dashboard/my-reports"
                className="text-sm text-blue-600 hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {recent.length === 0 && (
                <p className="text-sm text-gray-500">No recent activity yet.</p>
              )}
              {recent.map((item) => (
                <div
                  key={item._id}
                  className="border rounded-md p-3 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {item.type === "search"
                        ? `Search: ${item.title}`
                        : item.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(item.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  {item.type === "search" ? (
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                      Completed
                    </span>
                  ) : (
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        item.status === "approved"
                          ? "bg-emerald-50 text-emerald-700"
                          : item.status === "pending"
                          ? "bg-amber-50 text-amber-700"
                          : item.status === "rejected"
                          ? "bg-rose-50 text-rose-700"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* My Reports list in Overview and My Reports tab */}
      {(activeTab === "overview" || activeTab === "my_reports") && (
        <section className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900">
            My Recent Reports
          </h3>
          <div className="mt-4 space-y-3">
            {myReports?.items?.length ? (
              myReports.items.map((r) => (
                <div key={r._id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900 truncate">
                          {r.title}
                        </p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${statusPillClasses(
                            r.status
                          )}`}
                        >
                          {r.status}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full border bg-white text-gray-700">
                          {getCategoryLabel(r)}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-gray-600">
                        <span>
                          Loss:{" "}
                          <span className="text-rose-600 font-medium">
                            {formatCurrency(
                              r.fraudsterDetails?.amount as number,
                              r.fraudsterDetails?.currency
                            )}
                          </span>
                        </span>
                        <span className="mx-2">•</span>
                        <span>
                          {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/dashboard/reports/${r._id}`}
                      className="ml-4 inline-flex items-center gap-1 text-sm text-gray-700 border rounded px-3 py-1.5 hover:bg-gray-50"
                    >
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                      View
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                You have not submitted any reports yet.
              </p>
            )}
          </div>
        </section>
      )}

      {/* Search Database - simple placeholder */}
      {activeTab === "search" && (
        <section className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Search Database
            </h3>
          </div>
          {searchBlocked && (
            <div className="mb-4 rounded-md border border-rose-200 bg-rose-50 p-3 text-rose-700 text-sm">
              {searchStatus?.type === "pay_as_you_go" && limitReached
                ? "You have no credits remaining. Purchase more credits to continue searching."
                : searchStatus?.type === "free_trial" &&
                  searchStatus?.isTrialExpired
                ? "Your free trial has expired. Upgrade your plan to continue searching."
                : "You have reached your search limit. Upgrade your plan to continue searching."}
            </div>
          )}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-3"
          >
            <div className="lg:col-span-3">
              <label className="block text-xs text-gray-600 mb-1">
                Keyword
              </label>
              <input
                disabled={searchBlocked}
                value={searchForm.q}
                onChange={(e) =>
                  setSearchForm((s) => ({ ...s, q: e.target.value }))
                }
                placeholder="Title, description, tags..."
                className="w-full border rounded-md px-3 py-2 text-sm text-black bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-xs text-gray-600 mb-1">
                Type of fraud
              </label>
              <select
                disabled={searchBlocked}
                value={searchForm.type}
                onChange={(e) =>
                  setSearchForm((s) => ({ ...s, type: e.target.value }))
                }
                className="w-full border rounded-md px-3 py-2 text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="">Any</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="website">Website</option>
                <option value="identity">Identity</option>
                <option value="financial">Financial</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="lg:col-span-2">
              <label className="block text-xs text-gray-600 mb-1">
                Risk level
              </label>
              <select
                disabled={searchBlocked}
                value={searchForm.severity}
                onChange={(e) =>
                  setSearchForm((s) => ({ ...s, severity: e.target.value }))
                }
                className="w-full border rounded-md px-3 py-2 text-sm text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="">Any</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div className="lg:col-span-2">
              <label className="block text-xs text-gray-600 mb-1">Email</label>
              <input
                disabled={searchBlocked}
                value={searchForm.email}
                onChange={(e) =>
                  setSearchForm((s) => ({ ...s, email: e.target.value }))
                }
                placeholder="Email address"
                className="w-full border rounded-md px-3 py-2 text-sm text-black bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
            <div className="lg:col-span-3">
              <label className="block text-xs text-gray-600 mb-1">Phone</label>
              <input
                disabled={searchBlocked}
                value={searchForm.phone}
                onChange={(e) =>
                  setSearchForm((s) => ({ ...s, phone: e.target.value }))
                }
                placeholder="Phone number"
                className="w-full border rounded-md px-3 py-2 text-sm text-black bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-xs text-gray-600 mb-1">
                Min amount
              </label>
              <input
                disabled={searchBlocked}
                value={searchForm.minAmount}
                onChange={(e) =>
                  setSearchForm((s) => ({
                    ...s,
                    minAmount: e.target.value.replace(/[^\d.]/g, ""),
                  }))
                }
                placeholder="0.00"
                className="w-full border rounded-md px-3 py-2 text-sm text-black bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-xs text-gray-600 mb-1">
                Max amount
              </label>
              <input
                disabled={searchBlocked}
                value={searchForm.maxAmount}
                onChange={(e) =>
                  setSearchForm((s) => ({
                    ...s,
                    maxAmount: e.target.value.replace(/[^\d.]/g, ""),
                  }))
                }
                placeholder="1000.00"
                className="w-full border rounded-md px-3 py-2 text-sm text-black bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
            <div className="lg:col-span-3">
              <label className="block text-xs text-gray-600 mb-1">
                Fuzziness
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  disabled={searchBlocked}
                  value={searchForm.fuzziness}
                  onChange={(e) =>
                    setSearchForm((s) => ({
                      ...s,
                      fuzziness: Number(e.target.value),
                    }))
                  }
                  className="w-full"
                />
                <span className="text-xs text-gray-700 w-10 text-right">
                  {searchForm.fuzziness}%
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Exact match Broad Match
              </p>
            </div>
            <div className="lg:col-span-3 flex items-end justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setSearchForm({
                    q: "",
                    type: "",
                    severity: "",
                    email: "",
                    phone: "",
                    minAmount: "",
                    maxAmount: "",
                    fuzziness: 0,
                  });
                  setSearchResults(null);
                  setSearchPagination(null);
                  setSearchCurrentPage(1);
                  // Clear sessionStorage
                  if (typeof window !== 'undefined') {
                    sessionStorage.removeItem('searchResults');
                    sessionStorage.removeItem('searchForm');
                    sessionStorage.removeItem('searchMeta');
                    sessionStorage.removeItem('searchPagination');
                    sessionStorage.removeItem('searchCurrentPage');
                  }
                }}
                className="px-4 py-2 rounded-md border text-gray-700"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={searchLoading || searchBlocked}
                className="px-4 py-2 rounded-md bg-gray-900 text-white disabled:opacity-60"
              >
                {searchLoading ? "Searching..." : "Search"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            {!searchResults && !searchLoading && (
              <p className="text-sm text-gray-500">
                Enter filters and click Search to see results.
              </p>
            )}
            {searchLoading && !searchResults && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-3"></div>
                <p className="text-sm text-gray-600">Searching...</p>
              </div>
            )}
            {searchResults && (
              <div className="relative">
                {searchLoading && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
                      <p className="text-sm text-gray-600">Loading results...</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-base font-semibold text-gray-900">
                    Search Results
                  </h4>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                    {searchPagination?.total ?? searchResults.length} {searchPagination?.total === 1 ? 'result' : 'results'}
                  </span>
                </div>
                {searchResults.length === 0 && !searchLoading ? (
                  <p className="text-sm text-gray-500">No results found.</p>
                ) : (
                  <div className="space-y-4">
                    {searchResults.map((r) => {
                      const locationLabel = (r as any).location || "N/A";
                      // Store search state in sessionStorage before navigating
                      const handleClick = () => {
                        sessionStorage.setItem('searchResults', JSON.stringify(searchResults))
                        sessionStorage.setItem('searchForm', JSON.stringify(searchForm))
                        sessionStorage.setItem('searchMeta', JSON.stringify(searchMeta))
                        if (searchPagination) {
                          sessionStorage.setItem('searchPagination', JSON.stringify(searchPagination))
                        }
                        sessionStorage.setItem('searchCurrentPage', searchCurrentPage.toString())
                      }
                      return (
                       <Link 
                         href={`/reports/${r._id}?return=${encodeURIComponent('/dashboard?tab=search')}`}
                         onClick={handleClick}
                         key={r._id}
                       >
                         <div
                          className="rounded-xl border border-gray-200 bg-white shadow-sm p-5"
                        >
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h5 className="text-lg font-semibold text-gray-900">
                                {r.title}
                              </h5>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 flex items-center gap-1">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                Verified
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                                {getCategoryLabel(r)}
                              </span>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center gap-5 text-sm text-gray-600 flex-wrap">
                            <div className="flex items-center gap-2">
                              <svg
                                className="w-4 h-4 text-gray-500"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect
                                  x="3"
                                  y="4"
                                  width="18"
                                  height="18"
                                  rx="2"
                                  ry="2"
                                />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                              </svg>
                              <span>
                                {r.createdAt
                                  ? new Date(r.createdAt).toLocaleDateString()
                                  : "-"}
                              </span>
                            </div>
                            {locationLabel && (
                              <div className="flex items-center gap-2">
                                <svg
                                  className="w-4 h-4 text-gray-500"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
                                  <circle cx="12" cy="10" r="3" />
                                </svg>
                                <span>{locationLabel}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <svg
                                className="w-4 h-4 text-rose-500"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M12 1v22" />
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3 3 0 0 1 0 6H6" />
                              </svg>
                              <span className="text-rose-600 font-medium">
                                {formatCurrency(
                                  r.fraudsterDetails?.amount as number,
                                  r.fraudsterDetails?.currency
                                )}
                              </span>
                            </div>
                          </div>
                          <p className="mt-3 text-sm text-gray-700 overflow-hidden text-ellipsis whitespace-nowrap">
                            {r.description}
                          </p>
                          <div className="mt-4 rounded-md border border-rose-200 bg-rose-50 p-3">
                            <div className="flex items-center gap-2 text-rose-700 mb-2">
                              <svg
                                className="w-4 h-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M12 9v2" />
                                <path d="M5.07 10.25a7 7 0 1 1 13.86 0c0 4.28-3.42 7.88-6.93 10.26-3.51-2.38-6.93-5.98-6.93-10.26z" />
                              </svg>
                              <span className="font-medium">
                                Scammer Contact Information
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-rose-700">
                              <div className="flex items-center gap-2">
                                <svg
                                  className="w-4 h-4"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.86 19.86 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.66 12.66 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.66 12.66 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                                <span>
                                  {(r as any).contact?.phone ||
                                    r.fraudsterDetails?.suspiciousPhone ||
                                    "N/A"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <svg
                                  className="w-4 h-4"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M4 4h16v16H4z" />
                                </svg>
                                <span>
                                  {(r as any).contact?.email ||
                                    r.fraudsterDetails?.suspiciousEmail ||
                                    "N/A"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 md:col-span-1">
                                <svg
                                  className="w-4 h-4"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <circle cx="12" cy="12" r="10" />
                                  <path d="M2 12h20" />
                                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                </svg>
                                <span>
                                  {(r as any).contact?.website ||
                                    r.fraudsterDetails?.suspiciousWebsite ||
                                    "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                       </Link>
                      );
                    })}
                  </div>
                )}
                {/* Pagination */}
                {searchPagination && searchPagination.totalPages > 1 && (
                  <div className="mt-6 pt-4 border-t border-gray-200 relative">
                    {searchLoading && (
                      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                          <span>Loading...</span>
                        </div>
                      </div>
                    )}
                    <div className={searchLoading ? 'opacity-50 pointer-events-none' : ''}>
                      <Pagination
                        currentPage={searchCurrentPage}
                        totalPages={searchPagination.totalPages}
                        totalItems={searchPagination.total}
                        itemsPerPage={searchPagination.limit}
                        onPageChange={handleSearchPageChange}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Users management - enterprise admin only */}
      {activeTab === "users" && auth?.role === "enterprise_admin" && (
        <section className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Enterprise Users
            </h3>
            <button
              onClick={async () => {
                setUsersLoading(true);
                try {
                  const res = await fetch("/api/enterprise/users", {
                    credentials: "include",
                  });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data?.error || "Failed to load");
                  setEnterpriseUsers(data.items || []);
                } catch (e: any) {
                  showToast(e.message || "Failed to load users", "error");
                } finally {
                  setUsersLoading(false);
                }
              }}
              className="text-sm px-3 py-1.5 rounded-md border"
            >
              Refresh
            </button>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Create User</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    First Name
                  </label>
                  <input
                    value={createUserForm.firstName}
                    onChange={(e) =>
                      setCreateUserForm((f) => ({
                        ...f,
                        firstName: e.target.value,
                      }))
                    }
                    className="w-full border rounded-md px-3 py-2 text-sm text-black"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Last Name
                  </label>
                  <input
                    value={createUserForm.lastName}
                    onChange={(e) =>
                      setCreateUserForm((f) => ({
                        ...f,
                        lastName: e.target.value,
                      }))
                    }
                    className="w-full border rounded-md px-3 py-2 text-sm text-black"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-gray-600 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={createUserForm.email}
                    onChange={(e) =>
                      setCreateUserForm((f) => ({
                        ...f,
                        email: e.target.value,
                      }))
                    }
                    className="w-full border rounded-md px-3 py-2 text-sm text-black"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-gray-600 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={createUserForm.password}
                    onChange={(e) =>
                      setCreateUserForm((f) => ({
                        ...f,
                        password: e.target.value,
                      }))
                    }
                    className="w-full border rounded-md px-3 py-2 text-sm text-black"
                  />
                </div>
              </div>
              <div className="mt-3">
                <button
                  disabled={usersLoading}
                  onClick={async () => {
                    if (
                      !createUserForm.firstName ||
                      !createUserForm.lastName ||
                      !createUserForm.email ||
                      !createUserForm.password
                    ) {
                      showToast("Please fill all fields", "error");
                      return;
                    }
                    setUsersLoading(true);
                    try {
                      const res = await fetch("/api/enterprise/users", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(createUserForm),
                        credentials: "include",
                      });
                      const data = await res.json();
                      if (!res.ok)
                        throw new Error(data?.error || "Failed to create");
                      setCreateUserForm({
                        firstName: "",
                        lastName: "",
                        email: "",
                        password: "",
                      });
                      showToast("User created", "success");
                      // refresh list
                      try {
                        const pres = await fetch("/api/enterprise/users", {
                          credentials: "include",
                        });
                        const pdata = await pres.json();
                        if (pres.ok) setEnterpriseUsers(pdata.items || []);
                      } catch {}
                    } catch (e: any) {
                      showToast(e.message || "Failed to create user", "error");
                    } finally {
                      setUsersLoading(false);
                    }
                  }}
                  className="px-4 py-2 rounded-md bg-gray-900 text-white disabled:opacity-60"
                >
                  {usersLoading ? "Saving..." : "Create User"}
                </button>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Users List</h4>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-600 bg-gray-50">
                      <th className="py-2 px-3">Name</th>
                      <th className="py-2 px-3">Email</th>
                      <th className="py-2 px-3">Searches Used</th>
                      <th className="py-2 px-3">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enterpriseUsers.length === 0 && (
                      <tr>
                        <td className="py-3 px-3 text-gray-500" colSpan={4}>
                          No users yet.
                        </td>
                      </tr>
                    )}
                    {enterpriseUsers.map((u) => (
                      <tr key={u._id} className="border-t">
                        <td className="py-2 px-3 text-gray-900">
                          {u.firstName} {u.lastName}
                        </td>
                        <td className="py-2 px-3 text-gray-900">{u.email}</td>
                        <td className="py-2 px-3 text-gray-900">
                          {typeof (u as any).searchCount === "number"
                            ? (u as any).searchCount
                            : 0}
                        </td>
                        <td className="py-2 px-3 text-gray-900">
                          {u.createdAt
                            ? new Date(u.createdAt).toLocaleDateString()
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
