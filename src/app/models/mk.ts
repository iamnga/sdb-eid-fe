export class FingerResponse {
  type: number;
  image: string;
  quality: number;
  verifyResponse: VerifyResponse;
  icaoResponse: ICaoResponse;
}

class VerifyResponse {
  success: boolean;
  code: number;
  message: string;
  data: string;
}

class ICaoResponse {
  success: boolean;
  code: number;
  message: string;
  data: ICaoResponseData;
}

class ICaoResponseData {
  docNumber: string;
  name: string;
  dateOfBirth: string;
  validTo: string;
  dateOfIssuance: string;
  gender: string;
  faceImage: string;
  fingerImages: string;
  dg13: Dg13Data;
  validationResult: ValidationResult;
}

class Dg13Data {
  idCardNo: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  ethnic: string;
  religion: string;
  placeOfOrigin: string;
  residenceAddress: string;
  personalSpecificIdentification: string;
  dateOfIssuance: string;
  dateOfExpiry: string;
  motherName: string;
  fatherName: string;
  spouseName: string;
  oldIdCardNumber: string;
  chipId: string;
}

class ValidationResult {
  aa: boolean;
  pa: boolean;
  ca: boolean;
}

export class BankData {
  bankTransactionId: string;
  bankAppId: number; // 1- ATM, 2- counter, 3 - eZone, ...
  extendedInfo: string;
  transactionCode: number;
}

export class ReadCardRequest {
  image: string;
  bankData: BankData;
}
