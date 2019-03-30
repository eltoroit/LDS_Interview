import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class WlRecordEditForm extends LightningElement {
	@api recordId;

	onLoad(event) {
		// eslint-disable-next-line no-console
		console.log("Load", event.detail);
	}

	onSubmit(event) {
		// eslint-disable-next-line no-console
		console.log("onSubmit", JSON.stringify(event.detail.fields));
		this.showSuccess();
	}

	onSuccess(event) {
		// eslint-disable-next-line no-console
		console.log("Success", event.detail);
	}

	onError(event) {
		// eslint-disable-next-line no-alert
		alert(`Errors... ${JSON.stringify(event.detail)}`);
	}

	onManualSubmit(event) {
		// eslint-disable-next-line no-console
		console.log("onManualSubmit", event.detail);
		this.template.querySelector('lightning-record-edit-form').submit();
		this.showSuccess();
	}

	showSuccess() {
		const msg = "The record has been updated successfully.";
		const toast = new ShowToastEvent({
			mode: "dismissible",
			variant: "success",
			title: "Success!",
			message: msg
		});
		this.dispatchEvent(toast);
	}
}
