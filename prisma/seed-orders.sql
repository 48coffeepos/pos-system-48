-- Ensure auto-generated ID columns have DB-level defaults ..................
ALTER TABLE order_items       ALTER COLUMN order_item_id       SET DEFAULT gen_random_uuid();
ALTER TABLE order_item_addons ALTER COLUMN order_item_addon_id SET DEFAULT gen_random_uuid();

-- ============================================================================
-- Seed: 50 Test Orders (May 22–24, 2026)
--   May 22 ── 20 orders  (100-000001 .. 100-000020)
--   May 23 ── 20 orders  (100-000021 .. 100-000040)
--   May 24 ── 10 orders  (100-000041 .. 100-000050)
--
-- Conventions:
--   line_total      = unit_price * quantity (addons & discounts separate)
--   discount_amount = amount subtracted per line when discount applies
--   addon_total_price = addon_price_snapshot * quantity
--   grand_total     = sum(line_totals) + sum(addon_total_prices) - sum(discount_amounts)
--
-- Run AFTER the Prisma seed (menus, inventory, addons, admin user exist).
-- Requires gen_random_uuid() (PG 13+).
-- All timestamps are Asia/Manila (UTC+8).
-- ============================================================================

-- --------------------------------------------------------------------------
-- 0. Cleanup — wipe existing seed orders & reset inventory ................
-- --------------------------------------------------------------------------
DELETE FROM order_item_addons;
DELETE FROM order_items;
DELETE FROM orders;

UPDATE inventory SET stock = 100 WHERE name = '12oz hot';
UPDATE inventory SET stock = 100 WHERE name = '16oz iced';
UPDATE inventory SET stock = 50  WHERE name = 'Chocolate Chip Cookie Inventory';

-- --------------------------------------------------------------------------
-- 1. Staff users (idempotent) ................................................
-- --------------------------------------------------------------------------
INSERT INTO "user" (id, name, email, "emailVerified", role, username, "displayUsername", "createdAt", "updatedAt")
VALUES
  ('staff-001', 'Juan Dela Cruz',  'juan@pos.local',  true, 'STAFF', 'juan',  'juan',  now(), now()),
  ('staff-002', 'Maria Santos',    'maria@pos.local', true, 'STAFF', 'maria', 'maria', now(), now()),
  ('staff-003', 'Pedro Reyes',     'pedro@pos.local', true, 'STAFF', 'pedro', 'pedro', now(), now())
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 2. ORDERS — May 22, 2026  (20 orders, 6:00 AM – 8:00 PM)
-- ============================================================================

-- 100-000001 ── 6:15 AM | cash | latte 12oz ........................................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, amount_tendered, change_amount, created_at)
  VALUES ('100-000001', 'staff-001', 120, 'CASH', 150, 30, '2026-05-22 06:15:00+08')
  RETURNING order_id
)
INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, loyalty)
SELECT o.order_id, m.menu_id, 'Latte', 120, '12oz hot', 120, 1, 120, 0, false
FROM o, (SELECT menu_id FROM menu WHERE name = 'Latte') m;

-- 100-000002 ── 6:45 AM | cash | mocha 16oz .......................................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, amount_tendered, change_amount, created_at)
  VALUES ('100-000002', 'staff-002', 150, 'CASH', 200, 50, '2026-05-22 06:45:00+08')
  RETURNING order_id
)
INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, loyalty)
SELECT o.order_id, m.menu_id, 'Mocha', 150, '16oz iced', 150, 1, 150, 0, false
FROM o, (SELECT menu_id FROM menu WHERE name = 'Mocha') m;

-- 100-000003 ── 7:00 AM | cash | latte 16oz + cookie ...............................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, amount_tendered, change_amount, note, created_at)
  VALUES ('100-000003', 'staff-001', 205, 'CASH', 210, 5, 'Extra hot', '2026-05-22 07:00:00+08')
  RETURNING order_id
)
INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, loyalty)
SELECT o.order_id, mid, mname, mprice, minv, up, qty, up * qty, 0, false
FROM o, (VALUES
  ((SELECT menu_id FROM menu WHERE name = 'Latte'),                   'Latte',                  140, '16oz iced',                     140, 1),
  ((SELECT menu_id FROM menu WHERE name = 'Chocolate Chip Cookie'),   'Chocolate Chip Cookie',   65,  'Chocolate Chip Cookie Inventory', 65,  1)
) AS v(mid, mname, mprice, minv, up, qty);

-- 100-000004 ── 7:30 AM | gcash | mocha 12oz (PWD) + latte 16oz ...................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, reference_number, note, created_at)
  VALUES ('100-000004', 'staff-003', 244, 'GCASH', 'GC-20260522-001', 'PWD', '2026-05-22 07:30:00+08')
  RETURNING order_id
)
INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, discount_type, discount_id_number, discount_contact)
SELECT o.order_id, mid, mname, mprice, minv, up, qty, up * qty - dsc, dsc, dtype::"Discount_Type", did, dcontact
FROM o, (VALUES
  ((SELECT menu_id FROM menu WHERE name = 'Mocha'),  'Mocha',  130, '12oz hot', 130, 1, 26, 'PWD',   'PWD-2026-001', 'Ana Ramos'),
  ((SELECT menu_id FROM menu WHERE name = 'Latte'),  'Latte',  140, '16oz iced', 140, 1,  0, NULL,   NULL,           NULL)
) AS v(mid, mname, mprice, minv, up, qty, dsc, dtype, did, dcontact);

