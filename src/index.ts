import { parse } from "./parser";

const inputs = [
  `put "some data to insert" in key_name`,
  `put 5 in key_name`,
  `get key_name`,
  `put true in another_keyname`,
  `get another_keyname`,
  `delete key_name`,
  `register user "admin" "15123ghgsd" with "add,edit,delete" and is active`,
  `register user 'user2' 'pass' with "add,none,delete" and is not active`,
  `update user "an_users_name" set password "new password"`,
  `update user "an_users_name" set username "new_username"`,
  `update user "an_users_name" set permissions "add,delete"`,
  `update user "an_users_name" set active false`,
  `update user "an_users_name" set active true`,
  `delete user admin`,
  `list users`
];

for (const input of inputs) {
  try {
    const ast = parse(input);
    console.log(JSON.stringify(ast, null, 2));
  } catch (e) {
    if (e instanceof Error) {
      console.error("ERROR:", e.message);
    } else {
      console.error("ERROR:", e);
    }
  }
}
