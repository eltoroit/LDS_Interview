import { LightningElement, api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import FIELD_Id from '@salesforce/schema/Contact.Id';
import FIELD_FirstName from '@salesforce/schema/Contact.FirstName';
import FIELD_LastName from '@salesforce/schema/Contact.LastName';
import FIELD_Birthdate from '@salesforce/schema/Contact.Birthdate';
import FIELD_OtherPhone from '@salesforce/schema/Contact.OtherPhone';
import FIELD_Description from '@salesforce/schema/Contact.Description';
import { getRecord, updateRecord, getFieldValue, getFieldDisplayValue } from 'lightning/uiRecordApi';
export default class WNoUiEdit extends LightningElement {
  @track error;
  @api recordId;
  @track contact;

  @wire(getRecord, { recordId: '$recordId', fields: [FIELD_FirstName, FIELD_LastName, FIELD_Birthdate, FIELD_OtherPhone, FIELD_Description] })
  wired_getContact({ data, error }) {
    if (data) {
      this.contact = {
        FirstName: this._getDisplayValue(data, FIELD_FirstName),
        LastName: this._getDisplayValue(data, FIELD_LastName),
        Birthdate: this._getDisplayValue(data, FIELD_Birthdate, true),
        OtherPhone: this._getDisplayValue(data, FIELD_OtherPhone),
        Description: this._getDisplayValue(data, FIELD_Description)
      };
      this.error = undefined;
    } else if (error) {
      this.contact = undefined;
      this.error = JSON.stringify(error);
    }
  }

  saveRecord() {
    // Fields can be modified in code...
    const fieldBirthdate = this.template.querySelector("[data-field='Birthdate']");
    var dt = new Date(fieldBirthdate.value);
    dt.setDate(dt.getDate() + 1);
    fieldBirthdate.value = dt.toJSON();

    // Build object to save
    const fields = {};
    fields[FIELD_Id.fieldApiName] = this.recordId;
    fields[FIELD_FirstName.fieldApiName] = this.template.querySelector("[data-field='FirstName']").value;
    fields[FIELD_LastName.fieldApiName] = this.template.querySelector("[data-field='LastName']").value;
    fields[FIELD_Birthdate.fieldApiName] = this.template.querySelector("[data-field='Birthdate']").value;
    fields[FIELD_OtherPhone.fieldApiName] = this.template.querySelector("[data-field='OtherPhone']").value;
    fields[FIELD_Description.fieldApiName] = this.template.querySelector("[data-field='Description']").value;
    const recordInput = { fields };

    updateRecord(recordInput)
      .then(() => {
        this.dispatchEvent(new ShowToastEvent({ title: 'Success', message: 'Contact updated', variant: 'success' }));
      }).catch(error => {
        console.log(JSON.stringify(error));
        this.dispatchEvent(new ShowToastEvent({ title: 'Error updating record', message: error.body.message, variant: 'error' }));
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