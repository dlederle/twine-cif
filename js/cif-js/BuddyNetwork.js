define(['SocialNetwork'], function(SocialNetwork) {

    /**
     * @class BuddyNetwork
     */
    var bn = function() {
        var instance;
        function BuddyNetwork() {
            if (instance) {
                return instance;
            }
            instance = this;
        }
        BuddyNetwork.prototype = new SocialNetwork();
        BuddyNetwork.getInstance = function() {
            return instance || new BuddyNetwork();
        }
        return BuddyNetwork;
    };

    //This feels slightly weird, but it returns the Singleton correctly
    return bn();
});

