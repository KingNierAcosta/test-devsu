export interface Product {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string | Date;
  date_revision: string | Date;
}

export type NotificationType = 'success' | 'error';
export type NotificationPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
