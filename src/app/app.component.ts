import {Component, OnInit} from '@angular/core';
import {HttpClientService} from "../http-client.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit{
  readonly isLoading = this.httpClientService.isLoading;
  title = 'webhook-tester';

  constructor(
    private httpClientService: HttpClientService
  ) {}

  ngOnInit(): void {
  }
}
