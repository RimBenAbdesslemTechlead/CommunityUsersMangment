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
        helper.allUserName(component, null, helper);
    },
    updateSorting: function (cmp, event, helper) {
        var fieldName = event.getParam('fieldName');
        var sortDirection = event.getParam('sortDirection');
        cmp.set("v.sortedBy", fieldName);
        cmp.set("v.sortedDirection", sortDirection);
        helper.sortData(cmp, fieldName, sortDirection);
    },
     
    handleNext: function(component, event, helper){        
        component.set("v.currentPageNumber", component.get("v.currentPageNumber") + 1);
        helper.setPaginateData(component);
    },
     
    handlePrevious: function(component, event, helper){
       component.set("v.currentPageNumber", component.get("v.currentPageNumber") - 1);
       helper.setPaginateData(component);
    },
     
    onFirst: function(component, event, helper) {        
        component.set("v.currentPageNumber", 1);
        helper.setPaginateData(component);
    },
     
    onLast: function(component, event, helper) {        
        component.set("v.currentPageNumber", component.get("v.totalPages"));
        helper.setPaginateData(component);
    },

    //search input onChange to get users
    handleInputChange: function(component, event,helper){
       
        var inputData = event.getParam('value');
        component.set("v.textValue", inputData);
      
        helper.allUserName(component,event.getParam('value'));
        
        
    },
    
    handleAddOneClick: function() {
        var domain =window.location.origin;
        window.open(domain+ "/c/AddNewUsers.app","_self");
    },
    handleAddManyClick : function(){
       var MyDomain = window.location.origin;
       window.open(MyDomain+ '/c/createUserMassApp.app', '_self');
    }
  
    
    
})
