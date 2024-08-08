/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
({
    init : function(component){
        if(component.get("v.visibleToast")){
            var interval = setTimeout(function(){
                component.set("v.visibleToast", false);
            }, 5000)
            
        }
    },
    deleteToast : function(component){
        component.set("v.visibleToast", false);
    }
    
    
})
