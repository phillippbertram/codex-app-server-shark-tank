import { join } from "node:path";
import { app, BrowserWindow } from "electron";
import { IPC } from "../shared/ipc.js";
import { CodexAppServer } from "./codex/CodexAppServer.js";
import { registerIpc } from "./ipc/registerIpc.js";
import { ProjectStore } from "./projects/ProjectStore.js";
import { loadWorkflow } from "./workflow/WorkflowDefinition.js";
import { WorkflowEngine } from "./workflow/WorkflowEngine.js";

let mainWindow: BrowserWindow | undefined;
let codex: CodexAppServer | undefined;

async function createApplication(): Promise<void> {
  const root = app.getAppPath();
  const workflowDefinition = await loadWorkflow(root);
  const store = new ProjectStore(root, workflowDefinition);
  await store.initialize();

  codex = new CodexAppServer(root);
  const workflow = new WorkflowEngine(root, workflowDefinition, store, codex);
  registerIpc(store, workflow, codex);

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 940,
    minWidth: 1080,
    minHeight: 720,
    show: false,
    titleBarStyle: "default",
    backgroundColor: "#080d16",
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  workflow.on("appEvent", (event) => {
    const window = mainWindow;
    if (!window || window.isDestroyed() || window.webContents.isDestroyed()) return;
    window.webContents.send(IPC.appEvent, event);
  });
  mainWindow.on("closed", () => {
    mainWindow = undefined;
  });
  mainWindow.on("ready-to-show", () => mainWindow?.show());

  if (process.env.ELECTRON_RENDERER_URL) {
    await mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    await mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }

  void codex.start();
}

app.whenReady().then(async () => {
  await createApplication();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) void createApplication();
  });
});

app.on("window-all-closed", () => {
  codex?.close();
  app.quit();
});
