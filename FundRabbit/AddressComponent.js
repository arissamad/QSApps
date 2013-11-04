function AddressComponent(address, panel, initialType) {
	if(address == null) address = new Address();
    
    this.address = address;
    
    if(address.getType() != null) {
        initialType = address.getType();
    }
    
    var qf = new QueryFields(panel, address);
    this.qf = qf;
    
    qf.setFocusFirstItem(false);
    
    panel.addLabel("");
    qf.put("type", new DropDownWidget(["Home Address", "Work Address", "Other"], "id", "value", initialType));
    
    panel.addLabel("Address");
    qf.put("street", new TextAreaWidget().setGrowable(80, 2));
    
    panel.addLabel("City");
    qf.put("city", new InputFieldWidget());
    
    panel.addLabel("State");
    qf.put("state", new InputFieldWidget());
    
    panel.addSecondLabel("Zip");
    qf.put("zip", new InputFieldWidget());
    
    panel.addLabel("Country");
    qf.put("country", new InputFieldWidget());
}

AddressComponent.prototype.getAddress = function() {
    this.address.setType(this.qf.getValue("type"));
    this.address.setStreet(this.qf.getValue("street"));
    this.address.setCity(this.qf.getValue("city"));
    this.address.setState(this.qf.getValue("state"));
    this.address.setZip(this.qf.getValue("zip"));
    this.address.setCountry(this.qf.getValue("country"));
    
    return this.address;
}