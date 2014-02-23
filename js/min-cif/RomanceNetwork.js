define(['./SocialNetwork'], function(SocialNetwork) {

    /**
     * @class RomanceNetwork
     */
    var rn = function() {
        var instance;
        function RomanceNetwork() {
            if (instance) {
                return instance;
            }
            instance = this;
        }
        RomanceNetwork.prototype = new SocialNetwork();
        RomanceNetwork.getInstance = function() {
            return instance || new RomanceNetwork();
        }
        return RomanceNetwork;
    };

    //This feels slightly weird, but it returns the Singleton correctly
    return rn();
});

