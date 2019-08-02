import { LightningElement, api, wire, track } from 'lwc';
import { getRecord, getFieldValue, getFieldDisplayValue } from 'lightning/uiRecordApi';
import FIELD_FirstName from '@salesforce/schema/Contact.FirstName';
import FIELD_LastName from '@salesforce/schema/Contact.LastName';
import FIELD_Birthdate from '@salesforce/schema/Contact.Birthdate';

export default class WNoUiFull extends LightningElement {
  @api recordId;
  @track error;
  @track contact = {
    RecordId: undefined,
    FirstName: undefined,
    LastName: undefined,
    Birthdate: undefined
  }
  @track valFields = "FULL"

  fields = ["Id"];
  optsFields = [
    { label: 'Full', value: 'FULL' },
    { label: 'Compact', value: 'COMPACT' },
    { label: 'Fields Only', value: '_Fields' },
    { label: 'Full + Fields', value: 'FULL_Fields' },
    { label: 'Compact + Fields', value: 'COMPACT_Fields' }
  ];

  @wire(getRecord, {
    recordId: '$recordId',
    fields: [FIELD_FirstName, FIELD_LastName, FIELD_Birthdate]
  })
  wired_getContact({ data, error }) {
    if (data) {
      this.contact = {
        RecordId: this.recordId,
        FirstName: this._getDisplayValue(data, FIELD_FirstName),
        LastName: this._getDisplayValue(data, FIELD_LastName),
        Birthdate: this._getDisplayValue(data, FIELD_Birthdate)
      };
      this.error = undefined;
    } else if (error) {
      this.contact = undefined;
      this.error = JSON.stringify(error);
    }
  }

  fieldsChanged(event) {
    this.valFields = event.detail.value;
  }

  firstNameChanged(event) {
    this.contact.FirstName = event.detail.value;
  }

  lastNameChanged(event) {
    this.contact.LastName = event.detail.value;
  }

  birthNameChanged(event) {
    this.contact.Birthdate = event.detail.value;
  }

  newRecord(event) {
    console.log(event);
  }

  saveRecord(event) {
    console.log(event);
  }

  reloadRecord(event) {
    console.log(event);
  }

  deleteRecord(event) {
    console.log(event);
  }

  _makeComponent() {

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