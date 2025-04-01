'use client'

import { Navbar } from '@/components/layout/navbar'
import { Sidebar } from '@/components/layout/sidebar'
import { AgencyProvider } from '@/lib/contexts/agency-context'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AgencyProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </AgencyProvider>
  )
}
