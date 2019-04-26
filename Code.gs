// Most of the basic code of this script is taken from https://github.com/alessbelli/cron-supelec-ent (file code.gs)

function checkChanges(){
  // if this script is not attached to a sheet, or if SpreadsheetApp.getActiveSheet() does not work for some reason
  const sheetID = ""; // the sheet's ID here (you can find it in the url of the sheet)
  
  const email = Session.getActiveUser().getEmail();
  
  var sheet, url, checkPath, oldVal, newVal, title;
  
  sheet = SpreadsheetApp.getActiveSheet();
  if (sheet === null) {
    sheet = SpreadsheetApp.openById(sheetID).getActiveSheet();
    if (sheet === null)
      throw "could not get a sheet";
  }
  
  var i = 2;
  while (sheet.getRange(1, i).getValue() !== "") {
    title = sheet.getRange(1, i).getValue();
    url = sheet.getRange(2, i).getValue();
    checkPath = sheet.getRange(3, i).getValue();
    oldVal = sheet.getRange(4, i).getValue(); // the value that was previously entered
    
    try {
      newVal = getVal(url, checkPath);
    }
    catch (error) {
      if (true);
      newVal = error.message;
    }
    
    if (oldVal !== newVal) {
      sheet.getRange(4, i).setValue(newVal);
      
      MailApp.sendEmail({
        to: email,
        subject: "The page has changed, or error caught (" + title + ")",
        body: 'The page "' + title + '" has changed, or an error was caught:\n' + newVal + '\nold one was:\n' + oldVal
      });
      Logger.log("Mail sent (" + newVal + ")");
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
