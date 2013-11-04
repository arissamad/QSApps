function Address() {
    this.type;
    
    this.street;
    this.city;
    this.state;
    this.zip;
    this.country;
}
Metis.defineSubItem(Address, "Addresses", "type", "street", "city", "state", "zip", "country");
Metis.createGettersAndSetters(Address);