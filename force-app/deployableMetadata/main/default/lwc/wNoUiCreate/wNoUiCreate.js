import { LightningElement, api, track } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi'
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class wNoUiCreate extends LightningElement {
	@api recordId;
	@track caseId;
	@track caseError;
	@track goToCaseBtnLabel;
	@track spinnerShown = false;
	@track caseRecord = {
		Subject: "",
		Origin: "",
		Description: ""
	};

	subjectChanged(event) {
		this.caseRecord.Subject = event.detail.value;
	}

	originChanged(event) {
		this.caseRecord.Origin = event.detail.value;
	}

	descriptionChanged(event) {
		this.caseRecord.Description = event.detail.value;
	}

	// constructor() {
	// 	super();

	// }

	// <force:recordData aura:id="caseCreator" recordId="{!v.caseId}" layoutType="FULL" mode="EDIT"
	// 				targetRecord="{!v.caseRecord}" targetFields="{!v.caseFields}" targetError="{!v.caseError}"
	// 				recordUpdated="{!c.caseUpdated}" />


	saveRecord(event) {
		console.log(this.caseRecord)
	}
}