public with sharing class UsersManagmentController {
    
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
    public static List<User> getCommunityUserByProfiles(String networkId){
        try {
            List<User> CommunityUser = [select Name, Id, Profile.Name from user where Profile.Name in ('Customer Community User', 'Customer Community Login User') and ID in (select MemberId from networkMember where networkId =:networkId )];
            return CommunityUser;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    
}