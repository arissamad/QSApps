function RemindersPage() {
    new PageHeaderWidget("Reminders");
    
    var ml = new MetisLoader("DonorNotes");
    ml.setFilters([new EqFilter("isReminder", true), new EqFilter("isDone", false)]);
    Metis.load(ml, this, function() {
        this.pendingDonorNotes = ml.getList();
        this.renderReminders();
    });
}

RemindersPage.prototype.renderReminders = function() {
    
    if(this.pendingDonorNotes.length == 0) {
        new HeaderWidget("You have no outstanding reminders.");
        
        new TextWidget("You can set reminders on donors. For example, you can set a reminder to call a donor two weeks for now.\n\n");
        
        new TextWidget("You will need to come to this page to see your outstanding reminders. Email reminders are not sent.");
        return;
    }
    
    this.lateSection = new MarkerWidget();
    this.todaySection = new MarkerWidget();
    this.futureSection = new MarkerWidget();
    
    this.lateSection.activate();
    new HeaderWidget("Late Items");
    this.lateSection.hide();
    
    this.todaySection.activate();
    new HeaderWidget("Today");
    this.todaySection.hide();
    
    this.futureSection.activate();
    new HeaderWidget("Future");
    this.futureSection.hide();
    
    var todayStr = new PlainDate(new Date()).toString();
    
    var currSection;

    for(var i=0; i<this.pendingDonorNotes.length; i++) {
        var donorNote = this.pendingDonorNotes[i];
        
        var reminderDateStr = donorNote.getReminderDate().toString();
        
        
        if(reminderDateStr < todayStr) currSection = this.lateSection;
        else if(reminderDateStr == todayStr) currSection = this.todaySection;
        else currSection = this.futureSection;
        
        currSection.show();
        currSection.setActive();
        
        new ReminderComponent(donorNote);
    }
    
    // Add a line break to the end of each section
    this.lateSection.setActive();
    new LineBreakWidget();
    
    this.todaySection.setActive();
    new LineBreakWidget();
};
