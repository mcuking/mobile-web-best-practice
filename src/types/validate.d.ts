export interface ValidateRules {
  [propName: string]: AnyObject[];
}

export interface ValidateError {
  field: string;
  message: string;
}
