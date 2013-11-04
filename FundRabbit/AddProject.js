function AddProject(addOrEdit, project) {
	ClassUtil.mixin(AddProject, this, Refreshable);
    ClassUtil.mixin(AddProject, this, Dialogable);
    
    this.addOrEdit = addOrEdit;
    this.project = project;

    this.headerPrefix = "Add Project";
    if(this.addOrEdit == "edit") {
        this.headerPrefix = "Edit Project";
    }

	this.dialog = new FullPageDialog();
	this.recordHeader = new RecordHeaderWidget(this.headerPrefix);
	this.recordHeader.activateRightBorderSection();

	var panel = new HorizontalPanelWidget("right", false);
	new EmphasizedButtonWidget("Save", this, "clickedSave");
	new DemotedButtonWidget("Close", this.dialog, "close");

	panel.finish();

	this.dialog.resetInsertPosition();
    
    var panel = new QueryPanelWidget(140, 500);
    this.queryFields = new QueryFields(panel, project);
    
    panel.addLabel("Project name");
    this.queryFields.put("name", new InputFieldWidget(), ["notEmpty"]);
    panel.addInstruction("A memorable title for the project that you're raising funds for. For example, \"New School Gymnasium\".\n\n");
    
    this.nameWidget = this.queryFields.getWidget("name");
    this.nameWidget.onKeyUp(this, "updateName");
    
    if(this.addOrEdit == "edit") this.updateName();

    panel.addLabel("Short blurb");
    this.queryFields.put("blurb", new TextAreaWidget().setGrowable());
    
    panel.addFullRow();
    new LineBreakWidget();
    new TextWidget("Specify the fundraising goal and the target date to achieve that goal. You and your donors will be able to see how close you are to the goal at any time on the project page.");
    new LineBreakWidget();
    
    panel.addLabel("Fundraising goal ($)");
    this.queryFields.put("goal", new InputFieldWidget(), ["notEmpty", "numberOnly"]);
    
    panel.addLabel("Target date");
    this.queryFields.put("targetDate", new DateWidget(), ["validDate"]);

    panel.addFullRow();

    new LineBreakWidget(2);
    new HeaderWidget("Project Story");
    new TextWidget("This section is key to your fundraising efforts! Inspire your donors with a good video and a compelling case for your project.")
    new LineBreakWidget(1);
    new TextWidget("You can leave this section blank if you only plan to track donations, and not actively fundraise using FundRabbit's public project page.");
    
    new LineBreakWidget();
    
    panel.addLabel("YouTube URL");
    this.queryFields.put("videoUrl", new InputFieldWidget());
    panel.addInstruction("We can only display videos uploaded to YouTube at the present moment.\n\n");
    
    panel.addLabel("Project Description")
    this.queryFields.put("description", new TextAreaWidget().setGrowable(100, 3));
    
    panel.finish();
    
    if(this.addOrEdit == "edit") {
        new LineBreakWidget(2);
        new HeaderWidget("Delete Project");
        new TextWidget("Deletions are permanent so we will ask for a confirmation before deleting a project.\n")
        
        new LinkWidget("Delete Project", this, function() {
        	new MessageDialog("Confirm delete", $T("Click below to delete this project: " + this.project.getName()), "Delete", true, this, "clickedDelete");
    	});
    }
}

AddProject.prototype.updateName = function() {
    var text = this.nameWidget.getValue();
    if(text != "") text = ": " + text;
    this.recordHeader.setHeader(this.headerPrefix + text);
};

AddProject.prototype.clickedSave = function() {
    if(!this.queryFields.verify()) return false;
    
    if(this.addOrEdit == "add") {
        this.project = new Project();
    }
    
    var qf = this.queryFields;
    
    this.project.setName(qf.getValue("name"));
    this.project.setBlurb(qf.getValue("blurb"));
    this.project.setGoal(qf.getValue("goal"));
    this.project.setTargetDate(new PlainDate(qf.getValue("targetDate")));
    this.project.setVideoUrl(qf.getValue("videoUrl"));
    this.project.setDescription(qf.getValue("description"));
    
    Metis.save(this.project, this, function() {
        this.closeDialogBox();
        this.refreshAction.call();
    });
};

AddProject.prototype.clickedDelete = function() {
    this.project.setDeleted(true);
    Metis.save(this.project, this, function() {
        this.closeDialogBox();
        this.refreshAction.call();
    });
}