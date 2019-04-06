({
	doInit: function (component, event, helper) {
		component.find("caseCreator").getNewRecord("Case", null, false,
			$A.getCallback(() => {
				component.set("v.loaded", true);
				var rec = component.get("v.caseRecord");
				var error = component.get("v.caseError");
				if (error || (rec === null)) {
					const message = `Error initializing record template: ${error}`;
					component.set("v.caseError", message);
					helper.showToast({
						type: "error",
						mode: "sticky",
						title: "Failed",
						message
					});
				}
			})
		);
	},
	saveRecord: function (component, event, helper) {
		if (helper.validateCaseForm(component)) {
			component.find("btnSave").set("v.disabled", true);
			helper.spinnerVisible(component, true);
			component.set("v.caseFields.ContactId", component.get("v.recordId"));
			component.find("caseCreator").saveRecord((saveResult) => {
				component.find("btnSave").set("v.disabled", false);
				helper.spinnerVisible(component, false);
				if (saveResult.state === "SUCCESS" || saveResult.state === "DRAFT") {
					component.set("v.caseId", saveResult.recordId);
					const message = `The record [${saveResult.recordId}] was saved.`;
					helper.showToast({ type: "success", title: `Saved ${saveResult.state}`, message });
					component.find("caseCreator").reloadRecord();
				} else if (saveResult.state === "INCOMPLETE") {
					helper.showToast({ type: "warning", title: "Offline", message: "User is offline, device doesn't support drafts." });
				} else if (saveResult.state === "ERROR") {
					let message = JSON.stringify(saveResult.error).replace(/,/g, ", ");
					helper.showToast({
						type: "error",
						mode: "sticky",
						title: "Failed",
						message: 'Message is required, but will not be shown',
						messageTemplate: 'Problem saving record: {0}',
						messageTemplateData: [message],

					});
				} else {
					let message = JSON.stringify(saveResult.error).replace(/,/g, ", ");
					helper.showToast({
						type: "error",
						mode: "sticky",
						title: "Unknown error",
						message: 'Message is required, but will not be shown',
						messageTemplate: "Unknown problem, state: {0}, error: {1}` })",
						messageTemplateData: [saveResult.state, message]
					});
				}
			});
		}
	},
	caseUpdated: function (component, event, helper) {
		var eventParams = event.getParams();
		if (eventParams.changeType === "CHANGED") {
			helper.showToast({ type: "info", title: "CHANGED", message: "Record is changed" });
		} else if (eventParams.changeType === "LOADED") {
			helper.showToast({ type: "info", title: "LOADED", message: "Record is loaded in the cache" });
		} else if (eventParams.changeType === "REMOVED") {
			helper.showToast({ type: "info", title: "REMOVED", message: "Record is deleted" });
		} else if (eventParams.changeType === "ERROR") {
			if (component.get("v.loaded") === true) {
				helper.showToast({ type: "error", title: "ERROR", message: "There’s an error while loading, saving, or deleting the record" });
			}
		} else {
			helper.showToast({ type: "error", title: "Unknown State", message: `What changed type? [${eventParams.changeType}]` });
		}
	},
	goToCase: function (component, event, helper) {
		var navEvt = $A.get("e.force:navigateToSObject");
		navEvt.setParams({
			recordId: component.get("v.caseId"),
			slideDevName: "related"
		});
		navEvt.fire();
	}
})