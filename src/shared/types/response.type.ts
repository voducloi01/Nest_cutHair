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

export type UserResponse = {
  result: {
    id: number;
    name: string;
    email: string;
    role: number;
  }[];
};

export type LogoutResponse = {
  message: string;
};

export type UpdateUser = {
  result: {
    name: string;
    email: string;
    role: number;
  };
  message: string;
};

export type DeleteUser = LogoutResponse;

export type ProductResponse = {
  result?: {
    id: number;
    productName: string;
    price: number;
    categoryID: number;
    urlImg: string;
    nameImg: string;
  };
  message: string;
};

export type ProductType = {
  id: number;
  productName: string;
  price: number;
  categoryID: number;
  urlImg: string;
  nameImg: string;
};

export type GetProductResponse = {
  result: ProductType[];
  message: string;
};

export type CategoryResponse = {
  result?: {
    id: number;
    categoryName: string;
    description: string;
  };
  message: string;
};

export type CategoryType = {
  id: number;
  categoryName: string;
  description: string;
};

export type GetAllCategoryResponse = {
  result: CategoryType[];
  message: string;
};

export type OrderScheduleResponse = {
  result?: {
    id: number;
    name: string;
    email: string;
    phone: string;
    dateSchedule: Date;
  };
  message: string;
};

export type OrderScheduleType = {
  id: number;
  name: string;
  email: string;
  phone: string;
  dateSchedule: Date;
};

export type GetAllOrderResponse = {
  result: OrderScheduleType[];
  message: string;
};
