function Donation() {
	this.id;
    this.creationDate = new Date();
    
    this.donorId;
    this.donorName;
    
    this.projectId;
    this.projectName;
    
    this.amountPledged;
    this.amountReceived;
    this.isPaid = false;
    
    this.notes;
}
Metis.define(Donation, "Donations", "id", "creationDate", "donorId", "donorName", "projectId", "projectName", "amountPledged", "amountReceived", "isPaid", "notes");
Metis.defineSortColumn(Donation, "creationDate", "desc");
Metis.createGettersAndSetters(Donation);