/* eslint-disable no-console */
({
    init: function() {
        // eslint-disable-next-line no-console
        console.log('Component Initialized');
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
        
        console.log('lastname c', lastname, email, alias, username, tz,loc,emlenco, lang);

        helper.createNewUser(component,lastname, email, alias, username, tz,loc,emlenco, lang);
    }
})
