import { neon } from '@neondatabase/serverless';
import jwt from 'jsonwebtoken';

export const sql = neon(process.env.DATABASE_URL);
export const sign = (u) => jwt.sign({ id: u.id, email: u.email }, process.env.JWT_SECRET, { expiresIn: '30d' });
export function auth(req) {
  const t = (req.headers.authorization || '').replace('Bearer ', '');
  try { return jwt.verify(t, process.env.JWT_SECRET); } catch { return null; }
}
