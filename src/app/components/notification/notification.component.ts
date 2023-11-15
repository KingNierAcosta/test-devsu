import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationType } from '../../models/product.model';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {

  @Input() message: string = '';
  @Input() type: NotificationType = 'success';

}
