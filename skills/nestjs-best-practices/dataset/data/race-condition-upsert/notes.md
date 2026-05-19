# Race Condition Upsert Dataset

Use this when code performs a separate existence read before create/update. Require a database unique constraint and express the operation with `upsert` or explicit constraint-error handling.
