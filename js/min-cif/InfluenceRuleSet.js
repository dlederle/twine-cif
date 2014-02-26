define(['CiFSingleton', 'InfluenceRule', 'Rule', 'RuleRecord'], function(CiFSingleton, InfluenceRule, Rule, RuleRecord) {
    /**
     * Manages a set of influence rules. Has the ability to evalute the truth
     * of all the rules and return a weight corresponding to the sum of the
     * weights of the true influence rules.
     * <p>The results of the most current evaluation of the influence rule set
     * is stored in the class.</p>
     * @author Tiger Team
     * @see CiF.InfluenceRule
     * @see CiF.Rule
     * @see CiF.Predicate
     */
    var InfluenceRuleSet = function(opts) {
        opts = opts || {};
        this.influenceRules = opts.influenceRules || [];
        this.lastTruthValues = opts.lastTruthValues || [];
        this.lastScores = opts.lastScores || [];


        /**
         * Scores the rules of the influence rule set and returns the aggregate
         * weight of the true influence rules by going through all others whenever
         * others are relevant
         *
         * @param	initiator	The initiator of the social game.
         * @param	responder	The responder of the social game.
         * @param	other		A third party in the social game.
         * @return The sum of the weight values associated with true influence
         * rules.
         */
        this.scoreRulesWithVariableOther = function(initiator, responder, other, sg, activeOtherCast, microtheoryName, isResponder) {
            var possibleOthers = activeOtherCast || CiFSingleton.getInstance().cast.characters;
            var isResponder = isResponder || false;
            var microtheoryName = microtheoryName || "";
            var score = 0.0;
            var ruleRecord;
            this.truthCount = 0;
            this.lastScores = [];
            this.lastTruthValues = [];

            this.influenceRules.forEach(function(ir) {
                if (ir.weight != 0) {
                    if (ir.requiresThirdCharacter()) {
                        possibleOthers.forEach(function(other1) {
                            if (other1.characterName != initiator.characterName && other1.characterName != responder.characterName) {
                                if (ir.evaluate(initiator, responder, other1, sg)) {
                                    ruleRecord = new RuleRecord();
                                    ruleRecord.type = (microtheoryName != "")?RuleRecord.MICROTHEORY_TYPE: RuleRecord.SOCIAL_GAME_TYPE;
                                    ruleRecord.name = (microtheoryName != "")?microtheoryName: sg.name;
                                    ruleRecord.influenceRule = ir;
                                    ruleRecord.initiator = initiator.characterName;
                                    ruleRecord.responder = responder.characterName;
                                    ruleRecord.other = other1.characterName;
                                    if (isResponder) {
                                        responder.prospectiveMemory.responseSGRuleRecords.push(ruleRecord);
                                    }
                                    else {
                                        initiator.prospectiveMemory.ruleRecords.push(ruleRecord);
                                    }
                        score += ir.weight;
                        //this data might be broken city USA because of the way we handle others above. Use ruleRecords instead.
                        this.lastScores.push(score);
                        this.lastTruthValues.push(true);
                        ++this.truthCount;
                                }
                                else {
                                    this.lastScores.push(0.0);
                                    this.lastTruthValues.push(false);
                                }
                            }
                        });
                    }
                }
                else {
                    if (ir.evaluate(initiator, responder, undefined, sg)) {
                        ruleRecord = new RuleRecord();
                        ruleRecord.type = (microtheoryName != "")?RuleRecord.MICROTHEORY_TYPE: RuleRecord.SOCIAL_GAME_TYPE;
                        ruleRecord.name = (microtheoryName != "")?microtheoryName: sg.name;
                        ruleRecord.influenceRule = ir;
                        ruleRecord.initiator = initiator.characterName;
                        ruleRecord.responder = responder.characterName;
                        if (isResponder)
                        {
                            responder.prospectiveMemory.responseSGRuleRecords.push(ruleRecord);
                        }
                        else
                        {
                            initiator.prospectiveMemory.ruleRecords.push(ruleRecord);
                        }

                        score += ir.weight;

                        //this data might be broken city USA because of the way we handle others above. Use ruleRecords instead.
                        this.lastScores.push(score);
                        this.lastTruthValues.push(true);
                        ++this.truthCount;
                    }
                    else
                    {
                        this.lastScores.push(0.0);
                        this.lastTruthValues.push(false);
                    }
                }
            });
            return score;
        }

        /**
         * Scores the rules of the influence rule set and returns the aggregate
         * weight of the true influence rules
         *
         * @param	initiator	The initiator of the social game.
         * @param	responder	The responder of the social game.
         * @param	other		A third party in the social game.
         * @return The sum of the weight values associated with true influence
         * rules.
         */
        this.scoreRules = function(initiator, responder, other, sg, activeOtherCast, microtheoryName, isResponder) {
            var possibleOthers = activeOtherCast || CiFSingleton.getInstance().cast.characters;
            var isResponder = isResponder || false;
            var microtheoryName = microtheoryName || "";
            var score = 0.0;
            var ruleRecord;
            this.truthCount = 0;
            this.lastScores = [];
            this.lastTruthValues = [];

            //var numberCount:int = 0;

            this.influenceRules.forEach(function(ir) {
                //numberCount = 0;
                if (ir.weight != 0) {
                    //console.debug(this, "game: " + sg.name +" scoreRules() Rule: " + ir.toString());
                    if (ir.requiresThirdCharacter()) {
                        if (!other) console.debug(this, "scoreRules() No other passed in! Fatal bug with rule: " + ir.toString());

                        if (ir.evaluate(initiator, responder, other, sg)) {
                            ruleRecord = new RuleRecord();
                            ruleRecord.type = (microtheoryName != "")?RuleRecord.MICROTHEORY_TYPE: RuleRecord.SOCIAL_GAME_TYPE;
                            ruleRecord.name = (microtheoryName != "")?microtheoryName: sg.name;
                            ruleRecord.influenceRule = ir;
                            ruleRecord.initiator = initiator.characterName;
                            ruleRecord.responder = responder.characterName;
                            ruleRecord.other = other.characterName;
                            if (isResponder) {
                                responder.prospectiveMemory.responseSGRuleRecords.push(ruleRecord);
                            }
                            else {
                                initiator.prospectiveMemory.ruleRecords.push(ruleRecord);
                            }

                            score += ir.weight;

                            //this data might be broken city USA because of the way we handle others above. Use ruleRecords instead.
                            this.lastScores.push(score);
                            this.lastTruthValues.push(true);
                            ++this.truthCount;
                        }
                        else {
                            this.lastScores.push(0.0);
                            this.lastTruthValues.push(false);
                        }
                    }
                    else {
                        if (ir.evaluate(initiator, responder, undefined, sg))
                        {
                            ruleRecord = new RuleRecord();
                            ruleRecord.type = (microtheoryName != "")?RuleRecord.MICROTHEORY_TYPE: RuleRecord.SOCIAL_GAME_TYPE;
                            ruleRecord.name = (microtheoryName != "")?microtheoryName: sg.name;
                            ruleRecord.influenceRule = ir;
                            ruleRecord.initiator = initiator.characterName;
                            ruleRecord.responder = responder.characterName;
                            //if there is an other, this means it is the other that was important in the SG precondition, or MT def
                            if (other) {
                                ruleRecord.other = other.characterName;
                            }
                            if (isResponder) {
                                responder.prospectiveMemory.responseSGRuleRecords.push(ruleRecord);
                            }
                            else {
                                initiator.prospectiveMemory.ruleRecords.push(ruleRecord);
                            }
                            score += ir.weight;
                            //this data might be broken city USA because of the way we handle others above. Use ruleRecords instead.
                            this.lastScores.push(score);
                            this.lastTruthValues.push(true);
                            ++this.truthCount;
                        }
                        else {
                            this.lastScores.push(0.0);
                            this.lastTruthValues.push(false);
                        }
                    }
                }
            });
            return score;
        }

        this.getlastTruthValues = function() {
            return this.lastTruthValues.concat();
        }

        this.getlastScores = function() {
            return this.lastScores.concat();
        }

        /**
         * Returns the rule who's id matches the id provided
         * @param	ruleID
         * @return
         */
        this.getRuleByID = function(ruleID) {
            this.influenceRules.forEach(function(r) {
                if (r.id == ruleID) {
                    return r;
                }
            });
            console.debug(this, "getRuleByID() the id "+ruleID+ " is not matched by any influence rules in the set.");
            return new InfluenceRule();
        }

        /**
         * Replaces the influence rule at ID with the given influence rule
         * @param	ruleID
         * @param	replaceRule
         * @return
         */
        this.replaceRuleAtID = function(ruleID, replaceRule) {
            this.influenceRules.forEach(function(r, i) {
                if(r.id === ruleID) {
                    this.influenceRules[i] = replaceRule.clone();
                    //console.debug(this, "replaceRuleAtID() Replaced rule at index " + i);
                    return;
                }
            });
            console.debug(this, "replaceRuleAtID() the id "+ruleID+ " is not matched by any influence rules in the set.");
        }

        /**
         * Removes the influence rule at ID.
         * @param	ruleID
         * @return
         */
        this.removeRuleWithID = function(ruleID) {
            this.influenceRules.forEach(function(r, i) {
                if(r.id === ruleID) {
                    this.influenceRules.splice(i, 1);
                    return;
                }
            });
            console.debug(this, "removeRuleWithID() the id "+ruleID+ " is not matched by any influence rules in the set.");
        }

        this.clearLastValues = function() {
            this.lastTruthValues.forEach(function(l) {
                l = false;
            });
            this.lastScores.forEach(function(s) {
                s = 0;
            });
        }

        /**********************************************************************
         * Utilty functions.
         *********************************************************************/
        this.toString = function() {
            var returnstr;
            this.influenceRules.forEach(function(ir) {
                returnstr += ir.toString() + "\n";
            });
            return returnstr;
        }

        this.clone = function() {
            var irs = new InfluenceRuleSet();
            irs.influenceRules = [];
            this.influenceRules.forEach(function(ir) {
                irs.influenceRules.push(ir.clone());
            });
            return irs;
        }


        InfluenceRuleSet.equals = function(x, y) {
            if (x.influenceRules.length != y.influenceRules.length) { return false; }
            x.influenceRules.forEach(function(ir) {
                if (!InfluenceRule.equals(ir, y.influenceRules[i])) { return false; }
            });
            return true;
        }
    }

    return InfluenceRuleSet;
});
