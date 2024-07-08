public with sharing class UsersManagmentController {
    
    //custom class
    public class UserWrapper {
        @AuraEnabled public String Id { get; set; }
        @AuraEnabled public String Name { get; set; }
        @AuraEnabled public String ProfileName { get; set; }
        @AuraEnabled public String AccountName { get; set; }
        
        public UserWrapper(User u) {
            Id = u.Id;
            Name = u.Name;
            ProfileName = u.Profile.Name;
            AccountName = u.Account.Name;
        
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
            System.debug(userName);
            if(userName == null){

                CommunityUser = [select Name,Account.Name , Id, Profile.Name from user where Profile.Name in ('Customer Community User', 'Customer Community Login User') and ID in (select MemberId from networkMember where networkId =:networkId )];
            }else{
                CommunityUser = [select Name,Account.Name , Id, Profile.Name from user where Profile.Name in ('Customer Community User', 'Customer Community Login User') and ID in (select MemberId from networkMember where networkId =:networkId ) And ((Name Like : ('%'+ userName+'%')) OR (Email Like : ('%'+ userName+'%')))];
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
                System.debug('profilesList' + profilesList);
                return profilesList;
            
            }

    @AuraEnabled
    public static String getNewUser(String name,String email,String alias,String username,String tz,String loc,String emlenco,String lang, String contactId, String profileId){

        System.debug('profile : ' + profileId);
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
        insert uss;
        
        return 'ID : ' +  uss;
    }
    
    
    
}