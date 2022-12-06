export class AllInOneRequest<T> {
  refNumber: string;
  refDateTime: string;
  deviceID: string;
  sessionID: string;
  data: T;
}

export class AllInOneResponse<T> {
  refNumber: string;
  refDateTime: string;
  respCode: string;
  respDescription: string;
  data: T;
}

export class GetSessionIdResponseData {
  sessionId: string;
}

export class UpdateLogStepData {
  stepName: string;
  identityID: string;
  lastRespCode: string;
  lastRespDescription: string;
  lastChildStep: string;
}

export class AddressData {
  order: string;
  name: string;
  id: string;
}

export class Occupations {
  order: string;
  name: string;
}

export class CheckCustomerRequestData {
  cifNo: string;
  legalId: string;
  legalIdType: string;
  lastName: string;
  middleName: string;
  firstName: string;
  dob: string;
  mobile: string;
}

export class VerifyOtpRequestData {
  customerID: string;
  customerType: string;
  mobileNo: string;
  cifNo: string;
  authType: string;
  authCode: string;
  serviceType: string;
}

export class RequestOtpRequestData {
  customerID: string;
  customerType: string;
  mobileNo: string;
  cifNo: string;
  authType: string;
  channel: string;
  smsContent: string;
}
