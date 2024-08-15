/* eslint-disable default-case */
import { LightningElement, track } from 'lwc';
import createCaseWithAttachments from '@salesforce/apex/UsersManagmentController.createCaseWithAttachments';

export default class NewWebToCase extends LightningElement {
    @track subject = '';
    @track status = '';
    @track description = '';
    @track email = '';
    @track contact ='';
    @track isLoading = false;
    @track priority='';
    @track type ='';
    files = [];

    handleInputChange(event) {
        const field = event.target.dataset.id;
        switch(field){
            case 'subject':
                this.subject = event.target.value;
            break;
            case 'description':
                    this.description = event.target.value;
            break;
            case 'email':
                this.email = event.target.value
            break;
            case 'status':
                this.status = event.target.value;
            break;
            
            case 'priority':
                this.priority = event.target.value;
            break;
            case 'type':
                this.type = event.target.value;
            break;
            default :
            this.contact = event.target.value;
            break;


                }
    }

    handleFileChange(event) {
        this.files = [];
        let uploadedFiles = event.target.files;

        // Process each file and collect file data
        const filePromises = Array.from(uploadedFiles).map(file => this.readFile(file));

        // Ensure all files are processed before proceeding
        Promise.all(filePromises)
            .then(results => {
                this.files = results;
                console.log('Files loaded successfully:', this.files);
                this.logFiles(); // Log file details after loading
            })
            .catch(error => {
                console.error('Error processing files:', error);
            });
    }

    readFile(file) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = () => {
                // Extract base64 data from the file
                const base64Data = reader.result.split(',')[1];
                resolve({
                    fileName: file.name,
                    base64Data: base64Data
                });
            };
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    }

    logFiles() {
        console.log('Logging file details:');
        this.files.forEach(file => {
            console.log(`File Name: ${file.fileName}`);
            console.log(`Base64 Data: ${file.base64Data}`);
        });
    }

    handleSubmit() {
        this.isLoading = true;
        console.log('Submitting case with files:', this.files);
        console.log('contact name : ', this.contact);
        

        createCaseWithAttachments({
            subject: this.subject,
            description: this.description,
            email: this.email,
            files: this.files.length > 0 ? this.files : null,
            status :this.status,
            priority : this.priority,
            type:this.type,
            


        })
        .then(result => {
            this.isLoading = false;
            console.log('Case created successfully:', result);
            // Clear the form after successful submission
            // this.subject = '';
            // this.description = '';
            // this.email = '';
            // this.files = [];
        })
        .catch(error => {
            this.isLoading = false;
            console.error('Error creating case:', error);
        });
    }
}
