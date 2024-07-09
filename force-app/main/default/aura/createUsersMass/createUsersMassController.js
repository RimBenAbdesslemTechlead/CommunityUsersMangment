/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
({
    init : function(component, event, helper){
        var nbUsers = component.get("v.NbUsers");

        // Wait for the profiles to be fetched
        helper.getAllProfiles(component, function(profiles, contacts) {
            var componentsToCreate = [
                ["lightning:card", {
                    "title" : "form for user #" + nbUsers
                }],
                ["lightning:input", {
                    "type": "text",
                    "label": "Last Name",
                    "aura:id" : "lastname" + nbUsers
                }],
                ["lightning:input", {
                    "type": "email",
                    "label": "Email",
                    "aura:id" : "email" + nbUsers
                }],
                ["lightning:input", {
                    "type": "text",
                    "label": "Alias",
                    "aura:id" : "alias" + nbUsers
                }],
                ["lightning:input", {
                    "type": "email",
                    "label": "Username",
                    "aura:id" : "username" + nbUsers
                }],
                ["lightning:select", {
                    "label": "contacts",
                    "aura:id" : "selectContact" + nbUsers
                }],
                ["lightning:select", {
                    "label": "profiles",
                    "aura:id" : "selectProfile" + nbUsers
                }]
            ];

            // Concatenate the profiles list elements
            for (var i = 0; i < profiles.length; i++) {
                componentsToCreate.push(["option", {
                    "value": profiles[i].Id,
                    "label": profiles[i].Name,
                    
                }]);
            }
            for ( i = 0; i < contacts.length; i++) {
                componentsToCreate.push(["option", {
                    "value": contacts[i].Id,
                    "label": contacts[i].Name,
                    
                }]);
            }

            // console.log("form controller : ", contacts);

            $A.createComponents(
                componentsToCreate,
                function(components, status, errorMessage){
                    if (status === "SUCCESS") {
                        console.log("components length: ", components.length);
                        var card = components[0];
                        var inputs = components.slice(1,7);
                        var options = components.slice(7,9);
                       
                        inputs[5].set("v.body",options);
                        var cOptions = components.slice(9);
                        inputs[4].set("v.body", cOptions);

                        // Set the inputs as the body of lightning:card
                        card.set("v.body", inputs);

                        // Append the card to the body of the component
                        var body = component.get("v.body");
                        body.push(card);
                        component.set("v.isLoading", false);
                        component.set("v.body", body);
                        console.log('Component successfully created and added to body');
                    } else if (status === "INCOMPLETE") {
                        console.log("No response from server or client is offline.");
                    } else if (status === "ERROR") {
                        console.log("Error message: " + errorMessage);
                    }
                }
            );
        });
    },

    handleNewUserClick : function(component, event, helper){
        component.set("v.isLoading", true);
        var nbUsers = component.get("v.NbUsers");
        ++nbUsers;
        component.set("v.NbUsers", nbUsers);

        // Wait for the profiles to be fetched
        helper.getAllProfiles(component, function(profiles, contacts) {
            var componentsToCreate = [
                ["lightning:card", {
                    "title" : "form for user #" + nbUsers,
                    "class" :"centered-layout-item"
                }],
                ["lightning:input", {
                    "type": "text",
                    "label": "Last Name",
                    "aura:id" : "lastname" + nbUsers
                }],
                ["lightning:input", {
                    "type": "email",
                    "label": "Email",
                    "aura:id" : "email" + nbUsers
                }],
                ["lightning:input", {
                    "type": "text",
                    "label": "Alias",
                    "aura:id" : "alias" + nbUsers
                }],
                ["lightning:input", {
                    "type": "email",
                    "label": "Username",
                    "aura:id" : "username" + nbUsers
                }],
                ["lightning:select", {
                    "label": "contacts",
                    "aura:id" : "selectContact" + nbUsers
                }],
                ["lightning:select", {
                    "label": "profiles",
                    "aura:id" : "selectProfile" + nbUsers
                }]
            ];

            // Concatenate the profiles list elements
            for (var i = 0; i < profiles.length; i++) {
                componentsToCreate.push(["option", {
                    "value": profiles[i].Id,
                    "label": profiles[i].Name,
                    
                }]);
            }
            for ( i = 0; i < contacts.length; i++) {
                componentsToCreate.push(["option", {
                    "value": contacts[i].Id,
                    "label": contacts[i].Name,
                    
                }]);
            }
            $A.createComponents(
                componentsToCreate,
                function(components, status, errorMessage){
                    if (status === "SUCCESS") {
                        var card = components[0];
                        var inputs = components.slice(1,7);
                        var options = components.slice(7,9);
                        inputs[5].set("v.body",options);
                        var cOptions = components.slice(9);
                        inputs[4].set("v.body", cOptions);
                        // Set the inputs as the body of lightning:card
                        card.set("v.body", inputs);

                        // Append the card to the body of the component
                        var body = component.get("v.body");
                        body.push(card);
                        component.set("v.isLoading", false);
                        component.set("v.body", body);
                        console.log('Component successfully created and added to body');
                    } else if (status === "INCOMPLETE") {
                        console.log("No response from server or client is offline.");
                    } else if (status === "ERROR") {
                        console.log("Error message: " + errorMessage);
                    }

                    if(nbUsers === 10){
                        component.set("v.addUserButtonActive", false);
                    }
                }
            );
        });
    },

    createUsersMass : function(component, event, helper){
        var nbUsers = component.get("v.NbUsers");
        console.log("nb : ", nbUsers);
        var newUsersList = [];
        for(var i = 0; i < nbUsers; i++){
            var lastname = component.find("lastname" + (i + 1)).get("v.value");
            var email = component.find("email" + (i + 1)).get("v.value");
            var alias = component.find("alias" + (i + 1)).get("v.value");
            var username = component.find("username" + (i + 1)).get("v.value");
            var profile = component.find("selectProfile" + (i+1)).get("v.value");
            var contact = component.find("selectContact" + (i+1)).get("v.value");

            newUsersList[i] = {  lastname : lastname,
                                email : email,
                                alias:alias,
                                username:username,
                                profile:profile,
                                contact:contact,
                                TimeZoneSidKey :"Africa/Tunis",
                                LocaleSidKey : "ar_TN",
                                EmailEncodingKey : "UTF-8",
                                LanguageLocaleKey : "en_US"

            };
        }
        // Create an array to hold User records
    var userRecords = [];
    newUsersList.forEach(function(newUser) {
        var userRecord = {
            LastName: newUser.lastname,
            Email: newUser.email,
            Alias: newUser.alias,
            Username: newUser.username,
            ProfileId: newUser.profile,
            ContactId: newUser.contact,
            TimeZoneSidKey: newUser.TimeZoneSidKey,
            LocaleSidKey: newUser.LocaleSidKey,
            EmailEncodingKey: newUser.EmailEncodingKey,
            LanguageLocaleKey: newUser.LanguageLocaleKey
        };
        userRecords.push(userRecord);
    });
        helper.createManyUsers(component, userRecords);
    }
})
