/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
/* eslint-disable dot-notation */
/* eslint-disable no-console */
/* eslint-disable no-return-assign */
({
//     getAllUsersOfAllCommunities : function(component){
//      //get the comunities from the apex class
//      var action = component.get("c.getAllCommunitiesUsers");
//      action.setCallback(this,function(response){
//         if(response.getState()==='SUCCESS'){
//             component.set('v.listOfAccounts',response.getReturnValue());
//             component.set('v.AllUsers',response.getReturnValue())
            
//             this.preparePagination(component, response.getReturnValue());
//             console.log('success : ', response.getReturnValue());
            
            
            
//         }
//         else if (response.getState() === "ERROR") {
//             var errors = response.getError();
//             // eslint-disable-next-line no-console
//             console.error('errors :', errors);
            
//         }
//      });

//  $A.enqueueAction(action);
// },
    allcommunities : function(component) {
        //get the comunities from the apex class
        var action = component.get("c.getCommunities");
        action.setCallback(this,function(response)
        {
            var userlist = response.getReturnValue().map(function(element){
                return {
                    Name : element.Name,
                    Id : element.Id,
                    usersNumber : element.NetworkMembers.length
                }
            })
            
            component.set("v.netList",userlist) ;


            
            
        });

    $A.enqueueAction(action);

    }
    ,
    getRowActions: function (cmp, row, doneCallback) {
        var actions = [];
        if (row['isActive']) {
            actions.push(
                
                {'label' : 'send mail', 'name' : 'send_mail', 'iconName': 'utility:email'},
                {'label' : 'reset password', 'name' : 'reset_password', 'iconName': 'utility:reset_password'},
                {'label' : 'update' ,'name' : 'update', 'iconName': 'utility:record_update'},
                {'label': 'Deactivate','iconName': 'utility:block_visitor','name': 'deactivate'}
                
            );
        } else {
            actions.push(
                
                {'label' : 'send mail', 'name' : 'send_mail','iconName': 'utility:email' },
                
                {'label' : 'update' ,'name' : 'update', 'iconName': 'utility:record_update'},
                {'label': 'Activate','iconName': 'utility:adduser','name': 'activate'}
                );
        }

        if(row['ProfileName']==="Customer Community Login User"){
            actions.push(
                {'label' : 'switch to community user', 'name' : 'switch_to_community_user', 'iconName': 'utility:email'}
            )
        }
        else if(row['ProfileName']==="Customer Community User"){
            actions.push(
                {'label' : 'switch to community Login user', 'name' : 'switch_to_community_login_user', 'iconName': 'utility:email'}
            )
        }



        // simulate a trip to the server
        setTimeout($A.getCallback(function () {
            doneCallback(actions);
        }), 200);
    },

    

    activateContact: function (cmp, row) {
        var rows = cmp.get('v.listOfAccounts');
        var rowIndex = rows.indexOf(row);
        rows[rowIndex]['isActive'] = true;
        rows[rowIndex]['active'] = 'Active';
        cmp.set('v.data', rows);
    },
    deactivateContact: function (cmp, row) {
        var rows = cmp.get('v.listOfAccounts');
        var rowIndex = rows.indexOf(row);
        rows[rowIndex]['isActive'] = false;
        rows[rowIndex]['active'] = 'Inactive';
        cmp.set('v.data', rows);
    },

    allUserName : function(component, userName){
        //    var userName= component.get("v.textValue");
           var  networkId = component.get("v.selectedNetworkId");
           
            var action = component.get('c.getCommunityUserByProfiles');
            action.setParams({ networkId: networkId , userName:userName});
            
            action.setCallback(this, function(response){
                if(response.getState()==='SUCCESS'){
                    response.getReturnValue().forEach(function(element, index, array){
                        if(element.isActive === true){
                            array[index].statusClass = 'slds-text-color_success'
                        }
                        else{
                            array[index].statusClass = 'slds-text-color_error'
                        }
                    })
                    component.set('v.listOfAccounts',response.getReturnValue());
                    component.set('v.AllUsers',response.getReturnValue())
                    
                    
                    this.preparePagination(component, response.getReturnValue());
                    console.log('success : ', response.getReturnValue());
                    
                    
                    
                }
                else if (response.getState() === "ERROR") {
                    var errors = response.getError();
                    // eslint-disable-next-line no-console
                    console.error('errors :', errors);
                    
                }
            })
        $A.enqueueAction(action);
    
        },
        switchToCommunityUser : function(component, row){
            var action = component.get("c.switchToCommunityUserApex")
            console.log('rowid = ', row.Id);
            
            action.setParams({
                userID : row.Id
            })
            action.setCallback(this, function(Response){
                if(Response.getState()==="SUCCESS"){
                    


                    var paginationList = component.get("v.paginationList")
                   paginationList.forEach(function(element, index, array){
                    if(element.Id === row.Id){
                       array[index].ProfileName="Customer Community User";
                        
                    }
                    
                   })
                   var paginationList = component.set("v.paginationList", paginationList);


                        component.set("v.visibleToast", true)
                        component.set("v.toastVariant", "success")
                        component.set("v.toastIcon", "success")
                        component.set("v.toastMessage", "profile changed to community user");
                    
                }
                else{
                        component.set("v.visibleToast", true)
                        component.set("v.toastVariant", "error")
                        component.set("v.toastIcon", "error")
                        component.set("v.toastMessage", "error while changing profile")
                }
            })
            $A.enqueueAction(action)
        },


        switchToCommunityLoginUser : function(component, row){
            var action = component.get("c.switchToCommunityLoginUserApex")
            console.log('rowid = ', row.Id);
            
            action.setParams({
                userID : row.Id
            })
            action.setCallback(this, function(Response){
                if(Response.getState()==="SUCCESS"){
                    


                    var paginationList = component.get("v.paginationList")
                   paginationList.forEach(function(element, index, array){
                    if(element.Id === row.Id){
                       array[index].ProfileName="Customer Community Login User";
                        
                    }
                    
                   })
                   var paginationList = component.set("v.paginationList", paginationList);


                        component.set("v.visibleToast", true)
                        component.set("v.toastVariant", "success")
                        component.set("v.toastIcon", "success")
                        component.set("v.toastMessage", "profile changed to community login user");
                    
                }
                else{
                        component.set("v.visibleToast", true)
                        component.set("v.toastVariant", "error")
                        component.set("v.toastIcon", "error")
                        component.set("v.toastMessage", "error while changing profile")
                }
            })
            $A.enqueueAction(action)
        },




        //desactivate User:$A
        deactivateUser : function(component, row){
            
            var action = component.get("c.desactivateSelectedUser");
            action.setParams({
                userId: row.Id
            });
            action.setCallback(this, function(response){
                if(response.getState() ==="SUCCESS"){
                    console.log(response.getReturnValue());
                    //make user inactive in action selection view
                    var rows = component.get('v.listOfAccounts');
                    var rowIndex = rows.indexOf(row);
                    rows[rowIndex]['isActive'] = false;
                    rows[rowIndex]['active'] = 'Inactive';
                    rows[rowIndex]['statusClass'] = 'slds-text-color_error';
                    component.set('v.listOfAccounts', rows);

                    //make user inactive in datatable view
                    var rows2 = component.get('v.paginationList');
                    var rowIndex2 = rows2.indexOf(row);
                    rows2[rowIndex2]['isActive'] = false;
                    rows2[rowIndex2]['active'] = 'Inactive';
                    rows2[rowIndex2]['statusClass'] = 'slds-text-color_error';
                    component.set('v.paginationList', rows2);
                    component.set("v.visibleToast", true)
                    component.set("v.toastVariant", "success")
                    component.set("v.toastIcon", "success")
                    component.set("v.toastMessage", "user deactivated with success")
                }
                else if(response.getState()==='ERROR'){
                    console.log("error : ", response.getError());
                    component.set("v.visibleToast", true)
                    component.set("v.toastVariant", "error")
                    component.set("v.toastIcon", "error")
                    component.set("v.toastMessage", "error while deactivating user")
                }
            })
            $A.enqueueAction(action);
        },
        activateUser : function(component, row){
            var action = component.get("c.activateSelectedUser");
            action.setParams({
                userId: row.Id
            });
            action.setCallback(this, function(response){
                if(response.getState() === "SUCCESS"){
                
                    if(response.getReturnValue().startsWith('error in activation')){
                        // console.log('error in activation', response.getReturnValue());
                        component.set("v.visibleToast", true)
                        component.set("v.toastVariant", "error")
                        component.set("v.toastIcon", "error")
                        component.set("v.toastMessage", "error while activating user")
                    }
                    else{
                        //make user inactive in the hole list of users(not the printed in datatable)
                        var rows = component.get('v.listOfAccounts');
                        var rowIndex = rows.indexOf(row);
                        rows[rowIndex]['isActive'] = true;
                        rows[rowIndex]['active'] = 'Active';
                        rows[rowIndex]['statusClass'] = 'slds-text-color_success';
                        component.set('v.listOfAccounts', rows);
    
                        //make user inactive in datatable view
                        var rows2 = component.get('v.paginationList');
                        var rowIndex2 = rows2.indexOf(row);
                        rows2[rowIndex2]['isActive'] = true;
                        rows2[rowIndex2]['active'] = 'Active';
                        rows2[rowIndex2]['statusClass'] = 'slds-text-color_success';
                        component.set('v.paginationList', rows2);
                        component.set("v.visibleToast", true)
                        component.set("v.toastVariant", "success")
                        component.set("v.toastIcon", "success")
                        component.set("v.toastMessage", "user activated with success")
                    }
                }
                else if(response.getState()==='ERROR'){
                    console.log("error : ", response.getError());
                    component.set("v.visibleToast", true)
                    component.set("v.toastVariant", "error")
                    component.set("v.toastIcon", "error")
                    component.set("v.toastMessage", "error while deactivating user")
                }
            })
            $A.enqueueAction(action);
        },



    //prepare the pagination:
    preparePagination : function (component, records) {
        var countTotalPage = Math.ceil(records.length / component.get("v.pageSize"));
        var totalPage = countTotalPage > 0 ? countTotalPage : 1;
        component.set("v.totalPages", totalPage);
        component.set("v.currentPageNumber", 1);
        component.set("v.totalRecords", records.length);
        this.setPaginateData(component);
        console.log('hello world', component);
    },
    setPaginateData: function(component){
        var data = [];
        var pageNumber = component.get("v.currentPageNumber");
        var pageSize = component.get("v.pageSize");
        var accountData = component.get('v.listOfAccounts');
        var currentPageCount = 0;
        var x = (pageNumber - 1) * pageSize;
        currentPageCount = x;
        for (; x < (pageNumber) * pageSize; x++){
            if (accountData[x]) {
                data.push(accountData[x]);
                currentPageCount++;
            }
        }
        component.set("v.paginationList", data);
        component.set("v.currentPageRecords", currentPageCount);
    },    
    sortData: function (cmp, fieldName, sortDirection) {
        // var fname = fieldName;
        var data = cmp.get("v.listOfAccounts");
        var reverse = sortDirection !== 'asc';
        data.sort(this.sortBy(fieldName, reverse))
        cmp.set("v.listOfAccounts", data);
        this.setPaginateData(cmp);
    },
    sortBy: function (field, reverse) {
        var key = function(x) {return x[field]};
        reverse = !reverse ? 1 : -1;
        return function (a, b) {
            // eslint-disable-next-line no-sequences
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        }
    },

    sendMailHelper: function(component, address, subject, body){
        var action = component.get("c.sendMailUser");
        var fileName = component.get("v.fileName");
        var base64Data = component.get("v.base64Data");
        var contentType = component.get("v.contentType");
        action.setParams(
            {
                address : address ,
                subject : subject ,
                body    : body ,
                fileName: fileName,
                base64Data: base64Data,
                contentType: contentType
            }
        )
        action.setCallback(this, function(response){
            if (response.getState()==='SUCCESS' && !response.getReturnValue().startsWith("Error")) {
                console.log('success : ' + response.getReturnValue());
                
                component.set("v.visibleToast", true)
                component.set("v.toastVariant", "success")
                component.set("v.toastIcon", "success")
                component.set("v.toastMessage", "mail sent with success")
                component.set("v.showSendMailPopup", false)
            }
            else {
                console.log("Error : ", response.getError());
                component.set("v.visibleToast", true)
                component.set("v.toastVariant", "error")
                component.set("v.toastIcon", "error")
                component.set("v.showSendMailPopup", false)
                component.set("v.toastMessage", "error when sending mail")
            }
            component.set("v.fileName", "");
            component.set("v.base64Data", "");
            component.set("v.contentType", "");
        });
        $A.enqueueAction(action);
        },
        updateUserData : function(component,user) {
            
            var action = component.get('c.updateUser');
            action.setParams({
                user :user
            });
            action.setCallback(this, function(response){
                if(response.getState()==='SUCCESS' && ! response.getReturnValue().startsWith('error')){
                   // eslint-disable-next-line no-console
                   var paginationList = component.get("v.paginationList")
                   paginationList.forEach(function(element, index, array){
                    if(element.Id === user.Id){
                        array[index].Lastname = user.LastName;
                        array[index].email = user.Email;
                        array[index].alias = user.Alias;
                        array[index].username = user.Username;
                        
                    }
                    
                   })
                   component.set("v.paginationList",paginationList )
                    component.set("v.visibleToast", true)
                    component.set("v.toastVariant", "success")
                    component.set("v.toastIcon", "success")
                    component.set("v.showUpdateUserPopup", false)
                    component.set("v.toastMessage", "user updated successfully")
                console.log("success response : ", response.getReturnValue());
               }else{
                   // eslint-disable-next-line no-console
                   console.log(response.error);
                   component.set("v.visibleToast", true)
                    component.set("v.toastVariant", "error")
                    component.set("v.toastIcon", "error")
                    component.set("v.showUpdateUserPopup", false)
                    component.set("v.toastMessage", "error while updating user")
               }
            })
        $A.enqueueAction(action);
        },
        resetUserPassword : function(component, row){
            var action = component.get("c.resetPassword");
            action.setParams({
                userId  : row.Id
            })
            console.log("rox id : ",row.Id);
            action.setCallback(this, function(response){
                if(response.getState() === 'SUCCESS'){
                    console.log("succes of password reset");
                    component.set("v.visibleToast", true)
                    component.set("v.toastVariant", "success")
                    component.set("v.toastIcon", "success")
                    component.set("v.toastMessage", "reset password mail sent with success")
                }
                else if(response.getState() === 'ERROR'){
                    console.log('error resetting password');
                    component.set("v.visibleToast", true)
                    component.set("v.toastVariant", "error")
                    component.set("v.toastIcon", "error")
                    component.set("v.toastMessage", "error while resetting password")
                }
            })
            $A.enqueueAction(action);
        },
        
        sendManyMails : function(component, ids, subject, body){
            var action = component.get("c.sendEmailToManyUsers");
            var fileName = component.get("v.fileName");
            var base64Data = component.get("v.base64Data");
            var contentType = component.get("v.contentType");
            action.setParams({
                ids :ids,
                subject: subject,
                body : body,
                fileName: fileName,
                base64Data: base64Data,
                contentType: contentType
            })
            action.setCallback(this, function(response){
                if(response.getState() === "SUCCESS" && !response.getReturnValue().startsWith('error')){
                    console.log('success to send namy mails: ', response.getReturnValue());
                    
                    component.set("v.visibleToast", true)
                    component.set("v.toastVariant", "success")
                    component.set("v.toastIcon", "success")
                    component.set("v.toastMessage", "mail is sent to selected users")
                    component.set("v.sendMailManyUsersPopUp_visible", false)
                }
                else{
                    
                    component.set("v.visibleToast", true)
                    component.set("v.toastVariant", "error")
                    component.set("v.toastIcon", "error")
                    component.set("v.toastMessage", "error while sending the mail")
                    component.set("v.sendMailManyUsersPopUp_visible", false)
                }
            })
            $A.enqueueAction(action);
        },
        resetManyPasswords : function(component, ids){
            var action = component.get("c.resetManyPasswords");
            action.setParams({
                ids :ids,
               
            })
            action.setCallback(this, function(response){
                if(response.getState() === "SUCCESS"){
                    console.log(response.getReturnValue());
                    component.set("v.visibleToast", true)
                    component.set("v.toastVariant", "success")
                    component.set("v.toastIcon", "success")
                    component.set("v.toastMessage", "Reset many password success")
                    
                }
                else if(response.getState() === "ERROR"){
                    console.log("fail to reset many passwords" , response.getError());
                    component.set("v.visibleToast", true)
                    component.set("v.toastVariant", "error")
                    component.set("v.toastIcon", "error")
                    component.set("v.toastMessage", "error while resetting many passwords")
                }
            })
            $A.enqueueAction(action);
        },
        activateManyUsers : function(component, ids){
            
            var action = component.get("c.activateManyUsersApex");
            action.setParams({
                ids :ids,
               
            })
            action.setCallback(this, function(response){
                if(response.getState() === "SUCCESS"){
                    console.log('success : ',response.getReturnValue());

                    if(response.getReturnValue().startsWith('Success')){
                        var accounts = component.get('v.listOfAccounts');
                        accounts.forEach(function(element, index, array){
                            if(ids.includes(element.Id)){
                                array[index]['isActive'] = true;
                                array[index]['active'] = 'Active';
                                array[index]['statusClass'] = 'slds-text-color_success';
                            }
                        })
                        component.set("v.listOfAccounts", accounts);

                        var paginationList = component.get('v.paginationList');
                        paginationList.forEach(function(element, index, array){
                            if(ids.includes(element.Id)){
                                array[index]['isActive'] = true;
                                array[index]['active'] = 'Active';
                            }
                        })
                        component.set("v.paginationList", paginationList);
                    }
                }
                
                else if(response.getState() === "ERROR"){
                    console.log("fail : " , response.getError());
                }
            })
            $A.enqueueAction(action);
        },
        disactivateManyUsers : function(component, ids){
            
            var action = component.get("c.disactivateManyUsersApex");
            action.setParams({
                ids :ids,
               
            })
            action.setCallback(this, function(response){
                if(response.getState() === "SUCCESS"){
                    console.log('success : ',response.getReturnValue());

                    if(response.getReturnValue().startsWith('Success')){
                        var accounts = component.get('v.listOfAccounts');
                        accounts.forEach(function(element, index, array){
                            if(ids.includes(element.Id)){
                                array[index]['isActive'] = false;
                                array[index]['active'] = 'Inactive';
                                array[index]['statusClass'] = 'slds-text-color_error';
                            }
                        })
                        component.set("v.listOfAccounts", accounts);

                        var paginationList = component.get('v.paginationList');
                        paginationList.forEach(function(element, index, array){
                            if(ids.includes(element.Id)){
                                array[index]['isActive'] = false;
                                array[index]['active'] = 'Inactive';
                            }
                        })
                        component.set("v.paginationList", paginationList);
                    }
                }
                else if(response.getState() === "ERROR"){
                    console.log("fail : " , response.getError());
                }
            })
            $A.enqueueAction(action);
        },
        FilterString : function(component, prop, operation, value){
            var data = component.get("v.listOfAccounts");
            
            console.log("from filterByLicense : ",operation, value);
            
            switch(operation.toLowerCase()){
                case 'equals':
                    var filtredequals = data.filter(function(element){
                        return element[prop] ===value;
                    })
                    component.set("v.listOfAccounts", filtredequals);
                    component.set("v.paginationList", filtredequals.slice(0,10));
                    
                break;
                case 'contains':
                    var filterdcontains = data.filter(function(element){
                        return (element[prop]).includes(value)
                    })
                    component.set("v.listOfAccounts", filterdcontains);
                    component.set("v.paginationList", filterdcontains.slice(0,10));
                break;
                case 'startswith':
                    var filtredStartsWith = data.filter(function(element, index){
                       
                        return (element[prop]).startsWith(value)
                    })
                    component.set("v.listOfAccounts", filtredStartsWith);
                    component.set("v.paginationList", filtredStartsWith.slice(0,10));
                break;
                case 'not equal to':
                    var  filtredNotEqual = data.filter(function(element, index){
                        // console.log("element : ", index , " stw : ",(element[prop]).startsWith(value));
                        return element[prop] !== value;
                    })
                    component.set("v.listOfAccounts", filtredNotEqual);
                    component.set("v.paginationList", filtredNotEqual.slice(0,10));
                break;
                default :
                var filtredNotContain = component.get("v.listOfAccounts").filter(function(element){
                    return !element[prop].includes(value)
                })
                component.set("v.listOfAccounts", filtredNotContain);
                component.set("v.paginationList", filtredNotContain.slice(0,10));
                break;
            }
            
        },
        filterStatus : function(component, value){
            
            var filteredWithStatus = component.get("v.listOfAccounts").filter(function(element){
                if(value === 'true' && element["isActive"] === true){
                    return true
                }
                else if(value === 'false' && element["isActive"] === false){
                    return true
                }
                
                    return false
                
            })
            console.log("isActive : ", value);
            component.set("v.listOfAccounts", filteredWithStatus);
            component.set("v.paginationList", filteredWithStatus.slice(0,10));
        },
        
        
})
