function ReminderComponent(donorNote) {
	ClassUtil.inherit(ReminderComponent, this, Widget);
	this._super("ReminderComponent");
    this.donorNote = donorNote;
    
    this.render();
    
    // This attaches the HTML to the current insert location
	this.attach();
}

ReminderComponent.prototype.render = function() {
    current = this.widget.find(".date-column");
    current.empty();
    var cb = new ReverseCheckBoxWidget(this.donorNote.getIsDone(), DateUtil.getShortFormattedDate(this.donorNote.getReminderDate().toJsDate()));
    cb.onChange(this, function() {
        this.donorNote.setIsDone(cb.getValue());
        Metis.save(this.donorNote);
    });
    
    current = this.widget.find(".edit-link");
    current.empty();
    var editLink = new LinkWidget("Edit", this, function() {
        var dialog = new AddDonorNote("edit", "reminder", null, this.donorNote);
        dialog.setRefreshHandler(this, "updateReminder");
    });
    
    current = this.widget.find(".donor-name");
    current.empty();
    new TextWidget("Donor: " + this.donorNote.getDonorName());
    
    current = this.widget.find(".note-area");
    current.empty();
    new TextWidget(this.donorNote.getNotes());

    ClickHandler.wrap(this.widget.find(".donor-name"), this, function() {
        new ViewDonor(this.donorNote.getDonorId());
    });
}

ReminderComponent.prototype.updateReminder = function() {
    if(this.donorNote.deleted == true) {
        this.widget.remove();
    } else {
        this.render();
    }
};