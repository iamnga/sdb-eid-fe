import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Service } from '../../models/enum';
import { AioService } from './aio.service';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor(private aioSvc: AioService) {}
}
