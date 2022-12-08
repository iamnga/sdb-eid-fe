export class Alert {
  template: number;
  title: string;
  content: string;
  action: string;
}

export enum Template {
  Simple,
  ExistAccount,
  FingerPrintFailed,
}
