<aura:application extends="force:slds" implements="lightning:isUrlAddressable" access="global">
    <c:headerComponent/>
    <div>
        <div class="headingContainer">
            <div class="manyUsersText">Create Man Users</div>
            <div>
                <lightning:breadcrumbs>
                <lightning:breadcrumb label="Home" onclick="{! c.redirectHome}"/>
                <lightning:breadcrumb label="Create Many user"/>
            </lightning:breadcrumbs> 
            </div>
        </div>
        <c:createUsersMass />
    </div>
</aura:application>	
