// config for Windows without password
export const config = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'megak_bonus',
  logging: true,
  synchronize: true,
};

// config for macOS with password
// export const config = {
//   type: 'mysql',
//   host: 'localhost',
//   port: 8889,
//   username: 'root',
//   password: 'root',
//   database: 'megak_bonus',
//   logging: true,
//   synchronize: true,
// };
