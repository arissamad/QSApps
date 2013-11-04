// donor can be null when editing
function AddDonorNote(addOrEdit, type, donor, donorNote) {
	ClassUtil.mixin(AddDonorNote, this, Refreshable);
    ClassUtil.mixin(AddDonorNote, this, Dialogable);
    
    this.addOrEdit = addOrEdit;
    this.type = type;
    this.donor = donor;
    this.donorNote = donorNote;
    
    if(this.addOrEdit == "add") {
        if(this.type == "note") this.dialog = new Dialog("Add Note");
        else this.dialog = new Dialog("Add Reminder");
        
        this.dialog.setOkCancel(this, "clickedSave", "Add");
    } else {
        if(this.type == "note") this.dialog = new Dialog("Edit Note");
        else this.dialog = new Dialog("Edit Reminder");
        
        this.dialog.setOkCancel(this, "clickedSave", "Update");
    }
    
    if(this.addOrEdit == "add") {
        this.donorNote = new DonorNote();
        this.donorNote.setDonorId(this.donor.getId())
        
        if(this.type == "reminder") this.donorNote.setIsReminder(true);
    }
    
    var panel = new QueryPanelWidget(150);
    this.qf = new QueryFields(panel, this.donorNote);
    
    if(this.type == "reminder") {
        panel.addLabel("Due Date");
        this.qf.put("reminderDate", new DateWidget());
    }
    
    panel.addLabel("Notes");
    this.qf.put("notes", new TextAreaWidget().setGrowable(100, 2), ["notEmpty"]);
    
    panel.finish();
    
    new DeleteOption("Delete", "Click below to delete this " + this.type + ".", true, this, function() {
		Metis.remove(this.donorNote, this, function() {
            
            this.donorNote.deleted = true; // Some UIs need to know, such as RemindersPage
            
    	    this.closeDialogBox();
            this.refreshAction.call();
		});
	});
    
    this.dialog.reposition();
}

AddDonorNote.prototype.clickedSave = function() {
    if(!this.qf.verify()) return false;
    
    if(this.type == "reminder") {
        this.donorNote.setReminderDate(new PlainDate(this.qf.getValue("reminderDate")));
    }
    
    if(this.donor != null) {
        this.donorNote.setDonorName(this.donor.getName());
    }
    
    this.donorNote.setNotes(this.qf.getValue("notes"));
    
    Metis.save(this.donorNote, this, function() {
        this.closeDialogBox();
        this.refreshAction.call();
    });
};