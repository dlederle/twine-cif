define(['min-cif/Rule', 'min-cif/InfluenceRuleSet'], function(Rule, InfluenceRuleSet) {
    /**
     * The Microtheory class stores a domain dependent set of rules that govern
     * CiF. These rules get included when scoring intent formation and the
     * responder's accept/reject score when the definition of the microtheory
     * is met in the current intent formation or game playing context. This
     * allows for the domain rules (of important social properties like
     * relationships and network transformations) to be kept in one place and
     * not be repeated in each social game.
     * Also included in Microtheory are the interrupt games that are associated
     * with the domain of the Microtheory. These interrupt social games look
     * much like other normal social games with two distinctions. The first is
     * that they have a special type of predicate whose evaluation is based on
     * the name of the current social game played (currentGame(True Love's Kiss))
     * so we can easily cull the set of games that can be interrupted or not in
     * the interrupt social game's preconditions. The second change is that
     * the initiator and responder influence rule sets are are not used (as of
     * conception; might change) and will generally be empty and ignored.
     */
    var Microtheory = function(opts) {
        opts = opts || {};
        this.name = opts.name || "Not named.";
        this.definition = opts.definition || new Rule();
        this.initiatorIRS = new InfluenceRuleSet();
        this.responderIRS = new InfluenceRuleSet();
        this.interrupts = [];
        this.lastScore = 0.0;
        this.lastScoreValid = false;
        this.lastPreconditionValid = false;

        /**
         * This function will score an influence rule set for all others that fit the definition or no others
         * if the definition doesn't require it.
         * @param	type either "initiator" or "responder"
         * @param	initiator
         * @param	responder
         * @param	activeOtherCast
         * @return The total weight of the influence rules
         */
        this.scoreMicrotheoryByType = function(initiator, responder, sg, activeOtherCast) {
            var possibleOthers = activeOtherCast || CiFSingleton.getInstance().cast.characters;

            var influenceRuleSet = this.initiatorIRS;
            var x = initiator;//(type == "initiator")?initiator:responder;
            var y = responder;//(type == "initiator")?responder:initiator;
            var totalScore = 0.0;

            if (this.definition.requiresThirdCharacter()) {
                //if the definition is about an other, if it is true for even one other, run the MT's
                possibleOthers.forEach(function(otherChar) {
                    if (otherChar.characterName != x.characterName &&
                        otherChar.characterName != y.characterName) {
                            if (this.definition.evaluate(x, y, otherChar, sg)) {
                                // do not reverse roles here, because whichever IRS we are using, the roles are how they ought to be
                                // role reversal for MTs happens at parsing xml time.
                                totalScore += influenceRuleSet.scoreRules(x, y, otherChar, sg, possibleOthers, this.name);
                            }
                        }
                });
            }
            else {
                if (this.definition.evaluate(x, y, undefined, sg)) {
                    //if the definition doesn't involve an other, we score the rules with a variable other
                    totalScore += influenceRuleSet.scoreRulesWithVariableOther(x, y, undefined, sg, possibleOthers, this.name);
                }
            }
            //if (x.prospectiveMemory.intentScoreCache[y.networkID][sg.intents[0].predicates[0].getIntentType()] == ProspectiveMemory.DEFAULT_INTENT_SCORE)
            return totalScore;
        }

        /**************************************************************************
         * Utility Functions
         *************************************************************************/

        this.clone = function() {
            var newMicrotheory = new Microtheory();
            newMicrotheory.name = this.name;
            newMicrotheory.definition = this.definition.clone();
            newMicrotheory.initiatorIRS = this.initiatorIRS.clone();
            newMicrotheory.responderIRS = this.responderIRS.clone();
            newMicrotheory.interrupts = this.interrupts.slice(0, this.interrupts.length - 1);
            return newMicrotheory;
        }
    }

    return Microtheory;
});
