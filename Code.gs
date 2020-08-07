// Most of the basic code of this script is taken from https://github.com/alessbelli/cron-supelec-ent (file code.gs)

function checkChanges() {
  // provide the sheet's ID if this script is not attached to a sheet, or if SpreadsheetApp.getActiveSheet() does not work for some reason
  const sheetID = "15hKt3pPM-c0vnh0BDTGjx2IVecOhDVWV1xn6114xMqw"; // the sheet's ID here (you can find it in the url of the sheet)
  const titleCol = 1;
  const urlCol = 2;
  const pathCol = 3;
  const valueCol = 4;
  const timeCol = 5;
  const startErrorCol = 6;
  
  const email = Session.getActiveUser().getEmail();
  
  var sheet, url, checkPath, oldVal, newVal, title, oldError, newError, isError, errorCol;
  
  sheet = SpreadsheetApp.getActiveSheet();
  if (sheet === null) {
    sheet = SpreadsheetApp.openById(sheetID).getActiveSheet();
    if (sheet === null)
      throw "could not get a sheet";
  }

  
  var i = 2;
  while (sheet.getRange(i, urlCol).getValue() !== "") {
    title = sheet.getRange(i, titleCol).getValue();
    url = sheet.getRange(i, urlCol).getValue();
    checkPath = sheet.getRange(i, pathCol).getValue();
    oldVal = sheet.getRange(i, valueCol).getValue(); // the value that was previously entered
    
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
      errorCol = startErrorCol; 
      oldError = sheet.getRange(i, errorCol).getValue();
      while (oldError !== "" && oldError !== newError)
      {
        errorCol += 2;
        oldError = sheet.getRange(i, errorCol).getValue();
      }
      if (oldError === "")
      {
        sheet.getRange(i, errorCol).setValue(newError);
        MailApp.sendEmail({
          to: email,
          subject: "A (different) error has been caught on the Madalico script (" + title + ")",
          body: 'Caught an error while trying the page "' + title + '":\n' + newError + '\nold one was:\n' + oldError
        });
        Logger.log("Mail for the error sent (" + newError + ")");
      }
      sheet.getRange(i, errorCol + 1).setValue(new Date()).setNumberFormat("yyyy-MM-dd HH:mm:ss");
    }
    else
    {
      errorCol = startErrorCol;
      if (oldVal !== newVal) {
        sheet.getRange(i, valueCol).setValue(newVal);
        
        MailApp.sendEmail({
          to: email,
          subject: "The page has changed (" + title + ")",
          body: 'The page "' + title + '" has changed:\n' + url + '\n' + newVal + '\nold one was:\n' + oldVal
        });
        Logger.log("Mail sent (" + title + ", " + newVal + ")");
      }
      sheet.getRange(i, timeCol).setValue(new Date()).setNumberFormat("yyyy-MM-dd HH:mm:ss");
    }
    i++;
  }
}

// to see when a specific part of a webpage has changed (so you don't have to F5 every day?)

function getVal(url, checkPath) {
  
  var response, responseContent, newVal, fullText;
  
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
