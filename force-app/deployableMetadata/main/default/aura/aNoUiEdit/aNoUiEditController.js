({
	saveRecord: function (component, event, helper) {
		// Fields can be modified in code...
		// var fields = component.get("v.targetFields");
		// var dt = new Date(fields.Birthdate);
		// dt.setDate(dt.getDate() + 1);
		// fields.Birthdate = dt;

		var recordData = component.find("recordData");
		recordData.saveRecord(
			$A.getCallback(
				function (saveResult) {
					if (saveResult.state === "SUCCESS" || saveResult.state === "DRAFT") {
						// record is saved successfully
						var resultsToast = $A.get("e.force:showToast");
						resultsToast.setParams({
							type: "success",
							title: "Saved",
							message: "The record was saved."
						});
						resultsToast.fire();
					} else if (saveResult.state === "INCOMPLETE") {
						// handle the incomplete state
						alert("User is offline, device doesn't support drafts.");
					} else if (saveResult.state === "ERROR") {
						// handle the error state
						component.set("v.targetError", JSON.stringify(saveResult.error));
						alert('Problem saving contact, error: ' + JSON.stringify(saveResult.error));
					} else {
						alert('Unknown problem, state: ' + saveResult.state + ', error: ' + JSON.stringify(saveResult.error));
					}
				}
			)
		);
	}
})