-- Re-deploy only the nightly cron function (e.g. after editing roll logic).
-- First-time production setup: use migrate_inventory_ledger.sql instead.

CREATE OR REPLACE FUNCTION roll_inventory_daily_ledger()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE inventory
  SET
    beginning_admin = ending_admin,
    beginning_store = ending_store,
    in_admin = 0,
    out_admin = 0,
    in_store = 0,
    out_store = 0;
END;
$$;
