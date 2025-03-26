'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createClientSupabaseClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
  const [message, setMessage] = useState<string | null>(null)
  const supabase = createClientSupabaseClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    })

    if (error) {
      setMessage('Error sending reset email')
    } else {
      setMessage('Password reset email sent. Check your inbox.')
    }
  }

  return (
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {message && (
          <div
            className={`
            ${
              message.includes('Error')
                ? 'bg-red-50 border-red-400 text-red-700'
                : 'bg-green-50 border-green-400 text-green-700'
            } 
            border px-4 py-3 rounded
          `}
          >
            {message}
          </div>
        )}
        <Input
          label="Email"
          type="email"
          {...register('email')}
          error={errors.email?.message}
        />
        <Button type="submit" className="w-full">
          Reset Password
        </Button>
      </form>
    </div>
  )
}