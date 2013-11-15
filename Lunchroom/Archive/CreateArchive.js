function CreateArchive(archive, option) {
    ClassUtil.mixin(CreateArchive, this, Refreshable);
    this.archive = archive;
    
    this.transferBalance = true;
    if(option == "reset") {
        this.transferBalance = false;
    }
    
    this.loadingWidget = new LoadingWidget("Archiving lunch orders... This will take a few minutes.");
    
    Rest.get("/sms/v1/students", {itemsPerPage: 1000}, this, "loadedStudents");
}

CreateArchive.prototype.loadedStudents = function(pagedStudents) {
    var students = pagedStudents.list;
    
    var studentMap = new MapClass();
    for(var i=0; i<students.length; i++) {
        var studentInfo = students[i];
        studentMap.put(studentInfo.id, studentInfo);
    }
    
    // Now load all student packets
    
    var tp = new TableParametersDataClass();
    tp.setNumberOfItemsPerPage(1000);
    
    var studentPacketLoader = new MetisLoader("StudentPackets");
    studentPacketLoader.setTableParameters(tp);
    
    Metis.load(studentPacketLoader, this, function() {
        var studentPackets = studentPacketLoader.getList();
        log("Loaded studentPackets. # records: " + studentPackets.length);
        
        var studentArchives = [];
        
        for(var i=0; i<studentPackets.length; i++) {
            var studentPacket = studentPackets[i];
            var studentInfo = studentMap.get(studentPacket.getSmsStudentStubId());
            
            if(studentInfo != null) {
                var studentArchive = new StudentArchive(this.archive, studentInfo, studentPacket);
                studentArchives.push(studentArchive);
            }
        }
        
        Metis.save(studentArchives, this, function() {
            log("Saved student archives.");
            // Now save the studentPackets with empty transactions
            this.saveStudentPackets(studentPackets);
        });
    });
};

CreateArchive.prototype.saveStudentPackets = function(studentPackets) {
    var saveList = [];
    
    for(var i=0; i<studentPackets.length; i++) {
        var studentPacket = studentPackets[i];
        
        studentPacket.setTransactions([]);
        
        var currBalance = Number(studentPacket.getBalance());
        
        if(NumberUtil.compareDouble(currBalance, 0) == 0 || this.transferBalance == false) {
            studentPacket.setBalance("0");
        }
        else {
            var nextId = studentPacket.getNextTransactionId();
            studentPacket.setNextTransactionId(nextId+1);
            nextId = studentPacket.getSmsStudentStubId() + "-" + nextId + "";
            
            var transaction = new Transaction("payment");
            
            var amount = studentPacket.getBalance();
            
            transaction.setId(nextId);
            transaction.setDescription("Opening Balance");
            transaction.setAmount("" + amount);
            transaction.setItems([]);
            
            studentPacket.add(transaction);
            saveList.push(transaction);
        }
        
        saveList.push(studentPacket);
    }
    
    log("Now saving student packets.");
    Metis.save(saveList, this, function(){
        this.loadingWidget.close();
        new MessageDialog("Archive done", "Archiving of lunch orders had been completed.");
        this.refreshAction.call();
    });
};