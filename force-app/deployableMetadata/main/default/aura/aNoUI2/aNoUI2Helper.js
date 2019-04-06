({
	validateNewCaseForm: function () {
		return true;
	},
	showToast: function (params) {
		var resultsToast = $A.get("e.force:showToast");
		resultsToast.setParams(params);
		resultsToast.fire();
	},
	spinnerVisible: function (component, isVisible) {
		var spinner = component.get("spinner");
		if (isVisible) {
			$A.util.removeClass(spinner, "slds-hide");
		} else {
			$A.util.addClass(spinner, "slds-hide");
		}
	}
})