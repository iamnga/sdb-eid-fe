import * as jose from 'node-jose';
import { Observable, of, from } from 'rxjs';

const characters: string =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const digits: string = '0123456789';

export class CryptoUtils {
  constructor() {}

  public static importKey(input: any, format: any): Observable<any> {
    return from(jose.JWK.asKey(input, format));
  }

  public static generateKey(
    keyType: string,
    keyLength: any,
    properties: any
  ): Observable<any> {
    let keystore = jose.JWK.createKeyStore();
    return from(keystore.generate(keyType, keyLength, properties));
  }

  public static encrypt(input: any, key: any): Observable<any> {
    return from(
      jose.JWE.createEncrypt({ format: 'compact' }, key).update(input).final()
    );
  }

  public static decryptFromKeyStore(
    input: any,
    keyStore: any
  ): Observable<any> {
    return from(jose.JWE.createDecrypt(keyStore).decrypt(input));
  }

  public static toBufferFromBase64(input: any): Buffer {
    return jose.util.base64url.decode(input);
  }

  public static toBase64(input: string) {
    return jose.util.base64url.encode(input, 'utf8');
  }

  public static toBase64FromBuffer(input: any) {
    return jose.util.base64url.encode(input);
  }

  public static randomKeyBuffer(size: number) {
    return jose.util.randomBytes(size);
  }

  public static randomKeyString(size: number) {
    return Array(size)
      .join()
      .split(',')
      .map(function () {
        return characters.charAt(Math.floor(Math.random() * characters.length));
      })
      .join('');
  }

  public static randomNumberString(size: number) {
    return Array(size)
      .join()
      .split(',')
      .map(function () {
        return digits.charAt(Math.floor(Math.random() * digits.length));
      })
      .join('');
  }

  public static AesGcmDecrypt(key: any, cipherText: any): Observable<any> {
    return from(jose.JWA.decrypt('A256GCMKW', key, cipherText));
  }

  public static AesGcmEncrypt(key: any, plainText: any): Observable<any> {
    return from(jose.JWA.encrypt('A256GCMKW', key, plainText));
  }
}
