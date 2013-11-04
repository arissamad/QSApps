function ViewDonor(donorId) {
    ClassUtil.mixin(AddDonor, this, Refreshable);
    ClassUtil.mixin(AddDonor, this, Dialogable);

    this.dialog = new FullPageDialog();

    var ml = new MetisLoader("Donors", donorId);
    Metis.load(ml, this, function() {
        this.loadedDonor(ml.get());
    });
}

ViewDonor.prototype.loadedDonor = function(donor) {
    this.donor = donor;

	this.recordHeader = new RecordHeaderWidget("Donor Info: " + donor.getName());
	this.recordHeader.activateRightBorderSection();

	var panel = new HorizontalPanelWidget("right", false);
	new DemotedButtonWidget("Close", this.dialog, "close");

	panel.finish();

	this.dialog.resetInsertPosition();
    
    var cols = new ColumnPanelWidget();
    cols.setActiveColumn(0, 300);
    
    var panel = new QueryPanelWidget(140, 500);
    this.queryFields = new QueryFields(panel, donor);
    
    this.queryFields.setReadOnly(true);
    
    panel.addLabel("Donor name");
    this.queryFields.put("name", new InputFieldWidget());
    
    panel.addLabel("Salutation");
    this.queryFields.put("salutation", new InputFieldWidget());
    
    panel.addLabel("Email");
    this.queryFields.put("email", new InputFieldWidget());
    
    this.renderPhone(this.donor.getPhone1(), panel);
    this.renderPhone(this.donor.getPhone2(), panel);
    this.renderPhone(this.donor.getPhone3(), panel);
    
    panel.finish();
    new LineBreakWidget(2);
    
    var addCols = new ColumnPanelWidget();
    addCols.setActiveColumn(0);
    new AddressComponentView(this.donor.getAddress1());
    addCols.setActiveColumn(1);
    new AddressComponentView(this.donor.getAddress2());
    addCols.finish();
    
    new LineBreakWidget();
    new HeaderWidget("Donations");
    this.donationTable = new DataTableWidget(this, "donationTableForDonorView");
    
    this.donationTable.addHeader("Date", "creationDate");
    this.donationTable.addColumn();
    
    this.donationTable.addHeader("Project", "projectName");
    this.donationTable.addColumn();
    
    this.donationTable.addHeader("Pledged/Rcvd", "amountPledged");
    this.donationTable.addColumn(function(donation) {
        new TextWidget("$ " + donation.getAmountPledged() + " / $" + donation.getAmountReceived());
    });
    
    this.donationTable.renderMetisData(Metis, "Donations", [new EqFilter("donorId", this.donor.getId())]);
    
    cols.setActiveColumn(1, 300);
    new HeaderWidget("Notes and Reminders");
    
    var panel = new HorizontalPanelWidget();
    new ButtonWidget("Add Note", this, function() {
        var dialog = new AddDonorNote("add", "note", this.donor);
        dialog.setRefreshHandler(this.actionTable, "refreshTable");
    });
    new ButtonWidget("Add Reminder", this, function() {
        var dialog = new AddDonorNote("add", "reminder", this.donor);
        dialog.setRefreshHandler(this.actionTable, "refreshTable");
    });
    new ButtonWidget("Send Email (coming soon)");
    panel.finish();
    
    
    this.actionTable = new DataTableWidget(this, "actionTable");
    
    this.actionTable.addHeader("Date", "creationDate", 100);
    this.actionTable.addColumn();
    
    this.actionTable.addHeader("Notes & Reminders", "notes");
    this.actionTable.addColumn(function(donorNote) {
        if(donorNote.getIsReminder() == true) {
            
            var cb = new ReverseCheckBoxWidget(donorNote.getIsDone(), "Due " + DateUtil.getShortFormattedDate(donorNote.getReminderDate().toJsDate()));
            new LineBreakWidget(0);
            cb.onChange(this, function() {
                donorNote.setIsDone(cb.getValue());
                Metis.save(donorNote);
            });
        }
        return donorNote.getNotes();
    });
    
    this.actionTable.setClickHandler(this, function(donorNote) {
        var type = "note";
        if(donorNote.getIsReminder() == true) type = "reminder";
        
        var dialog = new AddDonorNote("edit", type, this.donor, donorNote);
        dialog.setRefreshHandler(this.actionTable, "refreshTable");
    });
    
    this.actionTable.renderMetisData(Metis, "DonorNotes", [new EqFilter("donorId", this.donor.getId())]);
    
    cols.finish();
}

ViewDonor.prototype.renderPhone = function(phone, panel) {
    if(phone == null) return;
    
    var number = phone.getNumber();
    
    if(number != null && number != "") {
        panel.addLabel(phone.getType());
        this.queryFields.put(phone.getType(), new InputFieldWidget(number));
    }
}