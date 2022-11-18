import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { QRCodeModule } from 'angularx-qrcode';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CollectComponent } from './collect/collect.component';
import { WebsocketService } from './services/websocket.service';
import { OnBoardingComponent } from './all-in-one/on-boarding/on-boarding.component';
import { AllInOneComponent } from './all-in-one/all-in-one.component';
import { InputFingerComponent } from './all-in-one/shared/input-finger/input-finger.component';
import { CaptureFaceComponent } from './all-in-one/shared/capture-face/capture-face.component';
import { InputCardIdComponent } from './all-in-one/shared/input-card-id/input-card-id.component';
import { DashBoardComponent } from './all-in-one/dash-board/dash-board.component';
import { CollectCardIdComponent } from './all-in-one/on-boarding/collect-card-id/collect-card-id.component';
import { InputMobileNumberComponent } from './all-in-one/shared/input-mobile-number/input-mobile-number.component';
import { VerifyCustomerInfoComponent } from './all-in-one/shared/verify-customer-info/verify-customer-info.component';
import { FillInfoComponent } from './all-in-one/on-boarding/fill-info/fill-info.component';
import { AccountAndAlertComponent } from './all-in-one/on-boarding/account-and-alert/account-and-alert.component';
import { VerifyOtpComponent } from './all-in-one/shared/verify-otp/verify-otp.component';
import { EndComponent } from './all-in-one/on-boarding/end/end.component';
import { FeedBackComponent } from './all-in-one/shared/feed-back/feed-back.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CollectComponent,
    OnBoardingComponent,
    InputCardIdComponent,
    CaptureFaceComponent,
    InputFingerComponent,
    AllInOneComponent,
    DashBoardComponent,
    CollectCardIdComponent,
    InputMobileNumberComponent,
    VerifyCustomerInfoComponent,
    FillInfoComponent,
    AccountAndAlertComponent,
    VerifyOtpComponent,
    EndComponent,
    FeedBackComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, QRCodeModule, HttpClientModule],
  providers: [WebsocketService],
  bootstrap: [AppComponent],
})
export class AppModule {}
