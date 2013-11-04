function AddDonor(addOrEdit, donor) {
    ClassUtil.mixin(AddDonor, this, Refreshable);
    ClassUtil.mixin(AddDonor, this, Dialogable);
    
    this.addOrEdit = addOrEdit;
    this.donor = donor;
    
    if(this.addOrEdit == "add") {
        this.donor = new Donor();
    }

    this.headerPrefix = "Add Donor";
    if(this.addOrEdit == "edit") {
        this.headerPrefix = "Edit Donor";
    }

	this.dialog = new FullPageDialog();
	this.recordHeader = new RecordHeaderWidget(this.headerPrefix);
	this.recordHeader.activateRightBorderSection();

	var panel = new HorizontalPanelWidget("right", false);
	new EmphasizedButtonWidget("Save", this, "clickedSave");
	new DemotedButtonWidget("Close", this.dialog, "close");

	panel.finish();

	this.dialog.resetInsertPosition();
    
    var panel = new QueryPanelWidget(140, 500);
    this.queryFields = new QueryFields(panel, donor);
    
    panel.addLabel("Donor name");
    this.queryFields.put("name", new InputFieldWidget(), ["notEmpty"]);
    
    panel.addLabel("Salutation");
    this.queryFields.put("salutation", new InputFieldWidget());
    
    panel.addLabel("Email");
    this.queryFields.put("email", new InputFieldWidget(), ["validEmailAddress"]);
    
    panel.finish();
    new LineBreakWidget(2);
    
    this.nameWidget = this.queryFields.getWidget("name");
    this.nameWidget.onKeyUp(this, "updateName");
    
    if(this.addOrEdit == "edit") this.updateName();
    
    panel.finish();
    
    var cols = new ColumnPanelWidget();
    cols.setActiveColumn(0, 400);
    
    var panel = new QueryPanelWidget(100);
    
    panel.addFullRow();
    new HeaderWidget("Primary Address");
    new LineBreakWidget();
    this.address1 = new AddressComponent(this.donor.getAddress1(), panel, "Home Address");
    
    panel.addFullRow();
    new LineBreakWidget(2);
    new HeaderWidget("Secondary Address");
    new LineBreakWidget();
    this.address2 = new AddressComponent(this.donor.getAddress2(), panel, "Work Address");
    panel.finish();
    
    cols.setActiveColumn(1);
    
    var panel = new QueryPanelWidget(100);
    
    panel.addFullRow();
    new HeaderWidget("Phone numbers");
    new LineBreakWidget();
    
    this.phone1 = new PhoneComponent(this.donor.getPhone1(), panel, "Home");
    this.phone2 = new PhoneComponent(this.donor.getPhone2(), panel, "Cell");
    this.phone3 = new PhoneComponent(this.donor.getPhone3(), panel, "Work");
    
    cols.finish();
    
    if(this.addOrEdit == "edit") {
        new LineBreakWidget(2);
        new HeaderWidget("Delete Donor");
        new TextWidget("Deletions are permanent so we will ask for a confirmation before deleting a donor.\n")
        
        new LinkWidget("Delete Donor", this, function() {
            new MessageDialog("Confirm delete", $T("Click below to delete this donor: " + this.donor.getName()), "Delete", true, this, "clickedDelete");
    	});
    }
}

AddDonor.prototype.updateName = function() {
    var text = this.nameWidget.getValue();
    if(text != "") text = ": " + text;
    this.recordHeader.setHeader(this.headerPrefix + text);
};

AddDonor.prototype.clickedSave = function() {
    if(!this.queryFields.verify()) return false;
    
    var qf = this.queryFields;
    
    this.donor.setName(qf.getValue("name"));
    this.donor.setSalutation(qf.getValue("salutation"));
    this.donor.setEmail(qf.getValue("email"));
    
    this.donor.setAddress1(this.address1.getAddress());
    this.donor.setAddress2(this.address2.getAddress());
    
    this.donor.setPhone1(this.phone1.getPhone());
    this.donor.setPhone2(this.phone2.getPhone());
    this.donor.setPhone3(this.phone3.getPhone());
    
    globalVariables.donorList = null;
    
    Metis.save(this.donor, this, function() {
        this.closeDialogBox();
        this.refreshAction.call();
    });
};

AddDonor.prototype.clickedDelete = function() {
    this.donor.setDeleted(true);
    Metis.save(this.donor, this, function() {
        this.closeDialogBox();
        this.refreshAction.call();
    });
}