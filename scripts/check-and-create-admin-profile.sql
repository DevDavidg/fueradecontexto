-- Check if the user profile exists
SELECT * FROM public.profiles WHERE id = '62927a8f-ba97-452d-ad83-02f67641f56f';

-- If the profile doesn't exist, create it with admin privileges
INSERT INTO public.profiles (id, is_admin, created_at, updated_at)
VALUES (
  '62927a8f-ba97-452d-ad83-02f67641f56f',
  true,
  now(),
  now()
)
ON CONFLICT (id) 
DO UPDATE SET 
  is_admin = true,
  updated_at = now();

-- Verify the profile was created/updated
SELECT * FROM public.profiles WHERE id = '62927a8f-ba97-452d-ad83-02f67641f56f';
