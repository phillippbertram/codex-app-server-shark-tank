import type { SharkTankApi } from "@shared/types";

declare global {
  interface Window {
    sharkTank: SharkTankApi;
  }
}
