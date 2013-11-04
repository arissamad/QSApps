function DonationsByProjectDialog(project) {
    ClassUtil.mixin(DonationsByProjectDialog, this, Refreshable);
    ClassUtil.mixin(DonationsByProjectDialog, this, Dialogable);
    
    this.project = project;
    
    this.dialog = new FullPageDialog();
	this.recordHeader = new RecordHeaderWidget("Donations for: " + project.getName());
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
    
    donationTable.addHeader("Donor", "donorName", 200);
    donationTable.addColumn(function(donation) {
        new LinkWidget(donation.getDonorName(), this, function() {
            new ViewDonor(donation.getDonorId());
        });
    });
    
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
        var dialog = new AddDonationForProject("edit", donation, this.project);
        dialog.setRefreshHandler(this.donationTable, "refreshTable");
    });
    
    donationTable.renderMetisData(Metis, "Donations", [new EqFilter("projectId", this.project.getId())]);
}

DonationsByProjectDialog.prototype.clickedAddDonation = function() {
    var dialog = new AddDonationForProject("add", null, this.project);
    dialog.setRefreshHandler(this.donationTable, "refreshTable");
};