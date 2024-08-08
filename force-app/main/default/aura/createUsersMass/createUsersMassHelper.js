/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
({
    getAllProfiles : function(component, callback){
        var action = component.get("c.getProfiles");

        action.setCallback(this, function(profilesResponse){
            var state = profilesResponse.getState();
            if (state === "SUCCESS") {

                var action1 = component.get('c.getContacts');
                action1.setCallback(this, function(contactsResponse){
                    if(contactsResponse.getState()==="SUCCESS"){
                        


                        var action2 = component.get("c.getLanguageLocaleKey");   
                        action2.setCallback(this, function(localeKeyResponse){
                            console.log("response.state() : ", localeKeyResponse.getState());
                            if(localeKeyResponse.getState()==='SUCCESS') {
                                var action3 = component.get("c.getLocaleSidKey");   
                                action3.setCallback(this, function(localeSidKeyResponse){
                                    component.set("v.LocaleSidKeys", localeSidKeyResponse.getReturnValue())
                                    component.set("v.LanguageLocaleKeys", localeKeyResponse.getReturnValue())
                                    component.set('v.profiles', profilesResponse.getReturnValue());
                                    contactsResponse.getReturnValue().unshift({id:"", Name:"select contact", hidden : true});
                                    component.set('v.contacts', contactsResponse.getReturnValue());

                                    callback(profilesResponse.getReturnValue(), contactsResponse.getReturnValue(), localeKeyResponse.getReturnValue(),localeSidKeyResponse.getReturnValue());
                                    
                                })
                                $A.enqueueAction(action3);
                                
                            }
                            else if(localeKeyResponse.getState()==='ERROR') {
                                console.log('error getting the localeKey map');
                            }
                        });
                        $A.enqueueAction(action2);




                        
                        
                        
                    }
                });
                $A.enqueueAction(action1);


               
               
                
                
                
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
            if(response.getState()==='SUCCESS' && !response.getReturnValue().startsWith("Error")) {
                console.log('users created successfully : ', response.getReturnValue());
                    component.set("v.visibleToast", true)
                    component.set("v.toastVariant", "success")
                    component.set("v.toastIcon", "success")
                    component.set("v.toastMessage", "new users added with success")
                setTimeout(function(){
                    window.open(window.location.origin + "/c/communitiesApp.app","_self");
                }, 3000)
            }
            else{
                console.log('error while creating users');
                component.set("v.visibleToast", true)
                    component.set("v.toastVariant", "error")
                    component.set("v.toastIcon", "error")
                    component.set("v.toastMessage", "error while adding new users")
            }
        });
        $A.enqueueAction(action);

    },
    
})
