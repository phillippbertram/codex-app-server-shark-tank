const sensitiveKey = /(?:token|authorization|api[-_]?key|password|secret|cookie)/i;
const bearerValue = /\bBearer\s+[A-Za-z0-9._~+/=-]+/gi;

export function redact<T>(value: T): T {
  return redactValue(value, new WeakSet()) as T;
}

function redactValue(value: unknown, seen: WeakSet<object>): unknown {
  if (typeof value === "string") {
    return value.replace(bearerValue, "Bearer [REDACTED]");
  }
  if (!value || typeof value !== "object") {
    return value;
  }
  if (seen.has(value)) {
    return "[Circular]";
  }
  seen.add(value);
  if (Array.isArray(value)) {
    return value.map((entry) => redactValue(entry, seen));
  }
  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [
      key,
      sensitiveKey.test(key) ? "[REDACTED]" : redactValue(entry, seen),
    ]),
  );
}
