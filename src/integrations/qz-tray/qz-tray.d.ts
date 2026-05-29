declare module "qz-tray" {
  interface QZWebSocket {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
  }

  interface QZPrinters {
    find(query?: string): Promise<string | string[]>;
  }

  interface QZConfigs {
    create(
      printer: string | object,
      options?: {
        encoding?: string;
        copies?: number;
        density?: number | string;
        orientation?: "portrait" | "landscape" | "reverse-landscape" | null;
        endOfDoc?: string;
      },
    ): object;
  }

  interface QZPrintDataItem {
    data: string;
    type?: "raw" | "pixel";
    format?: "command" | "file" | "base64";
    flavor?: "plain" | "base64" | "hex" | "file" | "xml";
  }

  interface QZ {
    websocket: QZWebSocket;
    printers: QZPrinters;
    configs: QZConfigs;
    print(
      config: object | object[],
      data: (string | QZPrintDataItem)[],
    ): Promise<null>;
  }

  const qz: QZ;
  export default qz;
}
