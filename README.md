# Madalico
### A Google Apps script that will tell you when a specific part of a web-page has been changed

It will periodically fetch the web pages you want, look at a specific element and will send you an email if that element was different than the last time this script was executed.  

A large part of the code was taken from or inspired by [alessbelli/cron-supelec-ent](https://github.com/alessbelli/cron-supelec-ent/).  

## Instructions for use
1) Create a [Google Spreadsheet](https://docs.google.com/spreadsheets/) using your Google Account
2) Fill in the sheet with the urls and paths of what you want to listen to (see [Syntax of the sheet](#syntax-of-the-sheet) below)
3) Add a script to the page using Tools>Script Editor, or create a project on [script.google.com](https://script.google.com/home)
4) Edit the script, and paste the code from [Code.gs](Code.gs) in this repository
5) If you created a new project instead of adding a script directly in the sheet, change the constant `sheetID` to the (spreadsheet ID)[https://developers.google.com/sheets/api/guides/concepts#spreadsheet_id] of your sheet
6) Run the function `checkChanges()`
7) If you haven't saved your script yet, it will prompt you to do so
8) There may be a warning saying this script is not yet approved by google, go to "more options" and say you agree
9) When Google prompts you, give the authorization to your script to send e-mails, to edit your spreadsheet etc
10) Enjoy! You can check or make it so that the script is set to run every hour by going to Edit-> Current project triggers

### Syntax of the sheet
Each site you want to track takes a column, starting from column `B`  
For each site (column) the cells correspond from top to bottom:
- Optionally a title on  for what you are tracking (will be in the subjects of emails you will receive)
- The url of the page to want to watch
- The path to to the html element to watch in the page
- The latest value that was watched. This is used by he script to compare with the new value, and then updated. It will be filled on the first run of the script

-|A|B
-|-|-
1|title:|Changes to the title Madalico in the repository name on github 
2|url:|https://github.com/Speedphoenix/Madalico
3|path:|/html/body/div[4]/div/main/div[1]/div/h1/strong/a
4|latest value:|Madalico

See [this spreadsheet](https://docs.google.com/spreadsheets/d/1MasTLf3-_XS-Ji0UNaEkb3-qaARx6gpOF40jDxPph88/edit#gid=0) as an example

[//]: # (The name Madalico was adopted after finding out that "mabadiliko" means "change" in Swahili)
