import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-contact-address',
  templateUrl: './contact-address.component.html',
  styleUrls: ['./contact-address.component.css'],
})
export class ContactAddressComponent implements OnInit {
  title = 'Tỉnh / Thành phố';
  currentPro: string;
  currentDis: string;
  currentWard: string;
  addressDetail: string;
  contactAddress = '';
  step = 1;
  err = '';
  constructor(
    public dialogRef: MatDialogRef<ContactAddressComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}
  ngOnInit(): void {}

  getDistrict(proCode: string) {
    this.currentPro = proCode;
    this.title = 'Quận / Huyện';
    this.step++;
  }

  getWard(disCode: string) {
    this.currentDis = disCode;
    this.title = 'Phường / Xã';

    this.step++;
  }

  getAddressDetail(wardCode: string) {
    this.currentWard = wardCode;
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
      this.dialogRef.close(this.data);
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
        this.currentWard +
        ', ' +
        this.currentDis +
        ', ' +
        this.currentPro;

      console.log(this.contactAddress);
      this.dialogRef.close(this.contactAddress);
    } else {
      this.err = 'Vui lòng không bỏ trống';
      this.contactAddress = '';
    }
  }

  provinces = [
    {
      name: 'Thành phố Hà Nội',
      code: 1,
      division_type: 'thành phố trung ương',
      codename: 'thanh_pho_ha_noi',
      phone_code: 24,
      districts: [],
    },
    {
      name: 'Tỉnh Hà Giang',
      code: 2,
      division_type: 'tỉnh',
      codename: 'tinh_ha_giang',
      phone_code: 219,
      districts: [],
    },
    {
      name: 'Tỉnh Cao Bằng',
      code: 4,
      division_type: 'tỉnh',
      codename: 'tinh_cao_bang',
      phone_code: 206,
      districts: [],
    },
    {
      name: 'Tỉnh Bắc Kạn',
      code: 6,
      division_type: 'tỉnh',
      codename: 'tinh_bac_kan',
      phone_code: 209,
      districts: [],
    },
    {
      name: 'Tỉnh Tuyên Quang',
      code: 8,
      division_type: 'tỉnh',
      codename: 'tinh_tuyen_quang',
      phone_code: 207,
      districts: [],
    },
    {
      name: 'Tỉnh Lào Cai',
      code: 10,
      division_type: 'tỉnh',
      codename: 'tinh_lao_cai',
      phone_code: 214,
      districts: [],
    },
    {
      name: 'Tỉnh Điện Biên',
      code: 11,
      division_type: 'tỉnh',
      codename: 'tinh_dien_bien',
      phone_code: 215,
      districts: [],
    },
    {
      name: 'Tỉnh Lai Châu',
      code: 12,
      division_type: 'tỉnh',
      codename: 'tinh_lai_chau',
      phone_code: 213,
      districts: [],
    },
    {
      name: 'Tỉnh Sơn La',
      code: 14,
      division_type: 'tỉnh',
      codename: 'tinh_son_la',
      phone_code: 212,
      districts: [],
    },
    {
      name: 'Tỉnh Yên Bái',
      code: 15,
      division_type: 'tỉnh',
      codename: 'tinh_yen_bai',
      phone_code: 216,
      districts: [],
    },
    {
      name: 'Tỉnh Hoà Bình',
      code: 17,
      division_type: 'tỉnh',
      codename: 'tinh_hoa_binh',
      phone_code: 218,
      districts: [],
    },
    {
      name: 'Tỉnh Thái Nguyên',
      code: 19,
      division_type: 'tỉnh',
      codename: 'tinh_thai_nguyen',
      phone_code: 208,
      districts: [],
    },
    {
      name: 'Tỉnh Lạng Sơn',
      code: 20,
      division_type: 'tỉnh',
      codename: 'tinh_lang_son',
      phone_code: 205,
      districts: [],
    },
    {
      name: 'Tỉnh Quảng Ninh',
      code: 22,
      division_type: 'tỉnh',
      codename: 'tinh_quang_ninh',
      phone_code: 203,
      districts: [],
    },
    {
      name: 'Tỉnh Bắc Giang',
      code: 24,
      division_type: 'tỉnh',
      codename: 'tinh_bac_giang',
      phone_code: 204,
      districts: [],
    },
    {
      name: 'Tỉnh Phú Thọ',
      code: 25,
      division_type: 'tỉnh',
      codename: 'tinh_phu_tho',
      phone_code: 210,
      districts: [],
    },
    {
      name: 'Tỉnh Vĩnh Phúc',
      code: 26,
      division_type: 'tỉnh',
      codename: 'tinh_vinh_phuc',
      phone_code: 211,
      districts: [],
    },
    {
      name: 'Tỉnh Bắc Ninh',
      code: 27,
      division_type: 'tỉnh',
      codename: 'tinh_bac_ninh',
      phone_code: 222,
      districts: [],
    },
    {
      name: 'Tỉnh Hải Dương',
      code: 30,
      division_type: 'tỉnh',
      codename: 'tinh_hai_duong',
      phone_code: 220,
      districts: [],
    },
    {
      name: 'Thành phố Hải Phòng',
      code: 31,
      division_type: 'thành phố trung ương',
      codename: 'thanh_pho_hai_phong',
      phone_code: 225,
      districts: [],
    },
    {
      name: 'Tỉnh Hưng Yên',
      code: 33,
      division_type: 'tỉnh',
      codename: 'tinh_hung_yen',
      phone_code: 221,
      districts: [],
    },
    {
      name: 'Tỉnh Thái Bình',
      code: 34,
      division_type: 'tỉnh',
      codename: 'tinh_thai_binh',
      phone_code: 227,
      districts: [],
    },
    {
      name: 'Tỉnh Hà Nam',
      code: 35,
      division_type: 'tỉnh',
      codename: 'tinh_ha_nam',
      phone_code: 226,
      districts: [],
    },
    {
      name: 'Tỉnh Nam Định',
      code: 36,
      division_type: 'tỉnh',
      codename: 'tinh_nam_dinh',
      phone_code: 228,
      districts: [],
    },
    {
      name: 'Tỉnh Ninh Bình',
      code: 37,
      division_type: 'tỉnh',
      codename: 'tinh_ninh_binh',
      phone_code: 229,
      districts: [],
    },
    {
      name: 'Tỉnh Thanh Hóa',
      code: 38,
      division_type: 'tỉnh',
      codename: 'tinh_thanh_hoa',
      phone_code: 237,
      districts: [],
    },
    {
      name: 'Tỉnh Nghệ An',
      code: 40,
      division_type: 'tỉnh',
      codename: 'tinh_nghe_an',
      phone_code: 238,
      districts: [],
    },
    {
      name: 'Tỉnh Hà Tĩnh',
      code: 42,
      division_type: 'tỉnh',
      codename: 'tinh_ha_tinh',
      phone_code: 239,
      districts: [],
    },
    {
      name: 'Tỉnh Quảng Bình',
      code: 44,
      division_type: 'tỉnh',
      codename: 'tinh_quang_binh',
      phone_code: 232,
      districts: [],
    },
    {
      name: 'Tỉnh Quảng Trị',
      code: 45,
      division_type: 'tỉnh',
      codename: 'tinh_quang_tri',
      phone_code: 233,
      districts: [],
    },
    {
      name: 'Tỉnh Thừa Thiên Huế',
      code: 46,
      division_type: 'tỉnh',
      codename: 'tinh_thua_thien_hue',
      phone_code: 234,
      districts: [],
    },
    {
      name: 'Thành phố Đà Nẵng',
      code: 48,
      division_type: 'thành phố trung ương',
      codename: 'thanh_pho_da_nang',
      phone_code: 236,
      districts: [],
    },
    {
      name: 'Tỉnh Quảng Nam',
      code: 49,
      division_type: 'tỉnh',
      codename: 'tinh_quang_nam',
      phone_code: 235,
      districts: [],
    },
    {
      name: 'Tỉnh Quảng Ngãi',
      code: 51,
      division_type: 'tỉnh',
      codename: 'tinh_quang_ngai',
      phone_code: 255,
      districts: [],
    },
    {
      name: 'Tỉnh Bình Định',
      code: 52,
      division_type: 'tỉnh',
      codename: 'tinh_binh_dinh',
      phone_code: 256,
      districts: [],
    },
    {
      name: 'Tỉnh Phú Yên',
      code: 54,
      division_type: 'tỉnh',
      codename: 'tinh_phu_yen',
      phone_code: 257,
      districts: [],
    },
    {
      name: 'Tỉnh Khánh Hòa',
      code: 56,
      division_type: 'tỉnh',
      codename: 'tinh_khanh_hoa',
      phone_code: 258,
      districts: [],
    },
    {
      name: 'Tỉnh Ninh Thuận',
      code: 58,
      division_type: 'tỉnh',
      codename: 'tinh_ninh_thuan',
      phone_code: 259,
      districts: [],
    },
    {
      name: 'Tỉnh Bình Thuận',
      code: 60,
      division_type: 'tỉnh',
      codename: 'tinh_binh_thuan',
      phone_code: 252,
      districts: [],
    },
    {
      name: 'Tỉnh Kon Tum',
      code: 62,
      division_type: 'tỉnh',
      codename: 'tinh_kon_tum',
      phone_code: 260,
      districts: [],
    },
    {
      name: 'Tỉnh Gia Lai',
      code: 64,
      division_type: 'tỉnh',
      codename: 'tinh_gia_lai',
      phone_code: 269,
      districts: [],
    },
    {
      name: 'Tỉnh Đắk Lắk',
      code: 66,
      division_type: 'tỉnh',
      codename: 'tinh_dak_lak',
      phone_code: 262,
      districts: [],
    },
    {
      name: 'Tỉnh Đắk Nông',
      code: 67,
      division_type: 'tỉnh',
      codename: 'tinh_dak_nong',
      phone_code: 261,
      districts: [],
    },
    {
      name: 'Tỉnh Lâm Đồng',
      code: 68,
      division_type: 'tỉnh',
      codename: 'tinh_lam_dong',
      phone_code: 263,
      districts: [],
    },
    {
      name: 'Tỉnh Bình Phước',
      code: 70,
      division_type: 'tỉnh',
      codename: 'tinh_binh_phuoc',
      phone_code: 271,
      districts: [],
    },
    {
      name: 'Tỉnh Tây Ninh',
      code: 72,
      division_type: 'tỉnh',
      codename: 'tinh_tay_ninh',
      phone_code: 276,
      districts: [],
    },
    {
      name: 'Tỉnh Bình Dương',
      code: 74,
      division_type: 'tỉnh',
      codename: 'tinh_binh_duong',
      phone_code: 274,
      districts: [],
    },
    {
      name: 'Tỉnh Đồng Nai',
      code: 75,
      division_type: 'tỉnh',
      codename: 'tinh_dong_nai',
      phone_code: 251,
      districts: [],
    },
    {
      name: 'Tỉnh Bà Rịa - Vũng Tàu',
      code: 77,
      division_type: 'tỉnh',
      codename: 'tinh_ba_ria_vung_tau',
      phone_code: 254,
      districts: [],
    },
    {
      name: 'Thành phố Hồ Chí Minh',
      code: 79,
      division_type: 'thành phố trung ương',
      codename: 'thanh_pho_ho_chi_minh',
      phone_code: 28,
      districts: [],
    },
    {
      name: 'Tỉnh Long An',
      code: 80,
      division_type: 'tỉnh',
      codename: 'tinh_long_an',
      phone_code: 272,
      districts: [],
    },
    {
      name: 'Tỉnh Tiền Giang',
      code: 82,
      division_type: 'tỉnh',
      codename: 'tinh_tien_giang',
      phone_code: 273,
      districts: [],
    },
    {
      name: 'Tỉnh Bến Tre',
      code: 83,
      division_type: 'tỉnh',
      codename: 'tinh_ben_tre',
      phone_code: 275,
      districts: [],
    },
    {
      name: 'Tỉnh Trà Vinh',
      code: 84,
      division_type: 'tỉnh',
      codename: 'tinh_tra_vinh',
      phone_code: 294,
      districts: [],
    },
    {
      name: 'Tỉnh Vĩnh Long',
      code: 86,
      division_type: 'tỉnh',
      codename: 'tinh_vinh_long',
      phone_code: 270,
      districts: [],
    },
    {
      name: 'Tỉnh Đồng Tháp',
      code: 87,
      division_type: 'tỉnh',
      codename: 'tinh_dong_thap',
      phone_code: 277,
      districts: [],
    },
    {
      name: 'Tỉnh An Giang',
      code: 89,
      division_type: 'tỉnh',
      codename: 'tinh_an_giang',
      phone_code: 296,
      districts: [],
    },
    {
      name: 'Tỉnh Kiên Giang',
      code: 91,
      division_type: 'tỉnh',
      codename: 'tinh_kien_giang',
      phone_code: 297,
      districts: [],
    },
    {
      name: 'Thành phố Cần Thơ',
      code: 92,
      division_type: 'thành phố trung ương',
      codename: 'thanh_pho_can_tho',
      phone_code: 292,
      districts: [],
    },
    {
      name: 'Tỉnh Hậu Giang',
      code: 93,
      division_type: 'tỉnh',
      codename: 'tinh_hau_giang',
      phone_code: 293,
      districts: [],
    },
    {
      name: 'Tỉnh Sóc Trăng',
      code: 94,
      division_type: 'tỉnh',
      codename: 'tinh_soc_trang',
      phone_code: 299,
      districts: [],
    },
    {
      name: 'Tỉnh Bạc Liêu',
      code: 95,
      division_type: 'tỉnh',
      codename: 'tinh_bac_lieu',
      phone_code: 291,
      districts: [],
    },
    {
      name: 'Tỉnh Cà Mau',
      code: 96,
      division_type: 'tỉnh',
      codename: 'tinh_ca_mau',
      phone_code: 290,
      districts: [],
    },
  ];

  districts = [
    {
      name: 'Quận Ba Đình',
      code: 1,
      division_type: 'quận',
      codename: 'quan_ba_dinh',
      province_code: 1,
      wards: [],
    },
    {
      name: 'Quận Hoàn Kiếm',
      code: 2,
      division_type: 'quận',
      codename: 'quan_hoan_kiem',
      province_code: 1,
      wards: [],
    },
    {
      name: 'Quận Tây Hồ',
      code: 3,
      division_type: 'quận',
      codename: 'quan_tay_ho',
      province_code: 1,
      wards: [],
    },
    {
      name: 'Quận Long Biên',
      code: 4,
      division_type: 'quận',
      codename: 'quan_long_bien',
      province_code: 1,
      wards: [],
    },
    {
      name: 'Quận Cầu Giấy',
      code: 5,
      division_type: 'quận',
      codename: 'quan_cau_giay',
      province_code: 1,
      wards: [],
    },
    {
      name: 'Quận Đống Đa',
      code: 6,
      division_type: 'quận',
      codename: 'quan_dong_da',
      province_code: 1,
      wards: [],
    },
    {
      name: 'Quận Hai Bà Trưng',
      code: 7,
      division_type: 'quận',
      codename: 'quan_hai_ba_trung',
      province_code: 1,
      wards: [],
    },
    {
      name: 'Quận Hoàng Mai',
      code: 8,
      division_type: 'quận',
      codename: 'quan_hoang_mai',
      province_code: 1,
      wards: [],
    },
    {
      name: 'Quận Thanh Xuân',
      code: 9,
      division_type: 'quận',
      codename: 'quan_thanh_xuan',
      province_code: 1,
      wards: [],
    },
    {
      name: 'Huyện Sóc Sơn',
      code: 16,
      division_type: 'huyện',
      codename: 'huyen_soc_son',
      province_code: 1,
      wards: [],
    },
    {
      name: 'Huyện Đông Anh',
      code: 17,
      division_type: 'huyện',
      codename: 'huyen_dong_anh',
      province_code: 1,
      wards: [],
    },
    {
      name: 'Huyện Gia Lâm',
      code: 18,
      division_type: 'huyện',
      codename: 'huyen_gia_lam',
      province_code: 1,
      wards: [],
    },
    {
      name: 'Quận Nam Từ Liêm',
      code: 19,
      division_type: 'quận',
      codename: 'quan_nam_tu_liem',
      province_code: 1,
      wards: [],
    },
    {
      name: 'Huyện Thanh Trì',
      code: 20,
      division_type: 'huyện',
      codename: 'huyen_thanh_tri',
      province_code: 1,
      wards: [],
    },
    {
      name: 'Quận Bắc Từ Liêm',
      code: 21,
      division_type: 'quận',
      codename: 'quan_bac_tu_liem',
      province_code: 1,
      wards: [],
    },
    {
      name: 'Huyện Mê Linh',
      code: 250,
      division_type: 'huyện',
      codename: 'huyen_me_linh',
      province_code: 1,
      wards: [],
    },
    {
      name: 'Quận Hà Đông',
      code: 268,
      division_type: 'quận',
      codename: 'quan_ha_dong',
      province_code: 1,
      wards: [],
    },
    {
      name: 'Thị xã Sơn Tây',
      code: 269,
      division_type: 'thị xã',
      codename: 'thi_xa_son_tay',
      province_code: 1,
      wards: [],
    },
    {
      name: 'Huyện Ba Vì',
      code: 271,
      division_type: 'huyện',
      codename: 'huyen_ba_vi',
      province_code: 1,
      wards: [],
    },
    {
      name: 'Huyện Phúc Thọ',
      code: 272,
      division_type: 'huyện',
      codename: 'huyen_phuc_tho',
      province_code: 1,
      wards: [],
    },
    {
      name: 'Huyện Đan Phượng',
      code: 273,
      division_type: 'huyện',
      codename: 'huyen_dan_phuong',
      province_code: 1,
      wards: [],
    },
    {
      name: 'Huyện Hoài Đức',
      code: 274,
      division_type: 'huyện',
      codename: 'huyen_hoai_duc',
      province_code: 1,
      wards: [],
    },
    {
      name: 'Huyện Quốc Oai',
      code: 275,
      division_type: 'huyện',
      codename: 'huyen_quoc_oai',
      province_code: 1,
      wards: [],
    },
    {
      name: 'Huyện Thạch Thất',
      code: 276,
      division_type: 'huyện',
      codename: 'huyen_thach_that',
      province_code: 1,
      wards: [],
    },
    {
      name: 'Huyện Chương Mỹ',
      code: 277,
      division_type: 'huyện',
      codename: 'huyen_chuong_my',
      province_code: 1,
      wards: [],
    },
    {
      name: 'Huyện Thanh Oai',
      code: 278,
      division_type: 'huyện',
      codename: 'huyen_thanh_oai',
      province_code: 1,
      wards: [],
    },
    {
      name: 'Huyện Thường Tín',
      code: 279,
      division_type: 'huyện',
      codename: 'huyen_thuong_tin',
      province_code: 1,
      wards: [],
    },
    {
      name: 'Huyện Phú Xuyên',
      code: 280,
      division_type: 'huyện',
      codename: 'huyen_phu_xuyen',
      province_code: 1,
      wards: [],
    },
    {
      name: 'Huyện Ứng Hòa',
      code: 281,
      division_type: 'huyện',
      codename: 'huyen_ung_hoa',
      province_code: 1,
      wards: [],
    },
    {
      name: 'Huyện Mỹ Đức',
      code: 282,
      division_type: 'huyện',
      codename: 'huyen_my_duc',
      province_code: 1,
      wards: [],
    },
  ];

  wards = [
    {
      name: 'Phường Phúc Xá',
      code: 1,
      division_type: 'phường',
      codename: 'phuong_phuc_xa',
      district_code: 1,
    },
    {
      name: 'Phường Trúc Bạch',
      code: 4,
      division_type: 'phường',
      codename: 'phuong_truc_bach',
      district_code: 1,
    },
    {
      name: 'Phường Vĩnh Phúc',
      code: 6,
      division_type: 'phường',
      codename: 'phuong_vinh_phuc',
      district_code: 1,
    },
    {
      name: 'Phường Cống Vị',
      code: 7,
      division_type: 'phường',
      codename: 'phuong_cong_vi',
      district_code: 1,
    },
    {
      name: 'Phường Liễu Giai',
      code: 8,
      division_type: 'phường',
      codename: 'phuong_lieu_giai',
      district_code: 1,
    },
    {
      name: 'Phường Nguyễn Trung Trực',
      code: 10,
      division_type: 'phường',
      codename: 'phuong_nguyen_trung_truc',
      district_code: 1,
    },
    {
      name: 'Phường Quán Thánh',
      code: 13,
      division_type: 'phường',
      codename: 'phuong_quan_thanh',
      district_code: 1,
    },
    {
      name: 'Phường Ngọc Hà',
      code: 16,
      division_type: 'phường',
      codename: 'phuong_ngoc_ha',
      district_code: 1,
    },
    {
      name: 'Phường Điện Biên',
      code: 19,
      division_type: 'phường',
      codename: 'phuong_dien_bien',
      district_code: 1,
    },
    {
      name: 'Phường Đội Cấn',
      code: 22,
      division_type: 'phường',
      codename: 'phuong_doi_can',
      district_code: 1,
    },
    {
      name: 'Phường Ngọc Khánh',
      code: 25,
      division_type: 'phường',
      codename: 'phuong_ngoc_khanh',
      district_code: 1,
    },
    {
      name: 'Phường Kim Mã',
      code: 28,
      division_type: 'phường',
      codename: 'phuong_kim_ma',
      district_code: 1,
    },
    {
      name: 'Phường Giảng Võ',
      code: 31,
      division_type: 'phường',
      codename: 'phuong_giang_vo',
      district_code: 1,
    },
    {
      name: 'Phường Thành Công',
      code: 34,
      division_type: 'phường',
      codename: 'phuong_thanh_cong',
      district_code: 1,
    },
  ];
}
