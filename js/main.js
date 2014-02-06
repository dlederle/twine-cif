require.config({
    paths : {
        'underscore' : 'vendor/underscore'
    },
    shim : {
        'underscore' : {
            exports : '_'
        }
    }
});

require(['min-cif/CiFSingleton', 'min-cif/Util', 'min-cif/Predicate', 'min-cif/Status'], function(CiF, Util, Predicate, Status) {
    console.log("Starting Main");
    //POLLUTING GLOBAL FOR DEBUGGING, UNDO LATER
    cif = new CiF.getInstance();
    pred = new Predicate;
    p = Predicate;
    s = Status;
});
