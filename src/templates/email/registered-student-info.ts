export function registeredStudentInfoEmailTemplate(
  userId: string,
  token: string,
  role: string,
) {
  return `
  <h1>Witaj ${role}!</h1>
  <p>Twój unikalny token aktywacyjny to: ${token}</p>
  <p>Kliknij w poniższy link aby dokończyć rejestrację: </p>
  <a href="http://localhost:3001/register/${userId}/${token}">Link</a>
  `;
}
