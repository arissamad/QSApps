function Phone() {
    this.type;
    this.number;
}
Metis.defineSubItem(Phone, "Phones", "type", "number");
Metis.createGettersAndSetters(Phone);