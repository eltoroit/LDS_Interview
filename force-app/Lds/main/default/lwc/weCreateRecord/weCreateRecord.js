import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class weCreateRecord extends NavigationMixin(LightningElement) {
	// March 2019
	// Setting default values isn't yet supported, and planned for an upcoming release.
	// https://github.com/trailheadapps/lwc-recipes/issues/66

	CreateRecord() {
		this[NavigationMixin.Navigate]({
			type: 'standard__objectPage',
			attributes: {
				objectApiName: 'Case',
				actionName: 'new'
			}
		});
	}
}
