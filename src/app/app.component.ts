import {Component, OnInit} from '@angular/core';
import {HttpClientService} from "../http-client.service";
import {environment} from "../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit{
  readonly isLoading = this.httpClientService.isLoading;
  readonly baseUrl = environment.baseUrl;

  title = 'webhook-tester';

  constructor(
    private httpClientService: HttpClientService
  ) {}

  ngOnInit(): void {
  }

  openUrl(url: string) {
    window.open(url);
  }

}
