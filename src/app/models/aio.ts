export class AllInOneRequest<T> {
  refNumber: string;
  refDateTime: string;
  deviceID: string;
  sessionID: string;
  data: T;
}
