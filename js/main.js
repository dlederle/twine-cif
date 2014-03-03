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
        CiF.loadJSON(_CiFState);
        var initiator = CiF.cast.characters[0];
        var responder = CiF.cast.characters[1];
        console.log("Before:");
        console.log(CiF.coolNetwork.getAverageOpinion(0));
        console.log(CiF.coolNetwork.getAverageOpinion(1));
        CiF.playGameByName("brag", initiator, responder);
        console.log("After:");
        console.log(CiF.coolNetwork.getAverageOpinion(0));
        console.log(CiF.coolNetwork.getAverageOpinion(1));
    } catch (e) {
        console.log(e.stack);
    }
});
