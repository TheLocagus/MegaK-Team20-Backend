# MegaK bonus - Backend
> It's a simple site which helps you to search through a lot of great developers you might need.
## :pushpin:Table of Contents
* [General Info](#general-information)
* [Technologies Used](#technologies-used)
* [Features](#features)
* [Screenshots](#screenshots)
* [Getting started](#getting-started)
* [Project Status](#project-status)

## 📋General Information
- This site is created to help both employees and employers to find a job or a worker.
- The best participants of the MegaK course who passed the tests, wrote their own app <br> and have worked on a group projects are listed here and ready to hire.


## 🗃Technologies Used
* [![Nest][Nest.js]][Nest-url]
* [![React][React.js]][React-url]
* [![Typescript][Typescript.com]][Typescript-url]

## ⚙Features
* As a recruiter you can:
  - select developers of your choice.
  - store up to 10 people you would like to hire.
  - set filters to meet your expectations easier.

* As a developer:
  - create your profile.
  - set up links to your portfolio.
  - choose expectations about your employment.

## 📷Screenshots
![Example screenshot](https://cdn.discordapp.com/attachments/346945171780403200/1009812555960700938/1screen.png)
![Example screenshot](https://cdn.discordapp.com/attachments/346945171780403200/1009813386382544986/unknown.png)

## 🏁Getting started
### Prerequisite
- [Node LTS](https://nodejs.org/en/download/)
- [Npm](https://docs.npmjs.com/getting-started)  or [Yarn](https://yarnpkg.com/lang/en/docs/install/)
 #### This app is running with database so if you want to clone it and try how it works you also need:
- [XAMPP](https://www.apachefriends.org/)
- [HeidiSQL](https://www.heidisql.com/)

### Commands

Open project in new folder and clone
```bash
git clone https://github.com/TheLocagus/MegaK-Team20-Backend.git
```
enter the project folder
```bash
cd megak-team20-backend
````

install dependencies
```bash
npm i
````
change config-db file to your liking
```sh
├── 📁config       
│   ├── 📄config-db.ts # configuration of your database
│   ├── 📄config-salt.ts
│   ├── 📄configCookie.example.ts 
│   ├── 📄configMail.example.ts 
│   └── 📄configMail.ts
```
to avoid conflicts comment pipes and also might want to change the port (default is 3001) in the `main.ts` file
```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GlobalExceptionFilter());
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     disableErrorMessages: true,
  //     whitelist: true,
  //     forbidNonWhitelisted: true,
  //     transform: true,
  //   }),
  // );
  app.use(cookieParser());
  app.use(pagination);
  app.enableCors({
    credentials: true,
  });
  await app.listen(3001);  // * change port if you want to *//
}

bootstrap();
```
start the app
```bash
nest start --watch
````


## 🚉Project Status
This project had a time limit of one month.
While we didn't exactly implement all the features we wanted, we're pretty proud of what we've achieved over those 30 days.








[Nest-url]: https://nestjs.com/
[Nest.js]: https://img.shields.io/badge/nest.js-000000?style=for-the-badge&logo=nestjs&logoColor=white
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Typescript.com]: https://img.shields.io/badge/Typescript-0769AD?style=for-the-badge&logo=typescript&logoColor=white
[Typescript-url]: https://www.typescriptlang.org/
