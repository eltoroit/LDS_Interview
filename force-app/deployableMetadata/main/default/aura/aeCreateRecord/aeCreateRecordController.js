({
	CreateRecord: function (component, event, helper) {
		var ev = $A.get("e.force:createRecord");
		if (ev) {
			ev.setParams({
				entityApiName: "Case",
				defaultFieldValues: {
					ContactId: component.get("v.recordId")
				}
			});
			ev.fire();
		} else {
			alert('Event [e.force:createRecord] not available');
		}
	}
})