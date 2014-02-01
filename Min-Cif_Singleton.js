function NotImplemented() {
    this.message = "Function not Implemented";
}
NotImplemented.prototype = new Error();


/**
 * @class Cif_Singleton
 */
var Cif_Singleton = (function() {
    var instance;
    function Singleton() {
        if (instance) {
            return instance;
        }
        instance = this;

        /*
         * Network and Database Initialization
         */
        this.buddyNetwork = "Buddy Network"; //{};
        this.relationshipNetwork = "Relationship Network"; // {};
        this.romanceNetwork = "Romance Network";
        this.coolNetwork = "Cool Network";
        this.ckb = "Cultural Knowledge Base";
        this.sfdb = "Social Facts Database";
        this.socialGamesLib = "Social Games Lib";

        /**
         * This will always hold the last other that the last responder used while deciding accept/reject
         * it should only be referenced immediately after play game
         */
        this.lastResponderOther = "Last Responder";

        this.useMicrotheoryCache = true;
        this.microtheoryCache = {};
        this.microtheories = [];

        this.cast = "Cast";

        this.socialStatusUpdates = [];

        /**
         * Used for computing the network line length.
         */
        this.intentsTotalPos = [];
        this.intentsTotalNeg = [];

        /**
         * The current time of the simulation.
         */
        this._time = 0;

        /**
         * The current context of CiF. This will primarily be in a
         * SocialGameContext but can be in a TriggerContext during the SFDB
         * trigger processing phase or a StatusContext when evaluating the
         * removal of statuses from characters.
         */
        var currentContext = "Current Context";
    }

    Singleton.getInstance = function() {
        return instance || new Singleton();
    }
    instance = Singleton.getInstance();

    instance.resetNetworks = function() {
        this.relationshipNetowrk = {};
        this.buddyNetwork = {};
        this.romanceNetwork = {};
        this.coolNetwork = {};
    }

    /**
     * Evaluates the change of all non-backstory social game context entries
     * in the SFDB in game time order. Triggers are ran after each context is
     * valuated
     *
     */
    instance.valuateHistory = function() {
        throw NotImplemented();
    }

    /**
     * Resets the last seen times on the social game's effects.
     */
    instance.resetLastSeenTimes = function() {
        throw NotImplemented();
    }

    //Intent formation

    /**
     * Performs intent planning for a single character. This process scores
     * all possible social games for all other characters and stores
     * the score in the character's prospective memory.
     * @method resetLastSeenTimes
     * @param character The Subject of the intent formation process.
     */
    instance.formIntentOld = function(character) {
        throw NotImplemented();
    }

    instance.formIntentForAll = function(activeInitiatorAndResponderCast, activeOtherCast) {
        throw NotImplemented();
    }

    return Singleton;
}());

var cif = new Cif_Singleton();
console.log(cif.valuateHistory());
