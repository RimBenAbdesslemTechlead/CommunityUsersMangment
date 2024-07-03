({
    allcommunities : function(component) {
        //get the comunities from the apex class
        var action = component.get("c.getCommunities");
        action.setCallback(this,function(response)
        {
            // eslint-disable-next-line no-console
            console.log('state', response.getState());
            component.set("v.netList",response.getReturnValue()) ; 
        });

    $A.enqueueAction(action);
    },

    allUserName : function(component, networkId){
        var action = component.get('c.getCommunityUserByProfiles');
        action.setParams({ networkId: networkId });
        action.setCallback(this, function(response){
            if(response.getState()==='SUCCESS'){
                // eslint-disable-next-line no-console
                console.log('true->',  response.getReturnValue());
                // eslint-disable-next-line no-console
                console.log('selected rows->', networkId);
                component.set('v.mydata',response.getReturnValue());
            }
            else if (response.getState() === "ERROR") {
                var errors = response.getError();
                // eslint-disable-next-line no-console
                console.error(errors);
            }
        })
    $A.enqueueAction(action);

    }
})
