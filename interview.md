# A Conversation With EL TORO About Lightning Data Service (Updated for Lightning Web Components) <!-- omit in toc -->

- [Modal: Edit Record](#modal-edit-record)
	- [Aura Components](#aura-components)
	- [Lightning Web Components](#lightning-web-components)
- [Modal: Create Record](#modal-create-record)
	- [Aura Components](#aura-components-1)
	- [Lightning Web Components](#lightning-web-components-1)
- [~~Component: Force / Record View~~ (Deprecated)](#component-force--record-view-deprecated)
	- [Aura Components](#aura-components-2)
- [~~Component: Force / Record Edit~~ (Deprecated)](#component-force--record-edit-deprecated)
	- [Aura Components](#aura-components-3)
- [Component: Lightning / Record Form](#component-lightning--record-form)
	- [Aura Components](#aura-components-4)
	- [Lightning Web Components](#lightning-web-components-2)
- [Components: Lightning / Record View Form](#components-lightning--record-view-form)
	- [Aura Components](#aura-components-5)
	- [Lightning Web Components](#lightning-web-components-3)
- [Components: Lightning / Record Edit Form](#components-lightning--record-edit-form)
	- [Aura Components](#aura-components-6)
	- [Lightning Web Components](#lightning-web-components-4)
- [Without UI](#without-ui)
	- [Aura Components: Read Data](#aura-components-read-data)
	- [Lightning Web Components: Read Data](#lightning-web-components-read-data)
	- [Aura Components](#aura-components-7)
	- [Lightning Web Components](#lightning-web-components-5)


**READER:** El Toro, I have heard that a Lightning Component runs on the client side, without requiring Apex… is that true?

**EL TORO:** Actually, that is 100% true. That’s what makes it run “lightning fast” ;-) *(Pun intended)*

**READER:** Ok, so if I do not make calls to the server how do I work with Salesforce data? Do I need to write Apex controllers?

**EL TORO:** Great question, I am glad you asked. You may get access to data using Apex or usign LDS.

**READER:** Sorry to interrupt, what is LDS?

**EL TORO:** LDS is just Lightning Data Service

**READER:** Ok, thanks… you were saying?

**EL TORO:** Oh yes, you can get access to Apex or LDS. You will use Apex if you want to bring a list of records, but if you need to work with only one record, for example to create a new record or if you have the ID of an existing record, then you can use LDS which has many benefits including:

- Data is cached. If multiple components in the page need to get access to the same record, the server will only be contacted once.
- If two components on the same page use the same record and one of those components makes a change to the record, then the other component(s) will be notified.
- Data access is secured.

**READER:** What do you mean by secure? Doesn't Salesforce manage CRUD, FLS and Record Access?

**EL TORO:** Salesforce does have relly good security, and page layouts and Visualforce respect that. But when you are using Apex you will need to control the security yourself.

**READER:** But if I use `with sharing` in my Apex classes, then the security gets controlled, right?

**EL TORO:** Oh... be very careful with that thinking! `with sharing` only respect record access, but Apex will always ignore restrictions on CRUD and FLS.

**READER:** But when I have built Visualforce pages in the past, the data was secured. Including CRUD and FLS, I do not understand.

**EL TORO:** You are correct, Visualforce did protect you and LDS will protect you, but you have to protect your data when using Apex.

**READER:** How do I protect my data?

**EL TORO:** That's a really important question, I am glad you asked... The short answer, look at this library I wrote a while back: https://github.com/eltoroit/ETLC_ApexBridge/blob/master/ApexBride_Library/Library/main/default/classes/ETLC_SecuredDB.cls. But remember, if you use LDS then Salesforce will protect you!

**READER:** Why not use LDS all the time and not bother with Apex? why bother about security?

**EL TORO:** Have you been paying attention? LDS = 1 record, Apex = multiple records.

**READER:** Of course, I forgot. How do I work with Salesforce Data?

**EL TORO:** Let me show you the different methods you can work with Salesforce data with and without writing Apex. Oh, but let me warn you, LDS offers quite a few different methods... *(interrupted)*

**READER:** Why is that a warning?

**EL TORO:** Well, it can be confusing when trying to choose the best method for your needs. The difference is basically a trade off between how much you want to control the UI. The most basic method is a modal dialog which shows the page layout, there is another method to use the page layout but without a modal dialog, and finally a method where there is no UI provided by LDS and you can control the UI in which ever manner you choose.

**READER:** OK, I have been warned :-) I guess the more I want to control the UI, the more code I need to write, right? 

**EL TORO:** Yes, but no Apex unless you need to work with multiple records. Couple more things before we get started. I have created this repo with the examples for each method, so that you can see how they are implemented. I am going to override the view for the contact record with a component build on **Lightning Aura Components** and one build on **Lightning Web Components** so you can compare the similarities and differences between them when dealing with data.

**READER:** So, are we going to be comparing both Aura and Web components? Cool!

**EL TORO:** yes, very cool indeed. I will try to keep the names as similar as possible in order to make it easier to compare. So let's get started!

# Modal: Edit Record
> **Aura Components:**
> - **Documentation:** https://developer.salesforce.com/docs/component-library/bundle/force:editRecord/documentation
> - **Sample:** [aeEditRecord](./force-app/Lds/main/default/aura/aeEditRecord)
> 
> **Lightning Web Components:**  
> - **Documentation:** https://developer.salesforce.com/docs/component-library/documentation/lwc/lwc.use_navigate
> - **Documentation:** https://developer.salesforce.com/docs/component-library/bundle/lightning-navigation/documentation
> - **Sample:** [weEditRecord](./force-app/Lds/main/default/lwc/weEditRecord)

**EL TORO:** The easiest way to work with data is by letting Salesforce handle everything. This first example opens a pop-up modal window so that your users can edit a record.

## Aura Components

**EL TORO:** In Aura components, you fire an event like this:

```
var editRecordEvent = $A.get("e.force:editRecord");
editRecordEvent.setParams({
   recordId: component.get("v.recordId")
});
editRecordEvent.fire();
```

## Lightning Web Components

**EL TORO:** In Lightning Web components, you navigate to the edit page like this:

```
this[NavigationMixin.Navigate]({
   type: 'standard__recordPage',
   attributes: {
      recordId: this.recordId,
      actionName: 'edit'
   }
});
```

But in order to get this working in Lightning Web Components, you need to do few things:

1. Import the NavigationMixin library (`import { NavigationMixin } from 'lightning/navigation';`)
2. Extend the navigation mixing (`...extends NavigationMixin(LightningElement)`)

So your JavaScript needs to look like this:

```
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
```

# Modal: Create Record

> **Aura Components:**
> - **Documentation:** https://developer.salesforce.com/docs/component-library/bundle/force:createRecord/documentation
> - **Sample:** [aeCreateRecord](./force-app/Lds/main/default/aura/aeCreateRecord)
> 
> **Lightning Web Components:**  
> - **Documentation:** https://developer.salesforce.com/docs/component-library/documentation/lwc/lwc.use_navigate
> - **Documentation:** https://developer.salesforce.com/docs/component-library/bundle/lightning-navigation/documentation
> - **Sample:** [weCreateRecord](./force-app/Lds/main/default/lwc/weCreateRecord)

**READER:** That looks simple. Is there a similar way to create a record?

**EL TORO:** Indeed, and that is the second method I want to discuss. It allows you to create a record in a pop-up modal window without too much work.

**READER:** Nice, can you pre-set some fields?

**EL TORO:** Well, good question. I am glad you asked. In Aura components, yes. But in LWC is not available yet (as of April 2019).

## Aura Components

Let's take a look at the code in Aura:

```
var createRecordEvent = $A.get("e.force:createRecord");
createRecordEvent.setParams({
   entityApiName: "Contact",
   defaultFieldValues: {
      AccountId: component.get("v.recordId")
   }
});
createRecordEvent.fire();
```

## Lightning Web Components

With LWC, the code is pretty similar to above where you needed to import the `NavigationMixin`, this is the code:

```
this[NavigationMixin.Navigate]({
   type: 'standard__objectPage',
   attributes: {
      objectApiName: 'Case',
      actionName: 'new'
   }
});
```

**READER:** This is pretty simple, but what if I do not want a modal window? Do I need Apex?

**ELTORO:** That's actually a very good question... You need Apex if you want to work with multiple records but there are several ways of using LDS (Lightning Data Service) to work with one record and have more power over the UI. Let’s take a look at some more examples…

# ~~Component: Force / Record View~~ (Deprecated)

> **Aura Components:**
> - **Documentation:** https://developer.salesforce.com/docs/component-library/bundle/force:recordView/documentation
> - **Sample:** [afRecordView](./force-app/Lds/main/default/aura/afRecordView)
> 
> **Update:** This component was deprecated in Aura, do not use `<Force:recordView/>` instead please use`<lightning:recordForm/>`

**EL TORO:** This is possible the easiest way to display a record. This component displays the record using it’s page layout on the screen.

**READER:** Do you mean like the `<apex:detail/>` did in Visualforce pages?

## Aura Components

**EL TORO:** Exactly! This is how the markup for this component is written in Aura

```
<force:recordView recordId="{!v.recordId}"/>
```

**READER:** The `<apex:detail/>` tag in Visualforce was pretty useful, if you wanted to have the page layout and add additional things to the page. Is that used a lot in Lightning Components?

**EL TORO:** Great question, I am glad you asked… I actually, do not think this is that useful in Lightning components, remember, you could work much simpler, without writing code, if you use the Lightning App Builder.

**READER:** You are right, I had forgotten about that…

# ~~Component: Force / Record Edit~~ (Deprecated)

> **Aura Components:**
> - **Documentation:** https://developer.salesforce.com/docs/component-library/bundle/force:recordEdit/documentation
> - **Sample:** [afRecordEdit](force-app/Lds/main/default/aura/afRecordEdit)
> 
> **Update:** This component was deprecated in Aura, do not use `<Force:RecordEdit/>` instead please use `<lightning:recordForm/>`

**READER:** I have used `<apex:detail/>` in many of the pages I built in the past, but ... *(interrupted)*

**EL TORO:** One more thing, with Visualforce you were able to use `<apex:detail/>` to view a record but not to edit the records. If you wanted that, you had to write a lot of markup code. But Salesforce now gives us `<force:recordEdit/>` which allows the user to edit the records without too much code.

## Aura Components

**EL TORO:** This is how the markup for Aura looks:

```
<force:recordEdit aura:id="RE" recordId="{!v.recordId}"/>
```

**READER:** Which fields are being edited?

**EL TORO:** Remember this component uses the page layout, but the user will only be able to view/edit the fields he has access to.

**READER:** Cool! Will the buttons appear at the top and the bottom of the form as they did in Salesforce Classic?

**EL TORO:** Great question… You are pretty smart! Actually, you do have to add a button to save the changes done by the user. The button could look something like this:

```
<lightning:button label="Save" onclick="{!c.RE_Save}"/>
```

**READER:** What does the code for the RecordEdit_Save controller function look like?

**EL TORO:** Simple, you write something like this:

```
RE_Save: function(component, event, helper) {
   component.find("RE").get("e.recordSave").fire();
}
```

**READER:** Can you detect when the record gets successfully saved, so you can display a message to the user?

**EL TORO:** Actually, yes you can. You need to write this handler on the markup

```
<aura:handler name="onSaveSuccess" event="force:recordSaveSuccess" action="{!c.RE_SaveSuccess}"/>
```

**EL TORO:** And before you ask, this is what the controller function would look like:

```
RE_SaveSuccess: function(component, event, helper) {
   $A.get('e.force:refreshView').fire();
}
```

**READER:** Thanks, but can I ask you about the event `e.force:refreshView`?

**EL TORO:** LDS uses a mechanism to keep the records synchronized among the different components that use that record, this statement tells LDS to refresh its copy of the record…

**READER:** Cool ...

**EL TORO:** And remember... we do not need to write a single line of Apex!

**READER:** These last 2 components are pretty cool, but if they are deprecated ... I should not be using them, right?

# Component: Lightning / Record Form

> **Aura Components:**
> - **Documentation:** https://developer.salesforce.com/docs/component-library/bundle/lightning:recordForm/documentation
> - **Sample:** [alRecordForm](./force-app/Lds/main/default/aura/alRecordForm)
> - **Sample:** [alRecordForm2](./force-app/Lds/main/default/aura/alRecordForm2)
> 
> **Lightning Web Components:**  
> - **Documentation:** https://developer.salesforce.com/docs/component-library/bundle/lightning-record-form/documentation
> - **Sample:** [wlRecordForm](./force-app/Lds/main/default/lwc/wlRecordForm)
> - **Sample:** [wlRecordForm2](./force-app/Lds/main/default/lwc/wlRecordForm2)

**EL TORO:** Correct. I prefer you start using the other cool components provided by LDS. The first one we'll talk about is `<lightning:recordForm />`. With a little bit of code, you can get a lot out of this component. It's like the Visualforce `<apex:detail />` component that you are familiar with.

## Aura Components

**EL TORO:** This is what the Aura component looks like:

```
<lightning:recordForm recordId="{!v.recordId}" objectApiName="Contact" columns="4" mode="view" layoutType="Full" onload="{!c.onload}" onsubmit="{!c.onsubmit}" onsuccess="{!c.onsuccess}" onerror="{!c.onerror}" />
```

**READER:** Wow, that's a lot more code that we had when writing the old faithful `<apex:detail />` in Visualforce.

**EL TORO:** You are a very observant person, and yes indeed it's a lot more, but not everyhting is required. On the other hand, this actually gives you a bit more power than the Visualforce component. For example:

- It gives you inline editing
- You can specify how many columns you want to see
- Events that you can handle for loading, submiting,succes, and error

**READER:** yeah, but most of that was available with the `<apex:detail />`. Except for the number of columns.

**EL TORO:** true, by the way, here we are specifying 4 columns

**READER:** One thing I wish it had, was the ability to use the page layouts, and the compact layouts. Many times, I had to write tons of code because I did not wanted all the fields in the page layout.

**EL TORO:** Actually, this component has the ability to specify that you want the compact layout by doing `layoutType="Compact"`. You could actually specify some fields that you want to be there (even if they are not part of the layout) or just the fields you want. That is actually what I demonstrate on the second example.

**READER:** Wow, that is awesome! And something you could not do with Visualforce. Can you do the same in LWC?

## Lightning Web Components

**EL TORO:** Absolutely, this is what it would look like in LWC.

```
<lightning-record-form record-id={recordId} object-api-name="Contact" columns="4" mode="view" layout-type="Full" onload={onload} onerror={onerror} onsuccess={onsuccess} oncancel={oncancel}>
</lightning-record-form>
```

**READER:** I took a look at the [advanced demo for Aura components](./force-app/Lds/main/default/aura/alRecordForm2) and that is pretty good. I like the way that you built a dynamic component to change the different attributes and be able to compare the different settings. Did you build a similar demo for LWC?

**EL TORO:** Actually, yes I did... but the [advanced demo for LWC components](./force-app/Lds/main/default/lwc/wlRecordForm2) is a bit different because you can't create components at run-time with LWC. So I reset the attributes to remove the component, then few milliseconds later I call the makeComponent() method to set the new properties.

**READER:** That was pretty clever.

**EL TORO:** Thank you.

# Components: Lightning / Record View Form

> **Aura Components:**
> - **Documentation:** https://developer.salesforce.com/docs/component-library/bundle/lightning:recordViewForm/documentation
> - **Sample:** [alRecordViewForm](./force-app/Lds/main/default/aura/alRecordViewForm)
> 
> **Lightning Web Components:**  
> - **Documentation:** https://developer.salesforce.com/docs/component-library/bundle/lightning-record-view-form/documentation
> - **Sample:** [wlRecordViewForm](./force-app/Lds/main/default/lwc/wlRecordViewForm)

**READER:** I have been reviewing the demos you built, and they are pretty cool, specially the second one for `<lightning-record-form />`. But we are using page layouts and those can only have one or two columns

**EL TORO:** Did you see in the demo, how I defined four columns so the fields get arranged a bit better for wider screens.

**READER:** But I have noticed that some of the fields are not arranged the way I would like to have them placed on the screen. Can I move the fields around? I know that I could have the administrator re-arrange the fields on the page layouts, but those only handle 1 and 2 columns. 

**EL TORO:** Well, the administrator can change the order of the fields on tha page layouts, right?

**READER:** yeah, but we are stuck with page layouts defined by the administrator...

**EL TORO:** Which is not necessarily a bad thing, right?

**READER:** Indeed, but I do not want to depend on what he decides to do with the page layouts in the future. What can I do? can we build our own UI? What if I want to show / hide some fields dynamically? Do we need Apex then?

**EL TORO:** Not quite. Remember that you need Apex only if you want to work with multiple records. But controlling the UI with a single record is quite simple.

**READER:** Right, I keep forgetting that part... *(interrupted)*

**EL TORO:** There is a simple component named `<lightning:recordViewForm/>` which allows you to build the screen that you want, it's similar to the `<apex:outputField />` components you had in Visualforce.

## Aura Components

**EL TORO:** This is how you use the `<lightning:recordViewForm />` in Aura:

```
<lightning:recordViewForm recordId="{!v.recordId}" objectApiName="Contact">
   <lightning:outputField fieldName="FirstName" />
   <lightning:outputField fieldName="LastName" />
   <lightning:outputField fieldName="Birthdate" />
   <lightning:outputField fieldName="AccountId" />
</lightning:recordViewForm>
```

**READER:** That's pretty simple.

**EL TORO:** Indeed, and you can arrange the fields on the screen, show / hide fields depending on conditions, basically this is what you were asking... right?

**READER:** It is. I also see there are some outputField components, what do they render on the screen? a picklist? a checkbox? a calendar?

**EL TORO:** YES! 

**READER:** uhm?

**EL TORO:** well, it depends on the actual field itself. For example if the field is of type URL, then you will see a link. If the field is of type date/time you will see the value as formatted for this particular user (time zone and locale).

**READER:** One more question...

**EL TORO:** As many as you need.

**READER:** What would the JavaScript controller look like?

**EL TORO:** To display fields like this, there is no need for controller code.

**READER:** I get it... Cool! Do we have something similiar for LWC?

## Lightning Web Components

**EL TORO:** Absolutely, this is how you build that with LWC.

```
<lightning-record-view-form record-id={recordId} object-api-name="Contact">
   <lightning-output-field field-name="FirstName"></lightning-output-field>
   <lightning-output-field field-name="LastName"></lightning-output-field>
   <lightning-output-field field-name="Birthdate"></lightning-output-field>
   <lightning-output-field field-name="AccountId"></lightning-output-field>
</lightning-record-view-form>
```

**READER:** Oh, wait... these fields are read-only. Can I build a similar for to edit the records?

**EL TORO:** Records or record?

**READER:** I meant record, a single one, because I would need Apex if I want to work with multiple records.

**EL TORO:** Absolutely. Now you are getting it!

# Components: Lightning / Record Edit Form

> **Aura Components:**
> - **Documentation:** https://developer.salesforce.com/docs/component-library/bundle/lightning:recordEditForm/example
> - **Sample:** [alRecordEditForm](./force-app/Lds/main/default/aura/alRecordEditForm)
> 
> **Lightning Web Components:**  
> - **Documentation:** https://developer.salesforce.com/docs/component-library/bundle/lightning-record-edit-form/documentation
> - **Sample:** [wlRecordEditForm](./force-app/Lds/main/default/lwc/wlRecordEditForm)

**EL TORO:** This component is like the previous one, but it's for editing or creating records. *(interrupted)*

**READER:** Editing or creating? How does it know what you are doing?

**EL TORO:** Great question, I am glad you asked... Just as the previous components `<lightning:recordForm />` which take a record Id to edit a record, if you do not pass one then it will create a record. As I was saying, this component allows you to edit or create a component, but allows you to control the UI because you will be using `<lightning:inputField />` components to define the placement of those fields on the screen.

## Aura Components

**EL TORO:** Let me show you what the Aura code looks like

```
<lightning:recordEditForm aura:id="recordEditForm" recordId="{!v.recordId}" objectApiName="Contact" onload="{!c.onLoad}" onsubmit="{!c.onSubmit}" onsuccess="{!c.onSuccess}" onerror="{!c.onError}">
   <lightning:messages />
   <lightning:inputField fieldName="FirstName" />
   <lightning:inputField fieldName="LastName" />
   <lightning:inputField fieldName="Birthdate" />
   <lightning:inputField fieldName="AccountId" />
   <lightning:inputField fieldName="Account.Name" />
   <lightning:button variant="brand" type="submit" label="Update" aura:id="button" onclick="{!c.onSubmit}" />
   <lightning:button variant="destructive" type="reset" label="Reset" />
</lightning:recordEditForm>
```

**READER:** I see there is a bit more attribute being used here, what does the controller look like?

**EL TORO:** let me show you...

```
({
   onLoad: function(component, event, helper) {
      var record = event.getParams().recordUi.record;
      component.set("v.record", record);
      console.log("onLoad");
      console.log(JSON.parse(JSON.stringify(record)));
   },
   onSubmit: function(component, event, helper) {
      console.log("Submit");
      // event.preventDefault();   
   },
   onSuccess: function(component, event, helper) {
      var msg = "The record has been updated successfully.";
      var toast = $A.get("e.force:showToast");
      if (toast) {
         toast.setParams({ mode: "dismissible", type: "Success", title: "Success!", message: msg });
         toast.fire();
      } else {
         alert(msg);
      }

      // Refresh, since it does not do it automatically.
      $A.get('e.force:refreshView').fire();
   },
   onError: function(component, event, helper) {
      alert("Errors...");
   }
})
```

**READER:** That looks a bit more complex!

**EL TORO:** Well, saving a record is a bit more complex than querying for it. Plus you can hook up your code with this component in several parts, and layout the `<lightning:inputField />` in any way you wan on the screen. Let’s take a look at the details... As you can see, we are using <lightning:inputField/> to edit the values of the fields.

**READER:** And I would assume the widget used to edit the value depends on the type of the field, correct?

**EL TORO:** Absolutely, and it does use SLDS styles too.

**READER:** I see there is a <lightning:button/>, but it does not have an onclick event? How does it work?

**EL TORO:** You are a very good observer, actually if you nest a `<lightning:button/>` with a `type=”Submit”` attribute inside the `<lightning:recordEditForm />` then when the user clicks on such button the form is submitted and the data saved in the record. But you could also "manually submit" the form, and manually submit the form when you detect an event. Something like this:

```
onManualSubmit: function(component, event, helper) {
   console.log("Manual Submit");
   var recordEditForm = component.find("recordEditForm");
   recordEditForm.submit();
}
```

**READER:** I see in the code above that you are using a component named `<<lightning:messages />`, I assume that works similiarly to `<apex:pageMessages />` which it's automatically populated if there were any errors that happened when the record was being saved. Correct? 

**EL TORO:** Absolutely! So do not forget to include the `<lightning:messages/>` so that any errors or messages are displayed if saving the record fails.

**READER:** Thanks for the tip.

**EL TORO:** No problem.

## Lightning Web Components

**EL TORO:** Let's take a look at what the markup code looks like in LWC:

```
<lightning-record-edit-form record-id={recordId} object-api-name="Contact" onload={onLoad} onsubmit={onSubmit} onsuccess={onSuccess} onerror={onError}>
   <lightning-messages></lightning-messages>
   <lightning-input-field field-name="FirstName"></lightning-input-field>
   <lightning-input-field field-name="LastName"></lightning-input-field>
   <lightning-input-field field-name="Birthdate"></lightning-input-field>
   <lightning-input-field field-name="AccountId"></lightning-input-field>
   <lightning-input-field field-name="Account.Name"></lightning-input-field>
   <lightning-button label="Manual Update" onclick={onManualSubmit}></lightning-button>
   <lightning-button variant="brand" type="submit" label="Update" onclick={onSubmit}></lightning-button>
   <lightning-button variant="destructive" type="reset" label="Reset"></lightning-button>
</lightning-record-edit-form>
```

**EL TORO:** And this is what the controller code looks like in LWC:

```
import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class WlRecordEditForm extends LightningElement {
   @api recordId;

   onLoad(event) {
      console.log("Load", event.detail);
   }

   onSubmit(event) {
      console.log("onSubmit", JSON.stringify(event.detail.fields));
      this.showSuccess();
   }

   onSuccess(event) {
      console.log("Success", event.detail);
   }

   onError(event) {
      alert("Errors...");
   }

   onManualSubmit(event) {
      this.template.querySelector('lightning-record-edit-form').submit();
      this.showSuccess();
   }

   showSuccess() {
      const msg = "The record has been updated successfully.";
      const toast = new ShowToastEvent({
         mode: "dismissible",
         variant: "success",
         title: "Success!",
         message: msg
      });
      this.dispatchEvent(toast);
   }
}
```

**READER:** I guess that if you want a lot of control, you need to write a lot of code!

**EL TORO:** Absolutely.

# Without UI

> **Aura Components:**
> - **Documentation:** https://developer.salesforce.com/docs/component-library/bundle/force:recordData/documentation
> - **Sample:** [alRecordData](./force-app/Lds/main/default/aura/alRecordData)
> - **Sample:** [alRecordData2](./force-app/Lds/main/default/aura/alRecordData2)
> - **Sample:** [alRecordData3](./force-app/Lds/main/default/aura/alRecordData3)
> 
> **Lightning Web Components:**  
> - **Documentation:** https://developer.salesforce.com/docs/component-library/documentation/lwc/lwc.data_wire_service_about
> - **Sample:** [wlWired](./force-app/Lds/main/default/lwc/wlWired)
> - **Sample:** [wlWired2](./force-app/Lds/main/default/lwc/wlWired2)
> - **Sample:** [wlWired3](./force-app/Lds/main/default/lwc/wlWired3)

**READER:** I am afraid to ask you the next question...

**EL TORO:** Why?

**READER:** Because I think you are going to tell me that it needs a lot of code

**EL TORO:** Now I am intrigued, what could be the question...

**READER:** So far we have seen how to write with a single record but either providing the name of the field, or by doing an `<lightning:inputfield>`. I have a requirement from my users to create a form where I need to have special widget for a field. Can we do that?

**EL TORO:** Sorry, but I think I am lost. What exactly were you trying to accomplish?

**READER:** Let me explain, one of the fields in a form is a single numeric field to evaluate the rating of a lead. The possible values range from 1 for an awful lead to 5 for an awesome one. The page layout the users are using has a textbox where the users can enter a single digit, but they can enter a value less than 1 or greater than 5, there is a validation rule that prevents the data from being entered but the form data can still be submited (not saved) with any single digit number. Also, a crazy user thought the value "1" was for their best leads because those are the leads he wants to call first. I guess it kind of make sense... but I would prefer to have a picklist or a set of radio buttons but so far I have not seen this is possible. Can this be accompished?

**EL TORO:** Oh yes, this is a very common issue where you need toal control of the UI. This can definetly be done using the `<force:recordData />` component in Aura, which was actually the first components we had with LDS. Unlike all the components we have seen, this component does not provide any UI, so you have full control.

**READER:** That sounds very powerful.

**EL TORO:** Yes, and the code is not that complex. Do you want to see how it's done?

**READER:** Yes!

**EL TORO:** Ok, but let's approach this in steps.

- Read a record
- Edit it with a special widget
- All the options you can do with this component.

**READER:** I like the idea... I am ready!

## Aura Components: Read Data

**EL TORO:** Let me show you first how to read data with Aura.

```
<aura:component implements="force:hasRecordId">
   <aura:attribute name="targetRecord" type="Object" />
   <aura:attribute name="targetFields" type="Object" />
   <aura:attribute name="targetError" type="Object" />

   <force:recordData aura:id="F_RecordData" recordId="{!v.recordId}" layoutType="FULL" mode="VIEW" fields="FirstName,LastName,OtherPhone" targetRecord="{!v.targetRecord}" targetFields="{!v.targetFields}" targetError="{!v.targetError}" recordUpdated="{!c.recordUpdated}" />

   <table>
      <tr>
         <th>targetError</th>
         <td>{!v.targetError}</td>
      </tr>
      <tr>
         <th>FName</th>
         <td>{!v.targetFields.FirstName}</td>
      </tr>
      <tr>
         <th>LName</th>
         <td>{!v.targetRecord.fields.LastName.value}</td>
      </tr>
      <tr>
         <th>OtherPhone</th>
         <td>{!v.targetFields.OtherPhone}</td>
      </tr>
   </table>
</aura:component>
```

**READER:** That does not look so bad, and what does the controller look like?

**EL TORO:** Actually, if you just want to read the data there is no controller. But as we have said before, one of the benefits of LDS is that your component will be notified whenever a component in the same page updates the record. In that case, if you want to handle the change, then you'll need a controller. To handle this attribute `recordUpdated="{!c.recordUpdated}"` you write this controller method:

```
({
   recordUpdated: function(component, event, helper) {
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
```

**READER:** Wow... cool! Can you then please explain the other attributes being used here?

**EL TORO:** We already saw the `layoutType` attribute when we saw the `<lightning:RecordForm />` and it works on the same way, except that here the values for the `layoutType` are uppercase `FULL` and `COMPACT`.

**READER:** Hold on, I have few questions before you move on. What exactly does the layoutType do in this particular case? You are talking about page layouts, but you said `<force:recordData />` does not have a UI component.

**EL TORO:** Great point. Actually it’s not for the UI component, but for the fields to include in the record. 

**READER:** What is a Compact layout?

**EL TORO:** A compact layout displays a record’s key fields at a glance in both the Salesforce mobile app and Lightning Experience.

**READER:** That’s cool… but why is there an attribute named `fields`?

**EL TORO:** Well, if you just need a handful of `fields` you do not need to specify the layoutType, or if you need to ensure a field is retrieved and not sure it’s in the layout, then you can use both the `fields` and the `layoutType` attributes.

**READER:** That makes sense. Please continue...

**EL TORO:** If you are planning on making changes to the record retrieved (or creating a new record) make sure the `mode` attribute is `EDIT` otherwise you will spend hours trying to understand why the record is not editable or why you are getting some weird errors... (I know this from experience).

**READER:** Thanks for the tip. Which attribute do I use to get access to the data?

**EL TORO:** That sounds like a simple question, but it's not. Actually there are two attributes that contain the data.

**READER:** Two attributes?

**EL TORO:** Yes! You can get the data via the `targetRecord` or the `targetFields`, and they contain similar data, although `targetRecord` contains a bit more details. The best way to understand the difference is to look at the values this attributes contain. 

### targetFields: <!-- omit in toc -->

```
{
   "Id": "0010v00000D4MZMAA3",
   "SystemModstamp": "2018-05-19T23:34:36.000Z",
   "CreatedDate": "2018-05-18T22:04:46.000Z",
   "LastModifiedDate": "2018-05-19T23:34:36.000Z",
   "Name": "Acme",
   "PhotoUrl": "/services/images/photo/0010v00000D4MZMAA3",
   "Rating": "Hot",
   "Parent": {
      "Id": "0010v00000D4SXHAA3",
      "Type": "Technology Partner"
   },
   "ParentId": "0010v00000D4SXHAA3"
}
```

### targetRecord: <!-- omit in toc -->

```
{
   "fields": {
      "Id": {
         "displayValue": null,
         "value": "0010v00000D4MZMAA3"
      },
      "SystemModstamp": {
         "displayValue": "19/05/2018 7:34 PM",
         "value": "2018-05-19T23:34:36.000Z"
      },
      "CreatedDate": {
         "displayValue": "18/05/2018 6:04 PM",
         "value": "2018-05-18T22:04:46.000Z"
      },
      "LastModifiedDate": {
         "displayValue": "19/05/2018 7:34 PM",
         "value": "2018-05-19T23:34:36.000Z"
      },
      "Name": {
         "displayValue": null,
         "value": "Acme"
      },
      "PhotoUrl": {
         "displayValue": null,
         "value": "/services/images/photo/0010v00000D4MZMAA3"
      },
      "Rating": {
         "displayValue": "Hot",
         "value": "Hot"
      },
      "Parent": {
         "displayValue": null,
         "value": {
            "fields": {
               "Id": {
                  "displayValue": null,
                  "value": "0010v00000D4SXHAA3"
               },
               "Type": {
                  "displayValue": "Technology Partner",
                  "value": "Technology Partner"
               }
            },
            "id": "0010v00000D4SXHAA3",
            "recordTypeInfo": null,
            "childRelationships": {},
            "apiName": "Account"
         }
      },
      "ParentId": {
         "displayValue": null,
         "value": "0010v00000D4SXHAA3"
      }
   },
   "id": "0010v00000D4MZMAA3",
   "recordTypeInfo": null,
   "childRelationships": {},
   "apiName": "Account"
}
```

**EL TORO:**  My recommendation, just use targetFields unless you really need that extra-information ;-)

## Lightning Web Components: Read Data

**READER:** Can we use a component like that in LWC?

**EL TORO:** Well, you do have a similar concept... but it's not using a component. Let me show you the markup code to read a record.

```
<template>
   <template if:true={error}>
      <table>
         <tr>
            <th>Error</th>
            <td>{error}</td>
         </tr>
      </table>
   </template>
   <template if:true={contact}>
      <table>
         <tr>
            <th>FName</th>
            <td>{contact.FirstName}</td>
         </tr>
         <tr>
            <th>LName</th>
            <td>{contact.LastName}</td>
         </tr>
         <tr>
            <th>OtherPhone</th>
            <td>{contact.OtherPhone}</td>
         </tr>
      </table>
   </template>
</template>
```

**EL TORO:** And this is the LWC controller...

```
import { LightningElement, api, wire, track } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import CONTACT_FNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import CONTACT_LNAME_FIELD from '@salesforce/schema/Contact.LastName';
import CONTACT_OTHERPHONE_FIELD from '@salesforce/schema/Contact.OtherPhone';

export default class wNoUi extends LightningElement {
   @api recordId;
   @track contact;
   @track error;

   @wire(getRecord, { recordId: '$recordId', fields: [CONTACT_FNAME_FIELD, CONTACT_LNAME_FIELD, CONTACT_OTHERPHONE_FIELD] })
   wired_getContact({ error, data }) {
      if (data) {
         this.contact = {
            FirstName: getFieldValue(data, CONTACT_FNAME_FIELD),
            LastName: getFieldValue(data, CONTACT_LNAME_FIELD),
            OtherPhone: getFieldValue(data, CONTACT_OTHERPHONE_FIELD),
         };
         this.error = undefined;
      } else if (error) {
         this.contact = undefined;
         this.error = error;
      }
   }
}
```



**READER:** 
**EL TORO:** 












## Aura Components
## Lightning Web Components





**EL TORO:** 
**READER:** 
**EL TORO:** 
**READER:** 
**EL TORO:** 
**READER:** 
**EL TORO:** 
**READER:** 
**EL TORO:** 
**READER:** 
**EL TORO:** 
**READER:** 
**EL TORO:** 
**READER:** 
**EL TORO:** 
**READER:** 
**EL TORO:** 
**READER:** 
**EL TORO:** 
**READER:** 
**EL TORO:** 

















Creating A Record
**READER:**	Did you say you could create a record with the Lightning Data Service?
**EL TORO:**	Yes, but hold your horses… 
**EL TORO:**	Actually… let’s talk about that right now.

**EL TORO:**	To create the record, you need two things: First, you create a blank template that the user can populate with data. This can be accomplish with code like this:

var recordData = component.find("RecordData");
recordData.getNewRecord(
	"Contact", // objectApiName
	null,      // recordTypeId
	false,     // skipCache
	$A.getCallback(
		function() {
			var rec = component.get("v.RecordData_SimpleRecord");
			var error = component.get("v.RecordData_Error");
			if(error || (rec === null)) {
				alert("Error initializing record template: " + error);
				return;
			}
			console.log("Record template initialized: " + rec.sobjectType);
		}
	)
);

**EL TORO:**	And second, when the user clicks on the save button, you need to perform the DML operation to create the new record in the database. Like this…

var recordData = component.find("RecordData");
recordData.saveRecord(
	function(saveResult) {
		if (saveResult.state === "SUCCESS" || saveResult.state === "DRAFT") {
			// record is saved successfully
		} else if (saveResult.state === "INCOMPLETE") {
			// handle the incomplete state
			console.log("User is offline, device doesn't support drafts.");
		} else {
			var err = 'Unknown problem. ';
			err += 'State: ' + saveResult.state + '. ';
			err += 'Error: ' + JSON.stringify(saveResult.error);
			console.log(,+ ', error: ' +);
		}
	}
);

**READER:**	That makes sense, but in the first code you had a getCallback() function. What was that for?
**EL TORO:**	If you do not use $A.getCallback(), any attempt to access private attributes of your component results in access check failures.
**READER:**	Can you explain how to delete a record?
**EL TORO:**	This is quite simple, to delete a record, you just execute this code…

({
	handleDeleteRecord: function(component, event, helper) {
		var recordData = component.find("RecordData");
		recordData.deleteRecord(
			$A.getCallback(
				function(deleteResult) {
					if (deleteResult.state === "SUCCESS" || deleteResult.state === "DRAFT") {
						console.log("Record is deleted.");
					} else if (deleteResult.state === "INCOMPLETE") {
						console.log("User is offline, device doesn't support drafts.");
					} else {
						var err = 'Unknown problem. ';
						err += 'State: ' + saveResult.state + '. ';
						err += 'Error: ' + JSON.stringify(saveResult.error);
						console.log(,+ ', error: ' +);
					}
				}
			)
		);
	},
	RecordData_Updated: function(component, event, helper) {
		var eventParams = event.getParams();
		if(eventParams.changeType === "CHANGED") {
			// record is changed
		} else if(eventParams.changeType === "LOADED") {
			// record is loaded in the cache
		} else if(eventParams.changeType === "REMOVED") {
			// record is deleted, handle this event if needed.
		} else if(eventParams.changeType === "ERROR") {
			// there’s an error while loading, saving, or deleting the record
		}
	}
})

<CONVERSATION TO CONTINUE HERE …>

====







**READER:**	Actually, I have not heard ...

**EL TORO:** Ok, we’ll talk about that too. In any case, this statement tells LDS to refresh its copy of the record…

**READER:**	Cool ...

**READER:**	If I understand correctly, the components we have seen so far display a page layout on the screen, but it take some real estate. Is there a way we can just open a pop-up to edit a record?

**EL TORO:** Great point. I actually have two answers for you… First you could use the <lightning:overlayLibrary/> component to create the pop-up and use the previous components in the body of such pop-up.




**READER:**	If I understand correctly, the components we have seen so far display a page layout on the screen, but it take some real estate. Is there a way we can just open a pop-up to edit a record?

**EL TORO:** Great point. I actually have two answers for you… First you could use the <lightning:overlayLibrary/> component to create the pop-up and use the previous components in the body of such pop-up.

**READER:**	Wow, that’s a bit of work…

**EL TORO:** Actually, there is also a simpler way to accomplish this, but you do not have a lot of control on how the pop-up looks.
