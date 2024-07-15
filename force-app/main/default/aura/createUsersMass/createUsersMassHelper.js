/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
({
    getAllProfiles : function(component, callback){
        var action = component.get("c.getProfiles");

        action.setCallback(this, function(profilesResponse){
            var state = profilesResponse.getState();
            if (state === "SUCCESS") {

                var action1 = component.get('c.getContacts');
                action1.setCallback(this, function(contactsresponseResponse){
                    component.set('v.contacts', contactsresponseResponse.getReturnValue());
                    // console.log("from helper : ");
                    // console.log("contatcts : ", response.getReturnValue());
                    // console.log("profiles : ", profilesResponse.getReturnValue());
                    callback(profilesResponse.getReturnValue(), contactsresponseResponse.getReturnValue());
                    component.set('v.profiles', profilesResponse.getReturnValue());
                    component.set('v.contacts', contactsresponseResponse.getReturnValue());
                });
                $A.enqueueAction(action1);


                var profiles = profilesResponse.getReturnValue();
               
                
                
                
            } else {
                console.log("Failed with state: " + state);
            }
        });
        $A.enqueueAction(action);
    },
    createManyUsers : function(component, userRecords){
        // console.log("newUsersData : ", newUsersData[0].lastname);

        var action = component.get('c.createNewUsers');
        action.setParams(
            {
                users : userRecords
            }
        )
        action.setCallback(this, function(response){
            console.log("response.state() : ", response.getState());
            if(response.getState()==='SUCCESS') {
                console.log('users created sucessfully');
                window.open(window.location.origin + "/c/communitiesApp.app","_self");
            }
            else if(response.getState()==='ERROR') {
                console.log('error while creating users');
            }
        });
        $A.enqueueAction(action);

    }
})
