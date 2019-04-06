import { LightningElement, api, track } from 'lwc';

export default class AlRecordForm2 extends LightningElement {
	@api recordId;
	@track operationSelected = 'ViewEdit';
	@track operations = [
		{ label: 'View/Edit', value: 'ViewEdit' },
		{ label: 'Read Only', value: 'ReadOnly' },
		{ label: 'Create', value: 'Create' }
	];
	@track contentSelected = "Full";
	@track contents = [
		{ label: 'Full', value: 'Full' },
		{ label: 'Compact', value: 'Compact' },
		{ label: 'Fields Only', value: '_Fields' },
		{ label: 'Full + Fields', value: 'Full_Fields' },
		{ label: 'Compact + Fields', value: 'Compact_Fields' }
	];
	@track attributes = {};

	fields = ['Name', 'Birthdate', 'AccountId'];

	connectedCallback() {
		this.makeComponent();
	}

	makeComponent() {
		this.attributes = {};
		this.attributes.recordId = this.recordId;
		switch (this.operationSelected) {
			case "ViewEdit":
				this.attributes.mode = "view";
				break;
			case "ReadOnly":
				this.attributes.mode = "readonly";
				break;
			case "Create":
				this.attributes.recordId = null;
				this.attributes.mode = "edit";
				break;
			default:
				// eslint-disable-next-line no-alert
				alert("Invalid Operation");
		}

		const parts = this.contentSelected.split("_");
		if (parts[0]) {
			this.attributes.hasLayout = true;
			this.attributes.layoutType = parts[0];
			// eslint-disable-next-line no-console
			console.log("Layout: " + parts[0]);
		} else {
			this.attributes.hasLayout = false;
		}
		if (parts[1]) {
			this.attributes.hasFields = true;
			this.attributes.fields = this.fields;
			// eslint-disable-next-line no-console
			console.log("With fields");
		} else {
			this.attributes.hasFields = false;
		}

		if (this.attributes.hasLayout && this.attributes.hasFields) {
			this.attributes.hasLayoutAndFields = true;
			this.attributes.hasLayout = false;
			this.attributes.hasFields = false;
		} else {
			this.attributes.hasLayoutAndFields = false;
		}


	}

	onload(event) {
		// eslint-disable-next-line no-console
		console.log("Load", event.detail);
	}

	onsubmit(event) {
		// eslint-disable-next-line no-console
		console.log("Submit", event.detail);
	}

	onsuccess(event) {
		// eslint-disable-next-line no-console
		console.log("Success", event.detail);
	}

	onerror(event) {
		// eslint-disable-next-line no-console
		console.log("Error", event.detail);
	}

	onOperationChanged(event) {
		this.operationSelected = event.target.value;

		// eslint-disable-next-line @lwc/lwc/no-async-operation
		setTimeout(() => {
			this.makeComponent();
		}, 10);
		this.attributes = {};
	}

	onContentChanged(event) {
		this.contentSelected = event.target.value;

		// eslint-disable-next-line @lwc/lwc/no-async-operation
		setTimeout(() => {
			this.makeComponent();
		}, 10);
		this.attributes = {};
	}
}