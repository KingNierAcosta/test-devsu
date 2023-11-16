import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationComponent } from './notification.component';
import { NotificationType } from '../../models/product.model';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should match the snapshot', () => {
    expect(compiled).toMatchSnapshot();
  });

  it('should display and error message', () => {
    const inputValue = 'Test Message';
    const notificationType: NotificationType = 'error';

    component.message = inputValue;
    component.type = notificationType;

    fixture.detectChanges();

    const compiled = fixture.nativeElement;

    expect(compiled.querySelector('.notification').textContent).toContain(
      inputValue
    );
    expect(compiled.querySelector('.notification').classList.value).toContain(
      notificationType
    );
  });
});
