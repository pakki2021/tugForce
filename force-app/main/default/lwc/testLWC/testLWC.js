import { LightningElement} from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

export default class TestLWC extends NavigationMixin(LightningElement) {
    accName;
    accWebsite;
    cntFstName;
    cntLstname;
    cntEmail;
    cntPhNum;
    accountId;
    fileFields = {};
    styleClass = 'color:red;'
    spinner = false;
    showErrMsg = false;
    
    handleInputChange(event)
    {
        var inpName = event.target.name;
        var inpVal = event.detail.value;
        this[inpName] = inpVal;
        console.log('Testing deployment');
    }

    handleSave(event)
    {
        var fromWhere = event.target.name;
        if(this.accName == null || this.accName == '' || this.accName == undefined ||
           this.accWebsite == null || this.accWebsite == '' || this.accWebsite == undefined ||
           this.cntFstName == null || this.cntFstName == '' || this.cntFstName == undefined ||
           this.cntLstname == null || this.cntLstname == '' || this.cntLstname == undefined ||
           this.cntEmail == null || this.cntEmail == '' || this.cntEmail == undefined ||
           this.cntPhNum == null || this.cntPhNum == '' || this.cntPhNum == undefined )
        {
            this.showErrMsg = true;
        }
        else
        {
            this.spinner = true;
            this.showErrMsg = false;
            const accFields = {'Name' : this.accName,'Website' : this.accWebsite};
          
            createRecord({ apiName: 'Account', fields : accFields})
            .then(account => {

                const fields_Contact = {
                    'FirstName': this.cntFstName,
                    'LastName' : this.cntLstname,
                    'Email' : this.cntEmail,
                    'Phone' : this.cntPhNum,
                    'AccountId' : account.id
                };
                
                createRecord({ apiName: 'Contact',fields : fields_Contact})
                .then(contact => {
                    this.spinner = false;
                    this.dispatchEvent(
                        new ShowToastEvent({
                            message: 'Contact created',
                            variant: 'success',
                        }),
                    );

                    if(fromWhere == 'save')
                    {
                        this[NavigationMixin.Navigate]({
                            type: 'standard__recordPage',
                            attributes: {
                                recordId: contact.id,
                                actionName: 'view',
                            },
                        }) 
                    } 
                    else
                    {
                        this.handleCancel();
                    }  
                })

                if(Object.keys(this.fileFields).length === 0)
                {
                    console.log('empty');
                }
                else
                {
                    this.fileFields.FirstPublishLocationId = account.id;
                    const recordInput_File = { apiName: 'ContentVersion',
                        fields : this.fileFields};
                    
                    createRecord(recordInput_File)
                    .then(response => {
                        this.fileFields = null;
                    })
                }
            })
            .catch(error => {
                this.spinner = false;
                console.log('error '+JSON.stringify(error));
                this.dispatchEvent(
                    new ShowToastEvent({
                        message: 'Something went wrong!',
                        variant: 'error',
                    }),
                );
            });
        }
    }


    handleCancel()
    {
        this.accName = '';
        this.accWebsite = '';
        this.cntFstName = '';
        this.cntLstname = '';
        this.cntEmail = '';
        this.cntPhNum = '';
        this.fileFields = {};
        this.styleClass = 'color:red;';
    }

    handleFilesChange(event)
    {
        var file = event.target.files[0];
        this.styleClass = 'color:green;';
        var reader = new FileReader()
        reader.onload = () => {
            var base64 = reader.result.split(',')[1]
            this.fileFields = {
                'Title': file.name,
                'VersionData': base64,
                'PathOnClient': file.name
            }
        }
        reader.readAsDataURL(file)
    }
}