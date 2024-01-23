import {Injectable, signal} from '@angular/core';
import {HttpClientService} from "../http-client.service";
import {finalize, interval, Subscription, switchMap, tap} from "rxjs";
import {Message, UnitTime} from "./webhook-card/webhook.model";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";


@UntilDestroy()
@Injectable()
export class WebhookListService {
  refreshSubscription: Subscription;

  paths = signal<string[]>([]);
  messages = signal<Message[]>([]);

  constructor(
    private httpClientService: HttpClientService
  ) { }

  retrievePathsAndMessages$() {
    return this.httpClientService.retrievePathsAndMessages$().pipe(
      tap(resp => {
        this.paths.set(resp.paths);
        this.messages.set(resp.messages);
      })
    );
  }


  retrieveMessages$(maxNumberMessages: number, responseStatusCode: number | null, serverTimeout: number | null, selectedPaths: string[]) {
    this.httpClientService.isLoading.set(true)
    return this.httpClientService.retrieveMessages$(maxNumberMessages, serverTimeout, responseStatusCode, selectedPaths).pipe(
      tap(messages => this.messages.set(messages)),
      finalize(() => this.httpClientService.isLoading.set(false))
    )
  }

  updateRefreshRate(maxNumberMessages: number, responseStatusCode: number | null, serverTimeout: number | null, selectedPaths: string[], refreshNumber: number, unitTime: UnitTime) {
    this.refreshSubscription?.unsubscribe();
    this.retrieveMessages$(maxNumberMessages, serverTimeout, responseStatusCode, selectedPaths).subscribe();
    let intervalValue = refreshNumber * 1000;
    intervalValue = unitTime === UnitTime.Seconds ? intervalValue : intervalValue * 60;
    this.refreshSubscription = interval(intervalValue).pipe(
      untilDestroyed(this),
      switchMap(() => this.retrieveMessages$(maxNumberMessages, serverTimeout, responseStatusCode, selectedPaths))
    ).subscribe();
  }
}
