# Interview With EL TORO on Lightning Data Service (Updated for Lightning Web Components)

**READER:**	El Toro, I have heard that a Lightning Component runs on the client side, without requiring Apex… is that true?

**EL TORO:** Actually, that is 100% true. That’s what makes it run “lightning fast” ;-) *(Pun indented)*

**READER:**	Ok, so if I do not make calls to the server how do I work with Salesforce data? Do I need to write Apex controllers?

**EL TORO:** Great question, I am glad you asked. You may get access to data using Apex or usign LDS.

**READER:**	Sorry to interrupt, what is LDS?

**EL TORO:** LDS is just Lightning Data Service

**READER:**	Ok, thanks… you were saying?

**EL TORO:** Oh yes, you can get access to Apex or LDS. You will use Apex if you want to bring a list of records, but if you need to work with only one record then you can use LDS which has many benefits including:

- Data is cache. If multiple comonents in the page needs to get access to the same record, the server will only be contacted once.
- If two components on the same page use the same record and one of those components makes a change to the record, then the other component(s) will be notified.
- Data access is secured.

**READER:**	What do you mean by secure? Doesn't Salesforce manage CRUD, FLS and Record Access?

**EL TORO:** Salesforce does have relly good security, and page layouts and Visualforce respect that. But if you are using Apex then you will need to control the security yourself.

**READER:**	But if I use `with sharing` in my Apex classes, then the security gets controlled, right?

**EL TORO:** Oh... be very careful with that thinking. `with sharing` only respect record access, but Apex will always ignore restrictions on CRUD and FLS.

**READER:**	But when I have built Visualforce pages in the past, the data was secured. Including CRUD and FLS, I do not understand.

**EL TORO:** You are correct, Visualforce did protect you and LDS will protect you but you have to protect yourself when using Apex.

**READER:**	How do I protect myself?

**EL TORO:** That's a really important question, I am glad you asked... The short answer, look at this library I wrote a while back: [https://github.com/eltoroit/ETLC_ApexBridge/blob/master/ApexBride_Library/Library/main/default/classes/ETLC_SecuredDB.cls]. But remember, if you use LDS then Salesforce will protect you!

**READER:**	Why not use LDS all the time and not bother with Apex?

**EL TORO:** Have you been paying attention? LDS = 1 record, Apex = multiple records.

**READER:**	Of course, I forgot. How do I work with Salesforce Data?

**EL TORO:** Let me show you the different ways you can work with Salesforce data with and without writing Apex. Oh, but let me warn you, LDS offers quite a few different ways...

**READER:** Why is that a warning?

**EL TORO:** Well, it can be confusing when trying to choose the best way for your needs.

**READER:** OK, I have been warned :-)

**EL TORO:** Couple more things before we get started. I have created this repo with the examples for each method, so that you can see how they are implemented. I am going to override the view for the contact record with a component build on **Lightning Aura Components** and one build on **Lightning Web Components** so you can compare the similarities and differences between them when dealing with data.

**READER:** So, are we going to be comparing both Aura and Web components? Cool!

**EL TORO:** yes, very cool indeed. I will try to keep the names as similar as possible in order to make it easier to compare. So let's get started!

# **Event: Edit Record** (*_eEditRecord*)

**EL TORO:** The easiest way to work with data is by letting Salesforce handle everything. This first example opens a pop-up modal window so that your users can edit a record. In Aura components, you fire an event like this:

```
var editRecordEvent = $A.get("e.force:editRecord");
editRecordEvent.setParams({
	recordId: component.get("v.recordId")
});
editRecordEvent.fire();
```

In Lightning Web components, you navigate to the edit page like this:

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

1. Import the **NavigationMixin** library (`import { NavigationMixin } from 'lightning/navigation';`)
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

# **Event: Create Record** (*_eCreateRecord*) 

**READER:**	That looks simple. Is there a similar way to create a record?

**EL TORO:** Indeed, and that is the second method I want to discuss. It allows you to create a record in a pop-up modal window without too much work.

**READER:**	Nice, can you pre-set some fields?

**EL TORO:** Well, good question. I am glad you asked. In Aura components, yes. But in LWC is not available yet (as of March 2019). Let's take a look at the code in Aura:

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

With LWC, the code is pretty similar to above where you need to import the `NavigationMixin`, this is the code:

```
this[NavigationMixin.Navigate]({
	type: 'standard__objectPage',
	attributes: {
		objectApiName: 'Case',
		actionName: 'new'
	}
});
```

**READER:**	This is pretty simple, but what if I do not want a modal window? Do I need Apex?

