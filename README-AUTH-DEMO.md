# Authentication & Demo Accounts Guide

This guide covers how to complete the final authentication setup (OAuth) and how to provision your Demo Accounts for the hackathon judges.

## 1. Setting Up Google & GitHub OAuth
To make the "Sign in with Google" and "Sign in with GitHub" buttons work, you must configure the OAuth providers in your Supabase Cloud Dashboard.

### GitHub Setup:
1. Go to your GitHub account: **Settings -> Developer Settings -> OAuth Apps**.
2. Click **New OAuth App**.
3. Name: `Brute Force`
4. Homepage URL: `http://localhost:3000` (Change this to your Vercel URL when you deploy)
5. Authorization callback URL: `https://xuxcinxbzlhnozgzlfox.supabase.co/auth/v1/callback`
6. Click **Register application**.
7. Copy the **Client ID** and generate a **Client Secret**.
8. Go to your **Supabase Dashboard -> Authentication -> Providers**.
9. Enable **GitHub** and paste in the Client ID and Secret.

### Google Setup:
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project named `Brute Force`.
3. Go to **APIs & Services -> Credentials**.
4. Click **Create Credentials -> OAuth client ID**.
5. Application type: `Web application`.
6. Authorized redirect URIs: `https://xuxcinxbzlhnozgzlfox.supabase.co/auth/v1/callback`
7. Copy the **Client ID** and **Client Secret**.
8. Go to your **Supabase Dashboard -> Authentication -> Providers**.
9. Enable **Google** and paste in the keys.

---

## 2. Creating Demo Accounts for Judges
Because Supabase handles passwords securely via hashing, we cannot just "hardcode" a demo account into a SQL file. The easiest way to set up your demo accounts is to create them via your own `/signup` page.

### Step 1: Create the Demo Student
1. Run your app (`npm run dev`) and go to `http://localhost:3000/signup`.
2. Sign up with:
   - Name: `Demo Student`
   - Email: `student@bruteforce.dev`
   - Password: `hackathon2026`
3. You will automatically be redirected to the Dashboard. This account has the default `MEMBER` role.

### Step 2: Create the Demo Admin
1. Log out, then go to `http://localhost:3000/signup`.
2. Sign up with:
   - Name: `Demo Admin`
   - Email: `admin@bruteforce.dev`
   - Password: `hackathon2026`
3. Now, you need to elevate this user to an Admin.
4. Go to your **Supabase Cloud Dashboard -> SQL Editor**.
5. Run this exact query to promote the user:
   ```sql
   UPDATE public.profiles 
   SET role = 'ADMIN' 
   WHERE id IN (
     SELECT id FROM auth.users WHERE email = 'admin@bruteforce.dev'
   );
   ```
6. Now, when you log into the website as `admin@bruteforce.dev`, the middleware will allow you to access `http://localhost:3000/admin`!
