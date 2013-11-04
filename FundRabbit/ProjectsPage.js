function ProjectsPage() {
	new PageHeaderWidget("Projects");
    
    new QuickAddButtonWidget("Add Project", this, "clickedAddProject");
    
    new LineBreakWidget();
    
    var projectTable = new DataTableWidget(this, "projectTable");
    
    projectTable.addHeader("Creation Date", "creationDate", 100);
    projectTable.addColumn();
    
    projectTable.addHeader("Project Name", "name");
    projectTable.addColumn(function(project) {
        new TextWidget($H("<em>" + project.getName() + "</em>\n"));
        new TextWidget(project.getBlurb());
    });
    
    var msPerDay = 1000*60*60*24;
    projectTable.addHeader("Target Date", "targetDate", 100);
    projectTable.addColumn(function(project) {
        var targetDate = project.getTargetDate().toJsDate();
        
        new TextWidget(DateUtil.getShortFormattedDate(project.getTargetDate().toJsDate()));
        
        new LineBreakWidget(0.1);
        
        var numMs = targetDate.getTime() - new Date().getTime();
        var numDays = (numMs/msPerDay).toFixed(0);
        if(numDays < 0) {
            numDays = 0;
        }
        new TextWidget($H("<small>" + numDays + " days to go</small>"));
    });
    
    projectTable.addHeader("Goal", "goal", 150, {columnAlign: "center"});
    projectTable.addColumn(function(project) {
        var goal = Number(project.getGoal());
        new TextWidget("$" + goal.toFixed(2));
        new LineBreakWidget(0.5);
        
        var pledged = project.getAmountPledged();
        pledged = Number(pledged != null?pledged:0);
        
        var received = project.getAmountReceived();
        received = Number(received != null?received:0);
        
        var bar = new ProgressIndicatorWidget(100);
        
        var value = pledged/goal;
        if(value > 1) value = 1;
        if(value < 0) value = 0;
        bar.update(value);
        
        new LineBreakWidget(0.5);
        
        if(received > goal) {
            new TextWidget($H("<span class='goal-reached'>Fully funded!</span>"));
            new LineBreakWidget(0.5);
        } else if(pledged > goal) {
            new TextWidget($H("<span class='goal-reached'>Fully pledged!</span>"));
            new LineBreakWidget(0.5);
        }
        
        new TextWidget("Pledged: $" + pledged.toFixed(2) + "\n");
        new TextWidget("Received: $" + received.toFixed(2));
    });
    
    projectTable.addHeader("Actions", "actions");
    projectTable.addColumn(function(project) {
        new ButtonWidget("Track Donations", this, function() {
            var dialog = new DonationsByProjectDialog(project);
            dialog.setRefreshHandler(this.projectTable, "refreshTable");
        });
    });
    
    projectTable.renderMetisData(Metis, "Projects", [new EqFilter("deleted", false)]); 
    
    projectTable.setClickHandler(this, "clickedEditProject");
    
    this.projectTable = projectTable;
}

ProjectsPage.prototype.clickedAddProject = function() {
    var dialog = new AddProject("add");
    dialog.setRefreshHandler(this.projectTable, "refreshTable");
}

ProjectsPage.prototype.clickedEditProject = function(project) {
    var dialog = new AddProject("edit", project);
    dialog.setRefreshHandler(this.projectTable, "refreshTable");
}