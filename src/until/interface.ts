export interface IFRole {
  Admin: number;
  Staff: number;
}

export interface IFUser {
  name: string;
  email: string;
  password: string;
  role: number;
}