-- 100-000005 ── 8:00 AM | cash | mocha 12oz x2 ......................................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, amount_tendered, change_amount, created_at)
  VALUES ('100-000005', 'staff-002', 260, 'CASH', 300, 40, '2026-05-22 08:00:00+08')
  RETURNING order_id
)
INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, loyalty)
SELECT o.order_id, m.menu_id, 'Mocha', 130, '12oz hot', 130, 2, 260, 0, false
FROM o, (SELECT menu_id FROM menu WHERE name = 'Mocha') m;

-- 100-000006 ── 8:30 AM | grab | latte 12oz ........................................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, reference_number, note, created_at)
  VALUES ('100-000006', 'staff-001', 120, 'GRAB', 'GRAB-22001', 'Leave at counter', '2026-05-22 08:30:00+08')
  RETURNING order_id
)
INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, loyalty)
SELECT o.order_id, m.menu_id, 'Latte', 120, '12oz hot', 120, 1, 120, 0, false
FROM o, (SELECT menu_id FROM menu WHERE name = 'Latte') m;

-- 100-000007 ── 9:00 AM | cash | cookie x2 .........................................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, amount_tendered, change_amount, created_at)
  VALUES ('100-000007', 'staff-003', 130, 'CASH', 150, 20, '2026-05-22 09:00:00+08')
  RETURNING order_id
)
INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, loyalty)
SELECT o.order_id, m.menu_id, 'Chocolate Chip Cookie', 65, 'Chocolate Chip Cookie Inventory', 65, 2, 130, 0, false
FROM o, (SELECT menu_id FROM menu WHERE name = 'Chocolate Chip Cookie') m;

-- 100-000008 ── 9:30 AM | gcash | latte 16oz + mocha 16oz .........................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, reference_number, created_at)
  VALUES ('100-000008', 'staff-001', 290, 'GCASH', 'GC-20260522-002', '2026-05-22 09:30:00+08')
  RETURNING order_id
)
INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, loyalty)
SELECT o.order_id, mid, mname, mprice, minv, up, qty, up * qty, 0, false
FROM o, (VALUES
  ((SELECT menu_id FROM menu WHERE name = 'Latte'),  'Latte',  140, '16oz iced', 140, 1),
  ((SELECT menu_id FROM menu WHERE name = 'Mocha'),  'Mocha',  150, '16oz iced', 150, 1)
) AS v(mid, mname, mprice, minv, up, qty);

-- 100-000009 ── 10:00 AM | cash | latte 12oz (SENIOR) + cookie ....................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, amount_tendered, change_amount, note, created_at)
  VALUES ('100-000009', 'staff-002', 161, 'CASH', 180, 19, 'Senior', '2026-05-22 10:00:00+08')
  RETURNING order_id
)
INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, discount_type, discount_id_number, discount_contact)
SELECT o.order_id, mid, mname, mprice, minv, up, qty, up * qty - dsc, dsc, dtype::"Discount_Type", did, dcontact
FROM o, (VALUES
  ((SELECT menu_id FROM menu WHERE name = 'Latte'),                   'Latte',                  120, '12oz hot',                     120, 1, 24, 'SENIOR', 'SR-2026-100', 'Gregorio Santos'),
  ((SELECT menu_id FROM menu WHERE name = 'Chocolate Chip Cookie'),   'Chocolate Chip Cookie',   65,  'Chocolate Chip Cookie Inventory', 65,  1,  0, NULL,    NULL,           NULL)
) AS v(mid, mname, mprice, minv, up, qty, dsc, dtype, did, dcontact);

-- 100-000010 ── 10:30 AM | grab | mocha 12oz + latte 12oz ........................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, reference_number, created_at)
  VALUES ('100-000010', 'staff-003', 250, 'GRAB', 'GRAB-22002', '2026-05-22 10:30:00+08')
  RETURNING order_id
)
INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, loyalty)
SELECT o.order_id, mid, mname, mprice, minv, up, qty, up * qty, 0, false
FROM o, (VALUES
  ((SELECT menu_id FROM menu WHERE name = 'Mocha'),  'Mocha',  130, '12oz hot', 130, 1),
  ((SELECT menu_id FROM menu WHERE name = 'Latte'),  'Latte',  120, '12oz hot', 120, 1)
) AS v(mid, mname, mprice, minv, up, qty);

-- 100-000011 ── 11:00 AM | cash | mocha 16oz + oat milk ...........................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, amount_tendered, change_amount, created_at)
  VALUES ('100-000011', 'staff-001', 190, 'CASH', 200, 10, '2026-05-22 11:00:00+08')
  RETURNING order_id
),
oi AS (
  INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, loyalty)
  SELECT o.order_id, m.menu_id, 'Mocha', 150, '16oz iced', 150, 1, 150, 0, false
  FROM o, (SELECT menu_id FROM menu WHERE name = 'Mocha') m
  RETURNING order_item_id
)
INSERT INTO order_item_addons (order_item_id, addon_id, addon_name_snapshot, addon_price_snapshot, quantity, total_price)
SELECT oi.order_item_id, a.addon_id, 'Oat Milk', 40, 1, 40
FROM oi, (SELECT addon_id FROM addons WHERE name = 'Oat Milk') a;

