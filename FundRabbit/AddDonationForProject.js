function AddDonationForProject(addOrEdit, donation, project) {
    ClassUtil.mixin(AddDonationForProject, this, AddDonation);
    ClassUtil.mixin(AddDonationForProject, this, Refreshable);
    ClassUtil.mixin(AddDonationForProject, this, Dialogable);
    
    this.addOrEdit = addOrEdit;
    this.donation = donation;
    this.project = project;
    
    if(globalVariables.donorList != null) {
        this.render();
    } else {
        var ml = new MetisLoader("Donors");
        Metis.load(ml, this, function() {
            globalVariables.donorList = ml.getList();
            this.render();
        });
    }
}

AddDonationForProject.prototype.renderEasySelector = function(panel) {
    panel.addLabel("Donor");
    this.donorWidget = new EasySelectorWidget(1, globalVariables.donorList, "id", "name");
    
    if(this.donation.getDonorId() != null) {
        this.donorWidget.setValue(this.donation.getDonorId());
    }
    
    this.qf.put("donorId", this.donorWidget, ["notEmpty"]);
}

AddDonationForProject.prototype.readEasySelector = function() {
       
    // Passed verification so at least one item
    this.donor = this.donorWidget.getItems()[0];
}