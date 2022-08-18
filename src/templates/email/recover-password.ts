export function recoverPassword(userId: string, token: string) {
  return `
  <h1>Witaj,</h1>
  <p>Kliknij w poniższy link aby odzyskać hasło: </p>
  <a href="http://localhost:3000/check-user/${userId}/${token}">Link</a>
  `;
}

// export function recoverPassword(userId: string, token: string) {
//   return `
//   <h1>Witaj,</h1>
//   <p>Kliknij w poniższy link aby odzyskać hasło: </p>
//   <a href="https://megakheadhunters-team20.networkmanager.pl/check-user/${userId}/${token}">Link</a>
//   `;
// }
