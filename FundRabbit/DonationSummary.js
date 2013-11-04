function DonationSummary() {
	this.donationId;
    this.amountPledged;
    this.amountReceived;
}
Metis.defineSubItem(DonationSummary, "DS", "donationId", "amountPledged", "amountReceived");
Metis.createGettersAndSetters(DonationSummary);