-- 100-000012 ── 11:30 AM | gcash | latte 12oz + extra shot .......................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, reference_number, created_at)
  VALUES ('100-000012', 'staff-002', 150, 'GCASH', 'GC-20260522-003', '2026-05-22 11:30:00+08')
  RETURNING order_id
),
oi AS (
  INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, loyalty)
  SELECT o.order_id, m.menu_id, 'Latte', 120, '12oz hot', 120, 1, 120, 0, false
  FROM o, (SELECT menu_id FROM menu WHERE name = 'Latte') m
  RETURNING order_item_id
)
INSERT INTO order_item_addons (order_item_id, addon_id, addon_name_snapshot, addon_price_snapshot, quantity, total_price)
SELECT oi.order_item_id, a.addon_id, 'Extra Shot', 30, 1, 30
FROM oi, (SELECT addon_id FROM addons WHERE name = 'Extra Shot') a;

-- 100-000013 ── 12:00 PM | cash | latte 16oz x2 ....................................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, amount_tendered, change_amount, created_at)
  VALUES ('100-000013', 'staff-003', 280, 'CASH', 300, 20, '2026-05-22 12:00:00+08')
  RETURNING order_id
)
INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, loyalty)
SELECT o.order_id, m.menu_id, 'Latte', 140, '16oz iced', 140, 2, 280, 0, false
FROM o, (SELECT menu_id FROM menu WHERE name = 'Latte') m;

-- 100-000014 ── 12:30 PM | cash | mocha 12oz + cookie ............................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, amount_tendered, change_amount, created_at)
  VALUES ('100-000014', 'staff-001', 195, 'CASH', 200, 5, '2026-05-22 12:30:00+08')
  RETURNING order_id
)
INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, loyalty)
SELECT o.order_id, mid, mname, mprice, minv, up, qty, up * qty, 0, false
FROM o, (VALUES
  ((SELECT menu_id FROM menu WHERE name = 'Mocha'),                   'Mocha',                  130, '12oz hot',                     130, 1),
  ((SELECT menu_id FROM menu WHERE name = 'Chocolate Chip Cookie'),   'Chocolate Chip Cookie',   65,  'Chocolate Chip Cookie Inventory', 65,  1)
) AS v(mid, mname, mprice, minv, up, qty);

-- 100-000015 ── 1:00 PM | grab | latte 16oz + vanilla syrup ......................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, reference_number, created_at)
  VALUES ('100-000015', 'staff-002', 160, 'GRAB', 'GRAB-22003', '2026-05-22 13:00:00+08')
  RETURNING order_id
),
oi AS (
  INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, loyalty)
  SELECT o.order_id, m.menu_id, 'Latte', 140, '16oz iced', 140, 1, 140, 0, false
  FROM o, (SELECT menu_id FROM menu WHERE name = 'Latte') m
  RETURNING order_item_id
)
INSERT INTO order_item_addons (order_item_id, addon_id, addon_name_snapshot, addon_price_snapshot, quantity, total_price)
SELECT oi.order_item_id, a.addon_id, 'Vanilla Syrup', 20, 1, 20
FROM oi, (SELECT addon_id FROM addons WHERE name = 'Vanilla Syrup') a;

-- 100-000016 ── 2:00 PM | cash | mocha 12oz + caramel syrup ......................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, amount_tendered, change_amount, created_at)
  VALUES ('100-000016', 'staff-003', 150, 'CASH', 150, 0, '2026-05-22 14:00:00+08')
  RETURNING order_id
),
oi AS (
  INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, loyalty)
  SELECT o.order_id, m.menu_id, 'Mocha', 130, '12oz hot', 130, 1, 130, 0, false
  FROM o, (SELECT menu_id FROM menu WHERE name = 'Mocha') m
  RETURNING order_item_id
)
INSERT INTO order_item_addons (order_item_id, addon_id, addon_name_snapshot, addon_price_snapshot, quantity, total_price)
SELECT oi.order_item_id, a.addon_id, 'Caramel Syrup', 20, 1, 20
FROM oi, (SELECT addon_id FROM addons WHERE name = 'Caramel Syrup') a;

-- 100-000017 ── 3:00 PM | cash | cookie x3 .........................................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, amount_tendered, change_amount, created_at)
  VALUES ('100-000017', 'staff-001', 195, 'CASH', 200, 5, '2026-05-22 15:00:00+08')
  RETURNING order_id
)
INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, loyalty)
SELECT o.order_id, m.menu_id, 'Chocolate Chip Cookie', 65, 'Chocolate Chip Cookie Inventory', 65, 3, 195, 0, false
FROM o, (SELECT menu_id FROM menu WHERE name = 'Chocolate Chip Cookie') m;

-- 100-000018 ── 4:00 PM | gcash | latte 12oz x2 + extra shot each ................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, reference_number, created_at)
  VALUES ('100-000018', 'staff-002', 300, 'GCASH', 'GC-20260522-004', '2026-05-22 16:00:00+08')
  RETURNING order_id
),
oi AS (
  INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, loyalty)
  SELECT o.order_id, m.menu_id, 'Latte', 120, '12oz hot', 120, 2, 240, 0, false
  FROM o, (SELECT menu_id FROM menu WHERE name = 'Latte') m
  RETURNING order_item_id
)
INSERT INTO order_item_addons (order_item_id, addon_id, addon_name_snapshot, addon_price_snapshot, quantity, total_price)
SELECT oi.order_item_id, a.addon_id, 'Extra Shot', 30, 2, 60
FROM oi, (SELECT addon_id FROM addons WHERE name = 'Extra Shot') a;

