import {
  Component,
  OnInit,
  Inject,
  AfterViewInit,
  ChangeDetectorRef,
  AfterContentInit,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddressData, AddressInfo } from 'src/app/models/aio';
import { AioService } from 'src/app/services/all-in-one/aio.service';

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
  addressInfo = new AddressInfo();
  addressDetail: string;
  contactAddress = '';
  step = 1;
  err = '';
  provinces: AddressData[] = [];
  districts: AddressData[] = [];
  wards: AddressData[] = [];
  constructor(
    public dialogRef: MatDialogRef<ContactAddressComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddressData[],
    private aioSvc: AioService
  ) {}

  ngOnInit() {
    this.provinces = this.data;
  }

  getDistrict(pro: AddressData) {
    this.currentPro = pro;
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
    if (this.addressDetail && this.addressDetail.length > 5) {
      this.err = '';

      this.addressInfo.provinceCode = this.currentPro.code;
      this.addressInfo.provinceName = this.currentPro.name;
      this.addressInfo.districtCode = this.currentDis.code;
      this.addressInfo.districtName = this.currentDis.name;
      this.addressInfo.wardCode = this.currentWard.code;
      this.addressInfo.wardName = this.currentWard.name;
      this.addressInfo.street = this.addressDetail;

      this.dialogRef.close(this.addressInfo);
    } else {
      this.err = 'Địa chỉ tối thiểu 6 ký tự';
      this.contactAddress = '';
    }
  }
}
