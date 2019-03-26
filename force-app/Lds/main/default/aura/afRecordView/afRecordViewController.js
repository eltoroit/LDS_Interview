({
	showDeprecated: function (component, event, helper) {
		var toastEvent = $A.get("e.force:showToast");
		toastEvent.setParams({
			mode: "sticky",
			type: "error",
			title: "Deprecated Component",
			message: "Do not use <Force:RecordView />, instead please use <lightning:recordViewForm />"
		});
		toastEvent.fire();
	}
})