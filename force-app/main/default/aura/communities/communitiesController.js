({
    // eslint-disable-next-line no-unused-vars
    init : function(component, event, helper) {
        helper.allcommunities(component);
        helper.allUserName(component);
        component.set('v.mycolumns', [
            { label: 'user Name', fieldName: 'Name', type: 'text'},
            
        ]);
    },

     handleChange: function(component, event, helper) {
        var selectedNetworkId = event.getSource().get("v.value");
        component.set("v.selectedNetworkId", selectedNetworkId);
        helper.allUserName(component, selectedNetworkId);
    },

})
