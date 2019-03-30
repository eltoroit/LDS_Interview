import { LightningElement, api } from 'lwc';

export default class WlRecordForm extends LightningElement {
	@api recordId;

	onload(event) {
		// eslint-disable-next-line no-console
		console.log("LWC: Load", event.detail);
	}

	onerror(event) {
		// eslint-disable-next-line no-console
		console.log("LWC: Error", event.detail);
	}

	onsuccess(event) {
		// eslint-disable-next-line no-console
		console.log("LWC: Success", event.detail);
	}

	oncancel(event) {
		// eslint-disable-next-line no-console
		console.log("LWC: Cancel", event);
	}
}