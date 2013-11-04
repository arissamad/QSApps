/**
 * Superclass for two forms of adding donations: From the project perspective and from the donor perspective.
 */
function AddDonation() {
}

AddDonation.prototype.render = function() {

    if(this.addOrEdit == "add") {
	    this.dialog = new Dialog("New Pledge/Donation");
        this.dialog.setOkCancel(this, "clickedSave", "Add");
        
        this.donation = new Donation();
    } else {
        this.dialog = new Dialog("Edit Pledge/Donation");
        this.dialog.setOkCancel(this, "clickedSave", "Update");
    }
    
    var panel = new QueryPanelWidget(150);
    this.qf = new QueryFields(panel, this.donation);
    this.qf.setFocusFirstItem(false);
    
    this.renderEasySelector(panel);
    
    panel.addLabel("Amount pledged");
    this.qf.put("amountPledged", new InputFieldWidget(), ["numberOnly"]);
    
    panel.addLabel("Amount received");
    this.qf.put("amountReceived", new InputFieldWidget(), ["numberOnly"]);
    
    panel.addLabel("Notes");
    this.qf.put("notes", new TextAreaWidget().setGrowable(100, 2));
    
    panel.finish();
    
    this.dialog.reposition();
}

AddDonation.prototype.clickedSave = function() {
    if(!this.qf.verify()) return false;
    
    this.readEasySelector();
    
    this.donation.setDonorId(this.donor.getId());
    this.donation.setDonorName(this.donor.getName());
    
    this.donation.setProjectId(this.project.getId());
    this.donation.setProjectName(this.project.getName());
    
    this.donation.setAmountPledged(this.qf.getValue("amountPledged"));
    this.donation.setAmountReceived(this.qf.getValue("amountReceived"));
    this.donation.setNotes(this.qf.getValue("notes"));
    
    Metis.save(this.donation, this, function() {
        
        // Okay now update project/donor totals
        var projectLoader = new MetisLoader("Projects", this.project.getId());
        var donorLoader = new MetisLoader("Donors", this.donor.getId());
        
        Metis.load([projectLoader, donorLoader], this, function() {
            var project = projectLoader.get();
            var donor = donorLoader.get();
            
            project.updateDonation(this.donation);
            donor.updateDonation(this.donation);
            
            Metis.save([project, donor], this, function() {            
                this.closeDialogBox();
                this.refreshAction.call();
            });

        });
    });
};

