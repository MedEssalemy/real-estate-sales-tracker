'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { createClientSupabaseClient } from '@/lib/supabase/client'

interface AgencyContextType {
  agency: any
  isAgencyAdmin: boolean
  isAgencyAgent: boolean
  isIndividualAgent: boolean
  userRole: string
  loading: boolean
  error: string | null
  refreshAgency: () => Promise<void>
}

const AgencyContext = createContext<AgencyContextType>({
  agency: null,
  isAgencyAdmin: false,
  isAgencyAgent: false,
  isIndividualAgent: false,
  userRole: '',
  loading: true,
  error: null,
  refreshAgency: async () => {},
})

export function useAgency() {
  return useContext(AgencyContext)
}

interface AgencyProviderProps {
  children: ReactNode
}

export function AgencyProvider({ children }: AgencyProviderProps) {
  const [agency, setAgency] = useState<any>(null)
  const [agencyRole, setAgencyRole] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientSupabaseClient()

  const fetchAgencyData = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser()

      if (userError) throw userError

      // Set user role from metadata
      const userMetadataRole = userData.user?.user_metadata?.role || ''
      setUserRole(userMetadataRole)

      // Check if user is associated with an agency
      const { data: agencyUser, error: agencyUserError } = await supabase
        .from('agency_users')
        .select('agency_id, role')
        .eq('user_id', userData.user?.id)
        .single()

      if (agencyUserError) {
        // No agency association
        if (agencyUserError.code === 'PGRST116') {
          setAgency(null)
          setAgencyRole(null)
          setLoading(false)
          return
        }
        throw agencyUserError
      }

      // Set agency role
      setAgencyRole(agencyUser.role)

      // Fetch agency details
      const { data: agencyData, error: agencyError } = await supabase
        .from('agencies')
        .select('*')
        .eq('id', agencyUser.agency_id)
        .single()

      if (agencyError) throw agencyError

      setAgency(agencyData)
    } catch (err: any) {
      console.error('Error fetching agency data:', err)
      setError(err.message || 'Failed to load agency data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAgencyData()

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      fetchAgencyData()
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const value = {
    agency,
    isAgencyAdmin: agencyRole === 'admin',
    isAgencyAgent: agencyRole === 'agent',
    isIndividualAgent: userRole === 'individual_agent',
    userRole,
    loading,
    error,
    refreshAgency: fetchAgencyData,
  }

  return (
    <AgencyContext.Provider value={value}>{children}</AgencyContext.Provider>
  )
}
