// Mixin for Project and Donor
function DonationCalculatorMixin() {
}

DonationCalculatorMixin.prototype.updateDonation = function(donation) {
    if(this.donations == null) this.donations = [];
    
    var amountPledged = 0;
    var amountReceived = 0;
    var found = false;
    
    for(var i=0; i<this.donations.length; i++) {
        var currSummary = this.donations[i];
        if(currSummary.getDonationId() == donation.getId()) {
            found = true;
            currSummary.setAmountPledged(donation.getAmountPledged());
            currSummary.setAmountReceived(donation.getAmountReceived());
        }
        
        amountPledged += Number(currSummary.getAmountPledged());
        amountReceived += Number(currSummary.getAmountReceived());
    }
    
    if(!found) {
        var ds = new DonationSummary();
        ds.setDonationId(donation.getId());
        ds.setAmountPledged(donation.getAmountPledged());
        ds.setAmountReceived(donation.getAmountReceived());
        this.donations.push(ds);
        
        amountPledged += Number(ds.getAmountPledged());
        amountReceived += Number(ds.getAmountReceived());
    }
    
    this.amountPledged = amountPledged;
    this.amountReceived = amountReceived;
};