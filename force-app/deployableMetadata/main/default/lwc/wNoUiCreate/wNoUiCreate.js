import { NavigationMixin } from 'lightning/navigation';
import { LightningElement, api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecord, createRecord, getFieldValue, getFieldDisplayValue } from 'lightning/uiRecordApi';
import SOBJECT_Case from '@salesforce/schema/Case';
import FIELD_ContactId from '@salesforce/schema/Case.ContactId';
import FIELD_CaseNumber from '@salesforce/schema/Case.CaseNumber';
import FIELD_Subject from '@salesforce/schema/Case.Subject';
import FIELD_Origin from '@salesforce/schema/Case.Origin';
import FIELD_Description from '@salesforce/schema/Case.Description';

export default class wNoUiCreate extends NavigationMixin(LightningElement) {
  @api recordId;
  @track caseId;
  @track caseError;
  @track spinnerShown = false;
  @track caseRecord = {
    ContactId: "",
    CaseNumber: "",
    Subject: "",
    Origin: "",
    Description: ""
  };
  origins = [
    { label: 'Lightning Component', value: 'Lightning Component' },
    { label: 'Phone', value: 'Phone' },
    { label: 'Email', value: 'Email' },
    { label: 'Web', value: 'Web' }
  ];

  @wire(getRecord, { recordId: '$caseId', fields: [FIELD_ContactId, FIELD_CaseNumber, FIELD_Subject, FIELD_Origin, FIELD_Description] })
  wired_getContact({ data, error }) {
    if (data) {
      this.caseRecord = {
        ContactId: this._getDisplayValue(data, FIELD_ContactId),
        CaseNumber: this._getDisplayValue(data, FIELD_CaseNumber),
        Subject: this._getDisplayValue(data, FIELD_Subject),
        Origin: this._getDisplayValue(data, FIELD_Origin),
        Description: this._getDisplayValue(data, FIELD_Description)
      };
      this.error = undefined;
    } else if (error) {
      this.caseRecord = undefined;
      this.error = JSON.stringify(error);
    }
  }

  get editForm() {
    return !(this.caseRecord && this.caseRecord.CaseNumber);
  }

  get goToCaseBtnLabel() {
    return `Go to: ${this.caseRecord.CaseNumber}`;
  }

  subjectChanged(event) {
    this.caseRecord.Subject = event.detail.value;
  }

  originChanged(event) {
    this.caseRecord.Origin = event.detail.value;
  }

  descriptionChanged(event) {
    this.caseRecord.Description = event.detail.value;
  }

  saveRecord() {
    const fields = {};
    fields[FIELD_ContactId.fieldApiName] = this.recordId;
    fields[FIELD_Subject.fieldApiName] = this.caseRecord.Subject;
    fields[FIELD_Origin.fieldApiName] = this.caseRecord.Origin;
    fields[FIELD_Description.fieldApiName] = this.caseRecord.Description;
    const recordInput = { apiName: SOBJECT_Case.objectApiName, fields };

    this.spinnerShown = true;
    createRecord(recordInput)
      .then(newCase => {
        this.spinnerShown = false;
        this.caseId = newCase.id;
        this.dispatchEvent(new ShowToastEvent({ title: 'Success', message: 'Case created', variant: 'success' }));
      }).catch(error => {
        this.spinnerShown = false;
        console.log(JSON.stringify(error));
        this.dispatchEvent(new ShowToastEvent({ title: 'Error creating record', message: error.body.message, variant: 'error' }));
      });
  }

  goToCase() {
    this[NavigationMixin.Navigate]({
      type: 'standard__recordPage',
      attributes: {
        recordId: this.caseId,
        actionName: 'view'
      }
    });
  }

  _getDisplayValue(data, field, forceValue = false) {
    let output;
    if (forceValue) {
      output = getFieldValue(data, field);
    } else {
      const dispVal = getFieldDisplayValue(data, field);
      output = dispVal ? dispVal : getFieldValue(data, field);
    }
    return output;
  }
}