-- Constrain demo admin elevation to an explicit allowlist.

CREATE TABLE IF NOT EXISTS public.demo_admin_allowlist (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO public.demo_admin_allowlist (email)
VALUES ('admin@bootforce.dev')
ON CONFLICT (email) DO NOTHING;

-- Request admin access only for the currently authenticated allowlisted user.
CREATE OR REPLACE FUNCTION public.request_demo_admin_access()
RETURNS BOOLEAN AS $$
DECLARE
  caller_id UUID := auth.uid();
  caller_email TEXT;
BEGIN
  IF caller_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT email
  INTO caller_email
  FROM auth.users
  WHERE id = caller_id;

  IF caller_email IS NULL THEN
    RETURN FALSE;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.demo_admin_allowlist
    WHERE lower(email) = lower(caller_email)
  ) THEN
    RETURN FALSE;
  END IF;

  UPDATE public.profiles
  SET role = 'ADMIN'::public.user_role
  WHERE id = caller_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;

GRANT EXECUTE ON FUNCTION public.request_demo_admin_access() TO authenticated;

-- Keep legacy RPC name but constrain it to self-only and allowlisted callers.
CREATE OR REPLACE FUNCTION public.elevate_to_admin(target_user_id UUID)
RETURNS void AS $$
DECLARE
  granted BOOLEAN;
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> target_user_id THEN
    RAISE EXCEPTION 'Not permitted';
  END IF;

  SELECT public.request_demo_admin_access() INTO granted;

  IF granted IS DISTINCT FROM TRUE THEN
    RAISE EXCEPTION 'Admin access denied';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;
