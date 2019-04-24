# Madalico
### A Google Apps script that will tell you when a specific part of a webpage has been changed

It will periodically fetch the web page you want, look at a specific element and will send you an email if that element was different the last time this script was executed  

A large part of the code was taken from or inspired by [alessbelli/cron-supelec-ent](https://github.com/alessbelli/cron-supelec-ent/)  

## Instructions for use:
1) Create a [Google Spreadsheet](https://docs.google.com/spreadsheets/) using your Google Account.
2) Add a script to the page using Tools>Script Editor
3) Edit the script, and paste the code from [Code.gs](Code.gs) in this repository.
4) Change the constants at the top of the script to your desired target.
4) Run the function `hasItChanged()`.
5) If you haven't saved your script yet, it will prompt you to do so.
6) There may be a warning saying this script is not yet approved by google, go to "more options" and say you agree.
7) When Google prompts you, give the authorization to your script to send e-mails, to edit your spreadsheet etc.
8) Enjoy! You can verify that the script is set to run every hour by going to Edit-> Current project triggers.

[//]: # (The name Madalico was adopted after finding out that "mabadiliko" means "change" in Swahili)
