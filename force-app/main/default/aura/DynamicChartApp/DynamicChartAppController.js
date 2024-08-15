/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
({
    doInit : function(component, event, helper){

        helper.allcommunities(component);
        helper.allData(component)
        helper.ss(component)
        
        
        
        // console.log(dataObj, '======', jsonData);
        
    }
    ,
    handleChange : function(component, event, helper){
        var selectedNetworkId = event.getSource().get("v.value");
        component.set("v.selectedNetworkId", selectedNetworkId);
        helper.allUserName(component, null, helper);
    }

})