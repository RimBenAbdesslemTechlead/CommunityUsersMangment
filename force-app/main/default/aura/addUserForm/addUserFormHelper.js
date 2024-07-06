/* eslint-disable no-console */
({
    createNewUser : function(component, lastname, email, alias, username, tz,loc,emlenco, lang) {
        console.log('latname h', lastname,'email', email, 'alias',alias, 'usernname', username);
        var action = component.get('c.getNewUser');
        action.setParams({
            name :lastname,email : email,alias:alias, username: username, tz:tz, loc:loc,emlenco : emlenco,lang: lang
        });
        action.setCallback(this, function(response){
            if(response.state==='SUCCESS'){
               // eslint-disable-next-line no-console
            console.log("response", response.getReturnValue());
           }else{
               // eslint-disable-next-line no-console
               console.log(response.error);
           }
        })
    $A.enqueueAction(action);
    }
})
