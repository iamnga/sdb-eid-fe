import * as JsEncryptModule from 'jsencrypt';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import * as jose from 'node-jose';
import { Observable, of, from } from 'rxjs';
import { mergeMap, flatMap } from 'rxjs/operators';
import { KEYUTIL, KJUR } from 'jsrsasign';
export default class Utils {
  static issPlace = 'CTCCSQLHCVTTXH';
  static encryptMod = new JsEncryptModule.JSEncrypt();

  static sign(plainText: string): Observable<any> {
    console.log(Buffer.from(plainText));
    return this.importKey().pipe(
      mergeMap((jwk) => {
        console.log(jwk);
        return jose.JWS.createSign(
          {
            alg: 'RS256',
            format: 'compact',
          },
          jwk
        )
          .update(Buffer.from(plainText))
          .final();
      })
    );
  }

  static sign2(plainText: string) {
    let sig = new KJUR.crypto.Signature({ alg: 'SHA256withRSA' });
    sig.init(environment.privateKey);
    sig.updateString(plainText);
    let sigHex = sig.sign();

    console.log('sigHex', sigHex);
  }

  static sign3(plainText: string) {
    let encryptMod = new JsEncryptModule.JSEncrypt({
      default_key_size: '2048',
    });
    encryptMod.setPrivateKey(environment.privateKey);
    return encryptMod.sign(plainText, this.SHA256, 'sha256');
  }

  static SHA256(str: string): string {
    return CryptoJS.SHA256(str).toString(CryptoJS.enc.Base64);
  }
  public static importKey(): Observable<any> {
    return from(jose.JWK.asKey(environment.privateKey, 'pem'));
  }

  static encrypt(signText: string) {
    this.encryptMod.setPublicKey(environment.publicKey);
    return this.encryptMod.encrypt(signText);
  }

  static decrypt(cypherText: string) {
    this.encryptMod.setPrivateKey(environment.privateKey);
    return this.encryptMod.decrypt(cypherText);
  }

  static randomId(length: number) {
    var result = '';
    var characters = '0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  //dd/MM/yyyy => yyyyMMdd
  static formatDate(date: string) {
    let arr = date.split('/');
    return arr[2] + arr[1] + arr[0];
  }

  //yyyyMMdd => dd/MM/yyyy
  static strToDate(date: string) {
    let year = date.slice(0, 4);
    let month = date.slice(4, 6);
    let day = date.slice(6, 8);
    return [day, month, year].join('/');
  }
}
