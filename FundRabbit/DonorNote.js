function DonorNote() {
    this.id;
    this.creationDate = new Date();
    this.donorId;
    this.donorName;
    
    // User who added this history remark
    this.userId;
    this.name;
    
    this.notes;
    
    this.isReminder = false;
    this.isDone = false;
    this.reminderDate; // plaindate
}
Metis.define(DonorNote, "DonorNotes", "id", "creationDate", "donorId", "donorName", "userId", "name", "notes", "isReminder", "isDone", "reminderDate");
Metis.defineSortColumn(DonorNote, "creationDate", "desc");
Metis.createGettersAndSetters(DonorNote);