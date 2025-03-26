'use client'

import { useState, useEffect } from 'react'
import { createClientSupabaseClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent } from '@/components/ui/card'

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientSupabaseClient()

  useEffect(() => {
    async function fetchProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (data) {
          setProfile(data)
        }
      }
      setLoading(false)
    }

    fetchProfile()
  }, [])

  const handleUpdateProfile = async () => {
    // Implement profile update logic
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader title="My Profile" />
        <CardContent>
          {profile && (
            <div className="space-y-4">
              <Input
                label="Full Name"
                value={profile.full_name || ''}
                readOnly
              />
              <Input label="Email" value={profile.email || ''} readOnly />
              <Input label="Role" value={profile.role || ''} readOnly />
              {profile.agency_id && (
                <Input label="Agency" value={profile.agency_id} readOnly />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}