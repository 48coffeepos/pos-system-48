-- SQL Migration Script
-- Rename adjustments columns to price columns in the Menu table for PostgreSQL

ALTER TABLE "Menu" RENAME COLUMN "hot_12oz_adj" TO "hot_12oz_price";
ALTER TABLE "Menu" RENAME COLUMN "hot_16oz_adj" TO "hot_16oz_price";
ALTER TABLE "Menu" RENAME COLUMN "iced_12oz_adj" TO "iced_12oz_price";
ALTER TABLE "Menu" RENAME COLUMN "iced_16oz_adj" TO "iced_16oz_price";
