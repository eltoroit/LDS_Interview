({
	onload: function (component, event, helper) {
		console.log("Aura: Load", event);
	},
	onsubmit: function (component, event, helper) {
		console.log("Aura: Submit", event);
	},
	onsuccess: function (component, event, helper) {
		console.log("Aura: Success", event);
	},
	onerror: function (component, event, helper) {
		console.log("Aura: Error", event);
	}
})