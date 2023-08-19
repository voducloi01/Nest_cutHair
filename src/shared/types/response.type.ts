import { UserEntity } from 'src/entities/user.entity';

export type LoginResponse = {
  userInfo: {
    name: string;
    email: string;
    role: number;
  };
  token: string;
};

export type RegisterResponse = {
  userInfo: {
    name: string;
    email: string;
  };
  message: string;
};

export type UserResponse = UserEntity;

export type LogoutResponse = {
  message: string;
};
