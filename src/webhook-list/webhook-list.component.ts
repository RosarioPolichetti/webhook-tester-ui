import {Component, computed, OnInit, signal} from '@angular/core';
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzFormDirective} from "ng-zorro-antd/form";
import {NzInputDirective} from "ng-zorro-antd/input";
import {NzModalComponent} from "ng-zorro-antd/modal";
import {WebhookCardComponent} from "./webhook-card/webhook-card.component";
import {UnitTime} from "./webhook-card/webhook.model";
import {WebhookListService} from "./webhook-list.service";
import {NzEmptyComponent} from "ng-zorro-antd/empty";

@Component({
  selector: 'app-webhook-list',
  standalone: true,
  imports: [
    NzSelectComponent,
    FormsModule,
    NzRowDirective,
    NzColDirective,
    NzButtonComponent,
    NzIconDirective,
    NzFormDirective,
    NzInputDirective,
    NzOptionComponent,
    ReactiveFormsModule,
    NzModalComponent,
    WebhookCardComponent,
    NzEmptyComponent
  ],
  templateUrl: './webhook-list.component.html',
  styleUrl: './webhook-list.component.sass',
  providers: [WebhookListService]
})
export class WebhookListComponent implements OnInit {
  form: FormGroup;

  readonly paths = this.webhookListService.paths;
  readonly options = computed(() => this.paths().map(uuid => {
    return {value: uuid, label: uuid}
  }))
  readonly messages = this.webhookListService.messages;

  isFilterDropdownVisible = signal<boolean>(false);
  areFiltersSelected = signal<boolean>(false);

  selectedPaths = [];
  readonly UnitTime = UnitTime;

  constructor(
    private fb: FormBuilder,
    private webhookListService: WebhookListService
  ) {
    this.form = this.fb.group({
      visibleRequestsMaxNumber: [100],
      responseStatusCode: [null],
      serverTimeout: [null],
      refreshNumber: [59],
      unitTime: [UnitTime.Seconds]
    })
  }

  ngOnInit(): void {
    this.webhookListService.retrievePathsAndMessages$().subscribe();
  }

  onCloseFilterModal() {
    this.form.patchValue({
      visibleRequestsMaxNumber: 100,
      refreshNumber: 59,
      unitTime: UnitTime.Seconds
    });
    this.isFilterDropdownVisible.set(false);
    this.areFiltersSelected.set(false);
  }

  onUpdateFilter() {
    this.isFilterDropdownVisible.set(false);
    this.areFiltersSelected.set(true);
    this.searchMessages();
  }

  searchMessages() {
    const maxNumberMessages = this.form.get('visibleRequestsMaxNumber')?.value;
    const responseStatusCode = this.form.get('responseStatusCode')?.value || null;
    const serverTimeout = this.form.get('serverTimeout')?.value || null;
    this.webhookListService.retrieveMessages$(maxNumberMessages, responseStatusCode, serverTimeout, this.selectedPaths).subscribe()
  }

  onUpdateRefreshRate() {
    this.isFilterDropdownVisible.set(false);
    this.areFiltersSelected.set(true);
    const maxNumberMessages = this.form.get('visibleRequestsMaxNumber')?.value;
    const responseStatusCode = this.form.get('responseStatusCode')?.value || null;
    const serverTimeout = this.form.get('serverTimeout')?.value || null;
    const refreshNumber = this.form.get('refreshNumber')?.value;
    const unitTime = this.form.get('unitTime')?.value;
    this.webhookListService.updateRefreshRate(maxNumberMessages, responseStatusCode, serverTimeout, this.selectedPaths, refreshNumber, unitTime);
  }
}
