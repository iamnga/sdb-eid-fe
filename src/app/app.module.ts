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
import { DashBoardComponent } from './all-in-one/dash-board/dash-board.component';
import { InputMobileNumberComponent } from './all-in-one/shared/input-mobile-number/input-mobile-number.component';
import { VerifyCustomerInfoComponent } from './all-in-one/shared/verify-customer-info/verify-customer-info.component';
import { FillInfoComponent } from './all-in-one/on-boarding/fill-info/fill-info.component';
import { AccountAndAlertComponent } from './all-in-one/on-boarding/account-and-alert/account-and-alert.component';
import { VerifyOtpComponent } from './all-in-one/shared/verify-otp/verify-otp.component';
import { EndComponent } from './all-in-one/on-boarding/end/end.component';
import { CollectCardIdComponent } from './all-in-one/shared/collect-card-id/collect-card-id.component';
import { UpdateCardIdComponent } from './all-in-one/update-card-id/update-card-id.component';
import { WebcamComponent } from './webcam/webcam.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { HeaderComponent } from './all-in-one/shared/header/header.component';
import { MobileCaptureCardIdComponent } from './all-in-one/shared/mobile-capture-card-id/mobile-capture-card-id.component';
import { SharedComponent } from './all-in-one/shared/shared.component';
import { MkComponent } from './mk/mk.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AioService } from './services/aio.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BackAndStepperComponent } from './all-in-one/shared/back-and-stepper/back-and-stepper.component';
import { CaptureGuideComponent } from './all-in-one/shared/capture-guide/capture-guide.component';
import { KeyboardNumberComponent } from './all-in-one/shared/keyboard-number/keyboard-number.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CollectComponent,
    OnBoardingComponent,
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
    UpdateCardIdComponent,
    WebcamComponent,
    HeaderComponent,
    MobileCaptureCardIdComponent,
    SharedComponent,
    MkComponent,
    BackAndStepperComponent,
    CaptureGuideComponent,
    KeyboardNumberComponent,
  ],
  imports: [
    SlickCarouselModule,
    BrowserModule,
    AppRoutingModule,
    QRCodeModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
  providers: [
    WebsocketService,
    AioService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
