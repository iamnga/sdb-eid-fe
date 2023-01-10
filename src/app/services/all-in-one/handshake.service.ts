import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { of, Observable } from 'rxjs';
import { map, mergeMap, flatMap } from 'rxjs/operators';
import { CryptoUtils } from 'src/app/all-in-one/shared/utils/cryptoUtils';
import { environment } from 'src/environments/environment';
import { HandShake } from 'src/app/models/aio';
import { Base64Utils } from './base64Utils';
// import { API_BASE_URL } from '@shared/service-proxies/service-proxies';

interface PageSession {
  ssId: string | null;
  pageKey: string | null;
}
let cardProPageSession: PageSession = { ssId: null, pageKey: null };

@Injectable()
export class HandShakeService {
  private sharedSecret: string;
  private sharedSecretBase64: string;
  private ssId: string;
  private isUsingBaseService: boolean;

  constructor(private http: HttpClient) {}

  handShake(data: object, usingBaseService = false) {
    this.isUsingBaseService = usingBaseService;
    return this.doHandShake().pipe(
      mergeMap((ssid) => {
        this.ssId = ssid;
        return CryptoUtils.importKey(
          JSON.stringify({
            kty: 'oct',
            alg: 'A256GCM',
            kid: this.sharedSecret,
            use: 'enc',
            k: this.sharedSecretBase64,
            length: 256,
          }),
          'json'
        )
          .pipe(
            flatMap((pageJWK) => {
              let base64EncodedData = Base64Utils.encode(JSON.stringify(data));
              return CryptoUtils.encrypt(base64EncodedData, pageJWK);
            })
          )
          .pipe(
            map((result) => {
              cardProPageSession.ssId = this.ssId;
              cardProPageSession.pageKey = this.sharedSecret;
              return { data: result, ssId: this.ssId };
            })
          );
      })
    );
  }

  private doHandShake(): Observable<string> {
    // if (
    //   !HandShakeConfig.handshakeForAllRequests &&
    //   cardProPageSession.ssId != null &&
    //   cardProPageSession.pageKey != null
    // )
    if (cardProPageSession.ssId != null && cardProPageSession.pageKey != null) {
      this.sharedSecret = cardProPageSession.pageKey;
      this.sharedSecretBase64 = CryptoUtils.toBase64(this.sharedSecret);
      return of(cardProPageSession.ssId);
    } else {
      this.sharedSecret = CryptoUtils.randomKeyString(32);
      this.sharedSecretBase64 = CryptoUtils.toBase64(this.sharedSecret);
      let pageJWK: any;

      return CryptoUtils.importKey(
        JSON.stringify({
          kty: 'oct',
          alg: 'dir',
          kid: this.sharedSecret,
          k: this.sharedSecretBase64,
          length: 256,
        }),
        'json'
      )
        .pipe(
          mergeMap((jwk) => {
            pageJWK = jwk;
            return CryptoUtils.importKey(environment.publicKey, 'pem');
          })
        )
        .pipe(
          mergeMap((rsaKey) => {
            let sharedSecretBuffer = CryptoUtils.toBufferFromBase64(
              this.sharedSecretBase64
            );
            return CryptoUtils.encrypt(sharedSecretBuffer, rsaKey);
          })
        )
        .pipe(
          mergeMap((encryptedContent) => {
            let handShakeDto = new HandShake();
            handShakeDto.key = encryptedContent;

            return this.http.post(environment.apiUrl, handShakeDto);
          })
        )
        .pipe(
          mergeMap((response: any) =>
            this.doChallenge(response.result, pageJWK)
          )
        );
    }
  }

  private doChallenge(dto: HandShake, pageJWK: any) {
    return CryptoUtils.decryptFromKeyStore(dto.challenge, pageJWK).pipe(
      map((result) => {
        let decryptedKey = result.plaintext.toString();
        if (decryptedKey !== this.sharedSecret) {
          throw new Error('handshake failed');
        }
        return dto.key;
      })
    );
  }
}
