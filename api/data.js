import { sql, auth } from './_lib.js';

export default async function handler(req, res) {
  const u = auth(req);
  if (!u) return res.status(401).json({ error: 'Belum masuk' });
  try {
    if (req.method === 'GET') {
      const r = await sql`select data from stores where user_id = ${u.id}`;
      return res.json({ data: r[0] ? r[0].data : null });
    }
    if (req.method === 'PUT') {
      const d = req.body && req.body.data;
      if (!d || !Array.isArray(d.products) || !Array.isArray(d.sales)) return res.status(400).json({ error: 'Data tidak valid' });
      await sql`insert into stores (user_id, data, updated_at) values (${u.id}, ${JSON.stringify(d)}::jsonb, now())
                on conflict (user_id) do update set data = excluded.data, updated_at = now()`;
      return res.json({ ok: true });
    }
    res.status(405).end();
  } catch { res.status(500).json({ error: 'Kesalahan server' }); }
}