-- 100-000019 ── 5:30 PM | cash | mocha 16oz + oat milk ............................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, amount_tendered, change_amount, note, created_at)
  VALUES ('100-000019', 'staff-003', 190, 'CASH', 200, 10, 'Room 204', '2026-05-22 17:30:00+08')
  RETURNING order_id
),
oi AS (
  INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, loyalty)
  SELECT o.order_id, m.menu_id, 'Mocha', 150, '16oz iced', 150, 1, 150, 0, false
  FROM o, (SELECT menu_id FROM menu WHERE name = 'Mocha') m
  RETURNING order_item_id
)
INSERT INTO order_item_addons (order_item_id, addon_id, addon_name_snapshot, addon_price_snapshot, quantity, total_price)
SELECT oi.order_item_id, a.addon_id, 'Oat Milk', 40, 1, 40
FROM oi, (SELECT addon_id FROM addons WHERE name = 'Oat Milk') a;

-- 100-000020 ── 7:00 PM | cash | latte 12oz (PWD) + mocha 12oz + cookie ..........................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, amount_tendered, change_amount, created_at)
  VALUES ('100-000020', 'staff-001', 291, 'CASH', 300, 9, '2026-05-22 19:00:00+08')
  RETURNING order_id
)
INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, discount_type, discount_id_number, discount_contact)
SELECT o.order_id, mid, mname, mprice, minv, up, qty, up * qty - dsc, dsc, dtype::"Discount_Type", did, dcontact
FROM o, (VALUES
  ((SELECT menu_id FROM menu WHERE name = 'Latte'),                   'Latte',                  120, '12oz hot',                     120, 1, 24, 'PWD',  'PWD-2026-002', 'Luisa Tan'),
  ((SELECT menu_id FROM menu WHERE name = 'Mocha'),                  'Mocha',                  130, '12oz hot',                     130, 1,  0, NULL,  NULL,           NULL),
  ((SELECT menu_id FROM menu WHERE name = 'Chocolate Chip Cookie'),   'Chocolate Chip Cookie',   65, 'Chocolate Chip Cookie Inventory', 65, 1,  0, NULL,  NULL,           NULL)
) AS v(mid, mname, mprice, minv, up, qty, dsc, dtype, did, dcontact);

-- ============================================================================
-- 3. ORDERS — May 23, 2026  (20 orders: 100-000021 .. 100-000040)
-- ============================================================================

-- 100-000021 ── 6:00 AM | cash | latte 12oz ........................................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, amount_tendered, change_amount, created_at)
  VALUES ('100-000021', 'staff-002', 120, 'CASH', 120, 0, '2026-05-23 06:00:00+08')
  RETURNING order_id
)
INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, loyalty)
SELECT o.order_id, m.menu_id, 'Latte', 120, '12oz hot', 120, 1, 120, 0, false
FROM o, (SELECT menu_id FROM menu WHERE name = 'Latte') m;

-- 100-000022 ── 6:30 AM | cash | mocha 16oz .......................................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, amount_tendered, change_amount, created_at)
  VALUES ('100-000022', 'staff-001', 150, 'CASH', 200, 50, '2026-05-23 06:30:00+08')
  RETURNING order_id
)
INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, loyalty)
SELECT o.order_id, m.menu_id, 'Mocha', 150, '16oz iced', 150, 1, 150, 0, false
FROM o, (SELECT menu_id FROM menu WHERE name = 'Mocha') m;

-- 100-000023 ── 7:00 AM | gcash | latte 16oz + cookie .............................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, reference_number, created_at)
  VALUES ('100-000023', 'staff-003', 205, 'GCASH', 'GC-20260523-001', '2026-05-23 07:00:00+08')
  RETURNING order_id
)
INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, loyalty)
SELECT o.order_id, mid, mname, mprice, minv, up, qty, up * qty, 0, false
FROM o, (VALUES
  ((SELECT menu_id FROM menu WHERE name = 'Latte'),                   'Latte',                  140, '16oz iced',                     140, 1),
  ((SELECT menu_id FROM menu WHERE name = 'Chocolate Chip Cookie'),   'Chocolate Chip Cookie',   65,  'Chocolate Chip Cookie Inventory', 65,  1)
) AS v(mid, mname, mprice, minv, up, qty);

-- 100-000024 ── 7:30 AM | cash | mocha 12oz x2 .....................................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, amount_tendered, change_amount, created_at)
  VALUES ('100-000024', 'staff-002', 260, 'CASH', 300, 40, '2026-05-23 07:30:00+08')
  RETURNING order_id
)
INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, loyalty)
SELECT o.order_id, m.menu_id, 'Mocha', 130, '12oz hot', 130, 2, 260, 0, false
FROM o, (SELECT menu_id FROM menu WHERE name = 'Mocha') m;

-- 100-000025 ── 8:00 AM | grab | latte 12oz + vanilla syrup ......................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, reference_number, created_at)
  VALUES ('100-000025', 'staff-001', 140, 'GRAB', 'GRAB-23001', '2026-05-23 08:00:00+08')
  RETURNING order_id
),
oi AS (
  INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, loyalty)
  SELECT o.order_id, m.menu_id, 'Latte', 120, '12oz hot', 120, 1, 120, 0, false
  FROM o, (SELECT menu_id FROM menu WHERE name = 'Latte') m
  RETURNING order_item_id
)
INSERT INTO order_item_addons (order_item_id, addon_id, addon_name_snapshot, addon_price_snapshot, quantity, total_price)
SELECT oi.order_item_id, a.addon_id, 'Vanilla Syrup', 20, 1, 20
FROM oi, (SELECT addon_id FROM addons WHERE name = 'Vanilla Syrup') a;