**ELTORO:**	That's actually a very good question... You need Apex if you want to work with multiple records but there are several ways of using LDS (Lightning Data Service) to work with one record and have more power over the UI. Let’s take a look at some more examples…

# **Component: force:recordView** (*afRecordView*) 

> **Update:** This component was deprecated in Aura, do not use `<Force:recordView/>` instead please use`<lightning:recordViewForm/>`

**EL TORO:** This is possible the easiest way to display a record. This component displays the record using it’s page layout on the screen.

**READER:**	Do you mean like the `<apex:detail/>` did in Visualforce pages?

**EL TORO:** Exactly! This is how the markup for this component is written…

```
<force:recordView recordId="{!v.recordId}"/>
```

**READER:**	The `<apex:detail/>` tag in Visualforce was pretty useful, if you wanted to have the page layout and add additional things to the page. Is that used a lot in Lightning Components?

**EL TORO:** Great question, I am glad you asked… I actually, do not think this is that useful in Lightning components, remember, you could work much simpler, without writing code, if you use the Lightning App Builder.

**READER:**	You are right, I had forgotten about that…

**READER:**	I have used `<apex:detail/>` in many of the pages I built in the past, but ...

# **Component: force:recordEdit** (*afRecordEdit*) 

> **Update:** This component was deprecated in Aura, do not use `<Force:RecordEdit/>` instead please use `<lightning:recordEditForm/>`

**EL TORO:** One more thing, with Visualforce you were able to use `<apex:detail/>` to view a record but not to edit the records. If you wanted that, you had to write a lot of code. But Salesforce now gives us `<force:recordEdit/>` which allows the user to edit the records without too much code. This is how the markup for that looks:

```
<force:recordEdit aura:id="RE" recordId="{!v.recordId}"/>
```

**READER:**	Which fields are being edited?

**EL TORO:** Remember this component uses the page layout, but the user will only be able to view/edit the fields he has access to.

**READER:**	Cool! Will the buttons appear at the top and the bottom of the form as they did in Salesforce Classic?

**EL TORO:** Great question… You are pretty smart! Actually, you do have to add a button to save the changes done by the user. The button could look something like this:

```
<lightning:button label="Save" onclick="{!c.RE_Save}"/>
```

**READER:**	What does the code for the RecordEdit_Save controller function look like?

**EL TORO:**	Simple, you write something like this:

```
RE_Save: function(component, event, helper) {
	component.find("RE").get("e.recordSave").fire();
}
```

**READER:**	Can you detect when the record gets successfully saved, so you can display a message to the user?

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

**READER:**	Thanks, but can I ask you about the event `e.force:refreshView`?

**EL TORO:** LDS uses a mechanism to keep the records synchronized among the different components that use that record, this statement tells LDS to refresh its copy of the record…

**READER:**	Cool ...

**EL TORO:** And remember... we do not need to write a single line of Apex!

**READER:**	But we are stuck with page layouts defined by the administrator...

**EL TORO:** Which is not necessarily a bad thing, right?

**READER:**	Indeed, but can we build our own UI? What if I just need a couple of fields? Do we need Apex then?

**EL TORO:** Not quite. Remember that you need Apex only if you want to work with multiple records. But controlling the UI with a single record is quite simple. Let me show you few more options.

# **Components: lightning:recordViewForm and lightning:outputField** (_)

**EL TORO:**	There is a simple component named <lightning:recordViewForm/> which allows you to build the screen that you want. This is how the markup looks…

<lightning:recordViewForm recordId="{!v.recordId}" objectApiName="Account">
	<lightning:outputField fieldName="Name"/>
	<lightning:outputField fieldName="Rating"/>
	<lightning:outputField fieldName="ParentId"/>
</lightning:recordViewForm>

**READER:**	What would the controller look like?
**EL TORO:**	To display fields like this, there is no need for controller code.
**READER:**	I also see there are some inputFields, what to the render on the screen?
**EL TORO:**	Well, it depends on the actual field. For example if the field is of type URL, then you will see a link. If the field is of type date/time you will see the value as formatted for this particular user (time zone and locale).
**READER:**	That is COOL!
**EL TORO:**	Very!
**READER:**	Can you do something similar if you wanted to edit the record?











# <<<< --- HERE
# <<<< --- HERE
# <<<< --- HERE
# <<<< --- HERE
# <<<< --- HERE
# <<<< --- HERE
# <<<< --- HERE
# <<<< --- HERE
# <<<< --- HERE
# <<<< --- HERE
# <<<< --- HERE
# <<<< --- HERE
# <<<< --- HERE
# <<<< --- HERE
# <<<< --- HERE
# <<<< --- HERE
# <<<< --- HERE
# <<<< --- HERE











