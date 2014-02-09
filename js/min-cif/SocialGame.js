define(['min-cif/CiFSingleton', 'min-cif/Rule'], function(CiFSingleton, Rule) {
    var CiF = CiFSingleton.getInstance();
    /**
     * The SocialGame class stores social games in their declarative form; the
     * social game preconditions, influence sets, and effects are stored. What
     * is not stored is the decisions made by the player or AI system about what
     * game choices are made. These decisions are stored in the FilledGame class.
     * <p>(deprecated)The defined constants denote the type of social change that
     * the social game has as its effect. </p>
     *
     * @see CiF.FilledGame
     *
     */
    var SocialGame = function(opts) {
        opts = opts || {};
        this.intents =  opts.intents || [];
        this.instantiations = opts.instantiations || [];
        this.preconditions = opts.preconditions || [];
        this.initiatorIRS = opts.initiatorIRS || new CiF.InfluenceRuleSet();
        this.responderIRS = opts.responderIRS || new CiF.InfluenceRuleSet();
        this.effects = opts.effects || [];
        this.thirdPartyTalkAboutSomeone = opts.thirdPartyTalkAboutSomeone || false;
        this.thirdPartyGetSomeoneToDoSomethingForYou = opts.thirdPartyGetSomeoneToDoSomethingForYou || false;
        this.patsyRule = opts.patsyRule || new Rule();
        this.italic = opts.italic || false;
        this.name = opts.name | "";

        /**
         * Adds an effect to the effects list and gives it an ID.
         * @param	effect	The effect to add to the social games's effects.
         */
        this.addEffect = function(effect) {
            var e = effect.clone();
            var idToUse = 0;
            this.effects.forEach(function(iterEffect) {
                if (iterEffect.id > idToUse)
                idToUse = iterEffect.id + 1;
            });
            e.id = idToUse;
            this.effects.push(e);
        }

        /**
         * Returns the effect who's id matches the id provided
         * @param	effectID
         * @return
         */
        this.getEffectByID = function(effectID) {
            this.effects.forEach(function(e) {
                if (e.id == effectID)
            {
                return e;
            }
            });
            console.debug(this, "getEffectByID() the id "+effectID+ " is not matched by any effects in the social game " + this.name);
            return new Effect();
        }

        /**
         * Adds an instantation the the social game's instantions and gives
         * it an ID.
         * @param	instantiation	The instantiation to add.
         */
        this.addInstantiation = function(instantiation) {
            var instant= instantiation.clone();
            var idToUse = 0;
            this.instantiations.forEach(function(iterInstant) {
                if (iterInstant.id > idToUse)
                idToUse = iterInstant.id + 1;
            });
            instant.id = this.instantiations.length;
            this.instantiations.push(instant);
        }

        /**
         * Returns the initiator's influence rule set score with respect to the
         * character/role mapping given in the arguments.
         *
         * @param	initiator	The initiator of the social game.
         * @param	responder	The responder of the social game.
         * @param	other		A third party in the social game.
         * @return
         */
        //NOTE: this is old news....
        this.getInitiatorScore = function(initiator, responder, other, sg, activeOtherCast) {
            var possibleOthers = activeOtherCast || CiF.cast.characters;
            return this.initiatorIRS.scoreRules(initiator, responder, other, sg,possibleOthers);
        }

        /**
         * This function returns true if the precondition is met in any way
         */
        this.passesAtLeastOnePrecondition = function(initiator, responder, activeOtherCast) {
            var possibleOthers = activeOtherCast || CiF.cast.characters;
            if (this.preconditions.length > 0) {
                if (this.preconditions[0].requiresThirdCharacter()) {
                    //if the precondition involves an other check preconditions for static others
                    possibleOthers.forEach(function(otherchar) {
                        if (otherChar.characterName != initiator.characterName &&
                            otherChar.characterName != responder.characterName)
                        {
                            if (this.preconditions[0].evaluate(initiator, responder, otherChar, this))
                    {
                        return true;
                    }
                        }
                    });
                }
                else
                {

                    // if there is a precondition, check precondition normally
                    if (this.preconditions[0].evaluate(initiator, responder, undefined, this))
                    {
                        return true;
                    }
                }
            }
            else
            {
                //if there are no precondition, we pass the precondition
                return true;
            }

            // this means we shouldn't even both scoring this game
            return false;
        }

        /**
         * This function will score an influence rule set for all others that fit the definition or no others
         * if the definition doesn't require it. This function assumes that there is one precondition rule.
         *
         * @param	type either "initiator" or "responder"
         * @param	initiator
         * @param	responder
         * @param	activeOtherCast
         * @return The total weight of the influence rules
         */
        this.scoreGame = function(initiator, responder, activeOtherCast, isResponder) {
            isResponder = isResponder || false;
            var possibleOthers = activeOtherCast || CiF.cast.characters;
            var influenceRuleSet = (!isResponder) ? this.initiatorIRS : this.responderIRS;

            var totalScore = 0.0;
            if (this.preconditions.length > 0) {
                if (this.preconditions[0].requiresThirdCharacter()) {
                    //if the precondition involves an other run the IRS for all others with a static other (for others that satisfy the SG's preconditions)
                    possibleOthers.forEach(function(otherChar) {
                        if (otherChar.characterName != initiator.characterName &&
                            otherChar.characterName != responder.characterName) {
                                if (this.preconditions[0].evaluate(initiator, responder, otherChar, this)) {
                                    totalScore += influenceRuleSet.scoreRules(initiator, responder, otherChar, this, possibleOthers,"",isResponder);
                                }
                            }
                    });
                }
                else {
                    // if there is a precondition, but it doesn't require a third, just score the IRS once with variable other
                    if (this.preconditions[0].evaluate(initiator, responder, undefined, this)) {
                        totalScore += influenceRuleSet.scoreRulesWithVariableOther(initiator, responder, undefined, this, possibleOthers, "", isResponder);
                    }
                }
            }
            else
            {
                //if there are no precondition, just score the IRS, once with a variable other
                totalScore += influenceRuleSet.scoreRulesWithVariableOther(initiator, responder, undefined, this, possibleOthers,"",isResponder);
            }
            //if (initiator.prospectiveMemory.intentScoreCache[responder.networkID][sg.intents[0].predicates[0].getIntentType()] == ProspectiveMemory.DEFAULT_INTENT_SCORE)
            return totalScore;
        }

        /**
         * Returns the responder's influence rule set score with respect to the
         * character/role mapping given in the arguments.
         * @param	initiator	The initiator of the social game.
         * @param	responder	The responder of the social game.
         * @param	other		A third party in the social game.
         * @return
         */
        this.getResponderScore = function(initiator, responder, other, sg, activeOtherCast) {
            var possibleOthers = activeOtherCast || CiF.cast.characters;
            return this.responderIRS.scoreRules(initiator, responder, other, sg, possibleOthers);
        }

        /**
         * Evaluates the precditions of the social game with respect to 
         * character/role mapping given in the arguments for the initiator
         * and responder while finding an other that fits all precondition 
         * rules if a third character is require by any of those rules.
         * @param	initiator		The initiator of the social game.
         * @param	responder		The responder of the social game.
         * @param 	activeOtherCast The possible characters to fill the other role.
         * @return True if all precondition rules evaluate to true. False if 
         * they do not.
         */
        this.checkPreconditionsVariableOther = function(initiator, responder, activeOtherCast) {
            if (this.preconditions.length < 1) return true; //no preconditions is automatically true

            var possibleOthers = activeOtherCast || CiF.cast.characters;
            var requiresOther = false;
            var isOtherSuitable;

            this.preconditions.forEach(function(precond) {
                if (precond.requiresThirdCharacter()) requiresOther = true;
            });
            if (requiresOther) {
                //iterate through all possible others and check each precondition with the current other
                possibleOthers.forEach(function(otherChar) {
                    isOtherSuitable = true; //assume the other works unilt proven otherwise

                    if (otherChar.characterName != initiator.characterName && otherChar.characterName != responder.characterName) {
                        //if the other is found not to be suitable for filling all precondition rules, break the loop and move on
                        //to the next possible other.
                        this.preconditions.forEach(function(p) {
                            if (!p.evaluate(initiator, responder, otherChar, this))
                            isOtherSuitable = false;
                        });
                        //other was true for all preconditions
                        if (isOtherSuitable) return true;
                    }
                });
            } else {
                this.preconditions.forEach(function(pre) {
                    if (!pre.evaluate(initiator, responder, undefined, this))
                    return false;
                });
                return true;
            }

            //default case
            return false;
        }

        /**
         * Evaluates the precditions of the social game with respect to
         * character/role mapping given in the arguments.
         * @param    initiator    The initiator of the social game.
         * @param    responder    The responder of the social game.
         * @param    other        A third party in the social game.
         * @return True if all precondition rules evaluate to true. False if
         * they do not.
         */
        this.checkPreconditions = function(initiator, responder, other, sg) {
            this.preconditions.forEach(function(preconditionRule) {
                if (!preconditionRule.evaluate(initiator, responder, other, sg))
                return false;
            });
            return true;
        }

        this.checkEffectConditions = function(initiator, responder, other) {
            this.effects.forEach(function(e) {
                if (!e.condition.evaluate(initiator, responder, other)) {
                    return false;
                }
            });
            return true;
        }

        /**
         * Evaluates the intents of the social game with respect to
         * character/role mapping given in the arguments.
         *
         * @param	initiator	The initiator of the social game.
         * @param	responder	The responder of the social game.
         * @param	other		A third party in the social game.
         * @return True if all intent rules evaluate to true. False if
         * they do not.
         */
        this.checkIntents = function(initiator, responder, other, sg) {
            this.intents.forEach(function(intentRule) {
                if (!intentRule.evaluate(initiator, responder, other, sg))
                return false;
            });
            return true;
        }

        /**
         * Determines if we need to find a third character for the intent
         * formation process.
         * @return True if a third character is needed, false if not.
         */
        this.thirdForIntentFormation = function() {
            this.preconditions.forEach(function(r) {
                if (r.requiresThirdCharacter()) return true;
            });

            this.initiatorIRS.influenceRules.forEach(function(ir) {
                if (ir.requiresThirdCharacter()) return true;
            });

            this.presonderIRS.influenceRules.forEach(function(ir) {
                if (ir.requiresThirdCharacter()) return true;
            });

            this.effects.forEach(function(e) {
                if (e.condition.requiresThirdCharacter()) return true;
                if (e.change.requiresThirdCharacter()) return true;
            });

            return false;
        }

        /**
         * Determines if we need to find a third character for social game
         * play.
         * @return True if a third character is needed, false if not.
         */
        this.thirdForSocialGamePlay = function() {
            this.effects.forEach(function(e) {
                if (e.change.requiresThirdCharacter() || e.condition.requiresThirdCharacter())
                return true;
            });
            return false;
        }

        /**
         * Finds an instantiation given an id.
         * @param	id	id of instantiation to find.
         * @return	Instantiation with the parameterized id, undefined if not
         * found.
         */
        this.getInstantiationById = function(id) {
            this.instantiations.forEach(function(inst) {
                if (id == inst.id)
                return inst;
            });
            console.debug(this, "getInstiationById() id not found. id=" + id);
            return undefined;
        }

        this.getThirdParty = function() {
            return this.thirdPartyTalkAboutSomeone || this.thirdPartyGetSomeoneToDoSomethingForYou;
        }

        /**********************************************************************
         * Utility Functions
         *********************************************************************/

        this.clone = function() {
            var sg = new SocialGame();
            sg.name = this.name;

            sg.intents = this.intents.slice[0];

            sg.italic = this.italic;

            sg.patsyRule = this.patsyRule.clone();

            sg.preconditions = this.preconditions.slice[0];

            sg.initiatorIRS = this.initiatorIRS.clone();
            sg.responderIRS = this.responderIRS.clone();
            sg.effects = this.effects.slice[0];
            sg.instantiations  = this.instantiations.slice[0];
            return sg;
        }

        this.toNaturalLanguage = function() {
            var returnString = "";
            returnString += "-- Social Game --\n";
            returnString += "* Name: " + this.name + "\n";
            returnString += "* Preconditions: \n";
            this.preconditions.forEach(function(rule) {
                rule.predicates.forEach(function(pred) {
                    //returnString += "      " + pred.toNaturalLanguageString(pred.primary,pred.secondary) + "\n";
                    returnString += "      " + pred.toString() + "\n";
                });
            });
            returnString += "\n* Initiator Influence Rules:\n";
            this.initiatorIRS.influenceRules.forEach(function(infRule) {
                returnString += "   " + infRule.weight + ":\n"
                infRule.predicates.forEach(function(pred) {
                    //returnString += "      " + pred.toNaturalLanguageString(pred.primary,pred.secondary) + "\n";
                    returnString += "      " + pred.toString() + "\n";
                });
            });
            returnString += "\n* Responder Influence Rules:\n";
            this.responderIRS.influenceRules.forEach(function(infRule) {
                returnString += "   " + infRule.weight + ":\n"
                infRule.predicates.forEach(function(pred) {
                    returnString += "      " + pred.toString() + "\n";
                });
            });
            returnString += "\n* Effects/Instantiations:\n";
            this.effects.forEach(function(effect) {
                returnString += "Effect " + effect.id + ": " + effect.referenceAsNaturalLanguage + "\n";
                returnString += "   Condition Rule: \n";
                effect.condition.predicates.forEach(function(pred) {
                    //returnString += "      " + pred.toNaturalLanguageString(pred.primary,pred.secondary) + "\n";
                    returnString += "      " + pred.toString() + "\n";
                });
                returnString += "   Change Rule: \n";
                effect.change.predicates.forEach(function(pred) {
                    //returnString += "      " + pred.toNaturalLanguageString(pred.primary,pred.secondary) + "\n";
                    returnString += "      " + pred.toString() + "\n";
                });
                returnString += "   Linked to instantiation " + effect.instantiationID + ":\n";
                var inst = this.getInstantiationById(effect.instantiationID);
                if (inst) {
                    if (inst.toc1)
            {
                if (inst.toc1.rawString != "")
            {
                returnString += "      %toc1%: " + inst.toc1.rawString + "\n";
            }
            }
                    if (inst.toc2)
                    {
                        if (inst.toc2.rawString != "")
                        {
                            returnString += "      %toc2%: " + inst.toc2.rawString + "\n";
                        }
                    }
                    if (inst.toc3)
                    {
                        if (inst.toc3.rawString != "")
                        {
                            returnString += "      %toc3%: " + inst.toc3.rawString + "\n";
                        }
                    }
                    returnString += "";
                    inst.lines.forEach(function(lod) {
                        returnString += "      Initiator: \"" + lod.initiatorLine + "\" (" + lod.initiatorBodyAnimation + ", " + lod.initiatorFaceAnimation + ", " + lod.initiatorFaceState + ")\n";
                        returnString += "      Responder: \"" + lod.responderLine + "\" (" + lod.responderBodyAnimation + ", " + lod.responderFaceAnimation + ", " + lod.responderFaceState + ")\n";
                        if (lod.otherLine != "")
                    {
                        returnString += "      Other: \"" + lod.otherLine + "\" (" + lod.otherBodyAnimation + ", " + lod.otherFaceAnimation + ", " + lod.otherFaceState + ")\n";
                    }
                    returnString += "      ---\n";
                    });
                }
                returnString += "\n";
            });

            return returnString;
        }

    }
    SocialGame.equals = function(x, y) {
        if (x.name != y.name) return false;
        if (x.intents.length != y.intents.length) return false;
        var i = 0;
        for (i = 0; i < x.intents.length; ++i) {
            if (!Rule.equals(x.intents[i], y.intents[i])) return false;
        }
        if (x.preconditions.length != y.preconditions.length) return false;
        for (i=0; i < x.preconditions.length; ++i) {
            if (!Rule.equals(x.preconditions[i], y.preconditions[i])) return false;
        }
        if (!Rule.equals(x.patsyRule, y.patsyRule)) return false;
        if (!InfluenceRuleSet.equals(x.initiatorIRS, y.initiatorIRS)) return false;
        if (!InfluenceRuleSet.equals(x.responderIRS, y.responderIRS)) return false;
        if (x.effects.length != y.effects.length) return false;
        for (i = 0; i < x.effects.length; ++i) {
            if (!Effect.equals(x.effects[i], y.effects[i])) return false;
        }
        if (x.instantiations.length != y.instantiations.length) return false;
        for (i = 0; i < x.instantiations.length; ++i) {
            if (!Instantiation.equals(x.instantiations[i], y.instantiations[i])) return false;
        }
        return true;
    }
    return SocialGame;
});
