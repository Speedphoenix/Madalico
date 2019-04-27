// Most of the basic code of this script is taken from https://github.com/alessbelli/cron-supelec-ent (file code.gs)

function checkChanges() {
  // provide the sheet's ID if this script is not attached to a sheet, or if SpreadsheetApp.getActiveSheet() does not work for some reason
  const sheetID = ""; // the sheet's ID here (you can find it in the url of the sheet)
  const titleRow = 1;
  const urlRow = 2;
  const pathRow = 3;
  const valueRow = 4;
  const timeRow = 5;
  const errorRow = 6;
  
  const email = Session.getActiveUser().getEmail();
  
  var sheet, url, checkPath, oldVal, newVal, title, oldError, newError, isError;
  
  sheet = SpreadsheetApp.getActiveSheet();
  if (sheet === null) {
    sheet = SpreadsheetApp.openById(sheetID).getActiveSheet();
    if (sheet === null)
      throw "could not get a sheet";
  }
  
  var i = 2;
  while (sheet.getRange(urlRow, i).getValue() !== "") {
    title = sheet.getRange(titleRow, i).getValue();
    url = sheet.getRange(urlRow, i).getValue();
    checkPath = sheet.getRange(pathRow, i).getValue();
    oldVal = sheet.getRange(valueRow, i).getValue(); // the value that was previously entered
    oldError = sheet.getRange(errorRow, i).getValue();
    isError = false;
    
    try {
      newVal = getVal(url, checkPath);
    }
    catch (error) {
      newError = error.message;
      isError = true;
    }
    
    if (isError)
    {
      if (oldError !== newError)
      {
        sheet.getRange(errorRow, i).setValue(newError);
        MailApp.sendEmail({
          to: email,
          subject: "A (different) error has been caught on the Madalico script (" + title + ")",
          body: 'Caught an error while trying the page "' + title + '":\n' + newError + '\nold one was:\n' + oldError
        });
        Logger.log("Mail for the error sent (" + newError + ")");
      } 
    }
    else
    {
      if (oldVal !== newVal) {
        sheet.getRange(valueRow, i).setValue(newVal);
        
        MailApp.sendEmail({
          to: email,
          subject: "The page has changed (" + title + ")",
          body: 'The page "' + title + '" has changed:\n' + newVal + '\nold one was:\n' + oldVal
        });
        Logger.log("Mail sent (" + title + ", " + newVal + ")");
      }
      sheet.getRange(timeRow, i).setValue(new Date()).setNumberFormat("yyyy-MM-dd HH:mm:ss");
    }
    i++;
  }
}

// to see when a specific part of a webpage has changed (so you don't have to F5 every day?)

function getVal(url, checkPath) {
  
  var response, responseContent, newVal, fullText;
  
  // HTTP Response Code of the last server request
  if (!ScriptProperties.getProperty("status")) {
    ScriptProperties.setProperty("status", 200);
  }
  
  // Fetch the web page using UrlFetchApp
  response = UrlFetchApp.fetch(url);
  responseContent = response.getContentText("UTF-8"); // if needed
  
  var inter = getDataFromXpath(checkPath, response)
  if (inter === null) {
    return "getDataFromXpath returned null, check path?";
  }
  else {
    return inter.getText();
  }
}

// Note that the function below only supports basic Xpath, and not things like '//'
// Useful function to get an HTML element from its XPath, credits to @vs4vijay at https://coderwall.com/p/cq63og/extract-data-from-xpath-via-google-apps-script
function getDataFromXpath(path, responseText) {
  var xmlDoc = Xml.parse(responseText, true);
  
  // Replacing tbody tag because app script doesnt understand.
  path = path.replace("/html/","").replace("/tbody","","g");
  var tags = path.split("/");
  var element = xmlDoc.getElement();
  for(var i in tags) {
    var tag = tags[i];
    var index = tag.indexOf("[");
    if(index != -1) {
      var val = parseInt(tag[index+1]);
      tag = tag.substring(0,index);
      element = element.getElements(tag)[val-1];
    } else {
      element = element.getElement(tag);
    }
  }
  return element;
}
