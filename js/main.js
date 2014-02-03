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

require(['min-cif/CiFSingleton', 'min-cif/BuddyNetwork'], function(CiF, BuddyNetwork) {
    console.log("Starting Main");
    //POLLUTING GLOBAL FOR DEBUGGING, UNDO LATER
    cif = new CiF().getInstance();
    bn = new BuddyNetwork();
});
