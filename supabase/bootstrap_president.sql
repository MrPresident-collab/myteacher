-- SAFE BOOTSTRAP FOR THE INITIAL PRESIDENT ACCOUNT
-- IMPORTANT: create the Auth user in the Supabase Dashboard, not by writing to auth.users directly.
-- This avoids unsafe credentials handling and keeps Supabase Auth as the system of record.
--
-- One-time action in the Dashboard:
-- 1) Open Supabase Dashboard → Authentication → Users → Add user
-- 2) Set email to: president@myteacher.app
-- 3) Set temporary password to: president233
-- 4) Click Create user
-- 5) In User metadata, add only:
--      {
--        "username": "president",
--        "full_name": "Voldi Bill Paulo Ngangu"
--      }
--
-- After the user exists, run this SQL in the SQL editor to ensure the public profile row is synchronized.

WITH u AS (
  SELECT id
  FROM auth.users
  WHERE email = 'president@myteacher.app'
)
INSERT INTO public.profiles (id, email, full_name, role, staff_role, country_code)
SELECT
  u.id,
  'president@myteacher.app',
  'Voldi Bill Paulo Ngangu',
  'admin',
  'president',
  'ao'
FROM u
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  staff_role = EXCLUDED.staff_role,
  updated_at = NOW();

-- Security notes:
-- - The temporary password is only used once in Supabase Auth and should be changed after first login.
-- - The password is never committed to frontend code or stored in plain text in app tables.
-- - The President privilege is enforced by the database policies in the schema, not by a React-only check.
