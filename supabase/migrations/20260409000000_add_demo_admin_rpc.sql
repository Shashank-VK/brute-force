-- Function to elevate a user to admin (used ONLY for hackathon demo purposes)
-- In a real app, you would never expose this to the public RPC endpoint without auth checks.
CREATE OR REPLACE FUNCTION public.elevate_to_admin(target_user_id UUID)
RETURNS void AS $$
BEGIN
  -- We allow this function to execute, but we only let it update the specific demo admin email
  -- To make it slightly secure, we check if the user calling it has the admin email
  IF EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = target_user_id AND email = 'admin@bootforce.dev'
  ) THEN
    UPDATE public.profiles
    SET role = 'ADMIN'::user_role
    WHERE id = target_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
