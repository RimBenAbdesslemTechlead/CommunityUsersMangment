/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/* eslint-disable guard-for-in */
/* eslint-disable no-console */
({
    allData : function(component) {
        //get the comunities from the apex class
        var action = component.get("c.getCommunities");
        action.setCallback(this,function(response)
        {
            if(response.getState()==="SUCCESS"){
                var returnedData = response.getReturnValue()
            
            var userlist = response.getReturnValue().map(function(element){
                //object containing Name, Id and nber_of_users for each community
                return {
                    Name : element.Name,
                    Id : element.Id,
                    usersNumber : element.NetworkMembers.length
                }
            })
            //bar chart 1 code
            var commsNames = []
            userlist.forEach(function(element){
                commsNames.push(element.Name)
                console.log(element.Name);
                
            })
            var color = ["#5752D1", "#C9190B", "#009596"]
            component.set("v.communititesnames", commsNames)
            component.set("v.netList",userlist) ;

            var newData = [];
            userlist.forEach(function(element, index){
                newData.push({
                    y: element.usersNumber,
                    color  :color[index]
                })
            })
            
            
        var jsonData = '';
        var dataObj = [];
        dataObj[0] = {
            
            data: newData,
            
        };
        
        jsonData = JSON.stringify(dataObj);
        console.log("Json string : ", jsonData);
        component.set("v.data",jsonData);

       


       
       

    }

            
        });

    $A.enqueueAction(action);

    },
    ss : function(component){
        var action = component.get("c.getAllusersApex")
        action.setCallback(this, function(response){
            if(response.getState()==="SUCCESS"){
                console.log("response data : ", response.getReturnValue());
                
            }
        })
        $A.enqueueAction(action);
    },
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

    },


    allUserName : function(component, userName){
        //    var userName= component.get("v.textValue");
           var  networkId = component.get("v.selectedNetworkId");
           
            var action = component.get('c.getCommunityUserByProfiles');
            action.setParams({ networkId: networkId , userName:userName});
            
            action.setCallback(this, function(response){
                if(response.getState()==='SUCCESS'){
                    console.log("return valuse onchange : ", response.getReturnValue());
                    
                    component.set('v.listOfAccounts',response.getReturnValue());
                    component.set('v.AllUsers',response.getReturnValue())
                    
                    
                }
                else if (response.getState() === "ERROR") {
                    var errors = response.getError();
                    
                    console.error('errors :', errors);
                    
                }
            })
        $A.enqueueAction(action);
    
        },


})
