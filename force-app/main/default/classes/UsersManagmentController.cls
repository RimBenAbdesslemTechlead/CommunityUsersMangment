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


    @AuraEnabled
    public static String getNewUser(String name,String email,String alias,String username,String tz,String loc,String emlenco,String lang){

        Account Acc = [select Name, Id ,OwnerId, Owner.Name From Account where OwnerId != null And Owner.Name='user user' limit 1];
        Contact Contactini = new Contact(lastName='apexx code account', AccountId = Acc.Id);
        insert Contactini;
        System.debug('name : '+ name + ' email : '+ email + ' alias : '+ alias + ' username : '+ username+'tz : '+tz + 'loc : '+ loc +'emlenco : '+ emlenco + 'lang : '+ lang);
        User uss = new User(lastName = name,
                            email = email,
                            alias = alias,
                            ProfileId = '00eQI000002DQ8qYAG',
                            ContactId =Contactini.Id,
                            username= username,
                            TimeZoneSidKey = tz,
                            LocaleSidKey = loc,
                            EmailEncodingKey= emlenco,
                            LanguageLocaleKey = lang);
        insert uss;
        
        return 'ID : ' +  uss;
    }
    
    
    
}