require.config({
});

//POLLUTING GLOBAL FOR DEBUGGING, UNDO LATER
require(['min-cif/CiFSingleton'], function(CiFSingleton) {
    CiF = CiFSingleton;
    c = CiF.getInstance();
});
