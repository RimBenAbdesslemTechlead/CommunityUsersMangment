/* eslint-disable dot-notation */
/* eslint-disable no-console */
/* eslint-disable no-return-assign */
({
    allcommunities : function(component) {
        //get the comunities from the apex class
        var action = component.get("c.getCommunities");
        action.setCallback(this,function(response)
        {
            
            component.set("v.netList",response.getReturnValue()) ; 
            
        });

    $A.enqueueAction(action);
    },getRowActions: function (cmp, row, doneCallback) {
        var actions = [];
        if (row['isActive']) {
            actions.push(
                
                {'label' : 'send mail', 'name' : 'send_mail'},
                {'label' : 'reset password', 'name' : 'reset_password'},
                {'label' : 'update' ,'name' : 'update'},
                {'label': 'Deactivate','iconName': 'utility:block_visitor','name': 'deactivate'}
                
            );
        } else {
            actions.push(
                
                {'label' : 'send mail', 'name' : 'send_mail'},
                {'label' : 'reset password', 'name' : 'reset_password'},
                {'label' : 'update' ,'name' : 'update'},
                {'label': 'Activate','iconName': 'utility:adduser','name': 'activate'}
                );
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
                    component.set('v.listOfAccounts',response.getReturnValue());
                    
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
        
        action.setParams(
            {
                address : address ,
                subject : subject ,
                body    : body ,
            }
        )
        action.setCallback(this, function(response){
            if (response.getState()==='SUCCESS') {
                console.log("was mail sent correct? ", response.getReturnValue());
            }
            else if (response.getState()==='ERROR') {
                console.log("was mail sent correct? ", response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
        },
        updateUserData : function(component,user) {
            
            var action = component.get('c.updateUser');
            action.setParams({
                user :user
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
