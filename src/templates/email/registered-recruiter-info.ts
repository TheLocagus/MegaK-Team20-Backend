// export function registeredRecruiterInfoEmailTemplate(
//   userId: string,
//   token: string,
// ) {
//   return `
//   <h1>Witaj Rekruterze!</h1>
//   <p>Twój unikalny token aktywacyjny to: ${token}</p>
//   <p>Kliknij w poniższy link aby dokończyć rejestrację: </p>
//   <a href="http://localhost:3000/recruiter/register/${userId}/${token}">Link</a>
//   `;
// }

export function registeredRecruiterInfoEmailTemplate(
  userId: string,
  token: string,
) {
  return `
  <h1>Witaj Rekruterze!</h1>
  <p>Twój unikalny token aktywacyjny to: ${token}</p>
  <p>Kliknij w poniższy link aby dokończyć rejestrację: </p>
  <a href="https://megakheadhunters-team20.networkmanager.pl/recruiter/register/${userId}/${token}">Link</a>
  `;
}
