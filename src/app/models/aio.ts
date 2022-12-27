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
  code: string;
}

export class Occupations {
  code: string;
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

export class OpenAccountRequestData {
  idEKYCPersonal: string;
  cifNo: string;
  registerAlert: RegisterAlert;
  fullName: string;
  prefixNumberAccount: string;
  accountCurrency: string;
  accountType: string;
  branchCode: string;
  mobileNo: string;
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

export class GetAuthMethodRequestData {
  customerID: string;
  customerType: string;
  mobileNo: string;
  cifNo: string;
}

export class CustomerInfo {
  customerID: string;
  customerIDOld: string;
  customerType: string;
  categoryCustomer: string;
  fullName: string;
  email: string;
  gender: string;
  dob: string;
  mobileNo: string;
  issueDate: string;
  expireDate: string;
  issuePlace: string;
  address: string;
  jobCode: string;
  towncountry: string;
  contactAddress: AddressInfo;
  residentialAddress: AddressInfo;
  country: string;
  nationality: string;
}

export class AddressInfo {
  provinceCode: string;
  provinceName: string;
  districtCode: string;
  districtName: string;
  wardCode: string;
  wardName: string;
  street: string;
}

export class RegisterAlert {
  methodAlert: string;
}

export class CustomerEnroll {
  prefixNumberAccount: string;
  accountCurrency: string;
  accountType: string;
  customerInfo: CustomerInfo;
  registerAlert: RegisterAlert;
  branchCode: string;
}

export class OpenAccountResponseData {
  accountNumber: string;
  currency: string;
  cifNo: string;
  accountTitle: string;
  accountCompany: string;
  blockID: string;
  lockAccountNumber: string;
  lockCompany: string;
  dataStreamQR: string;
}

export class UpdateCustomerRequestData {
  mobileNo: string;
  customerUpdate: CustomerUpdateData;
  cifNo: string;
  branchCode: string;
}

export class CheckCustomerSDBRequestData {
  customerID: string;
  customerType: string;
  cifNo: string;
  serviceType: string;
  fullName: string;
  mobileNo: string;
  dob: string;
  residentAddress: string;
  email: string;
  isEdit: boolean;
}

export class CustomerUpdateData {
  customerIDOld: string;
  customerIDNew: string;
  issueDate: string;
  issuePlace: string;
  expDate: string;
  isUpdateAddress: boolean;
  addressCityCode: string;
  addressCityName: string;
  addressDistrictCode: string;
  addressDistrictName: string;
  addressWardCode: string;
  addressWardName: string;
  addressStreet: string;
  qrContent: string;
}

export class CurrentDocInfo {
  customerID: string;
  issueDate: string;
  issuePlace: string;
  address: string;
}

export class CheckCustomerByIdNoResponseData {
  cifNo: string;
  mnemonic: string;
  role: string;
  homeNumber: string;
  maritalStatus: string;
  crmId: string;
  familyName: string;
  givenName: string;
  middleName: string;
  shortName: string;
  name: string;
  legalId: string;
  legalDocName: string;
  legalIssAuth: string;
  legalIssDate: string;
  legalExpDate: string;
  birthIncorpDate: string;
  birthPlace: string;
  kycind: string;
  nationality: string;
  residence: string;
  gender: string;
  position: string;
  occuDetails: string;
  employersName: string;
  officeAddress: string;
  street: string;
  street_2: string;
  street_3: string;
  street_4: string;
  townCountry: string;
  province: string;
  country: string;
  address_1: string;
  address_2: string;
  address_3: string;
  address_4: string;
  mobileNumber: string;
  email: string;
  mainClass: string;
  sector: string;
  subIndustry: string;
  industry: string;
  target: string;
  customerStatus: string;
  cuStatus: string;
  bankRelation: string;
  companyBook: string;
  accountOfficer: string;
  documentID: string;
  lstLegal: [
    {
      legalId: string;
      legalDocName: string;
      legalIssAuth: string;
      legalIssDate: string;
      legalExpDate: string;
    }
  ];
}
