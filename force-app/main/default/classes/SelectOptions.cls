public class SelectOptions 
{
    @AuraEnabled
	public static List<String> getSelected(String selectt)
    {
        System.debug('selected option:-'+selectt);
        Map<String, Schema.SObjectField> fMap = Schema.getGlobalDescribe().get(selectt).getDescribe().fields.getMap();
		System.debug(fMap.get('Name').getDescribe().isPermissionable());
        
        return new List<String>(fMap.keySet());
    }
}