-- 100-000026 ── 8:30 AM | cash | cookie x3 .........................................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, amount_tendered, change_amount, note, created_at)
  VALUES ('100-000026', 'staff-003', 195, 'CASH', 200, 5, 'For the team', '2026-05-23 08:30:00+08')
  RETURNING order_id
)
INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, loyalty)
SELECT o.order_id, m.menu_id, 'Chocolate Chip Cookie', 65, 'Chocolate Chip Cookie Inventory', 65, 3, 195, 0, false
FROM o, (SELECT menu_id FROM menu WHERE name = 'Chocolate Chip Cookie') m;

-- 100-000027 ── 9:00 AM | gcash | latte 16oz + oat milk + mocha 12oz .............................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, reference_number, created_at)
  VALUES ('100-000027', 'staff-002', 310, 'GCASH', 'GC-20260523-002', '2026-05-23 09:00:00+08')
  RETURNING order_id
),
oi AS (
  INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, loyalty)
  SELECT o.order_id, mid, mname, mprice, minv, up, qty, up * qty, 0, false
  FROM o, (VALUES
    ((SELECT menu_id FROM menu WHERE name = 'Latte'),  'Latte',  140, '16oz iced', 140, 1),
    ((SELECT menu_id FROM menu WHERE name = 'Mocha'),  'Mocha',  130, '12oz hot',  130, 1)
  ) AS v(mid, mname, mprice, minv, up, qty)
  WHERE mname = 'Latte'
  RETURNING order_item_id
)
INSERT INTO order_item_addons (order_item_id, addon_id, addon_name_snapshot, addon_price_snapshot, quantity, total_price)
SELECT oi.order_item_id, a.addon_id, 'Oat Milk', 40, 1, 40
FROM oi, (SELECT addon_id FROM addons WHERE name = 'Oat Milk') a;

-- 100-000028 ── 9:30 AM | cash | mocha 16oz x2 (SENIOR on one) ...................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, amount_tendered, change_amount, note, created_at)
  VALUES ('100-000028', 'staff-001', 270, 'CASH', 300, 30, 'Senior one cup', '2026-05-23 09:30:00+08')
  RETURNING order_id
)
INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, discount_type, discount_id_number, discount_contact)
SELECT o.order_id, mid, mname, mprice, minv, up, qty, up * qty - dsc, dsc, dtype::"Discount_Type", did, dcontact
FROM o, (VALUES
  ((SELECT menu_id FROM menu WHERE name = 'Mocha'),  'Mocha',  150, '16oz iced', 150, 1, 30, 'SENIOR', 'SR-2026-101', 'Rosa Villanueva'),
  ((SELECT menu_id FROM menu WHERE name = 'Mocha'),  'Mocha',  150, '16oz iced', 150, 1,  0, NULL,    NULL,           NULL)
) AS v(mid, mname, mprice, minv, up, qty, dsc, dtype, did, dcontact);

-- 100-000029 ── 10:00 AM | cash | latte 12oz .......................................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, amount_tendered, change_amount, created_at)
  VALUES ('100-000029', 'staff-003', 120, 'CASH', 120, 0, '2026-05-23 10:00:00+08')
  RETURNING order_id
)
INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, loyalty)
SELECT o.order_id, m.menu_id, 'Latte', 120, '12oz hot', 120, 1, 120, 0, false
FROM o, (SELECT menu_id FROM menu WHERE name = 'Latte') m;

-- 100-000030 ── 10:30 AM | gcash | latte 16oz + extra shot + cookie .............................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, reference_number, created_at)
  VALUES ('100-000030', 'staff-002', 235, 'GCASH', 'GC-20260523-003', '2026-05-23 10:30:00+08')
  RETURNING order_id
),
oi AS (
  INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, loyalty)
  SELECT o.order_id, mid, mname, mprice, minv, up, qty, up * qty, 0, false
  FROM o, (VALUES
    ((SELECT menu_id FROM menu WHERE name = 'Latte'),                   'Latte',                  140, '16oz iced',                     140, 1),
    ((SELECT menu_id FROM menu WHERE name = 'Chocolate Chip Cookie'),   'Chocolate Chip Cookie',   65,  'Chocolate Chip Cookie Inventory', 65,  1)
  ) AS v(mid, mname, mprice, minv, up, qty)
  WHERE mname = 'Latte'
  RETURNING order_item_id
)
INSERT INTO order_item_addons (order_item_id, addon_id, addon_name_snapshot, addon_price_snapshot, quantity, total_price)
SELECT oi.order_item_id, a.addon_id, 'Extra Shot', 30, 1, 30
FROM oi, (SELECT addon_id FROM addons WHERE name = 'Extra Shot') a;

-- 100-000031 ── 11:00 AM | cash | mocha 12oz x3 .....................................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, amount_tendered, change_amount, created_at)
  VALUES ('100-000031', 'staff-001', 390, 'CASH', 400, 10, '2026-05-23 11:00:00+08')
  RETURNING order_id
)
INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, loyalty)
SELECT o.order_id, m.menu_id, 'Mocha', 130, '12oz hot', 130, 3, 390, 0, false
FROM o, (SELECT menu_id FROM menu WHERE name = 'Mocha') m;

-- 100-000032 ── 11:30 AM | grab | latte 12oz x2 + caramel syrup ..................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, reference_number, created_at)
  VALUES ('100-000032', 'staff-003', 260, 'GRAB', 'GRAB-23002', '2026-05-23 11:30:00+08')
  RETURNING order_id
),
oi AS (
  INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, loyalty)
  SELECT o.order_id, m.menu_id, 'Latte', 120, '12oz hot', 120, 2, 240, 0, false
  FROM o, (SELECT menu_id FROM menu WHERE name = 'Latte') m
  RETURNING order_item_id
)
INSERT INTO order_item_addons (order_item_id, addon_id, addon_name_snapshot, addon_price_snapshot, quantity, total_price)
SELECT oi.order_item_id, a.addon_id, 'Caramel Syrup', 20, 1, 20
FROM oi, (SELECT addon_id FROM addons WHERE name = 'Caramel Syrup') a;

