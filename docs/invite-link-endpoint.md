# Supabase Invite Link Endpoint (Backend Example)

Example Node/Express-style handler to generate invite links using the Supabase service role key. Protect this endpoint with admin auth on your backend.

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // never expose to frontend
);

export async function createInvite(req, res) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'email required' });

  const redirectTo = `${process.env.APP_BASE_URL}/auth/callback`;
  const { data, error } = await supabase.auth.admin.generateLink({
    type: 'invite',
    email,
    options: { redirectTo },
  });

  if (error) return res.status(400).json({ error: error.message });

  // Supabase can send the invite email automatically (data.properties.action_link).
  // If you want to send your own email, use data.properties.action_link.
  return res.json({ link: data.properties.action_link });
}
```

Required env vars:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `APP_BASE_URL` (e.g., `https://yourapp.com` or `http://localhost:5137`)

