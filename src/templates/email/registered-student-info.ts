export function registeredStudentInfoEmailTemplate(
  userId: string,
  token: string,
) {
  return `
  <h1>Witaj Kursancie!</h1>
  <p>Twój unikalny token aktywacyjny to: ${token}</p>
  <p>Kliknij w poniższy link aby dokończyć rejestrację: </p>
  <a href="http://localhost:3000/register/${userId}/${token}">Link</a>
  `;
}
