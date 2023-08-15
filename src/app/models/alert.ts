export class Alert {
  template: number;
  title: string;
  content: string;
  action: string;
  btnPriText: string;
  btnSecText: string;
  countDownTime: number;
}

export enum Template {
  Simple,
  ExistAccount,
  FingerPrintFailed,
  UpdateCardId,
  GoHome,
  HasAction,
  TermsAndConditions
}
