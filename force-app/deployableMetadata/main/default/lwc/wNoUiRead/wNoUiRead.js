import { LightningElement, api, wire, track } from 'lwc';
import { getRecord, getFieldValue, getFieldDisplayValue } from 'lightning/uiRecordApi';
import FIELD_FirstName from '@salesforce/schema/Contact.FirstName';
import FIELD_LastName from '@salesforce/schema/Contact.LastName';
import FIELD_AccountId from '@salesforce/schema/Contact.AccountId';
import FIELD_Account_Name from '@salesforce/schema/Contact.Account.Name';
import FIELD_Account_Website from '@salesforce/schema/Contact.Account.Website';
import FIELD_Birthdate from '@salesforce/schema/Contact.Birthdate';
import FIELD_OtherPhone from '@salesforce/schema/Contact.OtherPhone';
import FIELD_Description from '@salesforce/schema/Contact.Description';

export default class WNoUiRead extends LightningElement {
  @api recordId;
  @track error;
  @track contact;

  @wire(getRecord, { recordId: '$recordId', fields: [FIELD_FirstName, FIELD_LastName, FIELD_AccountId, FIELD_Account_Name, FIELD_Account_Website, FIELD_Birthdate, FIELD_OtherPhone, FIELD_Description] })
  wired_getContact({ data, error }) {
    if (data) {
      this.contact = {
        FirstName: this._getDisplayValue(data, FIELD_FirstName),
        LastName: this._getDisplayValue(data, FIELD_LastName),
        AccountId: this._getDisplayValue(data, FIELD_AccountId),
        Account: {
          Name: this._getDisplayValue(data, FIELD_Account_Name),
          Website: this._getDisplayValue(data, FIELD_Account_Website)
        },
        Birthdate: this._getDisplayValue(data, FIELD_Birthdate),
        OtherPhone: this._getDisplayValue(data, FIELD_OtherPhone),
        Description: this._getDisplayValue(data, FIELD_Description)
      };
      this.error = undefined;
    } else if (error) {
      this.contact = undefined;
      this.error = JSON.stringify(error);
    }
  }

  _getDisplayValue(data, field) {
    return getFieldDisplayValue(data, field) ? getFieldDisplayValue(data, field) : getFieldValue(data, field);
  }
}