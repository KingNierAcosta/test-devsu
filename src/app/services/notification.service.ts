import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { NotificationComponent } from '../components/notification/notification.component';
import { NotificationPosition, NotificationType } from '../models/product.model';

export interface Options {
  position?: NotificationPosition;
  delay?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private defaulOption: Options = {
    position: 'top-right',
    delay: 3000
  }

  constructor(
    private overlay: Overlay
  ) { }

  showNotification(message: string, type: NotificationType, options?: Options) {
    if (options) {
      this.defaulOption = { ...this.defaulOption, ...options };
    }
    const overlayRef = this.overlay.create(this.getOverlayConfig());
    const notificationPortal = new ComponentPortal(NotificationComponent);
    const componentRef = overlayRef.attach(notificationPortal);

    componentRef.instance.message = message;
    componentRef.instance.type = type;

    setTimeout(() => {
      overlayRef.detach();
    }, this.defaulOption.delay);
  }

  private getOverlayConfig(): OverlayConfig {
    const positionStrategy = this.overlay.position()
      .global();

    switch (this.defaulOption.position) {
      case 'bottom-left':
        positionStrategy.bottom('20px').left('20px');
        break;
      case 'bottom-right':
        positionStrategy.bottom('20px').right('20px');
        break;
      case 'top-left':
        positionStrategy.top('20px').left('20px');
        break;
      case 'top-right':
        positionStrategy.top('20px').right('20px');
        break;
    }


    const overlayConfig = new OverlayConfig({
      hasBackdrop: false,
      positionStrategy,
    });

    return overlayConfig;
  }
}
