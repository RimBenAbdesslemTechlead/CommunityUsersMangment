/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
({
    //get all users when the page is first loaded
    // eslint-disable-next-line no-unused-vars
    init : function(component, event, helper) {
        helper.allcommunities(component);
        helper.allUserName(component);
        var actions = helper.getRowActions.bind(this, component);
        
        component.set('v.mycolumns', [
            { label: 'Name(lastname)', fieldName: 'Name', type: 'text'},
            { label: 'email', fieldName: 'email', type: 'text'},
            { label: 'Profile', fieldName: 'ProfileName', type: 'text'},
            { label: 'Account', fieldName: 'AccountName', type: 'text'},
            { label: 'isActive', fieldName: 'isActive', type: 'text'},
            
             //actions column goes here
             { type: 'action', typeAttributes: { rowActions: actions, menuAlignment: 'right' } }
           
           
        ]);
    },
    UpdatecloseBtnClicked : function(component){
        
        component.set("v.showUpdateUserPopup", false);
    
    },
    emailcloseBtnClicked : function(component){
        component.set("v.showSendMailPopup", false);
    },
        
    //row actions logic goes here
    handleRowAction: function (component, event, helper) {
        var action = event.getParam('action');
        var row = event.getParam('row');
        var rows;
        var rowIndex;
        switch (action.name) {
            case 'reset_password':
                console.log("reset" );

            break;

            case 'send_mail':
                component.set("v.showSendMailPopup", true);
                rows = component.get("v.listOfAccounts");
                rowIndex = rows.indexOf(row);
                
                component.set("v.userIndex", (rowIndex+1));
                component.set("v.lastname", row.Name);
                component.set("v.email", row.email);
                component.set("v.alias", row.alias);
                component.set("v.username", row.username);
            break;

            case 'update':
                component.set("v.showUpdateUserPopup", true)
                rows = component.get('v.listOfAccounts');
                rowIndex = rows.indexOf(row);
                
                component.set("v.userIndex", (rowIndex+1));
                component.set("v.lastname", row.Name);
                component.set("v.email", row.email);
                component.set("v.alias", row.alias);
                component.set("v.username", row.username);
                component.set("v.Id", row.Id);
                
                
            break;

            default : 
                console.log("delete");
            break;
        }
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
    },
    sendMailToUser : function(component, event, helper){
        var address = component.find("emailAddress").get("v.value");
        var subject = component.find("emailSubject").get("v.value");
        var body    = component.find("emailBody").get("v.value");
        
        helper.sendMailHelper(component, address, subject , body);
    },
    UpdateUser : function(component, event, helper){
        // var lastname = component.find('lastname').get("v.value");
        // var email = component.find('email').get("v.value");
        // var alias = component.find('alias').get("v.value");
        // var username = component.find('username').get("v.value");
        // var timeZone = component.find("tz").get("v.value");
        // var locale_hour = component.find('loc').get("v.value");
        // var emailEncoding = component.find('emlenco').get("v.value");
        // var language = component.find('lang').get("v.value");
        // var selectContact = component.find('selectContact').get("v.value");
        // var selectProfile = component.find("selectProfile").get("v.value");
        var user = {
            Id : component.get("v.Id"),
            LastName: component.find('lastname').get("v.value"),
            Email: component.find('email').get("v.value"),
            Alias: component.find('alias').get("v.value"),
            Username: component.find('username').get("v.value"),
            TimeZoneSidKey: component.find("tz").get("v.value"),
            LocaleSidKey: component.find('loc').get("v.value"),
            EmailEncodingKey: component.find('emlenco').get("v.value"),
            LanguageLocaleKey: component.find('lang').get("v.value"),

        }
        helper.updateUserData(component,user);
    }
})
