export interface ServiceResponse<T = any> {
  success: boolean;
  message: string;
  method?: string;
  timestamp: string;
  statusCode: number;
  data?: T;
}
