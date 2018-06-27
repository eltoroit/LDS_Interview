({
    makeComponent: function (component, event, helper) {
        var valFields = component.get("v.valFields");
        var allFields = ['LastName', 'BirthdateXXXX', 'AccountId'];
        var F_RecordData = component.find("F_RecordData");

        var parts = valFields.split("_");
        F_RecordData.set("v.mode", component.get("v.valOperation"));
        F_RecordData.set("v.layoutType", parts[0]);
        if (parts[1]) {
            component.set("v.fields", allFields);
        } else {
            component.set("v.fields", ['Id']);
        }
        F_RecordData.reloadRecord();
    },
    recordUpdated: function (component, event, helper) {
        var eventParams = event.getParams();
        console.log(JSON.stringify(eventParams));
        if (eventParams.changeType === "CHANGED") {
            console.log("Record is changed");
            console.log('Fields that are changed: ' + JSON.stringify(eventParams.changedFields));
        } else if (eventParams.changeType === "LOADED") {
            console.log("Record is loaded in the cache");
        } else if (eventParams.changeType === "REMOVED") {
            console.log("Record is deleted");
        } else if (eventParams.changeType === "ERROR") {
            console.log("There’s an error while loading, saving, or deleting the record");
        } else {
            alert("What changed type? [" + eventParams.changeType + "]");
        }
        console.log("BirthDate: " + component.get("v.targetFields").Birthdate);
        console.log(JSON.parse(JSON.stringify(component.get("v.targetFields"))));
    },
    new: function (component, event, helper) {
        var F_RecordData = component.find("F_RecordData");
        F_RecordData.set("v.recordId", null);
        // ??? F_RecordData.reloadRecord();

        F_RecordData.getNewRecord(
            "Contact", // sObject type (objectApiName)
            null,      // recordTypeId
            false,     // skip cache?
            $A.getCallback(
                function () {
                    var targetRecord = component.get("v.targetRecord");
                    var targetError = component.get("v.targetError");
                    if (targetError || (targetRecord === null)) {
                        alert("Error initializing record template: " + targetError);
                        return;
                    }
                    console.log("Record template initialized: " + targetRecord.sobjectType);
                }
            )
        );
    },
    save: function (component, event, helper) {
        // Fields can be modified in code...
        var fields = component.get("v.targetFields");
        var dt = new Date(fields.Birthdate);
        dt.setDate(dt.getDate() + 1);
        fields.Birthdate = dt;

        var F_RecordData = component.find("F_RecordData");
        F_RecordData.saveRecord(
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
    },
    reload: function (component, event, helper) {
        var F_RecordData = component.find("F_RecordData");
        F_RecordData.reloadRecord(
            false,     // skip cache?
            $A.getCallback(
                function () {
                }
            )
        );
    },
    delete: function (component, event, helper) {
        var F_RecordData = component.find("F_RecordData");
        F_RecordData.deleteRecord(
            $A.getCallback(
                function (deleteResult) {
                    // NOTE: If you want a specific behavior (an action or UI behavior) when this action is successful
                    // then handle that in a callback (generic logic when record is changed should be handled in recordUpdated event handler)
                    if (deleteResult.state === "SUCCESS" || deleteResult.state === "DRAFT") {
                        console.log("Record is deleted.");
                        // Navigate...
                        var navService = component.find("navService");
                        var pageReference = {
                            type: 'standard__objectPage',
                            attributes: {
                                objectApiName: 'Contact',
                                actionName: 'home'
                            }
                        };
                        navService.navigate(pageReference);
                    } else if (deleteResult.state === "INCOMPLETE") {
                        console.log("User is offline, device doesn't support drafts.");
                    } else if (deleteResult.state === "ERROR") {
                        console.log('Problem deleting record, error: ' + JSON.stringify(deleteResult.error));
                    } else {
                        console.log('Unknown problem, state: ' + deleteResult.state + ', error: ' + JSON.stringify(deleteResult.error));
                    }
                }
            )
        );
    }
})