({
	doInit: function (component, event, helper) {
		component.find("newCaseCreator").getNewRecord("Case", null, false,
			$A.getCallback(() => {
				component.set("v.loaded", true);
				var rec = component.get("v.newCaseRecord");
				var error = component.get("v.newCaseError");
				if (error || (rec === null)) {
					helper.showToast({
						type: "error",
						title: "Failed",
						message: `Error initializing record template: ${error}`
					});
				}
			})
		);
	},
	saveRecord: function (component, event, helper) {
		if (helper.validateNewCaseForm(component)) {
			component.find("btnSave").set("v.disabled", true);
			helper.spinnerVisible(component, true);
			component.set("v.newCaseFields.ContactId", component.get("v.recordId"));
			component.find("newCaseCreator").saveRecord((saveResult) => {
				component.find("btnSave").set("v.disabled", false);
				helper.spinnerVisible(component, false);
				if (saveResult.state === "SUCCESS" || saveResult.state === "DRAFT") {
					helper.showToast({ type: "success", title: `Saved ${saveResult.state}`, message: "The record was saved." });
				} else if (saveResult.state === "INCOMPLETE") {
					helper.showToast({ type: "warning", title: "Offline", message: "User is offline, device doesn't support drafts." });
				} else if (saveResult.state === "ERROR") {
					helper.showToast({ type: "error", title: "Failed", message: `Problem saving record: ${JSON.stringify(saveResult.error)}` });
				} else {
					helper.showToast({ type: "error", title: "Unknown error", message: `Unknown problem, state: ${saveResult.state}, error: ${JSON.stringify(saveResult.error)}` });
				}
			});
		}
	},
	recordUpdated: function (component, event, helper) {
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
	}
})