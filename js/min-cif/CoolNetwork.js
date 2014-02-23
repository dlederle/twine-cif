define(['./SocialNetwork'], function(SocialNetwork) {

    /**
     * @class CoolNetwork
     */
    var cn = function() {
        var instance;
        function CoolNetwork() {
            if (instance) {
                return instance;
            }
            instance = this;
        }
        CoolNetwork.prototype = new SocialNetwork();
        CoolNetwork.getInstance = function() {
            return instance || new CoolNetwork();
        }
        return CoolNetwork;
    };

    //This feels slightly weird, but it returns the Singleton correctly
    return cn();
});

