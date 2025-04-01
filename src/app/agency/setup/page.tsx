'use client'

import { useState, useEffect } from 'react'
import { createClientSupabaseClient } from '@/lib/supabase/client'
import { AgencySetup } from '@/components/forms/agency-setup'
import { useRouter } from 'next/navigation'

export default function AgencySetupPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientSupabaseClient()

  useEffect(() => {
    async function checkUser() {
      try {
        const { data, error } = await supabase.auth.getUser()

        if (error || !data.user) {
          throw new Error('Not authenticated')
        }

        // Check if user already has an agency
        const { data: agencyUser, error: agencyError } = await supabase
          .from('agency_users')
          .select('agency_id')
          .eq('user_id', data.user.id)
          .single()

        if (agencyUser) {
          // User already has an agency, redirect to dashboard
          router.push('/dashboard')
          return
        }

        // Check if the user role is agency_admin or agency_agent
        const userRole = data.user.user_metadata.role

        if (userRole !== 'agency_admin' && userRole !== 'agency_agent') {
          // Not an agency user, redirect to dashboard
          router.push('/dashboard')
          return
        }

        setUserId(data.user.id)
      } catch (err) {
        console.error('Error checking user:', err)
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [])

  if (loading) return <div className="container mx-auto py-10">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Agency Setup
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Complete your agency profile to get started
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {userId && <AgencySetup userId={userId} />}
      </div>
    </div>
  )
}