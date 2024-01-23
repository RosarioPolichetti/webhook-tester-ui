import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebhookCardComponent } from './webhook-card.component';

describe('WebhookCardComponent', () => {
  let component: WebhookCardComponent;
  let fixture: ComponentFixture<WebhookCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebhookCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WebhookCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
