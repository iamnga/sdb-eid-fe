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
  InputMobileNumber,
  VerifyCustomerInfo,
  FillInfo,
  AccountAndAlert,
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
  None,
  OnlySPay,
  SmsAndSPay,
}
