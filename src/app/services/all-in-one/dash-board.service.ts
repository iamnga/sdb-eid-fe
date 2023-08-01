import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Service } from 'src/app/models/enum';
import { AioService } from './aio.service';

@Injectable({
  providedIn: 'root',
})
export class DashBoardService {
  constructor(private aioSvc: AioService) {}
  getSessionId(): Observable<any> {
    let req = this.aioSvc.newRequest({
      serviceCode: Service[this.aioSvc.currentSerice],
    });

    console.log(req.toString());

    return this.aioSvc.postAsync('get-sessionId', req);
    //return this.aioSvc.testProxy('hello');
  }
}
