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

require(['underscore', 'min-cif/SocialNetwork', 'min-cif/CiFSingleton'], function(_, SocialNetwork, CiF) {
    console.log("Starting Main");
    //POLLUTING GLOBAL FOR DEBUGGING, UNDO LATER
    cif = new CiF().getInstance();
    sn = new SocialNetwork(5);
});
