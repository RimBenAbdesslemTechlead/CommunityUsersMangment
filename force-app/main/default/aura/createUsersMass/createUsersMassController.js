/* eslint-disable no-undef */
// /* eslint-disable no-prototype-builtins */
/* eslint-disable compat/compat */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
({
    init : function(component, event, helper){
        var nbUsers = component.get("v.NbUsers");
        var aryIanaTimeZones = Intl.supportedValuesOf('timeZone');
        console.log("aryIanaTimeZones : ", aryIanaTimeZones.length);
        //get the localeKey from apex

       
        var emailEncodings = [
            {
                name: 'Unicode (UTF-8)',
                value: 'UTF-8'
            },
            {
                name: 'General US & Western Europe (ISO-8859-1, ISO-LATIN-1)',
                value: 'ISO-8859-1'
            },
            {
                name: 'Japanese (Shift-JIS)',
                value: 'Shift-JIS'
            },
            {
                name: 'Japanese (JIS)',
                value: 'ISO-2022-JP'
            },
            {
                name: 'Japanese (EUC)',
                value: 'EUC-JP'
            },
            {
                name: 'Korean (ks_c_5601-1987)',
                value: 'KS_C_5601-1987'
            },
            {
                name: 'Traditional Chinese (Big5)',
                value: 'Big5'
            },
            {
                name: 'Simplified Chinese (GB2312)',
                value: 'GB2312'
            },
            {
                name: 'Traditional Chinese Hong Kong (Big5-HKSCS)',
                value: 'Big5-HKSCS'
            },
            {
                name: 'Japanese (Shift-JIS_2004)',
                value: 'Shift-JIS_2004'
            }
        ];
        
        console.log("emailEncodings : ", emailEncodings);

        // Wait for the profiles to be fetched
        helper.getAllProfiles(component, function(profiles, contacts, LanguageLocaleKeys, LocaleSidKeys) {
            console.log("local side keys : ", LocaleSidKeys);
            
            
            var componentsToCreate = [
                ["lightning:card", {
                    "title" : "form for user #" + nbUsers,
                    "iconName" : "standard:user"
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
                }],
                ["lightning:select", {
                    "label": "TimeZone",
                    "aura:id" : "TimeZone" + nbUsers
                }],
                ["lightning:select", {
                    "label": "EmailEncoding",
                    "aura:id" : "EmailEncoding" + nbUsers
                }],
                ["lightning:select", {
                    "label": "LanguageLocaleKeys",
                    "aura:id" : "LanguageLocaleKeys" + nbUsers
                }],
                ["lightning:select", {
                    "label": "LocaleSidKeys",
                    "aura:id" : "LocaleSidKeys" + nbUsers
                }],

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
                    "hidden" : contacts[i].hidden || false
                    
                }]);
            }
            
           
            //concatenate the timezones in a list
            aryIanaTimeZones.forEach(function(element){
                componentsToCreate.push(["option", {
                    "value": element,
                    "label": element
                    
                }])
            })
            
            //concatenate the emailEncodings in a list
            emailEncodings.forEach(function(element){
                componentsToCreate.push(
                    ["option", {
                        "value": element.value,
                        "label":element.name,
                        
                    }]
                )
            })
            //concatenate the profiles list elements
            var languagesMap = new Map(Object.entries(LanguageLocaleKeys));
            languagesMap.forEach(function(value, key){
                componentsToCreate.push(["option", {
                    "value": key,
                    "label": value,
                    
                }])
            })
            var LocaleSidKeysMap = new Map(Object.entries(LocaleSidKeys));
            LocaleSidKeysMap.forEach(function(value, key){
                componentsToCreate.push(["option", {
                    "value": key,
                    "label": value,
                    
                }])
            })

            // console.log("form controller : ", contacts);

            $A.createComponents(
                componentsToCreate,
                function(components, status, errorMessage){
                    if (status === "SUCCESS") {
                        var staticInputsAndSelectsNb = 11;
                        var card = components[0];
                        var inputs = components.slice(1,staticInputsAndSelectsNb);
                        var options = components.slice(staticInputsAndSelectsNb,staticInputsAndSelectsNb + profiles.length);
                       
                        inputs[5].set("v.body",options);
                        var cOptions = components.slice(staticInputsAndSelectsNb + profiles.length, staticInputsAndSelectsNb + profiles.length+ contacts.length);
                        inputs[4].set("v.body", cOptions);

                        //set the otions of the timezone in the select component
                        var tzOptions = components.slice( staticInputsAndSelectsNb + profiles.length+ contacts.length, staticInputsAndSelectsNb + profiles.length+ contacts.length + aryIanaTimeZones.length);
                        inputs[6].set("v.body", tzOptions);

                        //set the otions of the emailEncodingd in the select component
                        var emailEncodingOptions = components.slice( staticInputsAndSelectsNb + profiles.length+ contacts.length + aryIanaTimeZones.length, staticInputsAndSelectsNb + profiles.length+ contacts.length + aryIanaTimeZones.length+ emailEncodings.length);
                        inputs[7].set("v.body", emailEncodingOptions)
                        
                        //set the otions of the emailEncodingd in the select component
                        var localKeyOptions = components.slice(staticInputsAndSelectsNb + profiles.length+ contacts.length + aryIanaTimeZones.length+ emailEncodings.length, staticInputsAndSelectsNb + profiles.length+ contacts.length + aryIanaTimeZones.length+ emailEncodings.length+ languagesMap.size);
                        console.log("languagesMap.size : ", languagesMap.size);
                        inputs[8].set("v.body", localKeyOptions)
                        component.set("v.createAddBtnsVisible","visibleButtons")
                        //set the otions of the LanguageLocaleKeys in the select component
                        console.log("staticInputsAndSelectsNb + profiles.length+ contacts.length + aryIanaTimeZones.length+ emailEncodings.length+ languagesMap.size : ", staticInputsAndSelectsNb + profiles.length+ contacts.length + aryIanaTimeZones.length+ emailEncodings.length+ languagesMap.size);
                        var data = components.slice(staticInputsAndSelectsNb + profiles.length+ contacts.length + aryIanaTimeZones.length+ emailEncodings.length+ languagesMap.size, staticInputsAndSelectsNb + profiles.length+ contacts.length + aryIanaTimeZones.length+ emailEncodings.length+ languagesMap.size+ LocaleSidKeysMap.size);
                        inputs[9].set("v.body", data)
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
        var aryIanaTimeZones = Intl.supportedValuesOf('timeZone');
        console.log("aryIanaTimeZones : ", aryIanaTimeZones.length);
        //get the localeKey from apex

       
        var emailEncodings = [
            {
                name: 'Unicode (UTF-8)',
                value: 'UTF-8'
            },
            {
                name: 'General US & Western Europe (ISO-8859-1, ISO-LATIN-1)',
                value: 'ISO-8859-1'
            },
            {
                name: 'Japanese (Shift-JIS)',
                value: 'Shift-JIS'
            },
            {
                name: 'Japanese (JIS)',
                value: 'ISO-2022-JP'
            },
            {
                name: 'Japanese (EUC)',
                value: 'EUC-JP'
            },
            {
                name: 'Korean (ks_c_5601-1987)',
                value: 'KS_C_5601-1987'
            },
            {
                name: 'Traditional Chinese (Big5)',
                value: 'Big5'
            },
            {
                name: 'Simplified Chinese (GB2312)',
                value: 'GB2312'
            },
            {
                name: 'Traditional Chinese Hong Kong (Big5-HKSCS)',
                value: 'Big5-HKSCS'
            },
            {
                name: 'Japanese (Shift-JIS_2004)',
                value: 'Shift-JIS_2004'
            }
        ];
        
        console.log("emailEncodings : ", emailEncodings);
        // Wait for the profiles to be fetched
        helper.getAllProfiles(component, function(profiles, contacts , LanguageLocaleKeys, LocaleSidKeys) {
            var componentsToCreate = [
                ["lightning:card", {
                    "title" : "form for user #" + nbUsers,
                    "class" :"centered-layout-item",
                    "iconName" : "standard:user"
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
                }],["lightning:select", {
                    "label": "TimeZone",
                    "aura:id" : "TimeZone" + nbUsers
                }],
                ["lightning:select", {
                    "label": "EmailEncoding",
                    "aura:id" : "EmailEncoding" + nbUsers
                }],
                ["lightning:select", {
                    "label": "LanguageLocaleKeys",
                    "aura:id" : "LanguageLocaleKeys" + nbUsers
                }],
                ["lightning:select", {
                    "label": "LocaleSidKeys",
                    "aura:id" : "LocaleSidKeys" + nbUsers
                }],
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
                    "hidden" : contacts[i].hidden || false
                    
                }]);
            }

            //concatenate the timezones in a list
            aryIanaTimeZones.forEach(function(element){
                componentsToCreate.push(["option", {
                    "value": element,
                    "label": element
                    
                }])
            })
            
            //concatenate the emailEncodings in a list
            emailEncodings.forEach(function(element){
                componentsToCreate.push(
                    ["option", {
                        "value": element.value,
                        "label":element.name,
                        
                    }]
                )
            })
            //concatenate the profiles list elements
            var languagesMap = new Map(Object.entries(LanguageLocaleKeys));
            languagesMap.forEach(function(value, key){
                componentsToCreate.push(["option", {
                    "value": key,
                    "label": value,
                    
                }])
            })
            var LocaleSidKeysMap = new Map(Object.entries(LocaleSidKeys));
            LocaleSidKeysMap.forEach(function(value, key){
                componentsToCreate.push(["option", {
                    "value": key,
                    "label": value,
                    
                }])
            })



            $A.createComponents(
                componentsToCreate,
                function(components, status, errorMessage){
                    if (status === "SUCCESS") {
                        var card = components[0];
                        var staticInputsAndSelectsNb = 11;
                        var inputs = components.slice(1,staticInputsAndSelectsNb);
                        var options = components.slice(staticInputsAndSelectsNb,staticInputsAndSelectsNb + profiles.length);
                       
                        inputs[5].set("v.body",options);
                        var cOptions = components.slice(staticInputsAndSelectsNb + profiles.length, staticInputsAndSelectsNb + profiles.length+ contacts.length);
                        inputs[4].set("v.body", cOptions);

                        //set the otions of the timezone in the select component
                        var tzOptions = components.slice( staticInputsAndSelectsNb + profiles.length+ contacts.length, staticInputsAndSelectsNb + profiles.length+ contacts.length + aryIanaTimeZones.length);
                        inputs[6].set("v.body", tzOptions);

                        //set the otions of the emailEncodingd in the select component
                        var emailEncodingOptions = components.slice( staticInputsAndSelectsNb + profiles.length+ contacts.length + aryIanaTimeZones.length, staticInputsAndSelectsNb + profiles.length+ contacts.length + aryIanaTimeZones.length+ emailEncodings.length);
                        inputs[7].set("v.body", emailEncodingOptions)
                        
                        //set the otions of the emailEncodingd in the select component
                        var localKeyOptions = components.slice(staticInputsAndSelectsNb + profiles.length+ contacts.length + aryIanaTimeZones.length+ emailEncodings.length, staticInputsAndSelectsNb + profiles.length+ contacts.length + aryIanaTimeZones.length+ emailEncodings.length+ languagesMap.size);
                        console.log("languagesMap.size : ", languagesMap.size);
                        inputs[8].set("v.body", localKeyOptions)

                        //set the otions of the LanguageLocaleKeys in the select component
                        console.log("staticInputsAndSelectsNb + profiles.length+ contacts.length + aryIanaTimeZones.length+ emailEncodings.length+ languagesMap.size : ", staticInputsAndSelectsNb + profiles.length+ contacts.length + aryIanaTimeZones.length+ emailEncodings.length+ languagesMap.size);
                        var data = components.slice(staticInputsAndSelectsNb + profiles.length+ contacts.length + aryIanaTimeZones.length+ emailEncodings.length+ languagesMap.size, staticInputsAndSelectsNb + profiles.length+ contacts.length + aryIanaTimeZones.length+ emailEncodings.length+ languagesMap.size+ LocaleSidKeysMap.size);
                        inputs[9].set("v.body", data)

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
            var TimeZone = component.find("TimeZone" + (i+1)).get("v.value");
            var EmailEncoding = component.find("EmailEncoding" + (i+1)).get("v.value");
            var LanguageLocaleKeys = component.find("LanguageLocaleKeys" + (i+1)).get("v.value");
            var LocaleSidKeys = component.find("LocaleSidKeys" + (i+1)).get("v.value");
            newUsersList[i] = {  lastname : lastname,
                                email : email,
                                alias:alias,
                                username:username,
                                profile:profile,
                                contact:contact,
                                TimeZoneSidKey :TimeZone,
                                LocaleSidKey : LocaleSidKeys,
                                EmailEncodingKey : EmailEncoding,
                                LanguageLocaleKey : LanguageLocaleKeys

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
