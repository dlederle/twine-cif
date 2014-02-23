define(['min-cif/InfluenceRule', 'min-cif/Predicate', 'min-cif/CiFSingleton', 'min-cif/SocialFactsDB'], function(InfluenceRule, Predicate, CiFSingleton, SocialFactsDB) {
    var InstrumentedInfluenceRule = function() {
        InstrumentedInfluenceRule.counter++;

        this.uniqueID = counter;
        this.history =  {};

        if (!InstrumentedInfluenceRule.rulesByID) {
            InstrumentedInfluenceRule.rulesByID = {};
        }
        InstrumentedInfluenceRule.rulesByID[this.uniqueID] = this;

        this.evaluate = function(initiator, responder, other, sg) {
            this.lastTrueCount = 0;
            var p;
            var p1;
            var i = 0;
            var truthState = {};

            var isTrue = false;

            if (0 < this.highestSFDBOrder()) {
                //console.debug(this, "evaluate() this.highestSFDBOrder of the rule: " + this.highestSFDBOrder());
                return this.evaluateTimeOrdedRule(initiator, responder, other);
            }

            this.predicates.forEach(function(p) {

                //console.debug(this, "evaluating predicate of type: " + Predicate.getNameByType(p.type), 0);
                var startTime = getTimer();
                if (!p.evaluate(initiator, responder, other, sg)) {
                    Predicate.evalutionComputationTime += getTimer() - startTime;
                    //console.debug(this, "predicate is false - " + p.toString());
                    truthState[i] = false;
                } else {
                    truthState[i] = true;
                    ++this.lastTrueCount;
                }
                Predicate.evalutionComputationTime += getTimer() - startTime;

                ++i;
            });

            if(this.lastTrueCount == this.predicates.length)
                isTrue = true
            else
                isTrue = false;

            truthState["numTrue"] = this.lastTrueCount;
            truthState["result"] = isTrue;
            this.addTruthStateToHistory(initiator, responder, other, truthState);

            return isTrue;
        }

        this.evaluateTimeOrdedRule = function(x, y, z) {
            var cif = CiFSingleton.getInstance();
            //The max order value of the rule.
            var maxOrderInRule = this.highestSFDBOrder();
            //when evaluating an order, this is value is updated with the highest truth time for the order.
            //when evaluating an order, this is value is updated with the highest truth time for the order.
            var curOrderTruthTime = cif.sfdb.getLowestContextTime();
            //the highest truth time of all the predicates in the previous order.
            var lastOrderTruthTime = curOrderTruthTime;
            //the truth time of the current predicate.
            var time;
            //the current order being evaluated
            var order;
            var pred; //predicate iterator
            var startTime;

            var truthState = {};
            var i = 0;
            var numTrue = 0;

            var isTrue = false;

            for (order = 1; order <= maxOrderInRule; ++order) {
                this.predicates.forEach(function(pred) {
                    if (pred.sfdbOrder == order) {
                        startTime = getTimer();
                        //the predicate is of the order we are currently concerned with
                        time = cif.sfdb.timeOfPredicateInHistory(pred, x, y, z);
                        Predicate.evalutionComputationTime += getTimer() - startTime;
                        //was the predicate true at all in history? If not, return false.
                        if ((SocialFactsDB.PREDICATE_NOT_FOUND == time) || (time < lastOrderTruthTime)) {
                            truthState[i] = false;
                        }else {
                            truthState[i] = true;
                            numTrue++
                        }
                        ++i;

                        //update curOrderTruthTime to highest value for this order
                        if (time > curOrderTruthTime) curOrderTruthTime = time;
                    }
                });
                lastOrderTruthTime = curOrderTruthTime;
            }

            //evaluate the predicates in the rule that are not time sensitive (i.e. their order is less than 1).
            this.predicates.forEach(function(pred) {
                if (pred.isSFDB < 1) {
                    startTime = getTimer();
                    if (!pred.evaluate(x, y, z)) {
                        Predicate.evalutionComputationTime += getTimer() - startTime;
                        truthState[i] = false;
                    }else {
                        numTrue++
                truthState[i] = true;
                    }
                    ++i;
                    Predicate.evalutionComputationTime += getTimer() - startTime;
                }
            });

            if(numTrue == this.predicates.length)
                isTrue = true
            else
                isTrue = false;

            truthState["numTrue"] = numTrue;
            truthState["result"] = isTrue;
            this.addTruthStateToHistory(x, y, z, truthState);

            return isTrue;
        }

        /**
         * Prepares the history dictionaries to accept this rule. It properly links the dictionary entries including
         * the truth state.
         * @param	x	First character variable.
         * @param	y	Second character variable.
         * @param	z	Third character variable.
         * @param	truthState	The state of evaluation of the rules of one evaluation.
         */
        var addTruthStateToHistory = function(x, y, z, truthState) {
            var time = CiFSingleton.getInstance().time;
            //is there a dictionary for this time?\

            var zName = (z)?z.characterName:"none";
            if (!this.history[time]) {
                this.history[time] = {};
            }

            //is there a dictionary for this x?
            if (!this.history[time][x.characterName]) {
                this.history[time][x.characterName] = {};
            }

            //is there a dictionary for this y?
            if (!this.history[time][x.characterName][y.characterName]) {
                this.history[time][x.characterName][y.characterName] = {};
            }

            //is there a dictionary for this z?
            if (!this.history[time][x.characterName][y.characterName][zName]) {
                this.history[time][x.characterName][y.characterName][zName] = {};
            }

            //Add the truthState.
            this.history[time][x.characterName][y.characterName][zName] = truthState;
        }

        var singleRuleHistoryToString = function(id) {
            //the truth state
            var t;
            var output = "";
            var curHistory = InstrumentedInfluenceRule.rulesByID[id].history;
            var rulePredicateCount = InstrumentedInfluenceRule.rulesByID[id].predicates.length;
            curHistory.forEach(function(time) {
                curHistory[time].forEach(function(xName) {
                    curHistory[time][xName].forEach(function(yName) {
                        curHistory[time][xName][yName].forEach(function(zName) {
                            //for (var ts:* in curHistory[time][xName][yName][zName]) {
                            //t = ts as Dictionary;
                            t = curHistory[time][xName][yName][zName];
                            //at the truth state level here
                            output += "\t" + time + ", " + xName + ", " + yName + ", " + zName + ", " + t["result"] + ", " + t["numTrue"];
                            for (var i = 0; i < rulePredicateCount; ++i ) {
                                output += ", " + t[i];
                            }
                            output += "\n";
                            //}
                        });
                    });
                });
            });
            if ("" == output) {
                output = id + " was never evaluated. " + InstrumentedInfluenceRule.rulesByID[id] + "\n";
            } else {
                output = id + ": " + InstrumentedInfluenceRule.rulesByID[id] + "\n" + output;
            }
            return output;

        }
        this.prototype = new InfluenceRule();
    } //End of InstrumentedInfluenceRule
    InstrumentedInfluenceRule.counter = 0;
    /**
     * Holds reference to all InstrumentedInfluenceRules by keys of their unique IDs.
     */
    InstrumentedInfluenceRule.rulesByID = {};
    /**
     * Returns a string containing either one or all of the rules and their histories.
     * @param	id	The unique identified of a rule. The default value is -1 and it
     * tells the function to print the history of all rules.
     * @return	A string containing the history of one or more rules.
     */
    InstrumentedInfluenceRule.ruleHistoryToString = function(id) {
        var output = "";
        var iir;
        var i = 0;
        var truthState;
        RET

            if (id >= 0) {
                return singleRuleHistoryToString(id);
            }
        InstrumentedInfluenceRule.rulesByID.forEach(function(IDKey) {
            output += singleRuleHistoryToString(IDkey) + "\n";
        });

        return output;
    }


    return InstrumentedInfluenceRule;
});
