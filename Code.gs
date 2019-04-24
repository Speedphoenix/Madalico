// Most of the basic code of this script is taken from https://github.com/alessbelli/cron-supelec-ent (file code.gs)

// A script to see when a specific part of a webpage has changed (so you don't have to F5 every day?)

function hasItChanged()
{
  // the url of what you want to track
  const url = "http://www.the-site-you-want-to-track.com/"; // "http://www.lineaamica.gov.it/risposte/carta-identita-elettronica-italiani-residenti-allestero";

  // the path to the html element you want to catch
  const checkPath = "/html/body"; // "/html/body/div[2]/div[2]/div/section/div/section/article/div[5]/div[2]/div/span";

  // if this script is not attached to a sheet, or if SpreadsheetApp.getActiveSheet() does not work for some reason, it will use the sheet with this ID
  const sheetID = ""; // "15hKt3pPM-c0vnh0BDTGjx2IVecOhDVWV1xn6114xMqw";

  // A string that will be used in the emails
  const title = "";
  
  // The receiving email address
  const myEmail = "example@gmail.com";




  var response, responseContent, sheet, oldVal, newVal, fullText;

  // HTTP Response Code of the last server request
  if (!ScriptProperties.getProperty("status")) {
    ScriptProperties.setProperty("status", 200);
  }

  // Fetch the web page using UrlFetchApp
  response = UrlFetchApp.fetch(url);
  responseContent = response.getContentText("UTF-8"); // if needed

  sheet = SpreadsheetApp.getActiveSheet();
  if (sheet === null) {
    sheet = SpreadsheetApp.openById(sheetID).getActiveSheet();
    if (sheet === null)
      throw "could not get a sheet";
  }


  oldVal = sheet.getRange('A1').getValue(); // the value that was previously entered
  var inter = getDataFromXpath(checkPath, response)
  if (inter === null) {
    newVal = "getDataFromXpath returned null, check path?";
    throw "shouldn't be here";
  }
  else {
    newVal = inter.getText();
  }


  if (oldVal !== newVal) {
    sheet.getRange('A1').setValue(newVal);

    MailApp.sendEmail({
      to: myEmail,
      subject: "The page has changed, or error caught (" + title + ")",
      body: 'The page "' + title + '" has changed, or an error was caught'
    });
    Logger.log("Mail sent (" + newVal + ")");
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
