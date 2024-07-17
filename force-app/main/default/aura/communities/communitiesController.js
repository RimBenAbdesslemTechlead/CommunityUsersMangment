/* eslint-disable compat/compat */
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
            { label: 'Name(lastname)', fieldName: 'Lastname', type: 'text'},
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
                helper.resetUserPassword(component, row);

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
                component.set("v.lastname", row.Lastname);
                component.set("v.email", row.email);
                component.set("v.alias", row.alias);
                component.set("v.username", row.username);
                component.set("v.Id", row.Id);
                
                
            break;
            case 'deactivate':
                console.log('disactivate');
                helper.deactivateUser(component, row);


            break;
            case 'activate':
                
                helper.activateUser(component, row);
            break;

            default : 
                console.log("switch default action");
                
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
    rowSelection : function(component, event) {
        
        var rowselected = event.getParam('selectedRows');
        var idsOfAllSelectedRows = component.get("v.idsOfAllSelectedRows"); 
            idsOfAllSelectedRows.push(rowselected[rowselected.length - 1].Id)
        
        console.log('elements : ', idsOfAllSelectedRows);
        if(idsOfAllSelectedRows.length >1){
            
            component.set("v.massActionsSelectionVisible", true)
        }

    },
     
    handleNext: function(component, event, helper){
        // var idsOfAllSelectedRows = component.get("v.idsOfAllSelectedRows");        
        component.set("v.currentPageNumber", component.get("v.currentPageNumber") + 1);
        helper.setPaginateData(component);

        
    },
     
    handlePrevious: function(component, event, helper){
        // var idsOfAllSelectedRows = component.get("v.idsOfAllSelectedRows");  
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
    },
    handleMassActionChanged : function(component, event, helper){
        var choosenValue = event.getSource().get("v.value");
        console.log("chosen val : ", choosenValue);
        switch(choosenValue){
            case 'sendEmail':
            component.set("v.sendMailManyUsersPopUp_visible", true)
                break;
            case 'resetPassword' :
                helper.resetManyPasswords(component, component.get("v.idsOfAllSelectedRows"));
                break;
                case 'activate' :
                helper.activateManyUsers(component, component.get("v.idsOfAllSelectedRows"));
                break;
                case 'disactivate' :
                helper.disactivateManyUsers(component, component.get("v.idsOfAllSelectedRows"));
                break;
            default:
                break;
        }
    },
    sendMailToManyUsers : function(component, event, helper){
        console.log("send mail to namy user toggled");
        var ids = component.get("v.idsOfAllSelectedRows");
        var subject = component.find("ManyEmailSubjects").get("v.value");
        var body = component.find("ManyEmailBodies").get("v.value");
        
        helper.sendManyMails(component, ids,subject, body)
        component.set("v.sendMailManyUsersPopUp_visible", false)
        
        component.find("datatable").set("v.selectedRows",[]);

    },
    ManyEmailcloseBtnClicked : function(cmp){
        cmp.set("v.sendMailManyUsersPopUp_visible", false);
    },
    isconButtonClicked : function(component){
        if(component.get("v.AllUsers").length !==0) component.set("v.datatableWidth", 9);
    },
    handleAddFilterClicked : function () {
        console.log("add filter");
    },
    deleteFilerClicked : function(){
        console.log('cancel filter');
    },
    //this function set the operations possibles for each property
    propertySelectionChanged : function(component,event){
        var prop = event.getSource().get("v.value");
        var propsValuesList = component.get("v.selectionPropValue");
        var operationsFound = propsValuesList.some(function(element){
            if(element.name === prop){
                console.log('ops : ', element.operations);
                component.set("v.operationsOfselectedProperty", element.operations);
                return true;
            }
            return false;
        })
        
    },
    deleteFilters : function(component){
        component.set("v.datatableWidth", 12)
        var allUsers = component.get("v.AllUsers");
        component.set("v.listOfAccounts", allUsers)
        component.set("v.paginationList", allUsers.slice(0,10));
    },
    applyFilters :function(component, event, helper){
        var prop = component.find("propSelect").get("v.value")
        
        switch(prop){
            case 'License':
                helper.FilterString(component, prop)
                break;
                case 'ProfileName':
                    helper.FilterString(component, prop)
                break;
                case 'AccountName':
                    helper.FilterString(component, prop)
                break;
                default:
                    helper.filterStatus(component)
                break;
        }
    },
        

})
