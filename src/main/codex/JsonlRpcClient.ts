import { type ChildProcessWithoutNullStreams, spawn } from "node:child_process";
import { EventEmitter } from "node:events";
import { createInterface } from "node:readline";
import type { RequestId } from "./generated/RequestId.js";

/** JSON-RPC 2.0 error codes: https://www.jsonrpc.org/specification#error_object */
export const JsonRpcErrorCode = {
  parseError: -32_700,
  invalidRequest: -32_600,
  methodNotFound: -32_601,
  invalidParams: -32_602,
  internalError: -32_603,
} as const;

type RpcResponse = {
  id: RequestId;
  result?: unknown;
  error?: { code?: number; message?: string; data?: unknown };
};

type RpcMethodMessage = {
  id?: RequestId;
  method: string;
  params?: unknown;
};

type PendingRequest = {
  method: string;
  resolve: (value: unknown) => void;
  reject: (error: Error) => void;
  timeout: NodeJS.Timeout;
};

export type JsonlRpcEvents = {
  notification: [message: RpcMethodMessage];
  serverRequest: [message: Required<Pick<RpcMethodMessage, "id" | "method">> & RpcMethodMessage];
  stderr: [line: string];
  exit: [error: Error];
};

export class JsonlRpcClient extends EventEmitter<JsonlRpcEvents> {
  private process?: ChildProcessWithoutNullStreams;
  private requestId = 0;
  private readonly pending = new Map<RequestId, PendingRequest>();

  start(command: string, args: string[], cwd: string): void {
    if (this.process) return;

    const child = spawn(command, args, {
      cwd,
      env: process.env,
      stdio: ["pipe", "pipe", "pipe"],
    });
    this.process = child;

    createInterface({ input: child.stdout }).on("line", (line) => this.handleLine(line));
    createInterface({ input: child.stderr }).on("line", (line) => this.emit("stderr", line));

    child.on("error", (cause) => this.handleExit(new Error("Codex App Server failed", { cause })));
    child.on("exit", (code, signal) => {
      this.handleExit(
        new Error(`Codex App Server exited (${signal ? `signal ${signal}` : `code ${code}`})`),
      );
    });
  }

  async request<TResult>(method: string, params: unknown, timeoutMs = 15_000): Promise<TResult> {
    const id = ++this.requestId;
    const payload = { id, method, params };

    return new Promise<TResult>((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`App Server request timed out: ${method}`));
      }, timeoutMs);

      this.pending.set(id, {
        method,
        resolve: (value) => resolve(value as TResult),
        reject,
        timeout,
      });
      try {
        this.write(payload);
      } catch (error) {
        clearTimeout(timeout);
        this.pending.delete(id);
        reject(error);
      }
    });
  }

  notify(method: string, params?: unknown): void {
    this.write(params === undefined ? { method } : { method, params });
  }

  respond(id: RequestId, result: unknown): void {
    this.write({ id, result });
  }

  respondError(id: RequestId, code: number, message: string): void {
    this.write({ id, error: { code, message } });
  }

  close(): void {
    this.process?.kill();
    this.process = undefined;
  }

  private write(message: unknown): void {
    if (!this.process?.stdin.writable) {
      throw new Error("Codex App Server is not running");
    }
    this.process.stdin.write(`${JSON.stringify(message)}\n`);
  }

  private handleLine(line: string): void {
    if (!line.trim()) return;

    let message: RpcResponse | RpcMethodMessage;
    try {
      message = JSON.parse(line) as RpcResponse | RpcMethodMessage;
    } catch {
      this.emit("stderr", `Ignored non-JSON App Server output: ${line}`);
      return;
    }

    if ("id" in message && message.id !== undefined && !("method" in message)) {
      const pending = this.pending.get(message.id);
      if (!pending) return;
      clearTimeout(pending.timeout);
      this.pending.delete(message.id);
      if (message.error) {
        pending.reject(new Error(message.error.message ?? `App Server ${pending.method} failed`));
      } else {
        pending.resolve(message.result);
      }
      return;
    }

    if (!("method" in message)) return;
    if (message.id !== undefined) {
      this.emit("serverRequest", message as Required<Pick<RpcMethodMessage, "id" | "method">>);
    } else {
      this.emit("notification", message);
    }
  }

  private handleExit(error: Error): void {
    if (!this.process && this.pending.size === 0) return;
    this.process = undefined;
    for (const pending of this.pending.values()) {
      clearTimeout(pending.timeout);
      pending.reject(error);
    }
    this.pending.clear();
    this.emit("exit", error);
  }
}
