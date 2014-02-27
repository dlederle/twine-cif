require.config({
    baseUrl: "./js/cif-js",
    paths: {
        "CiFSingleton": "CiFSingleton"
    }
});

require(['CiFSingleton'], function(CiFSingleton) {
    console.log("entering main");
    try {
        CiF = CiFSingleton.getInstance();
        //CiF.defaultState();
        //CiF.formIntentForAll(c.cast.characters, c.cast.characters);
        CiF.loadJSON(_CiFState);
    } catch (e) {
        console.log(e.stack);
    }
});
