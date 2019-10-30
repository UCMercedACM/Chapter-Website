var path = require("path");
var templatesDir = path.resolve(__dirname, "views/mailer");
var Email = require("email-templates");

const mailjet = require("node-mailjet").connect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

const sendEmail = (messageInfo, text, html) => {
  return mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: { Email: messageInfo.fromEmail, Name: messageInfo.fromName },
        To: [ { Email: messageInfo.email } ],
        Subject: messageInfo.subject,
        TextPart: text,
        HTMLPart: html
      }
    ]
  });
  
};

exports.sendOne = function(templateName, messageInfo, locals) {
   const email = new Email({
    views: { root: templatesDir, options: { extension: "ejs" } }
  });

  return Promise.all([
    email.render(`${templateName}/html`, locals),
    email.render(`${templateName}/text`, locals)
  ])
    .then(([html, text]) => {
      return sendEmail(messageInfo, text, html);
    })
    .catch(console.error);
};