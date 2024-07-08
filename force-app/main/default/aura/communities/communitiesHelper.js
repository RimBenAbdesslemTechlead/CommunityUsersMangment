({
    allcommunities : function(component) {
        //get the comunities from the apex class
        var action = component.get("c.getCommunities");
        action.setCallback(this,function(response)
        {
            
            component.set("v.netList",response.getReturnValue()) ; 
        });

    $A.enqueueAction(action);
    },

    allUserName : function(component, userName){
    //    var userName= component.get("v.textValue");
       var  networkId = component.get("v.selectedNetworkId");
       
        var action = component.get('c.getCommunityUserByProfiles');
        action.setParams({ networkId: networkId , userName:userName});
        action.setCallback(this, function(response){
            if(response.getState()==='SUCCESS'){
                
                
                component.set('v.mydata',response.getReturnValue());
            }
            else if (response.getState() === "ERROR") {
                var errors = response.getError();
                // eslint-disable-next-line no-console
                console.error('errors :', errors);
            }
        })
    $A.enqueueAction(action);

    }
})
