-- Repair databases where the initial migration was applied before totpSecret was added.
ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "totpSecret" TEXT;

ALTER TABLE "Company" ALTER COLUMN "totpSecret" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "Company_totpSecret_key" ON "Company"("totpSecret");
