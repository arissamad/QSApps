function AddressComponentView(address) {
    if(address == null) return;
    
    this.address = address;
    this.str = "";
    
    this.append("street", "", "\n");
    this.append("city", "", ", ");
    this.append("state", "", " ");
    this.append("zip", "", "");
    this.append("country", "\n", "");
    
    if(this.str != "") {
        this.str += "\n\n";
        
        new HeaderWidget(address.getType());
        new TextWidget(this.str);
    }
}

AddressComponentView.prototype.append = function(fieldName, conditionalPreString, conditionalPostString) {
    var value = this.address.getData(fieldName);
    if(value != null && value != "") {
        this.str += conditionalPreString;
        this.str += value;
        this.str += conditionalPostString;
    }
};