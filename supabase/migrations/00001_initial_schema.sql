-- Create Custom Types (Enums)
CREATE TYPE user_role AS ENUM ('MEMBER', 'ADMIN');
CREATE TYPE event_status AS ENUM ('DRAFT', 'PUBLISHED', 'COMPLETED');
CREATE TYPE challenge_difficulty AS ENUM ('EASY', 'MEDIUM', 'HARD');
CREATE TYPE submission_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- 1. PROFILES TABLE (Linked to auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role user_role DEFAULT 'MEMBER'::user_role NOT NULL,
  total_score INTEGER DEFAULT 0 NOT NULL,
  streak_count INTEGER DEFAULT 0 NOT NULL,
  github_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TEAM MEMBERS TABLE
CREATE TABLE team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  designation TEXT NOT NULL,
  batch TEXT,
  skills TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  is_alumni BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. EVENTS TABLE
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  location TEXT,
  status event_status DEFAULT 'DRAFT'::event_status NOT NULL,
  category TEXT,
  registered_count INTEGER DEFAULT 0 NOT NULL,
  banner_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. EVENT REGISTRATIONS TABLE
CREATE TABLE event_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(event_id, user_id)
);

-- 5. CHALLENGES TABLE
CREATE TABLE challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  difficulty challenge_difficulty DEFAULT 'EASY'::challenge_difficulty NOT NULL,
  points_awarded INTEGER NOT NULL,
  deadline TIMESTAMP WITH TIME ZONE,
  status event_status DEFAULT 'DRAFT'::event_status NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. SUBMISSIONS TABLE
CREATE TABLE submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  github_url TEXT NOT NULL,
  live_url TEXT,
  status submission_status DEFAULT 'PENDING'::submission_status NOT NULL,
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(challenge_id, user_id)
);

-- 7. PROJECTS TABLE
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  tech_stack TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  repo_url TEXT,
  live_url TEXT,
  thumbnail_url TEXT,
  likes_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. GALLERY ALBUMS TABLE
CREATE TABLE gallery_albums (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. GALLERY IMAGES TABLE
CREATE TABLE gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  album_id UUID REFERENCES gallery_albums(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. BLOGS TABLE
CREATE TABLE blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. ACHIEVEMENTS TABLE
CREATE TABLE achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  badge_name TEXT NOT NULL,
  icon_url TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- POSTGRESQL TRIGGERS & FUNCTIONS
-- -----------------------------------------------------------------------------

-- Trigger 1: Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'New Member'),
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Trigger 2: Update event registration count
CREATE OR REPLACE FUNCTION public.update_event_registration_count()
RETURNS trigger AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE public.events SET registered_count = registered_count + 1 WHERE id = NEW.event_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE public.events SET registered_count = registered_count - 1 WHERE id = OLD.event_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_event_registration_change
  AFTER INSERT OR DELETE ON public.event_registrations
  FOR EACH ROW EXECUTE PROCEDURE public.update_event_registration_count();

-- Trigger 4: Update user total score when a submission is approved
CREATE OR REPLACE FUNCTION public.update_user_total_score()
RETURNS trigger AS $$
DECLARE
  awarded_points INTEGER;
BEGIN
  -- Only trigger if the status changed to APPROVED
  IF (NEW.status = 'APPROVED' AND OLD.status != 'APPROVED') THEN
    -- Get the points from the challenge
    SELECT points_awarded INTO awarded_points FROM public.challenges WHERE id = NEW.challenge_id;
    -- Add points to user profile
    UPDATE public.profiles SET total_score = total_score + awarded_points WHERE id = NEW.user_id;
  END IF;
  -- If status changes from APPROVED to something else, remove the points
  IF (OLD.status = 'APPROVED' AND NEW.status != 'APPROVED') THEN
    SELECT points_awarded INTO awarded_points FROM public.challenges WHERE id = NEW.challenge_id;
    UPDATE public.profiles SET total_score = total_score - awarded_points WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_submission_status_change
  AFTER UPDATE OF status ON public.submissions
  FOR EACH ROW EXECUTE PROCEDURE public.update_user_total_score();

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'ADMIN'::user_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can update all profiles." ON profiles FOR UPDATE USING (is_admin());

-- Policies for events
CREATE POLICY "Published events are viewable by everyone." ON events FOR SELECT USING (status = 'PUBLISHED'::event_status OR is_admin());
CREATE POLICY "Admins can manage events." ON events FOR ALL USING (is_admin());

-- Policies for event_registrations
CREATE POLICY "Users can view their own registrations." ON event_registrations FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Users can register themselves." ON event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unregister themselves." ON event_registrations FOR DELETE USING (auth.uid() = user_id);

-- Policies for challenges
CREATE POLICY "Published challenges are viewable by everyone." ON challenges FOR SELECT USING (status = 'PUBLISHED'::event_status OR is_admin());
CREATE POLICY "Admins can manage challenges." ON challenges FOR ALL USING (is_admin());

-- Policies for submissions
CREATE POLICY "Users can view their own submissions." ON submissions FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Users can insert their own submissions." ON submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all submissions." ON submissions FOR ALL USING (is_admin());

-- Policies for projects
CREATE POLICY "Projects are viewable by everyone." ON projects FOR SELECT USING (true);
CREATE POLICY "Admins can manage projects." ON projects FOR ALL USING (is_admin());

-- Policies for gallery
CREATE POLICY "Albums are viewable by everyone." ON gallery_albums FOR SELECT USING (true);
CREATE POLICY "Admins can manage albums." ON gallery_albums FOR ALL USING (is_admin());

CREATE POLICY "Images are viewable by everyone." ON gallery_images FOR SELECT USING (true);
CREATE POLICY "Admins can manage images." ON gallery_images FOR ALL USING (is_admin());

-- Policies for blogs
CREATE POLICY "Published blogs viewable by everyone." ON blogs FOR SELECT USING (published_at IS NOT NULL OR is_admin() OR auth.uid() = author_id);
CREATE POLICY "Admins can manage blogs." ON blogs FOR ALL USING (is_admin());

-- Policies for achievements
CREATE POLICY "Achievements viewable by everyone." ON achievements FOR SELECT USING (true);
CREATE POLICY "Admins can manage achievements." ON achievements FOR ALL USING (is_admin());
