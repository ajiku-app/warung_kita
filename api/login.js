import bcrypt from 'bcryptjs';
import { sql, sign } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email = '', password = '' } = req.body || {};
  try {
    const r = await sql`select id, email, pass_hash from users where email = ${email.toLowerCase()}`;
    if (!r[0] || !(await bcrypt.compare(password, r[0].pass_hash)))
      return res.status(401).json({ error: 'Email atau kata sandi salah' });
    res.json({ token: sign(r[0]), email: r[0].email });
  } catch { res.status(500).json({ error: 'Kesalahan server' }); }
}
