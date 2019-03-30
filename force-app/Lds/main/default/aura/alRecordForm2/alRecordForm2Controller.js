({
	makeComponent: function (component, event, helper) {
		var contentSelected = component.get("v.contentSelected");
		var operationSelected = component.get("v.operationSelected");
		var fields = ['Name', 'Birthdate', 'AccountId', 'OtherPhone'];

		var attributes = {
			"aura:id": "L_RecordForm",
			recordId: component.get("v.recordId"),
			objectApiName: "Contact",
			columns: 4,
			onload: component.getReference("c.onload"),
			onsubmit: component.getReference("c.onsubmit"),
			onsuccess: component.getReference("c.onsuccess"),
			onerror: component.getReference("c.onerror")
		}

		switch (operationSelected) {
			case "ViewEdit":
				attributes.mode = "view";
				break;
			case "ReadOnly":
				attributes.mode = "readonly";
				break;
			case "Create":
				attributes.recordId = null;
				attributes.mode = "edit";
				break;
			default:
				alert("Invalid Operation");
		}

		var parts = contentSelected.split("_");
		if (parts[0]) {
			attributes.layoutType = parts[0];
			console.log("Layout: " + parts[0]);
		}
		if (parts[1]) {
			attributes.fields = fields;
			console.log("With fields");
		}

		$A.createComponent(
			"lightning:recordForm",
			attributes,
			function (newComponent, status, errorMessage) {
				// debugger;
				if (status === "SUCCESS") {
					component.find("placeHolder").set("v.body", [newComponent]);
				} else if (status === "INCOMPLETE") {
					alert("No response from server or client is offline.");
				} else {
					alert(Status + ": " + errorMessage);
				}
			}
		);
	},
	onload: function (component, event, helper) {
		console.log("Load");
	},
	onsubmit: function (component, event, helper) {
		console.log("Submit");
	},
	onsuccess: function (component, event, helper) {
		console.log("Success");
	},
	onerror: function (component, event, helper) {
		console.log("Error");
	}
})