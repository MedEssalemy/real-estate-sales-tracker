/**
 * Permission utility functions for checking user permissions on resources
 */

// Check if a user has permission to manage an agency
export function canManageAgency(userAgencyRole: string) {
  return userAgencyRole === 'admin'
}

// Check if a user has permission to view an agency
export function canViewAgency(userAgencyRole: string) {
  return userAgencyRole === 'admin' || userAgencyRole === 'agent'
}

// Check if a user has permission to manage a team
export function canManageTeam(userAgencyRole: string, isTeamLeader: boolean) {
  return userAgencyRole === 'admin' || isTeamLeader
}

// Check if a user has permission to modify a sale
export function canModifySale(
  saleUserId: string,
  currentUserId: string,
  userAgencyRole: string,
  isTeamLeader: boolean,
  saleTeamId: string | null,
  userTeamIds: string[]
) {
  // User can modify their own sales
  if (saleUserId === currentUserId) {
    return true
  }

  // Agency admins can modify any sale in their agency
  if (userAgencyRole === 'admin') {
    return true
  }

  // Team leaders can modify sales from their team
  if (isTeamLeader && saleTeamId && userTeamIds.includes(saleTeamId)) {
    return true
  }

  return false
}

// Check if a user has permission to view a sale
export function canViewSale(
  saleUserId: string,
  currentUserId: string,
  userAgencyRole: string,
  isTeamLeader: boolean,
  saleTeamId: string | null,
  userTeamIds: string[]
) {
  // User can view their own sales
  if (saleUserId === currentUserId) {
    return true
  }

  // Agency admins can view any sale in their agency
  if (userAgencyRole === 'admin') {
    return true
  }

  // Team leaders can view sales from their team
  if (isTeamLeader && saleTeamId && userTeamIds.includes(saleTeamId)) {
    return true
  }

  // Team members can view sales from their team
  if (saleTeamId && userTeamIds.includes(saleTeamId)) {
    return true
  }

  return false
}

// Check if a user has permission to manage agency users
export function canManageAgencyUsers(userAgencyRole: string) {
  return userAgencyRole === 'admin'
}

// Check if a user has permission to view agency users
export function canViewAgencyUsers(userAgencyRole: string) {
  return userAgencyRole === 'admin'
}

// Check if a user has permission to manage team members
export function canManageTeamMembers(
  userAgencyRole: string,
  isTeamLeader: boolean
) {
  return userAgencyRole === 'admin' || isTeamLeader
}

// Check if a user has permission to view dashboard stats
export function canViewDashboardStats(
  userAgencyRole: string,
  isTeamLeader: boolean,
  forTeam: boolean
) {
  if (forTeam) {
    return userAgencyRole === 'admin' || isTeamLeader
  }

  return true // Everyone can view their own stats
}

// Check if a user has permission to manage dealers/referrers/partners
export function canManageContacts(userAgencyRole: string) {
  return userAgencyRole === 'admin'
}

// Check if a user has permission to generate reports
export function canGenerateReports(
  userAgencyRole: string,
  isTeamLeader: boolean,
  forTeam: boolean
) {
  if (forTeam) {
    return userAgencyRole === 'admin' || isTeamLeader
  }

  return true // Everyone can generate their own reports
}
