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
    
    
}