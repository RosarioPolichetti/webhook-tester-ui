import {Injectable, signal} from '@angular/core';
import {catchError, EMPTY, finalize, forkJoin, map, Observable} from "rxjs";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "./environments/environment";
import {Message, Path} from "./webhook-list/webhook-card/webhook.model";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {Order, PathOrderBy} from "./webhook-list/webhook-list.component";

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {
  readonly BASE_URL = environment.baseUrl;
  isLoading = signal<boolean>(true);

  constructor(
    private http: HttpClient,
    private notificationService: NzNotificationService
  ) {
  }

  private doRequest$<T>(observable: Observable<T>): Observable<T> {
    this.isLoading.set(true);
    return observable.pipe(
      finalize(() => this.isLoading.set(false))
    )
  }

  retrievePaths$(orderBy = PathOrderBy.TotalMessage, order = Order.Descending): Observable<Path[]> {
    return this.doRequest$(this._retrievePaths$(orderBy, order));
  }

  private _retrievePaths$(orderBy = PathOrderBy.TotalMessage, order = Order.Descending): Observable<Path[]> {
    const url = [this.BASE_URL, 'api/v1/paths'].join('/')
    const params = new HttpParams().set('orderBy', orderBy).set('order', order);
    return this.http.get<Path[]>(url, {params});
  }

  retrieveMessages$(maxNumberMessages = 100, serverTimeout: number | null = null, responseStatusCode: number | null = null, pathsToInclude: string[] | null = null): Observable<Message[]> {
    const url = [this.BASE_URL, 'api/v1/paths/messages'].join('/')
    let queryParams = new HttpParams();
    queryParams = queryParams.append('maxItems', maxNumberMessages);
    if(serverTimeout) {
      queryParams = queryParams.append('serverTimeout', serverTimeout);
    }
    if (responseStatusCode) {
      queryParams = queryParams.append('responseStatusCode', responseStatusCode);
    }
    if (pathsToInclude && pathsToInclude.length !== 0) {
      queryParams = queryParams.append('pathsToInclude', pathsToInclude.join(', '));
    }
    const headers = new HttpHeaders(
      {'ngrok-skip-browser-warning': 1,'Content-Type': 'application/json'});
    return this.http.get<Message[]>(url, {params: queryParams, headers}).pipe(
      catchError(err => {
        // TODO: Create an error list
        this.notificationService.create(
          'error',
          'Unable to retrieve messages',
          ''
        )
        return EMPTY;
      })
    );
  }

  retrievePathsAndMessages$(orderBy = PathOrderBy.TotalMessage, order = Order.Descending) {
    return this.doRequest$(
      forkJoin({
        paths: this._retrievePaths$(orderBy, order),
        messages: this.retrieveMessages$()
      })
    );
  }

  retrieveMessageBody$(messageId: string): Observable<any> {
    const url = [this.BASE_URL, 'api/v1/paths/messages', messageId].join('/')
    const headers = new HttpHeaders(
      {'ngrok-skip-browser-warning': 1,'Content-Type': 'application/json'});
    return this.http.get<Message>(url, {headers}).pipe(map(resp => JSON.stringify(resp.extra.messagePayload || {})));
  }
}
