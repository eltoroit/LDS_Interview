({
    recordUpdated: function (component, event, helper) {
        var eventParams = event.getParams();
        if (eventParams.changeType === "CHANGED") {
            console.log("Record is changed");
        } else if (eventParams.changeType === "LOADED") {
            console.log("Record is loaded in the cache");
        } else if (eventParams.changeType === "REMOVED") {
            console.log("Record is deleted");
        } else if (eventParams.changeType === "ERROR") {
            console.log("There’s an error while loading, saving, or deleting the record");
        } else {
            alert("What changed type? [" + eventParams.changeType + "]");
        }
    }
})