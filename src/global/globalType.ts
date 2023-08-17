import { User } from '../models/user.model';

export type ResponseType<D> = {
  data?: D | D[];
  statusCode?: number;
  message?: string;
};

export type LoginResponse = {
  data?: User;
  statusCode?: number;
  message?: string;
  token: string;
};
