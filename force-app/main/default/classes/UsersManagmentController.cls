public with sharing class UsersManagmentController {
    
    //custom class
    public class UserWrapper {
        @AuraEnabled public String Id { get; set; }
        @AuraEnabled public String Lastname { get; set; }
        @AuraEnabled public String ProfileName { get; set; }
        @AuraEnabled public String AccountName { get; set; }
        @AuraEnabled public String email { get; set; }
        @AuraEnabled public String alias { get; set; }
        @AuraEnabled public String username { get; set; }
        @AuraEnabled public Boolean isActive {get; set;}
        @AuraEnabled public String License {get; set;}
        
        public UserWrapper(User u) {
            Id = u.Id;
            Lastname = u.LastName;
            ProfileName = u.Profile.Name;
            AccountName = u.Account.Name;
            email =  u.email; 
            alias = u.alias;
            username = u.username;
            isActive = u.isActive; 
            License = u.Profile.UserLicense.Name;
        
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

                CommunityUser = [select Profile.UserLicense.Name,  Lastname,Account.Name ,email,alias ,username, isActive,  Id, Profile.Name from user where Profile.Name in ('Customer Community User', 'Customer Community Login User') and ID in (select MemberId from networkMember where networkId =:networkId )];
            }else{
                CommunityUser = [select Profile.UserLicense.Name, LastName,Account.Name, email, alias, username, isActive,  Id, Profile.Name from user where Profile.Name in ('Customer Community User', 'Customer Community Login User') and ID in (select MemberId from networkMember where networkId =:networkId ) And ((Name Like : ('%'+ userName+'%')) OR (Email Like : ('%'+ userName+'%')))];
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
        User uss = new User(
                            LastName = name,
                            Email = email,
                            Alias = alias,
                            ProfileId = profileId,
                            ContactId =contactId,
                            Username= username,
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
        public static String sendMailUser(String address, String subject, String body) {
            try {
             EmailManager.sendMail(address, subject, body);
                return 'Mail sent with success';
            } catch (EmailException e) {
                System.debug('exception : '+ e);
                return 'Error : '+ e;
            }
            
            
           

        }
        // Helper method
        
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
    @auraEnabled
    public static String desactivateSelectedUser(String userId){
        User u = [select name, isActive from user where id =: userId];
        System.debug('users is'+ u);
        try {
            u.IsActive = false;
            update u;
            return 'user desactivated succesfully';
        } catch (DmlException e) {
            return 'error in desactivation : '+ e;
        }
        
    }

    @auraEnabled
    public static String activateSelectedUser(String userId){
        User u = [select name, isActive from user where id =: userId];
        System.debug('users is'+ u);
        try {
            u.IsActive = true;
            update u;
            return 'user activated succesfully';
        } catch (DmlException e) {
            return 'error in activation : '+ e;
        }
        
    }

    @AuraEnabled
    public static void resetPassword(String userId){
      System.resetPassword(userId, true);
    
    }


    @auraEnabled
    public static String sendEmailToManyUsers(List<String> ids,String subject,String body){
        
        List<user> userWithIds = [select Email from User where Id IN :ids];
        for(User u : userWithIds){
            // System.debug('email : '+U.Email+ ' subject : '+ subject+ ' body : '+body);
            try {
                
                EmailManager.sendMail(U.Email, subject, body);

            } catch (EmailException e) {
                System.debug('error : '+ e);
                return 'error  : '+ e;
            }
                
        }
        
        return 'success';
    }
    @auraEnabled
    public static String resetManyPasswords(List<String> ids){
        List<User> activeUsersPasswords = [select Id from User where IsActive=TRUE And Id in : ids];
        if (activeUsersPasswords.size()==0) {
            return 'can\'t reset password all users are innactive';
        }
        else{
            for(User u : activeUsersPasswords){
                System.resetPassword(U.Id, true);
                
            }
            return 'users passwords are resetted for active users';
        }
    }

    @auraEnabled
    public static String activateManyUsersApex(List<String> ids){
        List<User> inactiveUsersPasswords = [select Id from User where IsActive=FALSE And Id in : ids];
        for (User u : inactiveUsersPasswords) {
            u.IsActive = True;
        }
        try {
            update inactiveUsersPasswords;
            return 'Success in users activation many users';
        } catch (DmlException e) {
            return 'error activating many users' + e;
        }
    }
    @auraEnabled
    public static String disactivateManyUsersApex(List<String> ids){
        List<User> activeUsersPasswords = [select Id from User where IsActive=TRUE And Id in : ids];
        for (User u : activeUsersPasswords) {
            u.IsActive = False;
        }
        try {
            update activeUsersPasswords;
            return 'Success in users disactivation many users';
        } catch (DmlException e) {
            return 'error disactivating many users' + e;
        }
    }
    
    
    
}