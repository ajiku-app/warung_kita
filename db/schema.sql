create table if not exists users (
  id serial primary key,
  email text unique not null,
  pass_hash text not null,
  created_at timestamptz not null default now()
);
create table if not exists stores (
  user_id int primary key references users(id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);
