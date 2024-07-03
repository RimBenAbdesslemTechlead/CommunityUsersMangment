public class DataTableUserModel{
    @AuraEnabled
    public String id {get; set;}
    public string Name {get; set;}

    public DataTableUserModel(String id, String Name) {
        this.id = id;
        this.Name = name;
    }

}