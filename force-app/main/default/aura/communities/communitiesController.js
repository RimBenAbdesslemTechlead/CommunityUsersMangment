({
    //get all users when the page is first loaded
    // eslint-disable-next-line no-unused-vars
    init : function(component, event, helper) {
        helper.allcommunities(component);
        helper.allUserName(component);
        component.set('v.mycolumns', [
            { label: 'user Name', fieldName: 'Name', type: 'text'},
            { label: 'Id', fieldName: 'Id', type: 'text'},
            { label: 'Profile', fieldName: 'ProfileName', type: 'text'},
            { label: 'Account', fieldName: 'AccountName', type: 'text'},
           
        ]);
    },
    //select bar change to get users by community name
     handleChange: function(component, event, helper) {
        var selectedNetworkId = event.getSource().get("v.value");
        component.set("v.selectedNetworkId", selectedNetworkId);
        helper.allUserName(component, null);
    },

    //search input onChange to get users
    handleInputChange: function(component, event,helper){
       
        var inputData = event.getParam('value');
        component.set("v.textValue", inputData);
      
        helper.allUserName(component,event.getParam('value'));
        
        
    },
    handleNavigates: function(component) {
        var navService = component.find("navService");
        var pageReference = {
            type: "standard__webPage",
            attributes: {
                url: '/c/AddNewUsers.app'
            }
        };
        navService.navigate(pageReference);
    },
    handleClick: function() {
        //     var navService = component.find("navService");
        //     var pageReference = {
        //         type: "standard__webPage",
        //         attributes: {
        //             url: '/c/App2.app'
        //         }
        //     };
        //     navService.navigate(pageReference);
        // }
        var domain =window.location.origin;
        window.open(domain+ "/c/AddNewUsers.app","_self");
    }
  
    
    
})
