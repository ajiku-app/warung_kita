import bcrypt from 'bcryptjs';
import { sql, sign } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email = '', password = '' } = req.body || {};
  if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 8)
    return res.status(400).json({ error: 'Email tidak valid atau kata sandi kurang dari 8 karakter' });
  try {
    const hash = await bcrypt.hash(password, 10);
    const r = await sql`insert into users (email, pass_hash) values (${email.toLowerCase()}, ${hash}) returning id, email`;
    res.json({ token: sign(r[0]), email: r[0].email });
  } catch (e) {
    res.status(e.code === '23505' ? 409 : 500).json({ error: e.code === '23505' ? 'Email sudah terdaftar' : 'Kesalahan server' });
  }
}
