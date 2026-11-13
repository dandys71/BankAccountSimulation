import { pool } from "./client.js";

const SQL = `
-- Bankovní účet
CREATE TABLE IF NOT EXISTS accounts (
  account_id text PRIMARY KEY,
  user_id text NOT NULL,
  institution_id text NOT NULL,
  account_number text NOT NULL,
  name text NOT NULL,
  currency text NOT NULL,
  balance integer NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp NOT NULL,
  close_date text
);

-- Spořicí účet
CREATE TABLE IF NOT EXISTS savings_accounts (
  id text PRIMARY KEY,
  user_id text NOT NULL,
  institution_id text NOT NULL,
  account_number text NOT NULL,
  name text NOT NULL DEFAULT 'Spořicí účet',
  currency text NOT NULL DEFAULT 'CZK',
  balance integer NOT NULL DEFAULT 0,
  interest_rate double precision NOT NULL DEFAULT 0,
  is_closed boolean NOT NULL DEFAULT false,
  created_at timestamp NOT NULL,
  closed_at timestamp,
  last_interest_applied_at timestamp
);

-- Transakce
CREATE TABLE IF NOT EXISTS transactions (
  transaction_id text PRIMARY KEY,
  from_account_id text NOT NULL DEFAULT '',
  to_account_id text,
  from_account_number text,
  to_account_number text,
  account_id text NOT NULL,
  counterparty_account text,
  amount integer NOT NULL,
  currency text NOT NULL DEFAULT 'CZK',
  direction text NOT NULL,
  status text NOT NULL,
  vs text DEFAULT '',
  ks text DEFAULT '',
  ss text DEFAULT '',
  note text DEFAULT '',
  comment text DEFAULT '',
  related_transaction_id text,
  simulated_at timestamp,
  created_at timestamp NOT NULL,
  posted_at timestamp
);

ALTER TABLE transactions ADD COLUMN IF NOT EXISTS from_account_id text;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS to_account_id text;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS from_account_number text;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS to_account_number text;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS simulated_at timestamp;
UPDATE transactions SET from_account_id = account_id WHERE from_account_id IS NULL OR from_account_id = '';

CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions (account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions (status);
CREATE INDEX IF NOT EXISTS idx_transactions_from ON transactions (from_account_id);

-- Platba (definice částky / intervalu)
CREATE TABLE IF NOT EXISTS payments (
  payment_id text PRIMARY KEY,
  payment_type text NOT NULL,
  amount_type text NOT NULL,
  amount integer,
  min_amount integer,
  max_amount integer,
  interval_days integer NOT NULL DEFAULT 30,
  currency text NOT NULL DEFAULT 'CZK',
  created_at timestamp NOT NULL
);

-- Šablona (instituce + PlatbaID)
CREATE TABLE IF NOT EXISTS templates (
  template_id text PRIMARY KEY,
  institution_id text NOT NULL,
  name text NOT NULL,
  payment_id text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp NOT NULL
);

-- zpětná kompatibilita: stará tabulka payment_templates
CREATE TABLE IF NOT EXISTS payment_templates (
  template_id text PRIMARY KEY,
  institution_id text NOT NULL,
  name text NOT NULL,
  type text,
  amount_type text,
  fixed_amount integer,
  amount_min integer,
  amount_max integer,
  interval text,
  currency text DEFAULT 'CZK',
  note text DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp NOT NULL
);

-- Trvalé příkazy
CREATE TABLE IF NOT EXISTS standing_orders (
  standing_order_id text PRIMARY KEY,
  from_account_id text,
  to_account_id text,
  to_account_number text,
  payment_id text,
  template_id text,
  account_id text NOT NULL,
  counterparty_account text,
  interval text,
  custom_cron text,
  day_of_month integer,
  amount integer,
  currency text DEFAULT 'CZK',
  next_run_at timestamp,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp NOT NULL
);

ALTER TABLE standing_orders ADD COLUMN IF NOT EXISTS from_account_id text;
ALTER TABLE standing_orders ADD COLUMN IF NOT EXISTS to_account_id text;
ALTER TABLE standing_orders ADD COLUMN IF NOT EXISTS to_account_number text;
ALTER TABLE standing_orders ADD COLUMN IF NOT EXISTS payment_id text;
UPDATE standing_orders SET from_account_id = account_id WHERE from_account_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_standing_orders_account_id ON standing_orders (account_id);

-- Osud
CREATE TABLE IF NOT EXISTS fates (
  fate_id text PRIMARY KEY,
  organization_id text NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  payment_id text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp NOT NULL
);

-- stará tabulka event_templates (kompatibilita)
CREATE TABLE IF NOT EXISTS event_templates (
  event_template_id text PRIMARY KEY,
  institution_id text,
  name text NOT NULL,
  type text,
  amount_type text,
  fixed_amount integer,
  amount_min integer,
  amount_max integer,
  probability integer DEFAULT 50,
  currency text DEFAULT 'CZK',
  note text DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp NOT NULL
);

-- Úroková pásma
CREATE TABLE IF NOT EXISTS interest_rate_bands (
  band_id text PRIMARY KEY,
  institution_id text NOT NULL,
  min_balance integer NOT NULL DEFAULT 0,
  max_balance integer,
  interest_rate double precision NOT NULL,
  created_at timestamp NOT NULL
);

-- Fiktivní čas + výplata
CREATE TABLE IF NOT EXISTS simulation_settings (
  settings_id text PRIMARY KEY,
  institution_id text,
  current_sim_time timestamp NOT NULL,
  speed_factor double precision NOT NULL DEFAULT 1,
  payroll_amount integer NOT NULL DEFAULT 0,
  payroll_interval_minutes integer NOT NULL DEFAULT 30,
  payroll_interval text NOT NULL DEFAULT 'monthly',
  payroll_enabled boolean NOT NULL DEFAULT false,
  updated_at timestamp NOT NULL
);

ALTER TABLE simulation_settings ADD COLUMN IF NOT EXISTS payroll_interval_minutes integer DEFAULT 30;

CREATE TABLE IF NOT EXISTS account_counters (
  counter_id text PRIMARY KEY,
  value integer NOT NULL DEFAULT 0
);

INSERT INTO account_counters (counter_id, value)
VALUES ('account_number', 0)
ON CONFLICT (counter_id) DO NOTHING;

INSERT INTO simulation_settings (
  settings_id, institution_id, current_sim_time, speed_factor,
  payroll_amount, payroll_interval_minutes, payroll_interval, payroll_enabled, updated_at
) VALUES (
  'global', NULL, NOW(), 1, 25000, 30, 'monthly', false, NOW()
)
ON CONFLICT (settings_id) DO NOTHING;
`;

export async function migrate() {
  const client = await pool.connect();
  try {
    await client.query(SQL);
    console.log("✅ DB migrace hotová");
  } finally {
    client.release();
  }
}
