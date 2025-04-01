'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { createClientSupabaseClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

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

interface AgencySetupProps {
  userId: string
}

export function AgencySetup({ userId }: AgencySetupProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientSupabaseClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AgencyFormData>({
    resolver: zodResolver(agencySchema),
  })

  const onSubmit = async (data: AgencyFormData) => {
  setLoading(true);
  setError(null);

  try {
    // Call the database function directly
    const { data: agencyId, error: funcError } = await supabase.rpc(
      'create_agency_with_admin',
      {
        agency_name: data.name,
        agency_address: data.address || '',
        agency_city: data.city || '',
        agency_state: data.state || '',
        agency_zip_code: data.zipCode || '',
        agency_country: data.country || '',
        agency_phone: data.phone || '',
        agency_website: data.website || '',
        admin_user_id: userId
      }
    );

    if (funcError) throw funcError;

    // Redirect to dashboard
    router.push('/dashboard');
  } catch (err: any) {
    setError(err.message || 'Failed to create agency');
  } finally {
    setLoading(false);
  }
}
  return (
    <Card>
      <CardHeader
        title="Set Up Your Agency"
        description="Create your agency profile"
      />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
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

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating Agency...' : 'Create Agency'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}