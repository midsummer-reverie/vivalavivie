-- Add per-code, per-field scope to text templates created by the earlier migration.
-- Existing rows stay in the database; without a scope they will not appear in any field list.
ALTER TABLE personal_text_templates
  ADD COLUMN IF NOT EXISTS draft_id TEXT REFERENCES cloud_drafts(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS code_id TEXT,
  ADD COLUMN IF NOT EXISTS field_key TEXT;

DROP INDEX IF EXISTS personal_text_templates_owner_updated_idx;

CREATE INDEX personal_text_templates_owner_updated_idx
  ON personal_text_templates (personal_key_id, draft_id, code_id, field_key, updated_at DESC);
