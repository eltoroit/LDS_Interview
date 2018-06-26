({
    onLoad: function (component, event, helper) {
        var record = event.getParams().recordUi.record;
        component.set("v.record", record);
        console.log("onLoad");
        console.log(JSON.parse(JSON.stringify(record)));
    },
    onSubmit: function (component, event, helper) {
        console.log("Submit");
        // event.preventDefault();   
    },
    onSuccess: function (component, event, helper) {
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
    },
    onError: function (component, event, helper) {
        alert("Errors...");
    },
    onManualSubmit: function (component, event, helper) {
        console.log("Manual Submit");
        var recordEditForm = component.find("recordEditForm");
        recordEditForm.submit();
    }
})