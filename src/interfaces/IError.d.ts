export interface IError extends Error {
  code: number;
  errmsg: string;
  errors: Error[];
}
