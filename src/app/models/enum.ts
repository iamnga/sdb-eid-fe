export enum Service {
  None,
  OnBoarding,
  UpdateCardId,
}

export enum ServiceStep {
  Start,
  CaptureFace,
  InputFinger,
  CollectCardId,
  InputMobileNumber,
  VerifyCustomerInfo,
  FillInfo,
  AccountAndAlert,
  End,
}