-- 100-000033 ── 12:00 PM | cash | latte 12oz (PWD) + mocha 16oz ..................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, amount_tendered, change_amount, created_at)
  VALUES ('100-000033', 'staff-002', 246, 'CASH', 250, 4, '2026-05-23 12:00:00+08')
  RETURNING order_id
)
INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, discount_type, discount_id_number, discount_contact)
SELECT o.order_id, mid, mname, mprice, minv, up, qty, up * qty - dsc, dsc, dtype::"Discount_Type", did, dcontact
FROM o, (VALUES
  ((SELECT menu_id FROM menu WHERE name = 'Latte'),  'Latte',  120, '12oz hot', 120, 1, 24, 'PWD',  'PWD-2026-003', 'Mario Reyes'),
  ((SELECT menu_id FROM menu WHERE name = 'Mocha'),  'Mocha',  150, '16oz iced', 150, 1,  0, NULL,  NULL,           NULL)
) AS v(mid, mname, mprice, minv, up, qty, dsc, dtype, did, dcontact);

-- 100-000034 ── 1:00 PM | cash | mocha 16oz + oat milk ............................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, amount_tendered, change_amount, created_at)
  VALUES ('100-000034', 'staff-001', 190, 'CASH', 200, 10, '2026-05-23 13:00:00+08')
  RETURNING order_id
),
oi AS (
  INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, loyalty)
  SELECT o.order_id, m.menu_id, 'Mocha', 150, '16oz iced', 150, 1, 150, 0, false
  FROM o, (SELECT menu_id FROM menu WHERE name = 'Mocha') m
  RETURNING order_item_id
)
INSERT INTO order_item_addons (order_item_id, addon_id, addon_name_snapshot, addon_price_snapshot, quantity, total_price)
SELECT oi.order_item_id, a.addon_id, 'Oat Milk', 40, 1, 40
FROM oi, (SELECT addon_id FROM addons WHERE name = 'Oat Milk') a;

-- 100-000035 ── 2:00 PM | gcash | latte 16oz x2 .....................................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, reference_number, created_at)
  VALUES ('100-000035', 'staff-003', 280, 'GCASH', 'GC-20260523-004', '2026-05-23 14:00:00+08')
  RETURNING order_id
)
INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, loyalty)
SELECT o.order_id, m.menu_id, 'Latte', 140, '16oz iced', 140, 2, 280, 0, false
FROM o, (SELECT menu_id FROM menu WHERE name = 'Latte') m;

-- 100-000036 ── 3:00 PM | cash | cookie x4 .........................................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, amount_tendered, change_amount, created_at)
  VALUES ('100-000036', 'staff-002', 260, 'CASH', 300, 40, '2026-05-23 15:00:00+08')
  RETURNING order_id
)
INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, loyalty)
SELECT o.order_id, m.menu_id, 'Chocolate Chip Cookie', 65, 'Chocolate Chip Cookie Inventory', 65, 4, 260, 0, false
FROM o, (SELECT menu_id FROM menu WHERE name = 'Chocolate Chip Cookie') m;

-- 100-000037 ── 4:00 PM | grab | latte 12oz + mocha 12oz ..........................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, reference_number, created_at)
  VALUES ('100-000037', 'staff-001', 250, 'GRAB', 'GRAB-23003', '2026-05-23 16:00:00+08')
  RETURNING order_id
)
INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, loyalty)
SELECT o.order_id, mid, mname, mprice, minv, up, qty, up * qty, 0, false
FROM o, (VALUES
  ((SELECT menu_id FROM menu WHERE name = 'Latte'),  'Latte',  120, '12oz hot', 120, 1),
  ((SELECT menu_id FROM menu WHERE name = 'Mocha'),  'Mocha',  130, '12oz hot', 130, 1)
) AS v(mid, mname, mprice, minv, up, qty);

-- 100-000038 ── 5:00 PM | cash | mocha 16oz + extra shot ..........................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, amount_tendered, change_amount, created_at)
  VALUES ('100-000038', 'staff-003', 180, 'CASH', 200, 20, '2026-05-23 17:00:00+08')
  RETURNING order_id
),
oi AS (
  INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, loyalty)
  SELECT o.order_id, m.menu_id, 'Mocha', 150, '16oz iced', 150, 1, 150, 0, false
  FROM o, (SELECT menu_id FROM menu WHERE name = 'Mocha') m
  RETURNING order_item_id
)
INSERT INTO order_item_addons (order_item_id, addon_id, addon_name_snapshot, addon_price_snapshot, quantity, total_price)
SELECT oi.order_item_id, a.addon_id, 'Extra Shot', 30, 1, 30
FROM oi, (SELECT addon_id FROM addons WHERE name = 'Extra Shot') a;

