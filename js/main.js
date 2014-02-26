require.config({
    baseUrl: "./js/min-cif",
    paths: {
        "CiFSingleton": "CiFSingleton"
    }
});

require(['CiFSingleton'], function(CiFSingleton) {
    console.log("entering main");
    try {
        c = CiFSingleton.getInstance();
        c.defaultState();
        c.formIntentForAll(c.cast.characters, c.cast.characters);
        c.loadJSON(_CiFData.CiFState);
    } catch (e) {
        console.log(e.stack);
    }
});
