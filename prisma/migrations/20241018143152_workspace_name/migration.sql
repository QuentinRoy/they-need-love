/*
  Warnings:

  - Added the required column `name` to the `Workspace` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN "name" TEXT;

-- Set up a default value for existing rows.
UPDATE "Workspace"  SET "name" = 'Unnamed Workspace';

-- Now make the column required.
ALTER TABLE "Workspace" ALTER COLUMN "name" SET NOT NULL;