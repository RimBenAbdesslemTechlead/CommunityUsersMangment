/* eslint-disable no-console */
({
    init: function(component, event, helper) {
        // eslint-disable-next-line no-console
        console.log('Component Initialized');
        helper.getAllProfiles(component);
        helper.allContactsWithOwner(component);
    },

    createUser : function(component, event, helper){
        var lastname= component.find('lastname').get("v.value");
        var email = component.find('email').get("v.value");
        var alias = component.find('alias').get("v.value");
        var username = component.find('username').get("v.value")
        var tz = component.find('tz').get("v.value");
        var loc = component.find('loc').get("v.value")
        var emlenco = component.find('emlenco').get("v.value");
        var lang = component.find('lang').get("v.value")
        var contactId = component.find('selectContact').get("v.value");
        var ProfileId = component.find('selectProfile').get("v.value");
        console.log('lastname c', lastname, email, alias, username, tz,loc,emlenco, lang, 'conta------',contactId,'prf id' , ProfileId );

        helper.createNewUser(component,lastname, email, alias, username, tz,loc,emlenco, lang, contactId, ProfileId);
    }
})
