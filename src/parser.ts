import { tokenize } from "./lexer";
import type { Statement, PutStatement, GetStatement, DeleteStatement, RegisterUserStatement } from "./ast";
import { isValidKey } from "./utils";
import { PERMISSIONS } from "./constants";

export function parse(input: string): Statement {
  const tokens = tokenize(input);
  const next = () => tokens.shift();
  const peek = () => tokens[0];

  const token = next();

  if (!token) throw new Error("Empty input");

  switch (token.type) {
    case "PUT": {
      const valueToken = next();
      if (!valueToken) throw new Error("Missing value");

      const t_in = next();
      if (!t_in || t_in.type !== "in") throw new Error("Expected 'in'");

      const keyToken = next();
      if (!keyToken || !isValidKey(keyToken.value)) {
        throw new Error(`Invalid key name: '${keyToken?.value}'`);
      }

      let value: any = valueToken.value;
      if (valueToken.type === "INT") value = parseInt(value);
      else if (valueToken.type === "FLOAT") value = parseFloat(value);
      else if (valueToken.type === "BOOL") value = value === "true";

      return { type: "put", key: keyToken.value, value } as PutStatement;
    }

    case "GET": {
      const keyToken = next();
      if (!keyToken) throw new Error("Missing key");
      if (keyToken.value === "user") {
        const uname = next();
        if (!uname) throw new Error("Missing username");
        return { type: "get_user", username: uname.value };
      }
      if (!isValidKey(keyToken.value)) {
        throw new Error(`Invalid key name: '${keyToken.value}'`);
      }
      return { type: "get", key: keyToken.value } as GetStatement;
    }

    case "DELETE": {
      const nextToken = next();
      if (!nextToken) throw new Error("Missing key");
      if (nextToken.value === "user") {
        const uname = next();
        if (!uname) throw new Error("Missing username");
        return { type: "delete_user", username: uname.value };
      }
      if (!isValidKey(nextToken.value)) {
        throw new Error(`Invalid key name: '${nextToken.value}'`);
      }
      return { type: "delete", key: nextToken.value } as DeleteStatement;
    }

    case "REGISTER": {
      next();
      const uname = next();
      if (!uname) throw new Error("Missing username");

      const pwd = next();
      if (!pwd) throw new Error("Missing password");

      next();
      const permToken = next();
      if (!permToken) throw new Error("Missing permissions list");
      const perms = permToken.value.split(",").map(p => p.trim()).filter(a => a);
      for (const perm of perms) {
        if (!PERMISSIONS.has(perm)) {
          throw new Error(`Invalid permission: '${perm}'`);
        }
      }

      next();
      next();
      const isActiveToken = next();
      if (!isActiveToken) throw new Error("Missing active state");
      const isActive = isActiveToken.value === "active";
      return {
        type: "register_user",
        username: uname.value,
        password: pwd.value,
        permissions: perms.includes('none') ? ['none'] : perms,
        isActive,
      } as RegisterUserStatement;
    }

    case "UPDATE": {
      const nextToken = next();
      if (!nextToken || nextToken.value !== "user") throw new Error(`Expected 'user' after update`);
      const username = next();
      if (!username) throw new Error("Missing username");
    
      const setToken = next();
      if (!setToken || setToken.value !== "set") throw new Error("Expected 'set' keyword");
    
      const field = next();
      if (!field) throw new Error("Missing field to update");
    
      switch (field.value) {
        case "password": {
          const to = next(); if (!to || to.value !== "to") throw new Error("Expected 'to'");
          const newPassword = next(); if (!newPassword) throw new Error("Missing new password");
          return { type: "update_user", username: username.value, field: "password", value: newPassword.value };
        }
        case "username": {
          const to = next(); if (!to || to.value !== "to") throw new Error("Expected 'to'");
          const newUsername = next(); if (!newUsername) throw new Error("Missing new username");
          return { type: "update_user", username: username.value, field: "username", value: newUsername.value };
        }
        case "permissions": {
          const permToken = next(); if (!permToken) throw new Error("Missing permissions string");
          const perms = permToken.value.split(",").map(p => p.trim()).filter(a => a);
          for (const perm of perms) {
            if (!PERMISSIONS.has(perm)) throw new Error(`Invalid permission: '${perm}'`);
          }
          return { type: "update_user", username: username.value, field: "permissions", value: perms.includes('none') ? ['none'] : perms };
        }
        case "active": {
          const valueToken = next();
          if (!valueToken || (valueToken.value !== "true" && valueToken.value !== "false"))
            throw new Error("Expected 'true' or 'false'");
          return { type: "update_user", username: username.value, field: "active", value: valueToken.value === "true" };
        }
        default:
          throw new Error(`Invalid field for update: '${field.value}'`);
      }
    }

    case "LIST": {
      const nextToken = next();
      if (!nextToken || nextToken.value !== "users") throw new Error("Expected 'users'");
      return { type: "list_users" };
    }
    
    

    default:
      throw new Error(`Unknown statement: ${token.type}`);
  }
}
