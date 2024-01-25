export interface IEmailSmsManagement {
  id?: number;
  type?: string;
  body?: string;
  sender?: string;
  subject?: string;
  template?: string;
  receiver?: string;
  sent_at?: Date;
  retry_count?: number;
}
