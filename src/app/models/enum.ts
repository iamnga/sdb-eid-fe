export enum Service {
  None,
  OnBoarding,
  UpdateCardId,
}

export enum ServiceStep {
  DashBoard,
  CaptureGuide,
  CaptureFace,
  InputFinger,
  CollectCardId,
  VerifyCustomerInfo,
  RecheckInfo,
  UpdateCustomerInfo,
  FillInfo,
  AccountAndAlert,
  RequestOtp,
  VerifyOtp,
  End,
}

export enum AccountType {
  None,
  Phone,
  DOB,
  CardId,
  Custom,
  Random,
}

export enum AlertType {
  None = '',
  OnlySPay = 'P',
  SmsAndSPay = 'A',
}
