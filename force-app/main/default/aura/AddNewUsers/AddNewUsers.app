<aura:application extends="force:slds" implements="lightning:isUrlAddressable" access="global">

    <aura:attribute name="homeUrl" type="url"/>
    <div class="AddUserContainer">
        <div class="headerContainer">
            <c:headerComponent/>
        </div>
        <div  class="headingContainer">
            <div>
                <div class="createUserHeading">Create One user</div>
            </div>
            
            <lightning:breadcrumbs>
                <lightning:breadcrumb label="Home" onclick="{! c.redirectHome}"/>
                <lightning:breadcrumb label="Create user"/>
            </lightning:breadcrumbs>    
        </div>
        <div class="formContainer">
            <c:addUserForm />
        </div>
    </div>
</aura:application>	