# Components: <lightning:recordEditForm/> and <lightning:inputField/>
**EL TORO:**	Yes, of course. Let’s take a look at the code…

<lightning:recordEditForm aura:id="REF" recordId="{!v.recordId}" objectApiName="Account" onload="{!c.REF_OnLoad}" onsubmit="{!c.REF_OnSubmit}" onsuccess="{!c.REF_OnSuccess}" onerror="{!c.REF_OnError}">
	<lightning:messages/>
	<lightning:inputField fieldName="Name "/>
	<lightning:inputField fieldName="Rating"/>
	<lightning:inputField fieldName="ParentId"/>
	<lightning:button variant="brand" type="submit" label="Update"/>
</lightning:recordEditForm>

**READER:**	That looks a bit more complex.
**EL TORO:**	Well, saving a record is a bit more complex than querying for it. Plus you can hook up your code with this component in several parts. Let’s take a look at the details…
**EL TORO:**	As you can see, we are using <lightning:inputField/> to edit the values of the fields.
**READER:**	And I would assume the widget used to edit the value depends on the type of the field, correct?
**EL TORO:**	Absolutely, and it does use SLDS styles too.
**READER:**	I see there is a <lightning:button/>, but it does not have an onclick event? How does it work?
**EL TORO:**	You are a very good observer, actually if you nest a <lightning:button/> with a type=”Submit” attribute then when the user clicks on that button the form is submitted and the data saved in the record.
**READER:**	Can we also talk about the attributes in the <lightning:recordEditForm/>? I see the recordId and objectApiName are used here, but what do the other attributes do?
**EL TORO:**	Good, let’s take a look at each one at a time…

•	recordId: This attribute specifies the record you want to edit. If you do not specify this field, you can create a new record.
•	objectApiName: This attribute specifies the type of sObject you want to work with. This gives relevance to the field names on the <lightning:inputField/>.
•	onload: The JavaScript controller function invoked when the form data is loaded.
•	onsubmit: The JavaScript controller function invoked when the form is submitted.
•	onsuccess: The JavaScript controller function invoked when the form data is saved.
•	onerror: The JavaScript controller function invoked when there when there is an error on form submission.

**EL TORO:**	There is one more component that we have not talked about. Do not forget to include the <lightning:messages/> so that any errors or messages are displayed if saving the record fails.
**READER:**	Thanks for the tip.
**EL TORO:**	No problem.
**READER:**	This is a really cool component that gives you a lot of power for building forms, breaking out of the page layouts. But what if I want something that is not just viewing or editing a field? For example, I want to work with the record data in JavaScript but I will build my own UI. How can I do that?
**EL TORO:**	Well, that’s when LDS comes into the picture.
**READER:**	Lightning Data Service?
**EL TORO:**	Exactly… 
Lightning Data Service
**EL TORO:**	LDS is based on one single component: <force:recordData/>. This simple but powerful component allows you to read, create, edit and delete a single record. Because the component does not provide any UI, you can use the data in any way you want in the markup or JavaScript.
**READER:**	That sounds very powerful.
**EL TORO:**	Yes, and the code is not that complex. Let me show you an example…

<force:recordData aura:id="RD" recordId="{!v.recordId}"}" mode="EDIT" layoutType="COMPACT" fields="ParentId"  targetRecord="{!v.RD_FullRecord}" targetFields="{!v.RD_SimpleRecord}" targetError="{!v.RD_Error}" recordUpdated="{!c.RD_Updated}"/>

<lightning:input label="Name" value="{!v.RD_SimpleRecord.Name}"/>
<lightning:input label="Rating" value="{!v.RD_SimpleRecord.Rating}"/>
<lightning:input label="ParentId" value="{!v.RD_SimpleRecord.ParentId}"/>

<lightning:button label="Save" onclick="{!c.RD_Save}" variant="brand"/>

**READER:**	It may be a simple field, but it has a lot of attributes!
**EL TORO:**	Good point, let’s start by explaining them

•	recordId: The id of the record to fetch, or leave blank if you want to create a new record.
•	mode: VIEW (default) or EDIT. If you want to edit the record or create a new one, make sure this is set to EDIT, otherwise the record is read-only.
•	layoutType: FULL or COMPACT. The fields that are retrieved are based on the page layout (full or compact) and/or specified in the fields attribute.
•	fields: Provide a list of fields that you want to retrieve in addition to the ones on the page layout. If the fields are in the page layout and listed here, they are only fetched once.
•	targetRecord: This holds the data for the record. See below for details.
•	targetFields: This holds the data for the record. See below for details.
•	targetError: This attribute will contain the errors, if any
•	recordUpdated: JavaScript controller function that gets fired when the record gets updated, either by this <force:recordData/> or any other in the page.

