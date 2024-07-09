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
                    console.log('success');
                    
                    
                    
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

    
})
