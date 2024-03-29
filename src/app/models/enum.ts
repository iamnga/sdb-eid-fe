export enum Service {
  None,
  OnBoarding,
  UpdateCardId,
  TestMk
}

export enum ServiceStep {
  DashBoard,
  CaptureGuide,
  CaptureFace,
  InputFinger,
  InputPhoneNumber,
  CollectCardId,
  CaptureCardId,
  CheckCustomerInfo,
  VerifyCustomerInfo,
  RecheckInfo,
  UpdateCustomerInfo,
  UpdateCustomerSuccess,
  FillInfo,
  AccountAndAlert,
  HandleSmartAuthen,
  InquiryAuthen,
  RequestAuthen,
  VerifyAuthen,
  CustomerEnroll,
  OpenAccount,
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

export enum AuthType {
  Unknow = '-1',
  None = '0',
  SMSOTP = '1',
  DeviceToken = '2',
  mCodeOTP = '3',
  mConnect = '4',
  SMSTTT = '5',
  AdvToken = '6',
  SmartOTP = '8',
  SmartOTPCode = '9',
}

export enum CustomerType {
  KHHienHuu = 'C0',
  KHChuaXacDinhDoTrungHoTenNTNS = 'C1',
  KHChuaXacDinh = 'C2',
  KHVangLai = 'C3',
  KHMoi = 'C4',
  KHChuaXacDinhDoTrungCCCDKoTrungHoTen = 'C5',
  KHChuaXacDinhDoTrungCCCDKoTrungNTNS = 'C6',
  KHChuaXacDinhDoTrungCCCDKoTrungSDT = 'C7',
  KHHienHuuAMLKhongHopLe = 'C8',
  KHDieuChinhThongTin = 'C9',
  KHTiemNang = 'C10'
}
