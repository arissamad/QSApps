function DonationsByDonorDialog(donor) {
    ClassUtil.mixin(DonationsByDonorDialog, this, Refreshable);
    ClassUtil.mixin(DonationsByDonorDialog, this, Dialogable);
    
    this.donor = donor;
    
    this.dialog = new FullPageDialog();
    this.recordHeader = new RecordHeaderWidget("Donations for: " + donor.getName());
	this.recordHeader.activateRightBorderSection();

	var panel = new HorizontalPanelWidget("right", false);
	new DemotedButtonWidget("Close", this, function() {
        this.closeDialogBox();
        this.refreshAction.call();
	});

	panel.finish();

	this.dialog.resetInsertPosition();
    
    new QuickAddButtonWidget("New Pledge/Donation", this, "clickedAddDonation");
    new LineBreakWidget();
    
    var donationTable = new DataTableWidget(this, "DonationsTable");
    this.donationTable = donationTable;
    
    donationTable.addHeader("Date", "creationDate", 100);
    donationTable.addColumn();
    
    donationTable.addHeader("Project", "projectName", 200);
    donationTable.addColumn();
    
    donationTable.addHeader("Amount Pledged", "amountPledged", 100, {columnAlign: "center"});
    donationTable.addColumn(function(donation) {
        return "$" + Number(donation.getAmountPledged()).toFixed(2);
    });
    
    donationTable.addHeader("Amount Received", "amountReceived", 100, {columnAlign: "center"});
    donationTable.addColumn(function(donation) {
        return "$" + Number(donation.getAmountReceived()).toFixed(2);
    });
    
    donationTable.addHeader("Notes", "notes");
    donationTable.addColumn(function(donation) {
        return donation.getNotes();
    });
    
    donationTable.setClickHandler(this, function(donation) {
        var dialog = new AddDonationForDonor("edit", donation, this.donor);
        dialog.setRefreshHandler(this.donationTable, "refreshTable");
    });
    
    donationTable.renderMetisData(Metis, "Donations", [new EqFilter("donorId", this.donor.getId())]);
}

DonationsByDonorDialog.prototype.clickedAddDonation = function() {
    var dialog = new AddDonationForDonor("add", null, this.donor);
    dialog.setRefreshHandler(this.donationTable, "refreshTable");
};