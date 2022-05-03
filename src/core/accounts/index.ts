import { APlugin, Flow } from "@flowrage/core";

declare module "@flowrage/core" {
  namespace Flow {
    namespace Custom {
      interface Properties {
        Accounts: Accounts;
      }
    }
  }
}

const enum Response {
  SIGNUP_SUCCESS = "Account has been created",
  SIGNUP_USERNAME_ALREADY_EXIST = "Username already exist",
  SIGNUP_EMAIL_ALREADY_EXIST = "Email already exist",
  SIGNUP_USERNAME_AND_EMAIL_EXIST = "Username and email exist",
}

export type AccountOptions = {
  username: string;
  password: string;
  email: string;
};

class Account {
  public username: string;
  public password: string;
  public email: string;
  constructor(options: AccountOptions) {
    this.username = options.username;
    this.password = options.password;
    this.email = options.email;
  }
}

export class Accounts extends APlugin {
  static config(): Flow.Plugin.External.Options {
    return {
      name: "Accounts",
      package: "@flowrage/accounts",
      dependencies: [{ name: "MongoDB", package: "@flowrage/mongodb" }],
    };
  }
  constructor(options: Flow.Plugin.Internal.Options) {
    super(options);
  }
  async signin(): Promise<Response> {
    return new Promise<Response>((resolve) => {});
  }
  async signup(options: AccountOptions): Promise<Response> {
    return new Promise<Response>((resolve, reject) => {
      let account = new Account(options);

      this.context.MongoDB.connect().then((client) => {
        let db = client.db(this.context.MongoDB.database);

        this.list().then((results) => {
          let usernameExist: boolean, emailExist: boolean;

          if (results.some((result) => result.username === account.username)) {
            usernameExist = true;
          } else {
            usernameExist = false;
          }

          if (results.some((result) => result.email === account.email)) {
            emailExist = true;
          } else {
            emailExist = false;
          }

          if (usernameExist && !emailExist) {
            client.close();
            reject(Response.SIGNUP_USERNAME_ALREADY_EXIST);
          }

          if (emailExist && !usernameExist) {
            client.close();
            reject(Response.SIGNUP_EMAIL_ALREADY_EXIST);
          }

          if (usernameExist && emailExist) {
            client.close();
            reject(Response.SIGNUP_USERNAME_AND_EMAIL_EXIST);
          }

          if (!usernameExist && !emailExist) {
            db.collection("Accounts")
              .insertOne(account)
              .then(() => {
                resolve(Response.SIGNUP_SUCCESS);

                client.close();
              });
          }
        });

        db.collection("Accounts")
          .find({ username: account.username })
          .toArray((err, results) => {
            if (err) reject(err);

            if (results) {
              if (results.length === 0) {
                db.collection("Accounts")
                  .insertOne(account)
                  .then(() => {
                    resolve(Response.SIGNUP_SUCCESS);

                    client.close();
                  });
              } else {
                let usernameExist: boolean, emailExist: boolean;

                if (
                  results.some((result) => result.username === account.username)
                ) {
                  usernameExist = true;
                } else {
                  usernameExist = false;
                }

                if (results.some((result) => result.email === account.email)) {
                  emailExist = true;
                } else {
                  emailExist = false;
                }

                if (usernameExist && !emailExist) {
                  client.close();
                  reject(Response.SIGNUP_USERNAME_ALREADY_EXIST);
                }

                if (emailExist && !usernameExist) {
                  client.close();
                  reject(Response.SIGNUP_EMAIL_ALREADY_EXIST);
                }

                if (usernameExist && emailExist) {
                  client.close();
                  reject(Response.SIGNUP_USERNAME_AND_EMAIL_EXIST);
                }

                if (!usernameExist && !emailExist) {
                  db.collection("Accounts")
                    .insertOne(account)
                    .then(() => {
                      resolve(Response.SIGNUP_SUCCESS);

                      client.close();
                    });
                }
              }
            } else {
              db.collection("Accounts")
                .insertOne(account)
                .then(() => {
                  resolve(Response.SIGNUP_SUCCESS);

                  client.close();
                });
            }
          });
      });
    });
  }
  public async list(): Promise<Array<Account>> {
    let list = await this.getAccounts();

    return list;
  }

  private getAccounts(): Promise<Array<Account>> {
    return new Promise<Array<Account>>((resolve, reject) => {
      this.context.MongoDB.client.connect().then((client) => {
        let db = client.db(this.context.MongoDB.database);

        db.collection("Accounts")
          .find()
          .toArray((err, list) => {
            if (err) reject(err);
            if (list) {
              let result: Array<Account> = [];

              for (let index = 0; index < list.length; index++) {
                let username, password, email;

                if (list[index].username) {
                  username = list[index].username;
                } else {
                  continue;
                }

                if (list[index].password) {
                  password = list[index].password;
                } else {
                  continue;
                }

                if (list[index].email) {
                  email = list[index].email;
                } else {
                  continue;
                }

                result.push({
                  username,
                  password,
                  email,
                });
              }

              resolve(result);
            }
          });
      });
    });
  }
}
