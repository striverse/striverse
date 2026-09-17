-- v23: strengthen common admin audit-log query paths.
CREATE INDEX IF NOT EXISTS "SecurityAuditLog_actorRole_createdAt_idx" ON "SecurityAuditLog"("actorRole", "createdAt");
