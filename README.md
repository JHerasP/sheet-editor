# Sheet-editor

Simple project to edit an spreadsheet using the google API.

## Description

In general, the project consist on two cons that are pending to write on an specific spreadsheet. The first cron is in charge of writing the sheet and the second one is in charge of reseting the flow. 
The idea is that the writing cron is always going to try to write the sheet until he acomplish his task and then, it goes to "sleep". Afterwards on a given time, the second cron "awakes" the first.

The project is not aiming to write any information on any given sheet. All the information related to wich sheet and where to write is configured by environmental variables but the information that is going to be wroten just contemplates the posibility of 5 cells in the same row.

Every information that is giving to the cross is obtained from environmental variables, that includes the following:

* CRON_EXPRESION = '*/30 * * * * *'
* RESET_CRON_EXPRESION = '0 1 * * FRI'
* SHEET_ID = ""
* SHEET_NAME = ""
* SHEET_RANGE_READ = '!J13:O13'
* SHEET_RANGE_WRITE = '!K13:O13'
* EMPLOYEE_NAME = 'John'
* WEEK_MONDAY = "AnyString"
* WEEK_TUESDAY = "AnyString"
* WEEK_WEDNESDAY = "AnyString"
* WEEK_THURSDAY = "AnyString"
* WEEK_FRIDAY = "AnyString"

### How it works

Fist, the project should be able to autenticate itself, for that the proper config on the Google Console has to be made first. Second, the project is going to validate all the information from the enviromentan variables, if they are not correct, it should show information on the console about what is wrong.

Considering that everything is right, he project should run both cron at the given times, the first one is going to read/write the given sheet, an example of reading would be:  * *!J13:O13 This means 6 cells horizontaly from J to O on the row 13* *

The scope of this project is based on the idea that the rows are going to follow the next structure:   

```
      J       |   K    |    L    |    M     |    N     |   O   |
Employee name | Monday | Tuesday | Wednesday| Thursday | Friday|
```

The next action is to check from the information that readed before. First, it will check that the first cell belongs to the given * * Employee name * * The reason behind that will be explained futher. 
In case that the name of the first cell does not match, no futher interactions are made.

If the previous case is not given, the next check that is going to be realized is the amount of values that the row has. Since, the intention is just to write the information when the cells next to the employee name are empty, this check is important.

Finnaly, if everything goes right, right employee and empty cells, the next 5 cells will we written with the given information on each enviroment variable.

If everything goes right, the cells are modified, the frist cron will be "locked" so it wont make any more calls to the Google Api. Now is when the second cron takes place, normally, the first cron is configured to run on a fast pace, 1 time per minute or so, but the second is configured to run once per week. 
And its only action is to "unlock" the first cron, so it can run the process again.

### Why

The reason behind the creation for this project is just that my company forces me to write the same useless information every single week on Fridays. The sheet is cleaned every Friday on at a random period (more or less when my supervisor remmebers it) So, every Friday, the first cron is going to attempt to fill the sheet as soon as gets emptied and sleep until the next Friday.


## Installing

The project is prepared to run with Docker, however, in order to run the authentication with Gooogle, it is necesary to create an environment to work with Google Api. Therefore, the keys.env file should be placed on the root folder.

After that done, on the same root folder, create an .env file with the above mentioned. Finnaly, just run:

```
npm install
npm run dev

``` 

## Acknowledgments
* [Google api](https://twitter.com/dompizzie](https://developers.google.com/sheets/api/quickstart/nodejs))

