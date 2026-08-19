import { EventEmitter } from "node:events";
import { constants } from "node:fs";
import { access } from "node:fs/promises";
import { homedir } from "node:os";
import { delimiter, join } from "node:path";
import type { CodexStatus } from "../../shared/types.js";
import type { InitializeParams } from "./generated/InitializeParams.js";
import type { InitializeResponse } from "./generated/InitializeResponse.js";
import type { RequestId } from "./generated/RequestId.js";
import type { GetAccountResponse } from "./generated/v2/GetAccountResponse.js";
import type { ModelListResponse } from "./generated/v2/ModelListResponse.js";
import type { ThreadStartParams } from "./generated/v2/ThreadStartParams.js";
import type { ThreadStartResponse } from "./generated/v2/ThreadStartResponse.js";
import type { TurnInterruptParams } from "./generated/v2/TurnInterruptParams.js";
import type { TurnInterruptResponse } from "./generated/v2/TurnInterruptResponse.js";
import type { TurnStartParams } from "./generated/v2/TurnStartParams.js";
import type { TurnStartResponse } from "./generated/v2/TurnStartResponse.js";
import { JsonlRpcClient, JsonRpcErrorCode } from "./JsonlRpcClient.js";

type MethodMessage = { id?: RequestId; method: string; params?: unknown };

type CodexEvents = {
  notification: [message: MethodMessage];
  serverRequest: [message: MethodMessage & { id: RequestId }];
  stderr: [line: string];
  status: [status: CodexStatus];
};

export class CodexAppServer extends EventEmitter<CodexEvents> {
  private readonly client = new JsonlRpcClient();
  private status: CodexStatus = { state: "stopped", message: "App Server is stopped" };

  constructor(private readonly root: string) {
    super();
    this.client.on("notification", (message) => this.emit("notification", message));
    this.client.on("serverRequest", (message) => this.emit("serverRequest", message));
    this.client.on("stderr", (line) => this.emit("stderr", line));
    this.client.on("exit", (error) => {
      this.setStatus({ state: "error", message: error.message });
    });
  }

  getStatus(): CodexStatus {
    return this.status;
  }

  async start(): Promise<CodexStatus> {
    if (this.status.state === "ready" || this.status.state === "not_authenticated") {
      return this.status;
    }

    this.setStatus({ state: "starting", message: "Starting Codex App Server…" });

    try {
      const command = await resolveCodexExecutable();
      this.client.start(
        command,
        [
          "app-server",
          "--stdio",
          "-c",
          'web_search="disabled"',
          "-c",
          "agents.enabled=false",
          "-c",
          "mcp_servers={}",
        ],
        this.root,
      );
      const params: InitializeParams = {
        clientInfo: {
          name: "startup-shark-tank",
          title: "Startup Shark Tank",
          version: "0.1.0",
        },
        capabilities: {
          experimentalApi: false,
          requestAttestation: false,
        },
      };
      const initialized = await this.client.request<InitializeResponse>("initialize", params);
      this.client.notify("initialized");

      const account = await this.client.request<GetAccountResponse>("account/read", {
        refreshToken: false,
      });
      if (!account.account) {
        this.setStatus({
          state: "not_authenticated",
          message: "Sign in from a terminal with `codex login`, then restart the app.",
          userAgent: initialized.userAgent,
        });
      } else {
        const modelCatalog = await this.client
          .request<ModelListResponse>("model/list", { limit: 50, includeHidden: false })
          .catch(() => undefined);
        this.setStatus({
          state: "ready",
          message: "Codex App Server connected",
          userAgent: initialized.userAgent,
          ...(modelCatalog
            ? {
                models: modelCatalog.data.map((model) => ({
                  id: model.id,
                  displayName: model.displayName,
                  description: model.description,
                  isDefault: model.isDefault,
                  defaultReasoningEffort: model.defaultReasoningEffort,
                  supportedReasoningEfforts: model.supportedReasoningEfforts.map(
                    (option) => option.reasoningEffort,
                  ),
                })),
              }
            : {}),
        });
      }
    } catch (error) {
      this.setStatus({
        state: "error",
        message: error instanceof Error ? error.message : "Could not start Codex App Server",
      });
    }
    return this.status;
  }

  startThread(params: ThreadStartParams): Promise<ThreadStartResponse> {
    return this.client.request("thread/start", params);
  }

  startTurn(params: TurnStartParams): Promise<TurnStartResponse> {
    return this.client.request("turn/start", params);
  }

  interruptTurn(params: TurnInterruptParams): Promise<TurnInterruptResponse> {
    return this.client.request("turn/interrupt", params);
  }

  respond(id: RequestId, result: unknown): void {
    this.client.respond(id, result);
  }

  respondError(id: RequestId, message: string): void {
    this.client.respondError(id, JsonRpcErrorCode.methodNotFound, message);
  }

  close(): void {
    this.client.close();
    this.setStatus({ state: "stopped", message: "App Server is stopped" });
  }

  private setStatus(status: CodexStatus): void {
    this.status = status;
    this.emit("status", status);
  }
}

async function resolveCodexExecutable(): Promise<string> {
  const executable = process.platform === "win32" ? "codex.exe" : "codex";
  const pathCandidates = (process.env.PATH ?? "")
    .split(delimiter)
    .filter(Boolean)
    .map((directory) => join(directory, executable));
  const candidates = [
    process.env.STARTUP_SHARK_TANK_CODEX_PATH,
    ...pathCandidates,
    "/opt/homebrew/bin/codex",
    "/usr/local/bin/codex",
    join(homedir(), ".local", "bin", executable),
    join(homedir(), ".local", "share", "pnpm", executable),
    join(homedir(), ".volta", "bin", executable),
  ];

  for (const candidate of new Set(candidates.filter((value): value is string => Boolean(value)))) {
    try {
      await access(candidate, constants.X_OK);
      return candidate;
    } catch {
      // Continue through the known CLI installation locations.
    }
  }

  throw new Error(
    "Codex CLI was not found. Install Codex, sign in once from a terminal, and then restart the app.",
  );
}
