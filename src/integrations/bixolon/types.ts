export interface BixolonTextOptions {
  code?: string;
  ics?: string;
  font?: string;
  wd?: string;
  ht?: string;
  uline?: string;
  bold?: string;
  reverse?: string;
  updown?: string;
  rotate?: string;
  lsp?: string;
  data: string;
}

export interface BixolonAlignOptions {
  pos: "left" | "center" | "right";
}

export interface BixolonPaperFeedOptions {
  type?: "line" | "unit";
  value?: string;
}

export interface BixolonPaperCutOptions {
  cuttype?: "feed" | "nofeed";
}

export interface BixolonDrawerKickOptions {
  connector?: "pin2" | "pin5";
  duration?: string;
}

export interface BixolonBarcodeOptions {
  type?: string;
  hri?: string;
  wd?: string;
  ht?: string;
  data: string;
}

export interface BixolonSendDataOptions {
  ipAddr: string;
  shopID: string;
  devID: string;
}

export interface BixolonConnectionConfig {
  ipAddr: string;
  shopID: string;
  devID: string;
}

export interface BixolonReceiptLine {
  text: string;
  bold?: boolean;
  doubleWidth?: boolean;
  doubleHeight?: boolean;
  align?: "left" | "center" | "right";
  underline?: boolean;
  spaceAfter?: number;
  feedAfter?: number;
}

export interface BixolonReceiptSection {
  lines: BixolonReceiptLine[];
  feedAfter?: number;
  cutAfter?: boolean;
  drawerKick?: boolean;
}

export interface BixolonPrintJob {
  sections: BixolonReceiptSection[];
}

export interface BixolonReceiptData {
  header: BixolonReceiptLine[];
  items: BixolonReceiptLine[];
  totals: BixolonReceiptLine[];
  footer: BixolonReceiptLine[];
  feedAfter?: number;
  cutPaper?: boolean;
  openDrawer?: boolean;
}

export interface BixolonSDKInstance {
  makeAlign: (opts: BixolonAlignOptions) => void;
  makeText: (opts: BixolonTextOptions) => void;
  makePaperFeed: (opts: BixolonPaperFeedOptions) => void;
  makePaperCut: (opts: BixolonPaperCutOptions) => void;
  makeDKout: (opts: BixolonDrawerKickOptions) => void;
  makeBuzzer: () => void;
  makeReinit: () => void;
  makeBarcode12: (opts: BixolonBarcodeOptions) => void;
  sendData: (ipAddr: string, shopID: string, devID: string) => void | Promise<void>;
  getDeviceList: (
    ipAddr: string,
    shopID: string,
    listInputBoxID: string,
  ) => void;
  getShopList: (ipAddr: string, listInputBoxID: string) => void;
}
