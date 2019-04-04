import { LightningElement, api, wire, track } from 'lwc';
import { getRecord, getFieldValue, getFieldDisplayValue } from 'lightning/uiRecordApi';
import FIELD_Contact_FirstName from '@salesforce/schema/Contact.FirstName';
import FIELD_Contact_LastName from '@salesforce/schema/Contact.LastName';
import FIELD_Contact_AccountId from '@salesforce/schema/Contact.AccountId';
import FIELD_Contact_Account_Name from '@salesforce/schema/Contact.Account.Name';
import FIELD_Contact_Account_Website from '@salesforce/schema/Contact.Account.Website';
import FIELD_Contact_Birthdate from '@salesforce/schema/Contact.Birthdate';
import FIELD_Contact_OtherPhone from '@salesforce/schema/Contact.OtherPhone';
import FIELD_Contact_Description from '@salesforce/schema/Contact.Description';

export default class wNoUi extends LightningElement {
	@api recordId;
	@track error;
	@track contact;

	@wire(getRecord, { recordId: '$recordId', fields: [FIELD_Contact_FirstName, FIELD_Contact_LastName, FIELD_Contact_AccountId, FIELD_Contact_Account_Name, FIELD_Contact_Account_Website, FIELD_Contact_Birthdate, FIELD_Contact_OtherPhone, FIELD_Contact_Description] })
	wired_getContact({ data, error }) {
		if (data) {
			this.contact = {
				FirstName: this._getDisplayValue(data, FIELD_Contact_FirstName),
				LastName: this._getDisplayValue(data, FIELD_Contact_LastName),
				AccountId: this._getDisplayValue(data, FIELD_Contact_AccountId),
				Account: {
					Name: this._getDisplayValue(data, FIELD_Contact_Account_Name),
					Website: this._getDisplayValue(data, FIELD_Contact_Account_Website)
				},
				Birthdate: this._getDisplayValue(data, FIELD_Contact_Birthdate),
				OtherPhone: this._getDisplayValue(data, FIELD_Contact_OtherPhone),
				Description: this._getDisplayValue(data, FIELD_Contact_Description)
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