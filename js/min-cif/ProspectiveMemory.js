define(['min-cif/CiFSingleton', 'min-cif/GameScore', 'min-cif/RuleRecord', 'min-cif/Predicate'], function(CiFSingleton, GameScore, RuleRecord, Predicate) {
    var cif = CiFSingleton.getInstance();

    var ProspectiveMemory = function() {
        this.scores = [];
        this.ruleRecords = [];
        this.responseSGRuleRecords = [];

        /**
         * Initializes the intentCache, which is what stores the total score for an intent
         * This is used for both performace increases and for the network line length calculations
         */
        this.initializeIntentScoreCache = function() {
            var numChars = cif.cast.characters.length;
            this.intentScoreCache = [];
            this.intentPosScoreCache = [];
            this.intentNegScoreCache = [];
            var i;
            var j;
            for (i = 0; i < numChars; i++) {
                this.intentScoreCache[i] = new Array(Predicate.NUM_INTENT_TYPES);
                this.intentPosScoreCache[i] = new Array(Predicate.NUM_INTENT_TYPES);
                this.intentNegScoreCache[i] = new Array(Predicate.NUM_INTENT_TYPES);
                for (j = 0; j < Predicate.NUM_INTENT_TYPES; j++) {
                    this.intentScoreCache[i][j] = ProspectiveMemory.DEFAULT_INTENT_SCORE;
                    this.intentPosScoreCache[i][j] = ProspectiveMemory.DEFAULT_INTENT_SCORE;
                    this.intentNegScoreCache[i][j] = ProspectiveMemory.DEFAULT_INTENT_SCORE;
                }
            }
        }
        this.initializeIntentScoreCache();

        this.getIntentScore = function(typeOfIntent, responder) {
            return this.intentScoreCache[responder.networkID][typeOfIntent];
        }

        /**
         * Returns the higested scored games in prospective memory.
         * @param	count The number of the highest scored games to return.
         * @return The highest scored games.
         */
        this.getHighestGameScores = function(count) {
            var count = count || 5;
            if (this.scores.length < count) count = this.scores.length;
            return this.scores.sort(this.scoreCompare).slice(0, count);
        }

        /**
         * Returns the game score object that corresponds to the gameName given
         * @param	gameName
         * @return
         */
        this.getGameScoreByGameName = function(gameName,responder) {
            this.scores.forEach(function(gs) {
                if (gs.name == gameName && gs.responder == responder.characterName) {
                    return gs;
                }
            });
        }

        var scoreCompare = function(x, y) {
            return y.score - x.score;
        }

        /**
         * Searches the prospective memory for the highest game scores WRT
         * another character.
         * @param	charName	The name of the other character.
         * @param	count		The number of game scores to return.
         * @return	The returned scores.
         */
        this.getHighestGameScoresTo = function(charName, count, minVolition) {
            var count = count || 5;
            var minVolition = minVolition || -9999;
            var scoresTo = [];
            var counted = 0;
            this.scores.forEach(function(score) {
                if ((score.responder.toLowerCase() == charName.toLowerCase()) && score.score >= minVolition) {
                    scoresTo.push(score);
                    counted++;
                }
            });
            return scoresTo.sort(this.scoreCompare).slice(0, (counted < count)?counted:count);
        }

        this.clone = function() {
            var pm = new ProspectiveMemory();
            pm.scores = [];
            this.scores.forEach(function(g) {
                pm.scores.push(g.clone());
            });

            pm.intentScoreCache = [];
            this.intentScoreCache.forEach(function(s, i) {
                pm.intentScoreCache[i] = s.slice(0);
            });
            return pm;
        }

        this.toString = function() {
            var result = "Prospective Memory\n"
                this.scores.forEach(function(g) {
                    result += "\t" + g.toString() + "\n";
                });
            return result;
        }
    }

    ProspectiveMemory.DEFAULT_INTENT_SCORE = -1000;

    ProspectiveMemory.equals = function(x, y) {
        if (x.name != y.name) return false;
        if (x.initiator != y.initiator) return false;
        if (x.responder != y.responder) return false;
        if (x.score != y.score) return false;
        return true;
    }

    return ProspectiveMemory;
});