**READER:**	Hold on, I have few questions before you move on. What exactly does the layoutType do? You are talking about page layouts, but you said LDS does not have a UI component.
**EL TORO:**	Great point. Actually it’s not for the UI component, but for the fields to include in the record. 
**READER:**	What is a Compact layout?
**EL TORO:**	A compact layout displays a record’s key fields at a glance in both the Salesforce mobile app and Lightning Experience.
**READER:**	That’s cool… but why is there an attribute named fields?
**EL TORO:**	Well, if you just need a handful of fields you do not need to specify the layoutType, or if you need to ensure a field is retrieved and not sure it’s in the layout, then you can use both the fields and the layoutType attributes.
**READER:**	Which attribute do I use to get access to the data?
**EL TORO:**	That simple like a simple question , but actually there are two attributes that contain the data.
**READER:**	Two attributes?
**EL TORO:**	Yes! You can get the data via the targetRecord or the targetFields, and they contain similar data, although targetRecord contains a bit more details. The best way to understand the difference is to look at the values this attributes contain. 
targetFields:
{
	"Id":"0010v00000D4MZMAA3",
	"SystemModstamp":"2018-05-19T23:34:36.000Z",
	"CreatedDate":"2018-05-18T22:04:46.000Z",
	"LastModifiedDate":"2018-05-19T23:34:36.000Z",
	"Name":"Acme",
	"PhotoUrl":"/services/images/photo/0010v00000D4MZMAA3",
	"Rating":"Hot",
	"Parent":{
		"Id":"0010v00000D4SXHAA3",
		"Type":"Technology Partner"
	},
	"ParentId":"0010v00000D4SXHAA3"
}
targetRecord:
{
	"fields":{
		"Id":{
			"displayValue":null,
			"value":"0010v00000D4MZMAA3"
		},
		"SystemModstamp":{
			"displayValue":"19/05/2018 7:34 PM",
			"value":"2018-05-19T23:34:36.000Z"
		},
		"CreatedDate":{
			"displayValue":"18/05/2018 6:04 PM",
			"value":"2018-05-18T22:04:46.000Z"
		},
		"LastModifiedDate":{
			"displayValue":"19/05/2018 7:34 PM",
			"value":"2018-05-19T23:34:36.000Z"
		},
		"Name":{
			"displayValue":null,
			"value":"Acme"
		},
		"PhotoUrl":{
			"displayValue":null,
			"value":"/services/images/photo/0010v00000D4MZMAA3"
		},
		"Rating":{
			"displayValue":"Hot",
			"value":"Hot"
		},
		"Parent":{
			"displayValue":null,
			"value":{
				"fields":{
					"Id":{
						"displayValue":null,
						"value":"0010v00000D4SXHAA3"
					},
					"Type":{
						"displayValue":"Technology Partner",
						"value":"Technology Partner"
					}
				},
				"id":"0010v00000D4SXHAA3",
				"recordTypeInfo":null,
				"childRelationships":{},
				"apiName":"Account"
			}
		},
		"ParentId":{
			"displayValue":null,
			"value":"0010v00000D4SXHAA3"
		}
	},
	"id":"0010v00000D4MZMAA3",
	"recordTypeInfo":null,
	"childRelationships":{},
	"apiName":"Account"
}

**EL TORO:** 	My recommendation, just use targetFields unless you really need that extra-information ;-)
**READER:**	What about the recordUpdated attribute?
**EL TORO:**	Oh yes, I forgot about that, thanks for asking. The JavaScript function that gets called when the record is updated (by you, or by any other <force:recordData/> component in the page) can look like this:

RecordData_Updated: function (component, event, helper) {
	var eventParams = event.getParams();
	if (eventParams.changeType === "LOADED") {
		console.log("Record is loaded successfully.");
	} else if (eventParams.changeType === "CHANGED") {
		console.log("record is changed.");
		var changedFields = eventParams.changedFields;
		console.log('Fields that are changed: ' + JSON.stringify(changedFields));
	} else if (eventParams.changeType === "REMOVED") {
		console.log("record is deleted.");
	} else if (eventParams.changeType === "ERROR") {
		console.log("Errors while loading, saving, or deleting the record.");
	}
}
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
