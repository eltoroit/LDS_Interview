import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class weEditRecord extends NavigationMixin(LightningElement) {
  @api recordId;

  EditRecord() {
    this[NavigationMixin.Navigate]({
      type: 'standard__recordPage',
      attributes: {
        recordId: this.recordId,
        actionName: 'edit'
      }
    });
  }
}