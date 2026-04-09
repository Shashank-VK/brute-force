-- Align schema with admin CRUD and settings surfaces.

-- Add missing profile fields used by settings/admin screens.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
  ADD COLUMN IF NOT EXISTS tech_stack TEXT[] DEFAULT '{}'::TEXT[] NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_email_unique_idx
  ON public.profiles (email)
  WHERE email IS NOT NULL;

-- Backfill profile emails from auth users.
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id
  AND p.email IS NULL;

-- Keep new-user profile rows synchronized with auth email.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'New Member'),
    new.raw_user_meta_data->>'avatar_url',
    new.email
  )
  ON CONFLICT (id) DO UPDATE
  SET
    full_name = EXCLUDED.full_name,
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
    email = COALESCE(EXCLUDED.email, public.profiles.email);

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add event capacity used by admin/public event cards.
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS capacity INTEGER DEFAULT 100 NOT NULL;

-- Add explicit project lifecycle status + featured marker.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'project_status'
  ) THEN
    CREATE TYPE public.project_status AS ENUM ('IN_PROGRESS', 'BETA', 'LIVE');
  END IF;
END
$$;

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS status public.project_status DEFAULT 'IN_PROGRESS'::public.project_status NOT NULL,
  ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false NOT NULL;
