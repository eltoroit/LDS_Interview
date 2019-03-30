import { LightningElement, api, wire, track } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import CONTACT_FNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import CONTACT_LNAME_FIELD from '@salesforce/schema/Contact.LastName';
import CONTACT_OTHERPHONE_FIELD from '@salesforce/schema/Contact.OtherPhone';

export default class wNoUi extends LightningElement {
	@api recordId;
	@track contact;
	@track error;

	@wire(getRecord, { recordId: '$recordId', fields: [CONTACT_FNAME_FIELD, CONTACT_LNAME_FIELD, CONTACT_OTHERPHONE_FIELD] })
	wired_getContact({ error, data }) {
		if (data) {
			this.contact = {
				FirstName: getFieldValue(data, CONTACT_FNAME_FIELD),
				LastName: getFieldValue(data, CONTACT_LNAME_FIELD),
				OtherPhone: getFieldValue(data, CONTACT_OTHERPHONE_FIELD),
			};
			this.error = undefined;
		} else if (error) {
			this.contact = undefined;
			this.error = error;
		}
	}
}