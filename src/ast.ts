export type Value = string | number | boolean;

export type Statement =
  | PutStatement
  | GetStatement
  | DeleteStatement
  | RegisterUserStatement
  | UpdateUserStatement
  | GetUserStatement
  | DeleteUserStatement
  | ListUsersStatement;

export interface PutStatement {
  type: "put";
  key: string;
  value: Value;
}

export interface GetStatement {
  type: "get";
  key: string;
}

export interface DeleteStatement {
  type: "delete";
  key: string;
}

export interface RegisterUserStatement {
  type: "register_user";
  username: string;
  password: string;
  permissions: string[];
  isActive: boolean;
}

export interface UpdateUserStatement {
  type: "update_user";
  username: string;
  field: "password" | "username" | "permissions" | "active";
  value: Value | string[];
}

export interface GetUserStatement {
  type: "get_user";
  username: string;
}

export interface DeleteUserStatement {
  type: "delete_user";
  username: string;
}

export type ListUsersStatement = {
  type: "list_users";
};