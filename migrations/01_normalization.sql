-- 1. Create new tables
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    address TEXT,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scopes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    standard_code TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(standard_code, description)
);

-- 2. Migrate data from existing licenses table
INSERT INTO companies (name)
SELECT DISTINCT company FROM licenses WHERE company IS NOT NULL
ON CONFLICT (name) DO NOTHING;

INSERT INTO tags (name)
SELECT DISTINCT tag FROM licenses WHERE tag IS NOT NULL
ON CONFLICT (name) DO NOTHING;

INSERT INTO scopes (standard_code, description)
SELECT DISTINCT standard_scope, criteria_scope FROM licenses 
WHERE standard_scope IS NOT NULL AND criteria_scope IS NOT NULL
ON CONFLICT (standard_code, description) DO NOTHING;

-- 3. Add foreign keys to licenses table
ALTER TABLE licenses ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id);
ALTER TABLE licenses ADD COLUMN IF NOT EXISTS tag_id UUID REFERENCES tags(id);
ALTER TABLE licenses ADD COLUMN IF NOT EXISTS scope_id UUID REFERENCES scopes(id);

-- 4. Update foreign keys based on existing text data
UPDATE licenses l
SET company_id = c.id
FROM companies c
WHERE l.company = c.name;

UPDATE licenses l
SET tag_id = t.id
FROM tags t
WHERE l.tag = t.name;

UPDATE licenses l
SET scope_id = s.id
FROM scopes s
WHERE l.standard_scope = s.standard_code AND l.criteria_scope = s.description;

-- 5. Drop old columns (Uncomment when ready to fully switch)
-- ALTER TABLE licenses DROP COLUMN company;
-- ALTER TABLE licenses DROP COLUMN tag;
-- ALTER TABLE licenses DROP COLUMN standard_scope;
-- ALTER TABLE licenses DROP COLUMN criteria_scope;
