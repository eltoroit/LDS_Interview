({
    EditRecord: function (component, event, helper) {
        var ev = $A.get("e.force:editRecord");
        if (ev) {
            ev.setParams({
                recordId: component.get("v.recordId")
            });
            ev.fire();
        } else {
            alert('Event [e.force:editRecord] not available');
        }
    }
})