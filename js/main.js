require.config({
    baseUrl: "./js/cif-js",
    paths: {
        "CiFSingleton": "CiFSingleton",
        "jquery": "../vendor/jquery-1.11.0.min",
        "CiFAuthoring": "../CiFAuthoring"
    }
});

require(['CiFSingleton', 'CiFAuthoring'], function(CiFSingleton, CiFAuthoring) {
    console.log("entering main");
    try {
        CiF = CiFSingleton.getInstance();
        //CiF.defaultState();
        //CiF.formIntentForAll(c.cast.characters, c.cast.characters);
        //CiF.loadJSON(_CiFState);

        if(CiFAuthoring) {
            CiFAuthoring();
        } else {
            console.debug("CiFAuthoring not loaded");
        }
    } catch (e) {
        console.log(e.stack);
    }
});
