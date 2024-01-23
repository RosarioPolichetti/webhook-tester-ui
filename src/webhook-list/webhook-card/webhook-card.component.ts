import {Component, computed, effect, input, signal} from '@angular/core';
import {NzCardComponent} from "ng-zorro-antd/card";
import {NzTagComponent} from "ng-zorro-antd/tag";
import {NzCollapseComponent, NzCollapsePanelComponent} from "ng-zorro-antd/collapse";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {HttpClientService} from "../../http-client.service";
import {finalize, tap} from "rxjs";
import {NzSpinComponent} from "ng-zorro-antd/spin";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzModalComponent} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-webhook-card',
  standalone: true,
  imports: [
    NzCardComponent,
    NzTagComponent,
    NzCollapseComponent,
    NzCollapsePanelComponent,
    NzRowDirective,
    NzColDirective,
    NzSpinComponent,
    NzIconDirective,
    NzModalComponent
  ],
  templateUrl: './webhook-card.component.html',
  styleUrl: './webhook-card.component.sass'
})
export class WebhookCardComponent {
  path = input.required<string>();
  serviceSentMessageAt = input.required<string>();
  serverReceivedMessageAt = input.required<string>();
  responseStatusCode = input.required<number>();
  serverTimeout = input.required<number>();
  messageId = input.required<string>();

  isLoadingBodyMessage = signal<boolean>(true)
  messageBody = signal<any>('');
  showDetail = signal<boolean>(false);

  constructor(
    private httpClientService: HttpClientService
  ) {
    effect(() => {
      this.onActiveModal(this.showDetail());
    })
  }

  onActiveModal($event: boolean) {
    if ($event) {
      this.httpClientService.retrieveMessageBody$(this.messageId()).pipe(
        tap(message => this.messageBody.set(message)),
        finalize(() => this.isLoadingBodyMessage.set(false))
      ).subscribe();
    }
  }
}
