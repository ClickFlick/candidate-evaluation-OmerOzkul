import { Response } from "miragejs";
import { v4 as uuid } from "uuid";

/**
 * This handler fetches all token transaction logs (mints & transfers).
 * send GET Request at /api/token/logs
 */
export const getTokenLogsHandler = function (schema, request) {
  try {
    const logs = schema.db.logs;

    return new Response(200, {}, {
      logs: logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
    });
  } catch (error) {
    return new Response(500, {}, { error: "Failed to retrieve logs" });
  }
};

/**
 * Utility to insert a log entry into the mock chain.
 * Used by other controllers.
 * @param {Object} schema - Mirage schema
 * @param {Object} logData - { type, from, to, amount }
 */
export const createTokenLog = function (schema, logData) {
  const { type, from, to, amount } = logData;

  schema.db.logs.insert({
    id: uuid(),
    timestamp: new Date().toISOString(),
    type, // MINT or TRANSFER can be anything else but we will keep it simple
    from,
    to,
    amount: Number(amount),
  });
};
