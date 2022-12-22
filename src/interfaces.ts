export interface IUser {
  id: number;
  email: string;
}

export interface IComment {
  id: number;
  comment: string;
  createdBy?: IUser;
  createdAt: string;
}
