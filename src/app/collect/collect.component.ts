import { Component, Inject } from '@angular/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-collect',
  templateUrl: './collect.component.html',
})
export class CollectComponent {
  constructor(private sanitizer: DomSanitizer) {}
  image: string | SafeUrl;

  fileChange(event: any) {
    this.image = this.sanitizer.bypassSecurityTrustUrl(
      window.URL.createObjectURL(event.target.files[0])
    );
  }
}

//import { Component, Inject } from '@angular/core';
//import { HttpClient } from '@angular/common/http';

//@Component({
//  selector: 'app-fetch-data',
//  templateUrl: './fetch-data.component.html'
//})
//export class FetchDataComponent {
//  public forecasts: WeatherForecast[];

//  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
//    http.get<WeatherForecast[]>(baseUrl + 'weatherforecast').subscribe(result => {
//      this.forecasts = result;
//    }, error => console.error(error));
//  }
//}

//interface WeatherForecast {
//  date: string;
//  temperatureC: number;
//  temperatureF: number;
//  summary: string;
//}
