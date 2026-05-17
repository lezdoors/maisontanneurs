-- Seed admin user for Moroccan AKAL admin panel
-- Password: akal2026
-- Hash generated with: node -e "require('bcryptjs').hash('akal2026', 10).then(h => console.log(h))"

INSERT INTO admin_users (email, password_hash, role)
VALUES (
  'ryan@moroccan-akal.com',
  '$2b$10$ENHL1E7b5Gm5cEwCZrx8guqHxI3hRtWewkqCuJfsFhR8DaIfD2zdq',
  'admin'
)
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;

-- Also add an RLS policy to allow the service role to bypass RLS on admin_users
-- (service role already bypasses RLS, but this is here for documentation)

-- To run this:
-- 1. Go to Supabase Dashboard > SQL Editor for project qpnhuexkrhculbiayfgf
-- 2. Paste and run this SQL
-- 3. Also grab the service_role key from Settings > API and add to .env.local:
--    SUPABASE_SERVICE_ROLE_KEY=eyJ...
