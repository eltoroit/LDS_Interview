({
    makeComponent: function (component, event, helper) {
        var valFields = component.get("v.valFields");
        var allFields = ['Name', 'Birthdate', 'AccountId'];
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
        // debugger;
        var eventParams = event.getParams();
        if (eventParams.changeType === "CHANGED") {
            alert("Record is changed");
        } else if (eventParams.changeType === "LOADED") {
            alert("Record is loaded in the cache");
        } else if (eventParams.changeType === "REMOVED") {
            alert("Record is deleted");
        } else if (eventParams.changeType === "ERROR") {
            alert("There’s an error while loading, saving, or deleting the record");
        } else {
            alert("What changed type? [" + eventParams.changeType + "]");
        }
        console.log("BirthDate: " + component.get("v.targetFields").Birthdate);
        console.log(JSON.parse(JSON.stringify(component.get("v.targetFields"))));
    },






})