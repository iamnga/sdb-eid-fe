import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AioService } from 'src/app/services/aio.service';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-mobile-capture-card-id',
  templateUrl: './mobile-capture-card-id.component.html',
  styleUrls: ['./mobile-capture-card-id.component.css'],
})
export class MobileCaptureCardIdComponent implements OnInit {
  step = 0;
  deviceID = '';
  sessionID = '';
  front = '';
  back = '';
  imageChangedEvent: any = '';
  croppedImage: any = '';
  modalRef?: BsModalRef;
  modalRef2?: BsModalRef;
  hasChange = false;
  canvasRotation = 0;
  cropTimes = 0;
  alertMsg = '';
  loadErr = false;
  @ViewChild('alertModal') alertModal: TemplateRef<HTMLDivElement>;
  alertModalRef: BsModalRef;

  constructor(
    private actRoute: ActivatedRoute,
    private aioSvc: AioService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService
  ) {
    this.deviceID = this.actRoute.snapshot.params['deviceid'];
    this.sessionID = this.actRoute.snapshot.params['sessionid'];
  }

  ngOnInit() {
    this.aioSvc.isProcessing = true;
    this.aioSvc.verifySessionID(this.deviceID, this.sessionID).subscribe(
      (res: any) => {
        if (res.respCode == '00') {
          this.step++;
          this.aioSvc.isProcessing = false;
        } else {
          this.loadErr = true;
          this.alert(`Có lỗi xảy ra verifySessionID`);
          this.aioSvc.isProcessing = false;
        }
        console.log(res);
      },
      (err) => {
        this.loadErr = true;
        this.alert(`Có lỗi xảy ra verifySessionID`);
        this.aioSvc.isProcessing = false;
      }
    );
  }

  imageCropped(event: ImageCroppedEvent) {
    this.hasChange = this.cropTimes == 0 ? false : true;
    this.croppedImage = event.base64;
    this.cropTimes++;
  }
  imageLoaded(image: LoadedImage) {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  resetImg() {
    this.canvasRotation = 0;
    this.cropTimes = 0;
    this.hasChange = false;
  }

  done() {
    if (this.step == 2) {
      this.front = this.croppedImage;
    } else {
      this.back = this.croppedImage;
    }
    this.canvasRotation = 0;
    this.hasChange = false;
    this.closeModal();
  }

  getBase64ToEdit() {
    if (this.step == 2) {
      return this.front;
    } else {
      return this.back;
    }
  }

  handleInputChange(e: any) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    if (file) {
      var pattern = /image-*/;
      var reader = new FileReader();
      if (!file.type.match(pattern)) {
        alert('invalid format');
        return;
      }
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsDataURL(file);
    }
  }
  _handleReaderLoaded(e: any) {
    let reader = e.target;
    if (this.step == 2) {
      this.front = reader.result;
    }
    if (this.step == 3) {
      this.back = reader.result;
    }
    console.log(reader.result);
  }

  edit(template: TemplateRef<any>) {
    if (this.front != '' && this.step == 2) {
      this.modalRef = this.modalService.show(template, { id: 1 });
      this.modalRef.setClass('full-screen-modal');
    } else if (this.back != '' && this.step == 3) {
      this.modalRef = this.modalService.show(template, { id: 1 });
      this.modalRef.setClass('full-screen-modal');
    } else {
      return;
    }
  }

  discard(template: TemplateRef<any>) {
    if (this.hasChange) {
      this.modalRef2 = this.modalService.show(template, { id: 2 });
      this.modalRef2.setClass('confirm-discard-modal');
    } else {
      this.closeModal();
    }
  }

  closeModal(id?: number) {
    this.modalService.hide(id);
    if (!id) {
      this.hasChange = false;
    }
  }

  rotateLeft() {
    this.canvasRotation--;
    this.hasChange = true;
  }

  next() {
    switch (this.step) {
      case 1: {
        this.step++;
        break;
      }
      case 2: {
        if (this.front) {
          this.step++;
        } else {
          this.alert('Quý khách vui lòng cung cấp ảnh mặt trước CCCD ');
        }
        break;
      }
      case 3: {
        if (this.back) {
          // Send to BE
          this.aioSvc.isProcessing = true;
          this.aioSvc
            .uploadImage(this.front, 'front', this.deviceID, this.sessionID)
            .subscribe(
              (res: any) => {
                if (res.respCode == '00') {
                  console.log('Upload front', res);

                  this.aioSvc
                    .uploadImage(
                      this.back,
                      'back',
                      this.deviceID,
                      this.sessionID
                    )
                    .subscribe(
                      (res: any) => {
                        if (res.respCode == '00') {
                          console.log('Upload back', res);
                          this.aioSvc.isProcessing = false;
                          this.step++;
                        } else {
                          this.alert(`Có lỗi xảy ra uploadImage-back`);

                          this.aioSvc.isProcessing = false;
                          return;
                        }
                      },
                      (err) => {
                        this.alert(`Có lỗi xảy ra uploadImage-back`);
                        console.log(err);
                        this.aioSvc.isProcessing = false;
                        return;
                      }
                    );
                } else {
                  this.alert(`Có lỗi xảy ra uploadImage-Front`);

                  this.aioSvc.isProcessing = false;
                  return;
                }
              },
              (err) => {
                this.alert(`Có lỗi xảy ra uploadImage-Front`);
                console.log(err);
                this.aioSvc.isProcessing = false;
                return;
              }
            );
          console.log('Front: ', this.front);
          console.log('Back: ', this.back);
        } else {
          this.alert('Quý khách vui lòng cung cấp ảnh mặt sau CCCD ');
        }
        break;
      }
      default:
        break;
    }
  }

  previous() {
    this.step--;
  }

  alert(msg: string) {
    this.alertMsg = msg;
    this.alertModalRef = this.modalService.show(this.alertModal);
  }
}
