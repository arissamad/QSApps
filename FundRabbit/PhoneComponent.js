function PhoneComponent(phone, panel, initialType) {
    if(phone == null) phone = new Phone();
    
    this.phone = phone;
    
    if(phone.getType() != null) {
        initialType = phone.getType();
    }
    
    var qf = new QueryFields(panel, phone);
    this.qf = qf;
    
    qf.setFocusFirstItem(false);
    
    panel.addLabel("", function() {
        qf.put("type", new DropDownWidget(["Home", "Cell", "Work"], "id", "value", initialType));
    });
    qf.put("number", new InputFieldWidget());
}

PhoneComponent.prototype.getPhone = function() {
    
    this.phone.setType(this.qf.getValue("type"));
    this.phone.setNumber(this.qf.getValue("number"));
    
    return this.phone;
}