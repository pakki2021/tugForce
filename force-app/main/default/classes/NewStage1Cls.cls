public with sharing class NewStage1Cls {
    public NewStage1Cls() {
        System.debug('New cls created in Stage1 branch');
    }

    public void stage1Method()
    {
        System.debug('Stage 1 method');
    }

    public void testMethod1()
    {
        System.debug('testMethod1');
    }

    public void testMethod2()
    {
        System.debug('testMethod2');
        System.debug('testing PR');
    }
}