-- 100-000039 ── 6:00 PM | gcash | latte 12oz (SENIOR) + cookie ...................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, reference_number, note, created_at)
  VALUES ('100-000039', 'staff-002', 161, 'GCASH', 'GC-20260523-005', 'Senior disc', '2026-05-23 18:00:00+08')
  RETURNING order_id
)
INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, discount_type, discount_id_number, discount_contact)
SELECT o.order_id, mid, mname, mprice, minv, up, qty, up * qty - dsc, dsc, dtype::"Discount_Type", did, dcontact
FROM o, (VALUES
  ((SELECT menu_id FROM menu WHERE name = 'Latte'),                   'Latte',                  120, '12oz hot',                     120, 1, 24, 'SENIOR', 'SR-2026-102', 'Felipe Cruz'),
  ((SELECT menu_id FROM menu WHERE name = 'Chocolate Chip Cookie'),   'Chocolate Chip Cookie',   65,  'Chocolate Chip Cookie Inventory', 65,  1,  0, NULL,    NULL,           NULL)
) AS v(mid, mname, mprice, minv, up, qty, dsc, dtype, did, dcontact);

-- 100-000040 ── 7:30 PM | cash | latte 16oz + vanilla + caramel syrups ...........................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, amount_tendered, change_amount, created_at)
  VALUES ('100-000040', 'staff-001', 180, 'CASH', 200, 20, '2026-05-23 19:30:00+08')
  RETURNING order_id
),
oi AS (
  INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, loyalty)
  SELECT o.order_id, m.menu_id, 'Latte', 140, '16oz iced', 140, 1, 140, 0, false
  FROM o, (SELECT menu_id FROM menu WHERE name = 'Latte') m
  RETURNING order_item_id
)
INSERT INTO order_item_addons (order_item_id, addon_id, addon_name_snapshot, addon_price_snapshot, quantity, total_price)
SELECT oi.order_item_id, a.addon_id, aname, aprice, 1, aprice
FROM oi, (VALUES ('Vanilla Syrup', 20), ('Caramel Syrup', 20)) AS ad(aname, aprice)
JOIN addons a ON a.name = ad.aname;

-- ============================================================================
-- 4. ORDERS — May 24, 2026  (10 orders: 100-000041 .. 100-000050)
-- ============================================================================

-- 100-000041 ── 6:00 AM | cash | latte 12oz ........................................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, amount_tendered, change_amount, created_at)
  VALUES ('100-000041', 'staff-003', 120, 'CASH', 150, 30, '2026-05-24 06:00:00+08')
  RETURNING order_id
)
INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, loyalty)
SELECT o.order_id, m.menu_id, 'Latte', 120, '12oz hot', 120, 1, 120, 0, false
FROM o, (SELECT menu_id FROM menu WHERE name = 'Latte') m;

-- 100-000042 ── 6:30 AM | cash | mocha 16oz + oat milk ............................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, amount_tendered, change_amount, created_at)
  VALUES ('100-000042', 'staff-001', 190, 'CASH', 200, 10, '2026-05-24 06:30:00+08')
  RETURNING order_id
),
oi AS (
  INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, loyalty)
  SELECT o.order_id, m.menu_id, 'Mocha', 150, '16oz iced', 150, 1, 150, 0, false
  FROM o, (SELECT menu_id FROM menu WHERE name = 'Mocha') m
  RETURNING order_item_id
)
INSERT INTO order_item_addons (order_item_id, addon_id, addon_name_snapshot, addon_price_snapshot, quantity, total_price)
SELECT oi.order_item_id, a.addon_id, 'Oat Milk', 40, 1, 40
FROM oi, (SELECT addon_id FROM addons WHERE name = 'Oat Milk') a;

-- 100-000043 ── 7:00 AM | gcash | latte 16oz + cookie .............................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, reference_number, created_at)
  VALUES ('100-000043', 'staff-002', 205, 'GCASH', 'GC-20260524-001', '2026-05-24 07:00:00+08')
  RETURNING order_id
)
INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, loyalty)
SELECT o.order_id, mid, mname, mprice, minv, up, qty, up * qty, 0, false
FROM o, (VALUES
  ((SELECT menu_id FROM menu WHERE name = 'Latte'),                   'Latte',                  140, '16oz iced',                     140, 1),
  ((SELECT menu_id FROM menu WHERE name = 'Chocolate Chip Cookie'),   'Chocolate Chip Cookie',   65,  'Chocolate Chip Cookie Inventory', 65,  1)
) AS v(mid, mname, mprice, minv, up, qty);

-- 100-000044 ── 8:00 AM | cash | mocha 12oz x2 .....................................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, amount_tendered, change_amount, created_at)
  VALUES ('100-000044', 'staff-003', 260, 'CASH', 300, 40, '2026-05-24 08:00:00+08')
  RETURNING order_id
)
INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, loyalty)
SELECT o.order_id, m.menu_id, 'Mocha', 130, '12oz hot', 130, 2, 260, 0, false
FROM o, (SELECT menu_id FROM menu WHERE name = 'Mocha') m;

-- 100-000045 ── 9:00 AM | grab | latte 12oz x2 .....................................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, reference_number, created_at)
  VALUES ('100-000045', 'staff-001', 240, 'GRAB', 'GRAB-24001', '2026-05-24 09:00:00+08')
  RETURNING order_id
)
INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, loyalty)
SELECT o.order_id, m.menu_id, 'Latte', 120, '12oz hot', 120, 2, 240, 0, false
FROM o, (SELECT menu_id FROM menu WHERE name = 'Latte') m;

-- 100-000046 ── 10:00 AM | cash | mocha 16oz + latte 12oz (PWD) ..................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, amount_tendered, change_amount, created_at)
  VALUES ('100-000046', 'staff-002', 246, 'CASH', 250, 4, '2026-05-24 10:00:00+08')
  RETURNING order_id
)
INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, discount_type, discount_id_number, discount_contact)
SELECT o.order_id, mid, mname, mprice, minv, up, qty, up * qty - dsc, dsc, dtype::"Discount_Type", did, dcontact
FROM o, (VALUES
  ((SELECT menu_id FROM menu WHERE name = 'Mocha'),  'Mocha',  150, '16oz iced', 150, 1,  0, NULL,  NULL,          NULL),
  ((SELECT menu_id FROM menu WHERE name = 'Latte'),  'Latte',  120, '12oz hot',  120, 1, 24, 'PWD',  'PWD-2026-004', 'Cecilia Gomez')
) AS v(mid, mname, mprice, minv, up, qty, dsc, dtype, did, dcontact);

