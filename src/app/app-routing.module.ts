import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllInOneComponent } from './all-in-one/all-in-one.component';
import { DashBoardComponent } from './all-in-one/dash-board/dash-board.component';
import { AccountAndAlertComponent } from './all-in-one/on-boarding/account-and-alert/account-and-alert.component';
import { EndComponent } from './all-in-one/on-boarding/end/end.component';

import { OnBoardingComponent } from './all-in-one/on-boarding/on-boarding.component';
import { BackAndStepperComponent } from './all-in-one/shared/back-and-stepper/back-and-stepper.component';
import { CaptureFaceComponent } from './all-in-one/shared/capture-face/capture-face.component';
import { CaptureGuideComponent } from './all-in-one/shared/capture-guide/capture-guide.component';
import { CollectCardIdComponent } from './all-in-one/shared/collect-card-id/collect-card-id.component';
import { FillInfoComponent } from './all-in-one/shared/fill-info/fill-info.component';
import { InputFingerComponent } from './all-in-one/shared/input-finger/input-finger.component';
import { MobileCaptureCardIdComponent } from './all-in-one/shared/mobile-capture-card-id/mobile-capture-card-id.component';
import { SharedComponent } from './all-in-one/shared/shared.component';
import { VerifyCustomerInfoComponent } from './all-in-one/shared/verify-customer-info/verify-customer-info.component';
import { VerifyOtpComponent } from './all-in-one/shared/verify-otp/verify-otp.component';
import { VirtualKeyboardComponent } from './all-in-one/shared/virtual-keyboard/virtual-keyboard.component';
import { RecheckInfoComponent } from './all-in-one/update-card-id/recheck-info/recheck-info.component';
import { UpdateCardIdComponent } from './all-in-one/update-card-id/update-card-id.component';
import { UpdateSuccessComponent } from './all-in-one/update-card-id/update-success/update-success.component';
import { CollectComponent } from './collect/collect.component';
import { HomeComponent } from './home/home.component';
import { MkComponent } from './mk/mk.component';
import { WebcamComponent } from './webcam/webcam.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'collect/:deviceid/:sessionid', component: CollectComponent },
  {
    path: 'aio',
    component: AllInOneComponent,
    children: [
      {
        path: '',
        redirectTo: 'dash-board',
        pathMatch: 'full',
      },
      {
        path: 'dash-board',
        component: DashBoardComponent,
      },
      {
        path: 'on-boarding',
        component: OnBoardingComponent,
      },
      {
        path: 'on-boarding/account-and-alert',
        component: AccountAndAlertComponent,
      },
      {
        path: 'on-boarding/end',
        component: EndComponent,
      },
      {
        path: 'update-card-id/recheck-info',
        component: RecheckInfoComponent,
      },
      {
        path: 'update-card-id',
        component: UpdateCardIdComponent,
      },
      {
        path: 'update-card-id/update-success',
        component: UpdateSuccessComponent,
      },
      {
        path: 'shared',
        component: SharedComponent,
        children: [
          {
            path: 'capture-guide',
            component: CaptureGuideComponent,
          },
          {
            path: 'capture-face',
            component: CaptureFaceComponent,
          },
          {
            path: 'input-finger',
            component: InputFingerComponent,
          },
          {
            path: 'collect-card-id',
            component: CollectCardIdComponent,
          },
          {
            path: 'verify-customer-info',
            component: VerifyCustomerInfoComponent,
          },
          {
            path: 'fill-info',
            component: FillInfoComponent,
          },
          {
            path: 'verify-otp',
            component: VerifyOtpComponent,
          },
          {
            path: 'mobile-capture-card-id/:deviceid/:sessionid',
            component: MobileCaptureCardIdComponent,
          },
          {
            path: 'back-and-stepper',
            component: BackAndStepperComponent,
          },
          {
            path: 'vk',
            component: VirtualKeyboardComponent,
          },
        ],
      },
    ],
  },
  { path: 'webcam', component: WebcamComponent },
  {
    path: 'mk',
    component: MkComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
