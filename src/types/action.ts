export type ActionResponseSuccess<T> = {
  success: true;
  data: T;
  error?: never;
};

export type ActionResponseError = {
  success: false;
  error: string;
  data?: never;
};

export type ActionResponse<T = null> =
  | ActionResponseSuccess<T>
  | ActionResponseError;
