<aura:application controller="UsersManagmentController" implements="flexipage:availableForRecordHome,force:hasRecordId" access="global">
    <aura:attribute type="String" name="data"></aura:attribute>
    <aura:attribute name="communititesnames" type="String[]"/>
    <aura:attribute name="netList" type="Network[]"/>
    <aura:attribute name="AllUsers" type="Object[]"/> 
    <aura:attribute name="listOfAccounts" type="Object[]"/>
    <aura:attribute name="selectedNetworkId" type="String" /> 
    <aura:handler name="init" value="{!this}" action="{!c.doInit}"/>


    <lightning:layout>  
            <lightning:layoutItem size="2">
                 <div class="communitiesSelect">
                    
                    <!--select component for communities-->
                    
                    <h1 class="communitiesHeading">communities List</h1>
                   
                        <aura:iteration items="{!v.netList}" var="net">
                            <div class="btnContainer">
                                <lightning:button 
                                    class="btnC" 
                                    iconName="utility:world" 
                                    label="{!net.Name}" 
                                    iconPosition="left" 
                                    value="{!net.Id}" 
                                    onclick="{! c.handleChange }" />
  
                            </div>
                        </aura:iteration>
                    
                 </div>
            </lightning:layoutItem>


            <lightning:layoutItem size="10">
                <div>
                    <div class="container1">
                        
                        <c:DynamicChart aura:id="compId" chartType='bar' 
                                chartTitle='number of users per Community' 
                                chartSubTitle=''
                                xAxisCategories="{! v.communititesnames}"
                                yAxisParameter='$ or %'
                                data="{!v.data}"/>
            
                                
                    </div>
                    <div class="container2">
                        <c:DynamicPieChart aura:id="compCId" chartType='pie' 
                        chartTitle='profiles percentage' 
                        chartSubTitle=''
                        xAxisCategories="{! v.communititesnames}"
                        yAxisParameter='$ or %'
                        data="{!v.data}"/>
                    </div>
                </div>
            </lightning:layoutItem>

        </lightning:layout> 


    
                    
</aura:application>