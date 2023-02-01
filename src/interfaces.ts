export interface IUser {
  id: number;
  email: string;
}

export interface IPost {
  id: number;
  content: string;
  comments: IComment[];
  createdBy?: IUser;
  createdAt: string;
}

export interface IComment {
  id: number;
  comment: string;
  createdBy?: IUser;
  createdAt: string;
}
