import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { NotificationService, Options } from './notification.service';
import { Overlay, OverlayModule } from '@angular/cdk/overlay';
import { NotificationType } from '../models/product.model';

describe('NotificationService', () => {
  let service: NotificationService;
  let overlay: Overlay;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OverlayModule]
    });
    service = TestBed.inject(NotificationService);
    overlay = TestBed.inject(Overlay);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show notification with default options', fakeAsync(() => {
    const spyAttach = jest.spyOn(overlay, 'create');
    const message = 'This is a notification';
    const type: NotificationType = 'success';

    service.showNotification(message, type, { delay: 100 });

    tick(200);
    expect(spyAttach).toHaveBeenCalled();
  }));

  it('should show notification with custom options', fakeAsync(() => {
    const spyAttach = jest.spyOn(overlay, 'create');
    const message = 'This is a notification';
    const type: NotificationType = 'success';
    // bottom-right
    let customOptions: Options = {
      position: 'bottom-right',
      delay: 100,
    };
    service.showNotification(message, type, customOptions);
    tick(200);
    expect(spyAttach).toHaveBeenCalled();

    // bottom-left
    customOptions.position = 'bottom-left';
    service.showNotification(message, type, customOptions);
    tick(200);
    expect(spyAttach).toHaveBeenCalled();

    // top-left
    customOptions.position = 'top-left';
    service.showNotification(message, type, customOptions);
    tick(200);
    expect(spyAttach).toHaveBeenCalled();

    // top-right
    customOptions.position = 'top-right';
    service.showNotification(message, type, customOptions);
    tick(200);
    expect(spyAttach).toHaveBeenCalled();
  }));

});
