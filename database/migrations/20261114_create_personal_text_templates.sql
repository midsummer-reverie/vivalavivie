CREATE TABLE IF NOT EXISTS personal_text_templates (
  id TEXT PRIMARY KEY,
  personal_key_id TEXT NOT NULL REFERENCES personal_keys(id) ON DELETE CASCADE,
  draft_id TEXT REFERENCES cloud_drafts(id) ON DELETE CASCADE,
  code_id TEXT,
  field_key TEXT,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS personal_text_templates_owner_updated_idx
  ON personal_text_templates (personal_key_id, draft_id, code_id, field_key, updated_at DESC);
