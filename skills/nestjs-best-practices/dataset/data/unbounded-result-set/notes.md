# Unbounded Result Set Dataset

Use this when API list handlers call `findMany` without `take`, cursor, or batching. Public endpoints should cap result sizes and expose a stable pagination contract.
