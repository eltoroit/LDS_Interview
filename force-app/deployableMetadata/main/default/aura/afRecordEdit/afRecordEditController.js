({
	showDeprecated: function (component, event, helper) {
		var toastEvent = $A.get("e.force:showToast");
		toastEvent.setParams({
			mode: "dismissible",
			type: "error",
			title: "Deprecated Component",
			message: "Do not use <Force:RecordEdit />, instead please use <lightning:recordEditForm />"
		});
		toastEvent.fire();
	},
	save: function (component, event, helper) {
		component.find("RecordEdit").get("e.recordSave").fire();
	},
	saveSuccess: function (component, event, helper) {
		var msg = "The record has been updated successfully.";
		var toast = $A.get("e.force:showToast");
		if (toast) {
			toast.setParams({
				mode: "dismissible",
				type: "Success",
				title: "Success!",
				message: msg
			});
			toast.fire();
		} else {
			alert(msg);
		}

		// Refresh, since it does not do it automatically.
		$A.get('e.force:refreshView').fire();
	}
})