define(['min-cif/Util', 'min-cif/Cast'], function(Util, Cast) {
    /**
     * @class Cif_Singleton
     */
    var CiFSingleton = function() {
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

            this.cast = Cast.getInstance();

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
         *
         * @param initiator The Subject of the intent formation process.
         * @param [activeCast] Option cast of characters that can be responders
         */
        instance.formIntent = function(initiator, activeInitiatorAndResponderCast, activeOtherCast, setOfGames) {
            throw NotImplemented();
        }

        instance.formIntentForAll = function(activeInitiatorAndResponderCast, activeOtherCast) {
            throw NotImplemented();
        }

        /** Forms intent for all social games between two characters.
         * If any of the social games requires a third part, it is handled.
         * As with the other form intent functions, only intenets that result in
         * volition scores greater than 0 are aded to the initator's
         * perspective memory.
         */
        instance.formIntentForSocialGames = function(initiator, responder) {
            throw NotImplemented();
        }

        instance.formIntentForASocialGame = function(sg, initiator, responder, activeOtherCastt) {
            throw NotImplemented();
        }

        instance.getResponderScore = function(sg, initiator, responder, activeOtherCast) {
            throw NotImplemented();
        }

        /**
         * Forms the intents, each consisting of a gameScore, between an initiator,
         * responder, and another determined by this function. The other is chosen
         * first by permissibility (does he/she satisfy the preconditions of the
         * game) and then by desirability (highest volition score). The chosen other
         * is then placed along with the social game, initiator and responder
         * in a game score which is stored in the initator's perspective memory.
         */
        instance.formIntentThirdParty = function(sg, initiator, responder, activeOtherCast) {
            throw NotImplemented();
        }

        instance.scoreAllMicrotheoriesForType = function(sg, initiator, responder, activeOtherCast) {
            throw NotImplemented();
        }

        instance.formIntentWithPatsy = function(sg, initiator, responder, activeOtherCast) {
            throw NotImplemented();
        }

        instance.formIntentExplicitThirdParty = function(sg, initiator, responder, other, otherCast) {
            throw NotImplemented();
        }

        instance.formIntentNoThird = function(sg, initiator, responder) {
            throw NotImplemented();
        }

        instance.formIntentByName = function(characterName) {
            throw NotImplemented();
        }

        /**
         * Figures out how important each predicate was in the iniator's
         * desire to play a game
         *
         * @param sgc The social game context
         */
        instance.getPredicateRelevance = function(sgc, initiator, responder, other, forRole, otherCast, mode) {
            forRole = forRole || "initiator";
            mode = mode || "positive";
            throw NotImplemented();
        }

        return Singleton;
    };
    return CiFSingleton();
});
