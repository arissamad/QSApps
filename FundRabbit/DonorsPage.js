function DonorsPage() {
    new PageHeaderWidget("Donors");
    
    new QuickAddButtonWidget("Add Donor", this, "clickedAddDonor");
    
    new LineBreakWidget();
    
    var donorTable = new DataTableWidget(this, "donorTable");
    
    donorTable.addHeader("Donor Name", "name");
    donorTable.addColumn();
    
    donorTable.addHeader("Total Pledged", "amountPledged", 150, {columnAlign: "center"});
    donorTable.addColumn(function(donor) {
        new TextWidget("$" + Number(donor.getAmountPledged()).toFixed(2));
    });
    
    donorTable.addHeader("Total Received", "amountReceived", 150, {columnAlign: "center"})
    donorTable.addColumn(function(donor) {
        new TextWidget("$" + Number(donor.getAmountReceived()).toFixed(2));
    });
    
    donorTable.addHeader("Actions", 350);
    donorTable.addColumn(function(donor) {
        var panel = new HorizontalPanelWidget(false);
        
        new ButtonWidget("Edit Donor", this, "clickedEditDonor", donor);
        new ButtonWidget("View Donor", this, "clickedViewDonor", donor);
        new ButtonWidget("Track Donations", this, function() {
            var dialog = new DonationsByDonorDialog(donor);
            dialog.setRefreshHandler(this.donorTable, "refreshTable");
        });
        
        panel.finish();
    });
    
    donorTable.renderMetisData(Metis, "Donors", [new EqFilter("deleted", false)]); 
    
    donorTable.setClickHandler(this, "clickedViewDonor");
    
    this.donorTable = donorTable;
}

DonorsPage.prototype.clickedAddDonor = function() {
    var dialog = new AddDonor("add");
    dialog.setRefreshHandler(this.donorTable, "refreshTable");
};

DonorsPage.prototype.clickedEditDonor = function(donor) {
    var dialog = new AddDonor("edit", donor);
    dialog.setRefreshHandler(this.donorTable, "refreshTable");
};

DonorsPage.prototype.clickedViewDonor = function(donor) {
    new ViewDonor(donor.getId());
};