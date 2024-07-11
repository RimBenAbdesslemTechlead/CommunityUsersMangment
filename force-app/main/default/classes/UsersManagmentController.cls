public with sharing class UsersManagmentController {
    
    //custom class
    public class UserWrapper {
        @AuraEnabled public String Id { get; set; }
        @AuraEnabled public String Name { get; set; }
        @AuraEnabled public String ProfileName { get; set; }
        @AuraEnabled public String AccountName { get; set; }
        @AuraEnabled public String email { get; set; }
        @AuraEnabled public String alias { get; set; }
        @AuraEnabled public String username { get; set; }
        @AuraEnabled public Boolean isActive {get; set;}
        
        public UserWrapper(User u) {
            Id = u.Id;
            Name = u.Name;
            ProfileName = u.Profile.Name;
            AccountName = u.Account.Name;
            email =  u.email; 
            alias = u.alias;
            username = u.username;
            isActive = u.isActive; 
        
        }
    }




    @AuraEnabled
    public static List<Network> getCommunities(){
        try {
            List<Network> communitiesNames = [select Name from network];
            
            
            return communitiesNames;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<UserWrapper> getCommunityUserByProfiles(String networkId, String userName){
        try {
            List<User> CommunityUser = new List<User>();
            // System.debug(userName);
            if(userName == null){

                CommunityUser = [select Name,Account.Name ,email,alias ,username, isActive,  Id, Profile.Name from user where Profile.Name in ('Customer Community User', 'Customer Community Login User') and ID in (select MemberId from networkMember where networkId =:networkId )];
            }else{
                CommunityUser = [select Name,Account.Name, email, alias, username, isActive,  Id, Profile.Name from user where Profile.Name in ('Customer Community User', 'Customer Community Login User') and ID in (select MemberId from networkMember where networkId =:networkId ) And ((Name Like : ('%'+ userName+'%')) OR (Email Like : ('%'+ userName+'%')))];
            }
            List<userWrapper> listW = new List<userWrapper>();

            for(User u : CommunityUser){
                listW.add(new UserWrapper(u));
            }

            return listW;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    //get contacts when the pages if first loaded
    @AuraEnabled
    public static List<Contact> getContacts(){
        // Step 1: Retrieve IDs of users who have a role
        List<Id> userIdsWithRole = new List<Id>();
        for (User user : [SELECT Id FROM User WHERE UserRoleId != NULL]) {
            userIdsWithRole.add(user.Id);
        }
        
        // Step 2: Retrieve IDs of accounts owned by these users
        List<Id> accountIds = new List<Id>();
        if (!userIdsWithRole.isEmpty()) {
            for (Account account : [SELECT Id FROM Account WHERE OwnerId IN :userIdsWithRole]) {
                accountIds.add(account.Id);
            }
        }
        
        // Step 3: Retrieve IDs of contacts related to these accounts
        List<Contact> contactIds = new List<Contact>();
        if (!accountIds.isEmpty()) {
            for (Contact contact : [SELECT Id, Name FROM Contact WHERE AccountId IN :accountIds and Id not In (select contactId from user where contactId != null)]) {
                contactIds.add(contact);
            }
        }

return contactIds;
    }

    //get the list of possible profiles:
    @auraEnabled
    public static List<Profile> getProfiles(){
        List<UserLicense> customerUserLicenses = [
                    SELECT Id 
                    FROM UserLicense 
                    WHERE Name IN ('Customer Community', 'Customer Community Login')
                ];
                // Step 2: Retrieve profiles associated with these UserLicense IDs
                List<Profile> profilesList = [SELECT Id, Name FROM Profile WHERE UserLicenseId IN :customerUserLicenses];
                // System.debug('profilesList' + profilesList);
                return profilesList;
            
            }

            //create a single user
    @AuraEnabled
    public static String getNewUser(String name,String email,String alias,String username,String tz,String loc,String emlenco,String lang, String contactId, String profileId){

        // System.debug('profile : ' + profileId);
        User uss = new User(lastName = name,
                            email = email,
                            alias = alias,
                            ProfileId = profileId,
                            ContactId =contactId,
                            username= username,
                            TimeZoneSidKey = tz,
                            LocaleSidKey = loc,
                            EmailEncodingKey= emlenco,
                            LanguageLocaleKey = lang);
        
        
        try {
            insert uss;
            return 'ID : ' +  uss;
        } catch (DmlException e) {
            System.debug('Dml exception occured : '+ e);
            return 'error : ' + e;
        }
    }
    //create many users
    @AuraEnabled
    public static String createNewUsers(List<User> users){
        // List to hold created User records
        List<User> createdUsers = new List<User>();
        
        for (User newUser : users) {
            System.debug('User to be created: ' + newUser.LastName);
            
            // Optionally, add additional validation or processing logic here
            
            // Add the User record to the list
            createdUsers.add(newUser);
        }
        
        // Optionally, insert all User records into the database
        try {
            insert createdUsers;
            return 'users with Mass created with success';
        } catch (DmlException exe) {
            System.debug('DML exception' + exe);
            return 'error' + exe;
        }
    }

        @auraEnabled
        public static Boolean sendMailUser(String address, String subject, String body) {
            // Create an email message object
            Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
            String[] toAddresses = new String[] {address};
            mail.setToAddresses(toAddresses);
            mail.setSubject(subject);
            mail.setPlainTextBody(body);
            // Pass this email message to the built-in sendEmail method 
            // of the Messaging class
            Messaging.SendEmailResult[] results = Messaging.sendEmail(
                                    new Messaging.SingleEmailMessage[] { mail });
            // Call a helper method to inspect the returned results
            return inspectResults(results);
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
    //update existing user
    @AuraEnabled
    public static String updateUser(User user){
        // List to hold created User records
        try {
            update user;
            return 'user updated succesfully';
        } catch (DmlException e) {
             
       System.debug('error : '+ e);
       return 'error : '+ e ;
        }
        
       
    }
    
    
    
}