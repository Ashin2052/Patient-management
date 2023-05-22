export type Userlogin = {
  email: string;
  password: string;
};

export type ApiErrorResponse = {
  data: ApiData;
  message: string;
  status: number;
};

type ApiData = {
  info: string;
  [key: string]: string;
};

export interface AxiosResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: any;
  request?: any;
}

export type Signup = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type Itable = {
  dataSource: any[];
  columns: any[];
};
