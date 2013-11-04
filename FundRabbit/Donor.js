function Donor() {
    ClassUtil.mixin(Donor, this, DonationCalculatorMixin);
    
    this.id;
    this.creationDate = new Date();
    
    this.name;
    this.salutation;
    this.email;
    
    // Each is of type "Address"
    this.address1;
    this.address2;
    
    // Each is of type "Phone"
    this.phone1;
    this.phone2;
    this.phone3;
    
    this.notes;
    
    this.amountPledged = 0;
    this.amountReceived = 0;
    
    // Of type DonationSummary
    this.donations = [];
    
    this.deleted = false;
}
Metis.define(Donor, "Donors", "id", "creationDate", "name", "salutation", "email", "address1", "address2", "phone1", "phone2", "phone3", "notes", "amountPledged", "amountReceived", "donations", "deleted");
Metis.defineSortColumn(Donor, "name", "asc");
Metis.createGettersAndSetters(Donor);