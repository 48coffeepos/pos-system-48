import { BIXOLON_DEFAULT_SETTINGS } from "./printer";
import type {
  BixolonConnectionConfig,
  BixolonSDKInstance,
} from "./types";

const SDK_SCRIPTS = [
  "/sdk/bixolon/WS_parser.js",
  "/sdk/bixolon/bGateWebPrintAPI_WS.js",
];

function getGlobalSDK(): BixolonSDKInstance | null {
  try {
    const bGate = (window as unknown as Record<string, unknown>)
      .bGateWebPrintAPI;
    if (typeof bGate === "function") {
      return new (bGate as new () => BixolonSDKInstance)() as BixolonSDKInstance;
    }
    return null;
  } catch {
    return null;
  }
}

let sdkInstance: BixolonSDKInstance | null = null;
let loaded = false;
let loading = false;
let loadPromise: Promise<boolean> | null = null;

async function injectScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error(`Failed to load BIXOLON SDK script: ${src}`));
    document.head.appendChild(script);
  });
}

export async function loadBixolonSDK(): Promise<boolean> {
  if (loaded) return true;
  if (loading && loadPromise) return loadPromise;

  loading = true;
  loadPromise = (async () => {
    try {
      const existing = getGlobalSDK();
      if (existing) {
        sdkInstance = existing;
        loaded = true;
        return true;
      }

      for (const src of SDK_SCRIPTS) {
        await injectScript(src);
      }

      const instance = getGlobalSDK();
      if (instance) {
        sdkInstance = instance;
        loaded = true;
        return true;
      }

      return false;
    } catch {
      return false;
    } finally {
      loading = false;
      loadPromise = null;
    }
  })();

  return loadPromise;
}

export function getBixolonSDK(): BixolonSDKInstance | null {
  if (!loaded) return null;
  return sdkInstance;
}

export function isBixolonSDKLoaded(): boolean {
  return loaded && sdkInstance !== null;
}

export function sendToPrinter(
  config?: Partial<BixolonConnectionConfig>,
): void {
  const sdk = getBixolonSDK();
  if (!sdk) throw new Error("BIXOLON SDK not loaded");

  const { ipAddr, shopID, devID } = {
    ...BIXOLON_DEFAULT_SETTINGS,
    ...config,
  };

  sdk.sendData(ipAddr, shopID, devID);
}

export function resetPrinter(config?: Partial<BixolonConnectionConfig>): void {
  const sdk = getBixolonSDK();
  if (!sdk) throw new Error("BIXOLON SDK not loaded");

  sdk.makeReinit();
  sendToPrinter(config);
}

export function cutPaper(feed: boolean = true): void {
  const sdk = getBixolonSDK();
  if (!sdk) throw new Error("BIXOLON SDK not loaded");

  sdk.makePaperCut({ cuttype: feed ? "feed" : "nofeed" });
}

export function openCashDrawer(): void {
  const sdk = getBixolonSDK();
  if (!sdk) throw new Error("BIXOLON SDK not loaded");

  sdk.makeDKout({ connector: "pin2", duration: "200" });
}

export function buzzPrinter(): void {
  const sdk = getBixolonSDK();
  if (!sdk) throw new Error("BIXOLON SDK not loaded");

  sdk.makeBuzzer();
}
