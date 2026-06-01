var RECIPIENT_EMAIL = 'charalambos.hadjipanayi@gmail.com';

function doPost(e) {
  try {
    var data    = JSON.parse(e.postData.contents);
    var name    = sanitise(data.name);
    var email   = sanitise(data.email);
    var message = sanitise(data.message);

    if (!name || !email || !message) {
      return respond({ success: false, error: 'Missing fields' });
    }

    var body = 'Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message;

    MailApp.sendEmail({
      to: RECIPIENT_EMAIL,
      subject: 'Website contact from ' + name,
      body: body,
      replyTo: email
    });

    return respond({ success: true });

  } catch (err) {
    return respond({ success: false, error: err.message });
  }
}

function doGet() {
  return respond({ status: 'Contact form endpoint is live.' });
}

function sanitise(val) {
  return (val || '').toString().trim().substring(0, 2000);
}

function respond(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
