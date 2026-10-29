
-- Esta migración crea el historial de auditoría para registrar acciones
-- importantes, su autor y detalles adicionales en formato JSON.
CREATE TABLE IF NOT EXISTS ticket_history (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ticket_id BIGINT REFERENCES tickets(id) ON DELETE SET NULL,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ticket_history_ticket
    ON ticket_history(ticket_id, created_at DESC);
