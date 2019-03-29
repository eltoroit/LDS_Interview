({
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