-- Additive migration. Stores only keyed hashes of client identifiers, never raw IP addresses.
CREATE TABLE IF NOT EXISTS public.public_form_rate_limits (
  key_hash text PRIMARY KEY CHECK (char_length(key_hash) = 64),
  window_started_at timestamptz NOT NULL DEFAULT now(),
  hits integer NOT NULL DEFAULT 1 CHECK (hits >= 1),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS public_form_rate_limits_window_idx
  ON public.public_form_rate_limits (window_started_at);
