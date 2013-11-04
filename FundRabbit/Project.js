function Project() {
    ClassUtil.mixin(Project, this, DonationCalculatorMixin);
    
	this.id;
    this.creationDate = new Date();
    this.name;
    this.blurb;
    
    this.goal;
    this.targetDate;
    this.amountPledged;
    this.amountReceived;
    
    // Of type DonationSummary
    this.donations = [];
    
    this.videoUrl;
    this.description;
    
    this.deleted = false;
}
Metis.define(Project, "Projects", "id", "creationDate", "name", "blurb", "goal", "targetDate", "amountPledged", "amountReceived", "donations", "videoUrl", "description", "deleted");
Metis.defineSortColumn(Project, "creationDate", "desc");
Metis.createGettersAndSetters(Project);