-- =============================================================================
-- Inventory ledger migration (production)
-- =============================================================================
-- Run in Neon SQL editor BEFORE deploying the app that uses ledger columns.
-- Order: run this file → verify → npm run db:generate → deploy app
-- =============================================================================

-- Step 1: Add ledger columns
ALTER TABLE inventory
  ADD COLUMN IF NOT EXISTS beginning_admin INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS in_admin INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS out_admin INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ending_admin INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS beginning_store INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS in_store INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS out_store INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ending_store INT NOT NULL DEFAULT 0;

-- Step 2: Backfill from legacy columns (only when they still exist)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'inventory'
      AND column_name = 'stock'
  ) THEN
    UPDATE inventory
    SET
      ending_admin    = COALESCE(admin_stock, 0),
      ending_store    = COALESCE(stock, 0),
      beginning_store = COALESCE(yesterday_stock, 0),
      beginning_admin = COALESCE(admin_stock, 0);
  END IF;
END $$;

-- Step 3: Verify backfill (uncomment; should return 0 rows before step 4)
-- SELECT name, admin_stock, stock, yesterday_stock,
--        ending_admin, ending_store, beginning_store, beginning_admin
-- FROM inventory
-- WHERE ending_admin != COALESCE(admin_stock, 0)
--    OR ending_store != COALESCE(stock, 0);

-- Step 4: Add SUPPLIES inventory type
ALTER TYPE "Inventory_Type" ADD VALUE IF NOT EXISTS 'SUPPLIES';

-- Step 5: Drop legacy columns
ALTER TABLE inventory
  DROP COLUMN IF EXISTS stock,
  DROP COLUMN IF EXISTS admin_stock,
  DROP COLUMN IF EXISTS yesterday_stock;

-- Step 6: Nightly ledger roll (GET /api/cron/update-yesterday-stock)
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

DROP FUNCTION IF EXISTS update_yesterday_stock();
