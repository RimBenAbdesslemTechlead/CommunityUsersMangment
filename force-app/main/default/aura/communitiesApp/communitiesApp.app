<aura:application extends="force:slds" implements="lightning:isUrlAddressable" access="global">
    <div>
        <div class="globalContent">
            <div class="pml">
                <div  class="ssa">
                    <div  class="salesforceCommunity">
                        <!-- Use the $Resource global variable to reference the static resource -->
                        <img class="imageLogo" src="{!$Resource.SalesforceLogoResource}" alt="Salesforce Logo" />
                        <div class="communityText">Communities</div>
                    </div>
                    <div class="salesforceCommunity">
                        <!-- Use the $Resource global variable to reference the static resource -->
                        <lightning:avatar variant="square" src="/docs/component-library/app/images/examples/avatar2.jpg" initials="SJ" fallbackIconName="standard:person_account" alternativeText="Sarah Jones" class="slds-m-right_small"/>
                        <div class="username">User : Ahmed Abbassi</div>
                    </div>
                </div>
            </div>
            <!-- Include your component here -->
            <c:communities />
        </div>
    </div>
</aura:application>
