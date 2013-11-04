function AddDonationForDonor(addOrEdit, donation, donor) {
    ClassUtil.mixin(AddDonationForDonor, this, AddDonation);
    ClassUtil.mixin(AddDonationForDonor, this, Refreshable);
    ClassUtil.mixin(AddDonationForDonor, this, Dialogable);
    
    this.addOrEdit = addOrEdit;
    this.donation = donation;
    this.donor = donor;
    
    if(globalVariables.projectList != null) {
        this.render();
    } else {
        var ml = new MetisLoader("Projects");
        Metis.load(ml, this, function() {
            globalVariables.projectList = ml.getList();
            this.render();
        });
    }
}

AddDonationForDonor.prototype.renderEasySelector = function(panel) {
    panel.addLabel("Project");
    this.projectWidget = new EasySelectorWidget(1, globalVariables.projectList, "id", "name");
    
    if(this.donation.getProjectId() != null) {
        this.projectWidget.setValue(this.donation.getProjectId());
    }
    
    this.qf.put("projectId", this.projectWidget, ["notEmpty"]);
}

AddDonationForDonor.prototype.readEasySelector = function() {
       
    // Passed verification so at least one item
    this.project = this.projectWidget.getItems()[0];
}