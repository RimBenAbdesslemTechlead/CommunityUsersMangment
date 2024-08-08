/* eslint-disable no-undef */
/* eslint-disable @lwc/lwc/no-async-operation */
/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import getOrgId from '@salesforce/apex/UsersManagmentController.getOrgId';
import getOrgBaseUrl from '@salesforce/apex/UsersManagmentController.getOrgBaseUrl';
import { LightningElement, wire } from 'lwc';

export default class WebToCaseForm extends LightningElement {

    ActionUrl="";
    @wire(getOrgBaseUrl)
    wiredOrgBaseUrl({ error, data }){
        if (data) {
            this.ActionUrl = this.ActionUrl + data+"/servlet/servlet.WebToCase?encoding=UTF-8&orgId="
            console.log('url : ', data);
            
            
        } else if (error) {
            console.error('Error retrieving Org ID:', error);
        }
    }
    @wire(getOrgId)
    wiredOrgId({ error, data }){
        if (data) {
            this.ActionUrl = this.ActionUrl + data.slice(0, -3);
            console.log('action url : ', this.ActionUrl);
            
        } else if (error) {
            console.error('Error retrieving Org ID:', error);
        }
    }
   


    connectedCallback() {
        setTimeout(() => {
            this.initializeFormAction();
        }, 3000);
    }

    initializeFormAction() {
        var form = this.template.querySelector('[data-id="myForm"]');
        if (form) {
            console.log("Form element found");
            form.action = this.ActionUrl;
        } else {
            console.log("Form element not found");
        }
    }

    handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    this.template.querySelector('[data-id="myFInput"]').value = file.name;
                    this.template.querySelector('[data-id="mySInput"]').value = e.target.result; // Corrected myInput to mySInput
                } catch (error) {
                    console.error('Error during file handling:', error);
                }
            };
            reader.onerror = (error) => {
                console.error('FileReader error:', error);
            };
            reader.readAsDataURL(file);
        }
    }
}
