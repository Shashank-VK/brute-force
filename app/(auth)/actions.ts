'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

type RoleIntent = 'ADMIN' | 'MEMBER'

function resolveRoleIntent(value: FormDataEntryValue | null): RoleIntent {
  return String(value ?? '').toUpperCase() === 'ADMIN' ? 'ADMIN' : 'MEMBER'
}

function toMode(role: RoleIntent): 'admin' | 'student' {
  return role === 'ADMIN' ? 'admin' : 'student'
}

async function getProfileRole(
  supabase: ReturnType<typeof createClient>,
  userId: string
): Promise<RoleIntent> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle()

  return profile?.role === 'ADMIN' ? 'ADMIN' : 'MEMBER'
}

async function ensureAdminIntent(
  supabase: ReturnType<typeof createClient>,
  userId: string
): Promise<boolean> {
  const currentRole = await getProfileRole(supabase, userId)
  if (currentRole === 'ADMIN') {
    return true
  }

  const { data, error } = await supabase.rpc('request_demo_admin_access')
  if (error) {
    console.error('DEMO ADMIN ELEVATION ERROR:', error)
    return false
  }

  return data === true
}

async function getRedirectPathForUser(supabase: ReturnType<typeof createClient>, fallbackRole: RoleIntent) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return '/login'
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  const effectiveRole = profile?.role ?? fallbackRole
  return effectiveRole === 'ADMIN' ? '/admin' : '/dashboard'
}

export async function login(formData: FormData) {
  const supabase = createClient()
  const requestedRole = resolveRoleIntent(formData.get('role'))

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error("LOGIN ERROR:", error)
    redirect(`/login?mode=${toMode(requestedRole)}&error=Could not authenticate user`)
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (requestedRole === 'ADMIN' && user) {
    const granted = await ensureAdminIntent(supabase, user.id)
    if (!granted) {
      redirect('/dashboard?notice=Admin mode requires an allowlisted demo account')
    }
  }

  revalidatePath('/', 'layout')
  const targetPath = await getRedirectPathForUser(supabase, requestedRole)
  redirect(targetPath)
}

export async function signup(formData: FormData) {
  const supabase = createClient()
  const requestedRole = resolveRoleIntent(formData.get('role'))
  const fullName = String(formData.get('full_name') ?? formData.get('name') ?? '').trim()
  const signupRole: RoleIntent = 'MEMBER'

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: fullName,
        role: signupRole,
      }
    }
  }

  const { data: signupData, error } = await supabase.auth.signUp(data)

  if (error) {
    console.error("SIGNUP ERROR:", error)
    redirect(`/signup?mode=${toMode(requestedRole)}&error=Could not sign up user`)
  }

  if (signupData.user) {
    await supabase.from('profiles').upsert(
      {
        id: signupData.user.id,
        email: signupData.user.email ?? null,
        full_name: fullName || 'New Member',
        role: signupRole,
      },
      { onConflict: 'id' }
    )
  }

  revalidatePath('/', 'layout')

  if (!signupData.session) {
    redirect(`/login?mode=${toMode(requestedRole)}&signup=success`)
  }

  if (requestedRole === 'ADMIN' && signupData.user) {
    const granted = await ensureAdminIntent(supabase, signupData.user.id)
    if (!granted) {
      redirect('/dashboard?notice=Admin mode requires an allowlisted demo account')
    }
  }

  const targetPath = await getRedirectPathForUser(supabase, requestedRole)
  redirect(targetPath)
}

export async function signInWithGithub() {
  const supabase = createClient()
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const { data } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (data.url) {
    redirect(data.url)
  }
}

export async function signInWithGoogle() {
  const supabase = createClient()
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const { data } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (data.url) {
    redirect(data.url)
  }
}
