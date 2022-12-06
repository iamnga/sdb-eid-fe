import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddressData } from 'src/app/models/aio';
import { AioService } from 'src/app/services/aio.service';

@Component({
  selector: 'app-contact-address',
  templateUrl: './contact-address.component.html',
  styleUrls: ['./contact-address.component.css'],
})
export class ContactAddressComponent implements OnInit {
  title = 'Tỉnh / Thành phố';
  currentPro: AddressData;
  currentDis: AddressData;
  currentWard: AddressData;
  addressDetail: string;
  contactAddress = '';
  step = 1;
  err = '';
  provinces: AddressData[] = [];
  districts: AddressData[] = [];
  wards: AddressData[] = [];
  constructor(
    public dialogRef: MatDialogRef<ContactAddressComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private aioSvc: AioService
  ) {}
  ngOnInit(): void {
    this.getProvinces();
  }

  getProvinces() {
    this.aioSvc.isProcessing = true;
    this.aioSvc.getProvinces().subscribe(
      (res: any) => {
        this.aioSvc.isProcessing = false;
        console.log(res);
        if (res.data.provinces) {
          this.provinces = res.data.provinces;
        } else {
          this.aioSvc.alert(`Có lỗi xảy ra getProvinces`);
        }
      },
      (err) => {
        this.aioSvc.isProcessing = false;
        this.aioSvc.alert(`Có lỗi xảy ra getProvinces ${err}`);
      }
    );
  }

  getDistrict(pro: AddressData) {
    this.currentPro = pro;
    this.aioSvc.isProcessing = true;
    this.districts = [];
    this.aioSvc.getDistricts(pro.id).subscribe(
      (res: any) => {
        this.aioSvc.isProcessing = false;
        console.log(res);
        if (res.data.districts) {
          this.districts = res.data.districts;
        } else {
          this.aioSvc.alert(`Có lỗi xảy ra getDistrict`);
        }
      },
      (err) => {
        this.aioSvc.isProcessing = false;
        this.aioSvc.alert(`Có lỗi xảy ra getDistrict ${err}`);
      }
    );
    this.title = 'Quận / Huyện';
    this.step++;
  }

  getWard(dis: AddressData) {
    this.currentDis = dis;
    this.aioSvc.isProcessing = true;
    this.wards = [];
    this.aioSvc.getWards(dis.id).subscribe(
      (res: any) => {
        this.aioSvc.isProcessing = false;
        if (res.data.wards) {
          this.wards = res.data.wards;
          console.log(this.wards);
        } else {
          this.aioSvc.alert(`Có lỗi xảy ra getWard`);
        }
      },
      (err) => {
        this.aioSvc.isProcessing = false;
        this.aioSvc.alert(`Có lỗi xảy ra getWard ${err}`);
      }
    );
    this.title = 'Phường / Xã';

    this.step++;
  }

  getAddressDetail(wardName: AddressData) {
    this.currentWard = wardName;
    this.title = 'Địa chỉ chi tiết';
    this.step++;
  }

  back() {
    this.step--;
  }

  onChangeEvent(event: any) {
    this.addressDetail = event;
    console.log(event);
  }

  onKeyPressEvent(event: any) {
    console.log(event);
    if (event === '{downkeyboard}') {
      this.dialogRef.close();
    }
    if (event === '{enter}') {
      this.validateAdressDetail();
    }
  }

  validateAdressDetail() {
    if (this.addressDetail) {
      this.err = '';
      this.contactAddress =
        this.addressDetail +
        ', ' +
        this.currentWard.name +
        ', ' +
        this.currentDis.name +
        ', ' +
        this.currentPro.name;

      console.log(this.contactAddress);
      this.dialogRef.close(this.contactAddress);
    } else {
      this.err = 'Vui lòng không bỏ trống';
      this.contactAddress = '';
    }
  }
}