-- 100-000047 ── 11:00 AM | cash | cookie x2 ........................................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, amount_tendered, change_amount, created_at)
  VALUES ('100-000047', 'staff-003', 130, 'CASH', 150, 20, '2026-05-24 11:00:00+08')
  RETURNING order_id
)
INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, loyalty)
SELECT o.order_id, m.menu_id, 'Chocolate Chip Cookie', 65, 'Chocolate Chip Cookie Inventory', 65, 2, 130, 0, false
FROM o, (SELECT menu_id FROM menu WHERE name = 'Chocolate Chip Cookie') m;

-- 100-000048 ── 12:00 PM | gcash | latte 16oz + extra shot + mocha 12oz ..........................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, reference_number, created_at)
  VALUES ('100-000048', 'staff-001', 300, 'GCASH', 'GC-20260524-002', '2026-05-24 12:00:00+08')
  RETURNING order_id
),
oi AS (
  INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, loyalty)
  SELECT o.order_id, mid, mname, mprice, minv, up, qty, up * qty, 0, false
  FROM o, (VALUES
    ((SELECT menu_id FROM menu WHERE name = 'Latte'),  'Latte',  140, '16oz iced', 140, 1),
    ((SELECT menu_id FROM menu WHERE name = 'Mocha'),  'Mocha',  130, '12oz hot',  130, 1)
  ) AS v(mid, mname, mprice, minv, up, qty)
  WHERE mname = 'Latte'
  RETURNING order_item_id
)
INSERT INTO order_item_addons (order_item_id, addon_id, addon_name_snapshot, addon_price_snapshot, quantity, total_price)
SELECT oi.order_item_id, a.addon_id, 'Extra Shot', 30, 1, 30
FROM oi, (SELECT addon_id FROM addons WHERE name = 'Extra Shot') a;

-- 100-000049 ── 2:00 PM | cash | latte 12oz + mocha 12oz + vanilla ...............................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, amount_tendered, change_amount, created_at)
  VALUES ('100-000049', 'staff-002', 270, 'CASH', 300, 30, '2026-05-24 14:00:00+08')
  RETURNING order_id
),
oi AS (
  INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, loyalty)
  SELECT o.order_id, mid, mname, mprice, minv, up, qty, up * qty, 0, false
  FROM o, (VALUES
    ((SELECT menu_id FROM menu WHERE name = 'Latte'),  'Latte',  120, '12oz hot', 120, 1),
    ((SELECT menu_id FROM menu WHERE name = 'Mocha'),  'Mocha',  130, '12oz hot', 130, 1)
  ) AS v(mid, mname, mprice, minv, up, qty)
  WHERE mname = 'Mocha'
  RETURNING order_item_id
)
INSERT INTO order_item_addons (order_item_id, addon_id, addon_name_snapshot, addon_price_snapshot, quantity, total_price)
SELECT oi.order_item_id, a.addon_id, 'Vanilla Syrup', 20, 1, 20
FROM oi, (SELECT addon_id FROM addons WHERE name = 'Vanilla Syrup') a;

-- 100-000050 ── 5:00 PM | cash | latte 16oz (SENIOR) + cookie ....................................................
WITH o AS (
  INSERT INTO orders (order_id, staff_id, grand_total, method, amount_tendered, change_amount, note, created_at)
  VALUES ('100-000050', 'staff-003', 177, 'CASH', 200, 23, 'Last order', '2026-05-24 17:00:00+08')
  RETURNING order_id
)
INSERT INTO order_items (order_id, menu_id, snapshot_menu_name, snapshot_price, snapshot_inventory, unit_price, quantity, line_total, discount_amount, discount_type, discount_id_number, discount_contact)
SELECT o.order_id, mid, mname, mprice, minv, up, qty, up * qty - dsc, dsc, dtype::"Discount_Type", did, dcontact
FROM o, (VALUES
  ((SELECT menu_id FROM menu WHERE name = 'Latte'),                   'Latte',                  140, '16oz iced',                     140, 1, 28, 'SENIOR', 'SR-2026-103', 'Teresa Santos'),
  ((SELECT menu_id FROM menu WHERE name = 'Chocolate Chip Cookie'),   'Chocolate Chip Cookie',   65,  'Chocolate Chip Cookie Inventory', 65, 1,  0, NULL,    NULL,           NULL)
) AS v(mid, mname, mprice, minv, up, qty, dsc, dtype, did, dcontact);

-- ============================================================================
-- 5. Deduct inventory based on items sold ...................................
-- ============================================================================
UPDATE inventory i
SET stock = i.stock - sub.qty
FROM (
  SELECT oi.snapshot_inventory AS inv_name, SUM(oi.quantity)::int AS qty
  FROM order_items oi
  GROUP BY oi.snapshot_inventory
) sub
WHERE i.name = sub.inv_name;

-- ============================================================================
-- Done.
--   Inventory stock after deductions:
--     - 12oz hot        → 100 - (qty sold)
--     - 16oz iced       → 100 - (qty sold)
--     - Cookie Inventory →  50 - (qty sold)
-- ============================================================================
