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
        CiFAuthoring();
    } catch (e) {
        console.log(e.stack);
    }
});
