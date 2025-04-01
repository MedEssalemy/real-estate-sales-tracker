import { createClientSupabaseClient } from '@/lib/supabase/client'
import { createServerSupabaseClient } from '@/lib/supabase/server'

/**
 * Database utility functions for client-side data operations
 */

// Agency functions
export async function getAgencyById(agencyId: string) {
  const supabase = createClientSupabaseClient()
  const { data, error } = await supabase
    .from('agencies')
    .select('*')
    .eq('id', agencyId)
    .single()

  if (error) throw error
  return data
}

export async function getUserAgency() {
  const supabase = createClientSupabaseClient()

  // First get the user's agency membership
  const { data: agencyUser, error: agencyUserError } = await supabase
    .from('agency_users')
    .select('agency_id, role')
    .single()

  if (agencyUserError) throw agencyUserError

  // Then get the agency details
  const { data: agency, error: agencyError } = await supabase
    .from('agencies')
    .select('*')
    .eq('id', agencyUser.agency_id)
    .single()

  if (agencyError) throw agencyError

  return {
    agency,
    role: agencyUser.role,
  }
}

export async function updateAgency(agencyId: string, updates: any) {
  const supabase = createClientSupabaseClient()
  const { data, error } = await supabase
    .from('agencies')
    .update(updates)
    .eq('id', agencyId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Team functions
export async function getAgencyTeams(agencyId: string) {
  const supabase = createClientSupabaseClient()
  const { data, error } = await supabase
    .from('teams')
    .select(
      `
      *,
      leader:leader_id(id, email, user_metadata->full_name),
      members:team_members(
        user_id, 
        role,
        user:user_id(id, email, user_metadata->full_name)
      )
    `
    )
    .eq('agency_id', agencyId)
    .order('name')

  if (error) throw error
  return data
}

export async function getTeamById(teamId: string) {
  const supabase = createClientSupabaseClient()
  const { data, error } = await supabase
    .from('teams')
    .select(
      `
      *,
      leader:leader_id(id, email, user_metadata->full_name),
      members:team_members(
        user_id, 
        role,
        user:user_id(id, email, user_metadata->full_name)
      )
    `
    )
    .eq('id', teamId)
    .single()

  if (error) throw error
  return data
}

export async function createTeam(teamData: any) {
  const supabase = createClientSupabaseClient()
  const { data, error } = await supabase
    .from('teams')
    .insert(teamData)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateTeam(teamId: string, updates: any) {
  const supabase = createClientSupabaseClient()
  const { data, error } = await supabase
    .from('teams')
    .update(updates)
    .eq('id', teamId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteTeam(teamId: string) {
  const supabase = createClientSupabaseClient()
  const { error } = await supabase.from('teams').delete().eq('id', teamId)

  if (error) throw error
  return true
}

// Team member functions
export async function addTeamMember(teamMemberData: any) {
  const supabase = createClientSupabaseClient()
  const { data, error } = await supabase
    .from('team_members')
    .insert(teamMemberData)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function removeTeamMember(teamId: string, userId: string) {
  const supabase = createClientSupabaseClient()
  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('team_id', teamId)
    .eq('user_id', userId)

  if (error) throw error
  return true
}

// Agency user functions
export async function getAgencyUsers(agencyId: string) {
  const supabase = createClientSupabaseClient()
  const { data, error } = await supabase
    .from('agency_users')
    .select(
      `
      *,
      user:user_id(id, email, user_metadata->full_name)
    `
    )
    .eq('agency_id', agencyId)

  if (error) throw error
  return data
}

export async function addAgencyUser(agencyUserData: any) {
  const supabase = createClientSupabaseClient()
  const { data, error } = await supabase
    .from('agency_users')
    .insert(agencyUserData)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateAgencyUser(
  agencyId: string,
  userId: string,
  updates: any
) {
  const supabase = createClientSupabaseClient()
  const { data, error } = await supabase
    .from('agency_users')
    .update(updates)
    .eq('agency_id', agencyId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function removeAgencyUser(agencyId: string, userId: string) {
  const supabase = createClientSupabaseClient()
  const { error } = await supabase
    .from('agency_users')
    .delete()
    .eq('agency_id', agencyId)
    .eq('user_id', userId)

  if (error) throw error
  return true
}

// Dealers, Referrers, Partners functions
export async function getDealers(agencyId?: string) {
  const supabase = createClientSupabaseClient()
  let query = supabase.from('dealers').select('*')

  // Filter by agency if provided
  if (agencyId) {
    query = query.eq('agency_id', agencyId)
  }

  const { data, error } = await query.order('name')

  if (error) throw error
  return data
}

export async function getReferrers(agencyId?: string) {
  const supabase = createClientSupabaseClient()
  let query = supabase.from('referrers').select('*')

  // Filter by agency if provided
  if (agencyId) {
    query = query.eq('agency_id', agencyId)
  }

  const { data, error } = await query.order('name')

  if (error) throw error
  return data
}

export async function getPartners(agencyId?: string) {
  const supabase = createClientSupabaseClient()
  let query = supabase.from('partners').select('*')

  // Filter by agency if provided
  if (agencyId) {
    query = query.eq('agency_id', agencyId)
  }

  const { data, error } = await query.order('name')

  if (error) throw error
  return data
}

// Sales functions
export async function getSales(filters?: any) {
  const supabase = createClientSupabaseClient()
  let query = supabase.from('sales').select(`
    *,
    agent:user_id(id, email, user_metadata->full_name),
    dealer:dealer_id(*),
    referrer:referrer_id(*),
    partner:partner_id(*),
    team:team_id(id, name)
  `)

  // Apply filters if provided
  if (filters) {
    if (filters.userId) {
      query = query.eq('user_id', filters.userId)
    }

    if (filters.agencyId) {
      query = query.eq('agency_id', filters.agencyId)
    }

    if (filters.teamId) {
      query = query.eq('team_id', filters.teamId)
    }

    if (filters.startDate) {
      query = query.gte('sale_date', filters.startDate)
    }

    if (filters.endDate) {
      query = query.lte('sale_date', filters.endDate)
    }
  }

  const { data, error } = await query.order('sale_date', { ascending: false })

  if (error) throw error
  return data
}

export async function getSaleById(saleId: string) {
  const supabase = createClientSupabaseClient()
  const { data, error } = await supabase
    .from('sales')
    .select(
      `
      *,
      agent:user_id(id, email, user_metadata->full_name),
      dealer:dealer_id(*),
      referrer:referrer_id(*),
      partner:partner_id(*),
      team:team_id(id, name)
    `
    )
    .eq('id', saleId)
    .single()

  if (error) throw error
  return data
}

export async function createSale(saleData: any) {
  const supabase = createClientSupabaseClient()
  const { data, error } = await supabase
    .from('sales')
    .insert(saleData)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateSale(saleId: string, updates: any) {
  const supabase = createClientSupabaseClient()
  const { data, error } = await supabase
    .from('sales')
    .update(updates)
    .eq('id', saleId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteSale(saleId: string) {
  const supabase = createClientSupabaseClient()
  const { error } = await supabase.from('sales').delete().eq('id', saleId)

  if (error) throw error
  return true
}
