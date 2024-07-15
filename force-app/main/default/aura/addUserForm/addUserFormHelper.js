/* eslint-disable no-console */
({
    allContactsWithOwner: function(component) {
        var action = component.get('c.getContacts');
        action.setCallback(this, function(response) {
            component.set('v.contacts', response.getReturnValue());
            console.log("contacts", response.getReturnValue());
        });
        $A.enqueueAction(action);
    },
    getAllProfiles: function(component) {
        var action = component.get('c.getProfiles');
        action.setCallback(this, function(response) {
            component.set('v.profiles', response.getReturnValue());
            console.log("profiles", response.getReturnValue());
        });
        $A.enqueueAction(action);
    },
    createNewUser: function(component, lastname, email, alias, username, tz, loc, emlenco, lang, contactId, profileId) {
        console.log('selectProfile helper', profileId);
        var action = component.get('c.getNewUser');
        action.setParams({
            name: lastname,
            email: email,
            alias: alias,
            username: username,
            tz: tz,
            loc: loc,
            emlenco: emlenco,
            lang: lang,
            contactId: contactId,
            profileId: profileId
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                console.log("success", response.getReturnValue());
                window.open(window.location.origin + "/c/communitiesApp.app","_self");
                
            } else if(state === "ERROR") {
                console.log('error' ,response.getError());
                
            }
        });
        $A.enqueueAction(action);
    },
    
})
