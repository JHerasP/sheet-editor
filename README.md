# Sheet-editor

Simple project to modify a worksheet using the Google and Telegram APIs. The scope of this project is merely to extract the user from having to use a Google sheet to edit the same information each week.

## Description

In general, the project consists of a sheet configuration that is kept in memory and a telegram bot that is used to edit that configuration. The purpose of this setup is to contain the information that will be written into a Google sheet using a telegram bot as interface.

On top of this, there is a cron service which can create a task to write the sheet with the actual configuration on a given time.

The information that's written on the sheet consists of 5 cells with some speciffic values. Each cell represents a workweek day and the values are the phisical seats that are available at the office or the opportunity to work from home. For example:

```
              | Monday      | Tuesday | Wednesday  | Thursday    | Friday|
Employee name | Teletrabajo | A1      | Teletrabajo| Teletrabajo | C2    |
```

_Values are on spanish because the sheet language is spanish_

### How it works

First, using the comand _/start_ telegram will display a list of Employee names that have been previusly placed on the environment variables. On choosing one, It will locate the cells that are asigned to that employee and create a configuration for that user to edit that employee. Once this is done, the telegram user id is stored and it wont be able to change employee.

Second the telegram bot displays a menu that contains all the options that can be done. In short, this is used as a controller/interface. In there it is possible to:

- Edit the values that are going to be written by the user or the cron
- Write the values on to the sheet
- Get the actual values of the sheet
- Activate/Disable the cron
- Get the cron status
- Get the last error that the cron had

In addition to that, there are a few error handeling aspects that are related to the logic of the sheet:

- Not to overwrite the same value that is already in place
- Not duplicate seats with another co-worker
- Not write in to another co-worker row

Any error should be shown in telegram after performing any action.

## Installing

The project is prepared to run with Docker, however, in order to run the authentication with Gooogle, it is necessary to create an environment to work with Google Api. Therefore, the keys.env file should be placed on the root folder.

After that done, on the same root folder, create an .env file with the content on the ENV configuration file. Finally, just run:

```
npm install
npm run dev

```

## Acknowledgments

- [Google api](<https://twitter.com/dompizzie](https://developers.google.com/sheets/api/quickstart/nodejs)>)
