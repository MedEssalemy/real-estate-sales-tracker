import { createClientSupabaseClient } from './client'
import { createServerSupabaseClient } from './server'

export type Agency = {
  id: string
  name: string
  address: string | null
  logo_url: string | null
  subscription_status: string
  subscription_plan: string
  created_at: string
  updated_at: string
}

export type AgencyUser = {
  id: string
  agency_id: string
  user_id: string
  role: 'admin' | 'agent'
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export async function getUserAgencies() {
  const supabase = createClientSupabaseClient()

  // Get user's ID
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user)
    return { data: null, error: { message: 'Not authenticated' } }

  // Get all agencies where user is a member
  const { data: agencyUsers, error: agencyUsersError } = await supabase
    .from('agency_users')
    .select('agency_id, role')
    .eq('user_id', userData.user.id)
    .eq('status', 'active')

  if (agencyUsersError) return { data: null, error: agencyUsersError }
  if (!agencyUsers.length) return { data: [], error: null }

  // Get the agency details
  const agencyIds = agencyUsers.map((au) => au.agency_id)
  const { data: agencies, error: agenciesError } = await supabase
    .from('agencies')
    .select('*')
    .in('id', agencyIds)

  if (agenciesError) return { data: null, error: agenciesError }

  // Combine agency data with role information
  const agenciesWithRole = agencies.map((agency) => {
    const agencyUser = agencyUsers.find((au) => au.agency_id === agency.id)
    return {
      ...agency,
      userRole: agencyUser?.role || 'agent',
    }
  })

  return { data: agenciesWithRole, error: null }
}

export async function createAgency(agencyData: Partial<Agency>) {
  const supabase = createClientSupabaseClient()

  // Get user's ID
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user)
    return { data: null, error: { message: 'Not authenticated' } }

  // Create a new agency
  const { data: agency, error: agencyError } = await supabase
    .from('agencies')
    .insert([agencyData])
    .select()
    .single()

  if (agencyError) return { data: null, error: agencyError }

  // Add the creator as an admin
  const { error: userError } = await supabase.from('agency_users').insert([
    {
      agency_id: agency.id,
      user_id: userData.user.id,
      role: 'admin',
      status: 'active',
    },
  ])

  if (userError) {
    // Rollback agency creation
    await supabase.from('agencies').delete().eq('id', agency.id)
    return { data: null, error: userError }
  }

  return { data: agency, error: null }
}

export async function getAgencyById(agencyId: string) {
  const supabase = createClientSupabaseClient()

  const { data, error } = await supabase
    .from('agencies')
    .select('*')
    .eq('id', agencyId)
    .single()

  return { data, error }
}

export async function updateAgency(
  agencyId: string,
  agencyData: Partial<Agency>
) {
  const supabase = createClientSupabaseClient()

  const { data, error } = await supabase
    .from('agencies')
    .update(agencyData)
    .eq('id', agencyId)
    .select()
    .single()

  return { data, error }
}

export async function getAgencyUsers(agencyId: string) {
  const supabase = createClientSupabaseClient()

  const { data, error } = await supabase
    .from('agency_users')
    .select(
      `
      *,
      user:user_id (id, email, user_metadata)
    `
    )
    .eq('agency_id', agencyId)

  return { data, error }
}

export async function addAgencyUser(
  agencyId: string,
  email: string,
  role: 'admin' | 'agent'
) {
  const supabase = createClientSupabaseClient()

  // First, find the user by email
  const { data: users, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  if (userError) return { data: null, error: { message: 'User not found' } }

  // Check if the user is already in the agency
  const { data: existingUser, error: existingUserError } = await supabase
    .from('agency_users')
    .select('*')
    .eq('agency_id', agencyId)
    .eq('user_id', users.id)
    .single()

  if (existingUser)
    return { data: null, error: { message: 'User already in agency' } }

  // Add the user to the agency
  const { data, error } = await supabase
    .from('agency_users')
    .insert([
      {
        agency_id: agencyId,
        user_id: users.id,
        role,
        status: 'active',
      },
    ])
    .select()
    .single()

  return { data, error }
}

export async function updateAgencyUser(
  agencyUserId: string,
  userData: Partial<AgencyUser>
) {
  const supabase = createClientSupabaseClient()

  const { data, error } = await supabase
    .from('agency_users')
    .update(userData)
    .eq('id', agencyUserId)
    .select()
    .single()

  return { data, error }
}

export async function removeAgencyUser(agencyUserId: string) {
  const supabase = createClientSupabaseClient()

  const { error } = await supabase
    .from('agency_users')
    .delete()
    .eq('id', agencyUserId)

  return { error }
}