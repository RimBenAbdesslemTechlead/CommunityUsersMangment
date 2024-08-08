public with sharing class EmailManager  {
    // Public method
    public static void sendMail(String address, String subject, String body, String fileName, String base64Data, String contentType) {
        // Create an email message object
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        String[] toAddresses = new String[] {address};
        mail.setToAddresses(toAddresses);
        mail.setSubject(subject);
        mail.setPlainTextBody(body);
        // Pass this email message to the built-in sendEmail method 
        // of the Messaging class

                
if(!String.isEmpty(fileName) && ! String.isEmpty(base64Data) && String.isEmpty(contentType)){
// Create the email attachment
    Messaging.EmailFileAttachment attachment = new Messaging.EmailFileAttachment();
    attachment.setFileName(fileName);
    attachment.setBody(EncodingUtil.base64Decode(base64Data));
    attachment.setContentType(contentType);

    // Attach the file to the email
    mail.setFileAttachments(new Messaging.EmailFileAttachment[] { attachment });
}

        Messaging.SendEmailResult[] results = Messaging.sendEmail(
                                  new Messaging.SingleEmailMessage[] { mail });
        // Call a helper method to inspect the returned results
        inspectResults(results);
    }
    // Helper method
    private static Boolean inspectResults(Messaging.SendEmailResult[] results) {
        Boolean sendResult = true;
        // sendEmail returns an array of result objects.
        // Iterate through the list to inspect results. 
        // In this class, the methods send only one email, 
        // so we should have only one result.
        for (Messaging.SendEmailResult res : results) {
            if (res.isSuccess()) {
                System.debug('Email sent successfully');
            }
            else {
                sendResult = false;
                System.debug('The following errors occurred: ' + res.getErrors());                 
            }
        }
        return sendResult;
    }
}