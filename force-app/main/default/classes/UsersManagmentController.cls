global with sharing class UsersManagmentController {
    
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
            List<Network> communitiesNames = [SELECT Name, (SELECT Id FROM NetworkMembers) FROM Network];
            
            
            return communitiesNames;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    // @AuraEnabled
    // public static List<UserWrapper> getAllCommunitiesUsers() {
    //     // Get all active communities 
    //     List<Network> communities = [SELECT Id, Name FROM Network WHERE Status = 'Live'];

    //     // Initialize a map to hold unique users
    //     Map<Id, UserWrapper> uniqueUsersMap = new Map<Id, UserWrapper>();

    //     // Loop through each community and get the users
    //     for (Network community : communities) {
    //         // Query to get user IDs for the current community
    //         List<NetworkMember> communityMembers = [SELECT MemberId FROM NetworkMember WHERE NetworkId = :community.Id];
    //         // Add the user IDs to the map
    //         for (NetworkMember member : communityMembers) {
    //             uniqueUsersMap.put(member.MemberId, null);
    //         }
    //     }

    //     // Query to get unique user details based on the collected IDs
    //     List<User> uniqueUsers = [SELECT Profile.UserLicense.Name,  Lastname,Account.Name ,email,alias ,username, isActive,  Id, Profile.Name FROM User WHERE Id IN :uniqueUsersMap.keySet()];

    //     // Update the map with user details
    //     for (User user : uniqueUsers) {
    //         uniqueUsersMap.put(user.Id, new UserWrapper(user));
    //     }
    //     System.debug('users : '+ uniqueUsersMap.values());
    //     // Return the list of unique users
    //     return uniqueUsersMap.values();
    // }





    @AuraEnabled
    public static List<UserWrapper> getAllusersApex(){
        try {
            List<User> CommunityUser = new List<User>();
            // System.debug(userName);
            

                CommunityUser = [select Profile.UserLicense.Name,  Lastname,Account.Name ,email,alias ,username, isActive,  Id, Profile.Name from user where Profile.Name in ('Customer Community User', 'Customer Community Login User')];
           
            List<userWrapper> listW = new List<userWrapper>();

            for(User u : CommunityUser){
                listW.add(new UserWrapper(u));
            }

            return listW;
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
        public static String createNewUsers(List<User> users) {
            // List to hold created User records
            List<User> createdUsers = new List<User>();
    
            for (User newUser : users) {
                if (String.isEmpty(newUser.ContactId)) {
                    // Create a new Contact record
                    
                    try {
                        Account acc = new Account(Name = newUser.LastName);
                        insert acc;
                        // create and Insert the Contact record into the database
                        Contact con = new Contact(LastName = newUser.LastName, AccountId = acc.Id);
                        insert con;
                        System.debug('Contact created with success: ' + con.Id);
                        
                        // Set the ContactId on the User record
                        newUser.ContactId = con.Id;
                        
                        // Add the User to the list for bulk insertion
                        createdUsers.add(newUser);
                    } catch (Exception e) {
                        System.debug('error ' + e);
                        return 'Error while creating user: ' + e.getMessage();
                    }
                } else {
                    // If ContactId is provided, add the User directly to the list
                    createdUsers.add(newUser);
                }
            }
    
            // Try to insert all User records at once
            try {
                insert createdUsers;
                System.debug('Users created successfully');
                return 'Users created successfully';
            } catch (DmlException dmlEx) {
                System.debug('DML exception: ' + dmlEx);
                return 'Error during user creation: ' + dmlEx.getMessage();
            }
        }
    

        @auraEnabled
        public static String sendMailUser(String address, String subject, String body, String fileName, String base64Data, String contentType) {
            try {
             EmailManager.sendMail(address, subject, body,  fileName, base64Data, contentType);
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
             
      
       return 'error : '+ e ;
        }
        
       
    }
    @auraEnabled
    public static String desactivateSelectedUser(String userId){
        User u = [select name, isActive from user where id =: userId];
        
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
    public static String sendEmailToManyUsers(List<String> ids,String subject,String body, String fileName, String base64Data, String contentType){
        
        List<user> userWithIds = [select Email from User where Id IN :ids];
        for(User u : userWithIds){
            // System.debug('email : '+U.Email+ ' subject : '+ subject+ ' body : '+body);
            try {
                
                EmailManager.sendMail(U.Email, subject, body, fileName, base64Data, contentType);

            } catch (EmailException e) {
                
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
    
    @AuraEnabled
    public static Map<String, String> getLanguageLocaleKey() {
        Map<String, String> languageCodes = new Map<String, String>();
         for (PicklistEntry entry : User.LanguageLocaleKey.getDescribe().getPicklistValues()){
             languageCodes.put(entry.getValue(), entry.getLabel());
         }
             
        
         return languageCodes;
     }
     @AuraEnabled
    public static Map<String, String> getLocaleSidKey() {
        Map<String, String> languageCodes = new Map<String, String>();
         for (PicklistEntry entry : User.LocaleSidKey.getDescribe().getPicklistValues()){
             languageCodes.put(entry.getValue(), entry.getLabel());
         }
             
        
         return languageCodes;
     }

     @AuraEnabled(cacheable=true)
    public static String getOrgId() {
        return UserInfo.getOrganizationId();
    }

    @AuraEnabled(cacheable=true)
    public static String getOrgBaseUrl() {
        return URL.getOrgDomainUrl().toExternalForm();
    }



    @AuraEnabled
public static String createCaseWithAttachments(String subject, String description, String email, List<Map<String, String>> files, String status, String priority, String type) {
    System.debug('files received: ' + files);
    
    
    // Retrieve or create the contact


    
    // Create the case
    Case newCase = new Case(
        Subject = subject,
        Description = description,
        SuppliedEmail = email,
        Origin = 'Web',
        Status = status,
        Priority = priority,
        Type = type
        
    );
    try {
        insert newCase;
    } catch (DmlException e) {
        System.debug('Error creating case: ' + e.getMessage());
        throw new AuraHandledException('Error creating case: ' + e.getMessage());
    }
    
     // If there are attachments, create them
     if (files != null && !files.isEmpty()) {
        List<Attachment> attachmentList = new List<Attachment>();
        for (Map<String, String> fileMap : files) {
            String fileName = fileMap.get('fileName');
            String base64Data = fileMap.get('base64Data');
            
            System.debug('Processing file: ' + fileName);
            System.debug('Base64 Data: ' + base64Data);
            
            if (fileName != null && base64Data != null) {
                try {
                    // Decode the base64 content and create the attachment
                    Attachment att = new Attachment(
                        Body = EncodingUtil.base64Decode(base64Data),
                        Name = fileName,
                        ParentId = newCase.Id
                    );
                    attachmentList.add(att);
                } catch (System.StringException e) {
                    System.debug('Error decoding file: ' + fileName + ' - ' + e.getMessage());
                }
            } else {
                System.debug('Skipping null or incomplete file entry');
            }
        }
        if (!attachmentList.isEmpty()) {
            insert attachmentList;
        }
    }

    return newCase.Id;
}

    @auraEnabled 
    public static void switchToCommunityUserApex(String userID){
        
        User u = [select Name, Id from User where Id =: userID limit 1 ];
        Profile comunityUserPrfileId = [select Id from profile where Name ='Customer Community User' limit 1];
        u.ProfileId = comunityUserPrfileId.Id;
        System.debug('id : '+ userID);
        try{
            update u;
            System.debug('user updated');
        }catch(DMLException e){
            System.debug('excetion caught : '+ e);
        }
    }
    

    @auraEnabled 
    public static void switchToCommunityLoginUserApex(String userID){
        
        User u = [select Name, Id from User where Id =: userID limit 1 ];
        Profile comunityUserPrfileId = [select Id from profile where Name ='Customer Community Login User' limit 1];
        u.ProfileId = comunityUserPrfileId.Id;
        System.debug('id : '+ userID);
        try{
            update u;
            System.debug('user updated');
        }catch(DMLException e){
            System.debug('excetion caught : '+ e);
        }
    }
}