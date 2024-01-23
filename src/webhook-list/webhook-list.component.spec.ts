import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebhookListComponent } from './webhook-list.component';

describe('WebhookListComponent', () => {
  let component: WebhookListComponent;
  let fixture: ComponentFixture<WebhookListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebhookListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WebhookListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
