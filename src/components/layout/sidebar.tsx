'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAgency } from '@/lib/contexts/agency-context'

// Icons (you can replace these with your preferred icon library)
const DashboardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
  </svg>
)

const SalesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
      clipRule="evenodd"
    />
  </svg>
)

const TeamsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
  </svg>
)

const UsersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
  </svg>
)

const SettingsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
      clipRule="evenodd"
    />
  </svg>
)

const ReportsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
)

export function Sidebar() {
  const pathname = usePathname()
  const { isAgencyAdmin, isAgencyAgent, isIndividualAgent, loading } =
    useAgency()

  if (loading) {
    return <div className="w-64 bg-white shadow-sm h-screen"></div>
  }

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  const linkClasses = (path: string) => {
    return `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
      isActive(path)
        ? 'bg-gray-100 text-primary-700'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`
  }

  return (
    <div className="w-64 bg-white shadow-sm h-screen">
      <div className="p-4">
        <nav className="mt-5 space-y-1">
          <Link href="/dashboard" className={linkClasses('/dashboard')}>
            <DashboardIcon />
            <span className="ml-3">Dashboard</span>
          </Link>

          <Link href="/sales" className={linkClasses('/sales')}>
            <SalesIcon />
            <span className="ml-3">Sales</span>
          </Link>

          {/* Show Teams section only for agency users */}
          {(isAgencyAdmin || isAgencyAgent) && (
            <Link href="/teams" className={linkClasses('/teams')}>
              <TeamsIcon />
              <span className="ml-3">Teams</span>
            </Link>
          )}

          {/* Show Users section only for agency admins */}
          {isAgencyAdmin && (
            <Link href="/users" className={linkClasses('/users')}>
              <UsersIcon />
              <span className="ml-3">Users</span>
            </Link>
          )}

          <Link href="/reports" className={linkClasses('/reports')}>
            <ReportsIcon />
            <span className="ml-3">Reports</span>
          </Link>

          {/* Agency settings for agency admins */}
          {isAgencyAdmin && (
            <Link
              href="/agency/profile"
              className={linkClasses('/agency/profile')}
            >
              <SettingsIcon />
              <span className="ml-3">Agency Settings</span>
            </Link>
          )}

          {/* Profile settings for all users */}
          <Link href="/profile" className={linkClasses('/profile')}>
            <SettingsIcon />
            <span className="ml-3">Profile</span>
          </Link>
        </nav>
      </div>
    </div>
  )
}
