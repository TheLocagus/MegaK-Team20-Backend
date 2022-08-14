export function recoverPassword(userId: string, token: string) {
  return `
  <h1>Witaj,</h1>
  <p>Twój unikalny token aktywacyjny to: ${token}</p>
  <p>Kliknij w poniższy link aby odzyskać hasło: </p>
  <a href="http://localhost:3001/auth/check-user/${userId}/${token}">Link</a>
  `;
}
