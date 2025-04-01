'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createClientSupabaseClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'

const agencySchema = z.object({
  name: z.string().min(2, 'Agency name is required'),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
})

type AgencyFormData = z.infer<typeof agencySchema>

export default function AgencyProfilePage() {
  const [agency, setAgency] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saveLoading, setSaveLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const supabase = createClientSupabaseClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AgencyFormData>({
    resolver: zodResolver(agencySchema),
  })

  useEffect(() => {
    async function fetchAgency() {
      try {
        const { data: userData, error: userError } =
          await supabase.auth.getUser()
        if (userError) throw userError

        // Get agency where user is admin
        const { data: agencyUserData, error: agencyUserError } = await supabase
          .from('agency_users')
          .select('agency_id, role')
          .eq('user_id', userData.user?.id)
          .eq('role', 'admin')
          .single()

        if (agencyUserError) throw agencyUserError

        // Fetch agency details
        const { data: agencyData, error: agencyError } = await supabase
          .from('agencies')
          .select('*')
          .eq('id', agencyUserData.agency_id)
          .single()

        if (agencyError) throw agencyError

        setAgency(agencyData)

        // Set form values
        reset({
          name: agencyData.name,
          address: agencyData.address,
          city: agencyData.city,
          state: agencyData.state,
          zipCode: agencyData.zip_code,
          country: agencyData.country,
          phone: agencyData.phone,
          website: agencyData.website,
        })
      } catch (err: any) {
        console.error('Error loading agency:', err)
        setError(err.message || 'Failed to load agency profile')
      } finally {
        setLoading(false)
      }
    }

    fetchAgency()
  }, [])

  const onSubmit = async (data: AgencyFormData) => {
    setError(null)
    setSuccess(null)
    setSaveLoading(true)

    try {
      const { error: updateError } = await supabase
        .from('agencies')
        .update({
          name: data.name,
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          zip_code: data.zipCode || '',
          country: data.country || '',
          phone: data.phone || '',
          website: data.website || '',
          updated_at: new Date().toISOString(),
        })
        .eq('id', agency.id)

      if (updateError) throw updateError

      setSuccess('Agency profile updated successfully')
    } catch (err: any) {
      setError(err.message || 'Failed to update agency profile')
    } finally {
      setSaveLoading(false)
    }
  }

  if (loading)
    return (
      <div className="container mx-auto py-10">Loading agency profile...</div>
    )

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader
          title="Agency Profile"
          description="Manage your agency information"
        />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded">
                {success}
              </div>
            )}

            <Input
              label="Agency Name"
              {...register('name')}
              error={errors.name?.message}
              required
            />

            <Input
              label="Address"
              {...register('address')}
              error={errors.address?.message}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                {...register('city')}
                error={errors.city?.message}
              />
              <Input
                label="State/Province"
                {...register('state')}
                error={errors.state?.message}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="ZIP/Postal Code"
                {...register('zipCode')}
                error={errors.zipCode?.message}
              />
              <Input
                label="Country"
                {...register('country')}
                error={errors.country?.message}
              />
            </div>

            <Input
              label="Phone"
              type="tel"
              {...register('phone')}
              error={errors.phone?.message}
            />

            <Input
              label="Website"
              type="url"
              {...register('website')}
              error={errors.website?.message}
            />

            <Button type="submit" disabled={saveLoading}>
              {saveLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}