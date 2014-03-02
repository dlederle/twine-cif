define(['CiFSingleton', 'Predicate', 'Rule', 'Effect', 'Util', 'SocialFactsDB'], function(CiFSingleton, Predicate, Rule, Effect, Util, SocialFactsDB) {

    /**
     * The SocialGameContext class is were the details of a played social game
     * (known as a historical context) are kept. Contexts are stored in the
     * SFDB for use by characters in the future.
     * <p>SocialGameContext confirms to the SFDBContext interface.</p>
     * @see CiF.SocialFactsDB
     * @see CiF.SFDBContext
     */
    /* <SFDB>
     *   <SocialGameContext gameName="conversational flirt" initiator="edward" responder="karen"
     * 		other="" initiatorScore="80" responderScore="40" time="4" effect="2" chosenCKBItem="black nail polish"
     * 		socialGameContextReference="2">
     * 			<Predciate type="cbk" .../>
     *   </SocialGameContext>
     *   <TriggerContext status="cheating" from="edward" to="karen">
     * </SFDB>
     *
     */

    var SocialGameContext = function() {
        this.isBackstory = false;
        this.queryCKB = new Predicate();
        this.gameName = "";
        this.effectID = -1;
        this.initiator = "";
        this.initiatorScore = -10000;
        this.label = "";
        this.labelArg1 = "";
        this.labelArg2 = "";
        this.labelArg3 = "";
        this.other = "";
        this.responder = "";
        this.responderScore = -10000;
        this.referenceSFDB = -1;
        this.time = -1;
        /**
         * The name of the item brought up in the performance realization
         * that involves a CKB entry.
         */
        this.chosenItemCKB;
        /**
         * The Performance Realization String -- used for BackstoryContexts
         * e.g. %i% walked %r% home after a rough day at school.
         */
        this.performanceRealizationString;
        /**
         * The name of the character that was the initiator.
         */
        this.initiator;
        /**
         * The name of the character that was the responder.
         */
        this.responder;
        /**
         * The name of a third party participating in a social game.
         */
        this.other;

        this.backstoryLocutions = [];
        this.SFDBLabels = [];

        /**********************************************************************
         * SFDBContext Interface implementation.
         *********************************************************************/
        this.getTime = function() { return this.time; }

        this.isSocialGame = function() { return true; }

        this.isJuice = function() { return false; }

        this.isTrigger = function() { return false; }

        this.isStatus = function() { return false; }

        /**
         * Returns a reference to the social game's change rule.
         *
         * <p>Might be good make a static class-level cif reference. Also,
         * returning a copy instead of a reference to the original rule might
         * be good.</p>
         * @return
         */
        this.getChange = function() {
            var cif = CiFSingleton.getInstance();
            //console.debug(this, "getChange() effectID=" + this.effectID);
            //make empty rule and bail early if this is a backstory
            if (this.isBackstory) return new Rule();
            var sg = cif.socialGamesLib.getByName(this.gameName);
            return cif.socialGamesLib.getByName(this.gameName).getEffectByID(this.effectID).change;
        }

        /**
         * This function returns the performance realization string associated
         * with the effect taken in the played social game.
         * @return	The performance realization string of the effect taken.
         */
        this.getEffectPerformanceRealizationString = function(initiator, responder, other,speaker) {
            var cif = CiFSingleton.getInstance();

            //console.debug(this, "getEffectPerformanceRealizationString() GameName: "+this.gameName+" effectID: "+this.effectID+" initiator: "+this.initiator+" responder: "+this.responder);
            if (!this.isBackstory) {
                return Effect.renderText(initiator, responder, other, this, speaker,cif.socialGamesLib.getByName(this.gameName).getEffectByID(this.effectID).locutions);
            }
            else {
                return Effect.renderText(initiator, responder, other, this, speaker,this.backstoryLocutions)
            }
        }

        this.getInitiator = function() {
            return CiFSingleton.getInstance().cast.getCharByName(this.initiator);
        }
        this.getResponder = function() {
            return CiFSingleton.getInstance().cast.getCharByName(this.responder);
        }
        this.getOther = function() {
            return CiFSingleton.getInstance().cast.getCharByName(this.other);
        }

        /**
         * Determines if the SocialGameContext represents a status change consistent
         * with the passed-in Predicate.
         * @param	p	Predicate to check for.
         * @param	x	Primary character.
         * @param	y	Secondary character.
         * @param	z	Tertiary character.
         * @return	True if the SocialGameContext's change is the same as the valuation
         * of p. False if not.
         */
        this.isPredicateInChange = function(p, x, y, z) {
            var cif = CiFSingleton.getInstance();
            //get a reference to the social game this context is about

            //if it is a backstory context and the predicate is of type SFDBLabel, see if the labels and characters match.
            if (this.isBackstory && p.type == Predicate.SFDBLABEL) {
                return isLabelAndCharactersInPredicate(p, x, y, z);
            }

            //bail if this social game context has no social game name
            if (this.gameName == "") return false;

            var sg = cif.socialGamesLib.getByName(this.gameName);
            //get a reference to the effect taken in ths social game
            var effect = sg.getEffectByID(this.effectID);

            //for each predicate in the change rule of the effect
            effect.change.predicates.forEach(function(predInChange) {
                //see if that predicates' structures match!
                if (Predicate.equalsValuationStructure(p, predInChange)) {
                    //see of the characters and roles match up
                    //if (x.characterName == "Zack" && y.characterName == "Cassie" && ((z)?(z.characterName == "Monica"):false))
                    //{
                    //console.debug(this, "isPredicateInChange() -- our debug case.");
                    //}
                    if (doPredicateRolesMatchCharacterVariables(predInChange, x, y, z, p))
                return true; //a match was found!
                }
            });
            return false; // no match was found
        }

        this.setCharacters = function(init, resp, oth) {
            this.initiator = init.characterName;
            this.responder = resp.characterName;
            if (oth) {
                this.other = oth.characterName;
            }
        }


        /**
         * Handles the evaluation in the special case of the context being a backstory context and
         * the predicate we're checking for is of type sfdb label. Since backstory contexts have no
         * corresponding social game and, therefore, no change rule, we need to look at the context's
         * properties (specifically, the sfdbLabel) to evaluate.
         * @param	p	Predicate to check for.
         * @param	x	Primary character.
         * @param	y	Secondary character.
         * @param	z	Tertiary character.
         * @return True if the predicate and characters match the backstory context.
         */
        this.isLabelAndCharactersInPredicate = function(p, x, y, z) {
            //the character variables of the predicate match those of this context
            if (doPredicateRolesMatchCharacterVariables(p, x, y, z)) {
                //if this is true, both the characters and the labels match -- evaluation is true.
                if (this.label == SocialFactsDB.getLabelByNumber(p.sfdbLabel))
                    return true;
            }
            return false;
        }

        /**
         * Determines if the character variable binding between the context and the predicate's
         * primary chacacter reference match. This is not bidirectional.
         *
         * @param	predInChange	A predicate in the context's change.
         * @param	x				Primary character of non-context predicate.
         * @param	y				secondary character of non-context predicate.
         * @param	z				Tertiary character of non-context predicate.
         * @return	True if the character names in context's predicates primary
         * character variable matches the character names from the non-context
         * character variables, x,y, and z.
         */
        var doesPredicatePrimaryMatch = function(predInEvalRule, predInChange, x, y, z) {
            var characterReferedToInEvalRule;
            var characterReferedToInPredInChange;

            //1 - get the character refered to in predInEvalRule.primary
            // To do this, match the getPrimaryValue() return (i,r,o) with the appropriate x, y, or z.

            switch(predInEvalRule.getPrimaryValue()) {
                case "initiator":
                case "x":
                    characterReferedToInEvalRule = x.characterName;
                    break;
                case "responder":
                case "y":
                    characterReferedToInEvalRule = y.characterName;
                    break;
                case "other":
                case "z":
                    characterReferedToInEvalRule = z.characterName;
                    break;
                case "":
                    characterReferedToInEvalRule = "";
                    break;
                default:
                    characterReferedToInEvalRule = predInEvalRule.primary;
                    //it's a character name
            }

            //2 - get the character refered to  in predInChange.primary
            // To do this, match the getPrimaryValue() return (i,r,o) with the context's i, r, o.
            switch(predInChange.getPrimaryValue()) {
                case "initiator":
                case "x":
                    characterReferedToInPredInChange = this.initiator;
                    break;
                case "responder":
                case "y":
                    characterReferedToInPredInChange = this.responder;
                    break;
                case "other":
                case "z":
                    characterReferedToInPredInChange = this.other;
                    break;
                case "":
                    characterReferedToInPredInChange = "";
                    break;
                default:
                    characterReferedToInPredInChange = predInChange.primary;
                    //it's a character name
            }

            //3 - compare!
            if (characterReferedToInEvalRule == characterReferedToInPredInChange) return true;
            return false;
        }

        /**
         * Determines if the character variable binding between the context and the predicate's
         * secondary chacacter reference match. This is not bidirectional.
         * @param	predInChange	A predicate in the context's change.
         * @param	x				Primary character of non-context predicate.
         * @param	y				secondary character of non-context predicate.
         * @param	z				Tertiary character of non-context predicate.
         * @return	True if the character names in context's predicates secondary
         * character variable matches the character names from the non-context
         * character variables, x,y, and z.
         */
        var doesPredicateSecondaryMatch = function(predInEvalRule, predInChange, x, y, z) {
            var characterReferedToInEvalRule;
            var characterReferedToInPredInChange;

            //1 - get the character refered to in predInEvalRule.primary
            // To do this, match the getPrimaryValue() return (i,r,o) with the appropriate x, y, or z.

            switch(predInEvalRule.getSecondaryValue()) {
                case "initiator":
                case "x":
                    characterReferedToInEvalRule = x.characterName;
                    break;
                case "responder":
                case "y":
                    characterReferedToInEvalRule = y.characterName;
                    break;
                case "other":
                case "z":
                    characterReferedToInEvalRule = z.characterName;
                    break;
                case "":
                    characterReferedToInEvalRule = "";
                    break;
                default:
                    characterReferedToInEvalRule = predInEvalRule.secondary;
                    //it's a character name
            }

            //2 - get the character refered to  in predInChange.primary
            // To do this, match the getPrimaryValue() return (i,r,o) with the context's i, r, o.
            switch(predInChange.getSecondaryValue()) {
                case "initiator":
                case "x":
                    characterReferedToInPredInChange = this.initiator;
                    break;
                case "responder":
                case "y":
                    characterReferedToInPredInChange = this.responder;
                    break;
                case "other":
                case "z":
                    characterReferedToInPredInChange = this.other;
                    break;
                case "":
                    characterReferedToInPredInChange = "";
                    break;
                default:
                    characterReferedToInPredInChange = predInChange.secondary;
                    //it's a character name
            }

            //3 - compare!
            if (characterReferedToInEvalRule == characterReferedToInPredInChange) return true;
            return false;
        }

        /**
         * Determines if the character variable binding between the context and the predicate's
         * tertiary chacacter reference match. This is not bidirectional.
         * @param	predInChange	A predicate in the context's change.
         * @param	x				Primary character of non-context predicate.
         * @param	y				secondary character of non-context predicate.
         * @param	z				Tertiary character of non-context predicate.
         * @return	True if the character names in context's predicates tertiary
         * character variable matches the character names from the non-context
         * character variables, x,y, and z.
         */
        var doesPredicateTertiaryMatch = function(predInEvalRule, predInChange, x, y, z) {
            var characterReferedToInEvalRule;
            var characterReferedToInPredInChange;

            //1 - get the character refered to in predInEvalRule.primary
            // To do this, match the getPrimaryValue() return (i,r,o) with the appropriate x, y, or z.

            switch(predInEvalRule.getTertiaryValue()) {
                case "initiator":
                case "x":
                    characterReferedToInEvalRule = x.characterName;
                    break;
                case "responder":
                case "y":
                    characterReferedToInEvalRule = y.characterName;
                    break;
                case "other":
                case "z":
                    characterReferedToInEvalRule = z.characterName;
                    break;
                case "":
                    characterReferedToInEvalRule = "";
                    break;
                default:
                    characterReferedToInEvalRule = predInEvalRule.tertiary;
                    //it's a character name
            }

            //2 - get the character refered to  in predInChange.primary
            // To do this, match the getPrimaryValue() return (i,r,o) with the context's i, r, o.
            switch(predInChange.getTertiaryValue()) {
                case "initiator":
                case "x":
                    characterReferedToInPredInChange = this.initiator;
                    break;
                case "responder":
                case "y":
                    characterReferedToInPredInChange = this.responder;
                    break;
                case "other":
                case "z":
                    characterReferedToInPredInChange = this.other;
                    break;
                case "":
                    characterReferedToInPredInChange = "";
                    break;
                default:
                    characterReferedToInPredInChange = predInChange.tertiary;
                    //it's a character name
            }

            //3 - compare!
            if (characterReferedToInEvalRule == characterReferedToInPredInChange) return true;
            return false;
        }

        /**
         * Determines if the character names in context's predicates primary, secondary,
         * and tertiary character variables match the character names from the non-context
         * character variables x,y, and z respectively.
         * @param	predInChange	A predicate in the context's change.
         * @param	x				Primary character of non-context predicate.
         * @param	y				secondary character of non-context predicate.
         * @param	z				Tertiary character of non-context predicate.
         * @return	True if the character names in context's predicates primary, secondary,
         * and tertiary character variables match the character names from the non-context
         * character variables x,y, and z respectively.
         */
        var doPredicateRolesMatchCharacterVariables = function(predInChange, x, y, z, predInEvalRule) {
            /*The trick to this function is that the x,y, and z are in correspondence with the predicates primary
             * secondary, and tertiary character variables. This means we need to translate the predicates character
             * variables to actual character names (if they are roles and not direct character names inititally) via
             * the name<=>role mapping in the this SocialGameContext.
             */


            if (Util.xor(x != undefined, predInChange.primary != undefined)) return false; //only one exists
            if (Util.xor(y != undefined, predInChange.secondary != undefined)) return false; //only one exists

            //z is a case we want to ignore as it is likely to be in the context but no in the evaluation.
            //We want to be lax in this case.
            //if (Util.xor(z!=undefined, predInChange.tertiary!=undefined)) return false; //only one exists

            //relationships are bi-directional; the primary and secondary can flip around accordingly.
            if (predInChange.type == Predicate.RELATIONSHIP) {
                var result;
                var temp;
                //the case where the ordering matches
                result = this.doesPredicatePrimaryMatch(predInEvalRule, predInChange, x, y, z) && this.doesPredicateSecondaryMatch(predInEvalRule, predInChange, x, y, z);
                if (result) {
                    return true;
                }

                //the other side of the bi-directional relationship where the ordering is flipped
                temp = predInChange.primary;
                predInChange.primary = predInChange.secondary;
                predInChange.secondary = temp;

                result = this.doesPredicatePrimaryMatch(predInEvalRule, predInChange, x, y, z) && this.doesPredicateSecondaryMatch(predInEvalRule, predInChange, x, y, z);

                temp = predInChange.primary;
                predInChange.primary = predInChange.secondary;
                predInChange.secondary = temp;

                if (result) {
                    return true;
                }
                else return false;
            }

            if (!this.doesPredicatePrimaryMatch(predInEvalRule, predInChange, x, y, z)) return false;
            if (!this.doesPredicateSecondaryMatch(predInEvalRule, predInChange, x, y, z)) return false;
            if (!this.doesPredicateTertiaryMatch(predInEvalRule, predInChange, x, y, z)) return false;
            return true;
        }

        /**
         * Determines if the passed-in parameters of label and characters match the SFDBLabel and
         * characters related to the label in this SocialGameContext. If this context is a backstory
         * context, the first and second character parameters must match the context's initiator and
         * responder respectively. If it is a non-backstory context, the first and second character
         * parameters must match the labelArg1 and labelArg2 properties respectively.
         * @param	label			The label to match. If -1 is passed in, all labels are considered to match.
         * @param	firstCharacter	The first character paramter.
         * @param	secondCharacter	The second character parameter.
         * @param	thirdCharacter	The third character paramter (not currently used).
         * @return	True if this context is a match to the paramters. False if not a match.
         */
        this.doesSFDBLabelMatch = function(label, firstCharacter, secondCharacter, thirdCharacter, pred) {
            var testBool = false;
            if (this.isBackstory) {
                //-1 means any label matches
                if (label != -1)
                    //if not wildcard, label must match
                    if (this.label != SocialFactsDB.getLabelByNumber(label)) return false;
                //if firstCharacter is undefined, treat it as a wildcard.
                if (firstCharacter)
                    //in backstory contexts, the firstCharacter's name must always match the context's initiator if firstCharacter exists
                    if (this.initiator.toLowerCase() != firstCharacter.characterName.toLowerCase()) return false;
                //if secondCharacter is undefined or if the label is not directed, treat it as a wildcard.
                //Note: right now we only have directed labels
                if (secondCharacter)
                    //if not undefined, secondCharacter's name must match the context's responder
                    if (this.responder.toLowerCase() != secondCharacter.characterName.toLowerCase()) return false;

                //If we've made it to this point, it seems like we have a match!  we should return true!
                return true;
            }else {
                if (this.SFDBLabels) {//the multi-SFDBLabel way
                    this.SFDBLabels.forEach(function(sfdblabel) {
                        testBool = true;
                        if (!(label == -1 || SocialFactsDB.doesMatchLabelOrCategory(SocialFactsDB.getLabelByName(sfdblabel.type),label)))
                    {
                        //if the label doesn't match and it isn't a wildcard FAIL
                        testBool = false;
                    }

                    if (firstCharacter)
                    {
                        if (firstCharacter.characterName.toLowerCase() != sfdblabel.from.toLowerCase())
                    {
                        testBool = false;
                    }
                    }
                    if (secondCharacter)
                    {
                        if (secondCharacter.characterName.toLowerCase() != sfdblabel.to.toLowerCase())
                    {
                        testBool = false;
                    }
                    }


                    if (testBool)
                    {
                        return true;
                    }
                    });
                }
            }
            return false;
        }

        /**
         * This one is used with numTimesUniquelyTrue sfdb label predicates
         * Determines if the passed-in parameters of label and characters match the SFDBLabel and
         * characters related to the label in this SocialGameContext. If this context is a backstory
         * context, the first and second character parameters must match the context's initiator and
         * responder respectively. If it is a non-backstory context, the first and second character
         * parameters must match the labelArg1 and labelArg2 properties respectively.
         * @param	label			The label to match. If -1 is passed in, all labels are considered to match.
         * @param	firstCharacter	The first character paramter.
         * @param	secondCharacter	The second character parameter.
         * @param	thirdCharacter	The third character paramter (not currently used).
         * @return	True if this context is a match to the paramters. False if not a match.
         */
        this.doesSFDBLabelMatchStrict = function(label, firstCharacter, secondCharacter, thirdCharacter, pred) {
            if (this.isBackstory) {
                //-1 means any label matches
                if (label != -1)
                    //if not wildcard, label must match
                    if (this.label != SocialFactsDB.getLabelByNumber(label)) return false;
                //if firstCharacter is undefined, treat it as a wildcard.
                if (firstCharacter)
                    //in backstory contexts, the firstCharacter's name must always match the context's initiator if firstCharacter exists
                    if (this.initiator.toLowerCase() != firstCharacter.characterName.toLowerCase()) return false;
                //if secondCharacter is undefined or if the label is not directed, treat it as a wildcard.
                //Note: right now we only have directed labels
                if (secondCharacter)
                    //if not undefined, secondCharacter's name must match the context's responder
                    if (this.responder.toLowerCase() != secondCharacter.characterName.toLowerCase()) return false;

                //We got through all of the tests!  That means we've succeeded!
                return true;
            }else {
                if (this.SFDBLabels) {//the multi-SFDBLabel way
                    this.SFDBLabels.forEach(function(sfdblabel) {
                        if (label == -1 || SocialFactsDB.doesMatchLabelOrCategory(SocialFactsDB.getLabelByName(sfdblabel.type),label))
                    {
                        //in here either the label matches or it is a wild card. check characaters
                        if (sfdblabel.from == firstCharacter.characterName)
                    {
                        if (secondCharacter)
                    {
                        if (secondCharacter.characterName == sfdblabel.to)
                    {
                        return true;
                    }
                    }
                        else if (sfdblabel.to == "")
                    {
                        return true;
                    }
                    }
                    //no first character was present here -- move on to the next (by doing nothing).
                    }
                    });
                    return false;
                }
            }
            return false;
        }

        /**********************************************************************
         * Utility functions.
         *********************************************************************/
        this.clone = function() {
            var sgc = new SocialGameContext();
            sgc.gameName = this.gameName;
            sgc.initiator = this.initiator;
            sgc.responder = this.responder;
            sgc.other = this.other;
            sgc.initiatorScore = this.initiatorScore;
            sgc.responderScore = this.responderScore;
            sgc.effectID = this.effectID;
            sgc.time = this.time;
            sgc.chosenItemCKB = this.chosenItemCKB;
            sgc.queryCKB = this.queryCKB;
            sgc.referenceSFDB = this.referenceSFDB;

            sgc.label = this.label;
            sgc.labelArg1 = this.labelArg1;
            sgc.labelArg2 = this.labelArg2;
            sgc.labelArg3 = this.labelArg3;

            sgc.performanceRealizationString = this.performanceRealizationString;
            sgc.isBackstory = this.isBackstory;
            sgc.backstoryLocutions = this.backstoryLocutions.slice(0);
            sgc.SFDBLabels = this.SFDBLabels.slice(0, this.SFDBLabels.length-1);

            return sgc;
        }

    }
    SocialGameContext.equals = function(x, y) {
        if (x.gameName != y.gameName) return false;
        if (x.initiator != y.initiator) return false;
        if (x.responder != y.responder) return false;
        if (x.other != y.other) return false;
        if (x.initiatorScore != y.initiatorScore) return false;
        if (x.responderScore != y.responderScore) return false;
        if (x.effectID != y.effectID) return false;
        if (x.time != y.time) return false;
        if (x.chosenItemCKB != y.chosenItemCKB) return false;
        //if (!Predicate.equals(x.queryCKB,y.queryCKB)) return false;
        if (x.referenceSFDB != y.referenceSFDB) return false;

        if (x.label != y.label) return false;
        if (x.labelArg1 != y.labelArg1) return false;
        if (x.labelArg2 != y.labelArg2) return false;
        if (x.labelArg3 != y.labelArg3) return false;

        if (x.performanceRealizationString != y.performanceRealizationString) return false;
        if (x.isBackstory != y.isBackstory) return false;

        if (x.SFDBLabels.length != y.SFDBLabels.length) return false;

        for (var i = 0; i <  x.SFDBLabels.length; ++i ) {
            if (!SFDBLabel.equals(x.SFDBLabels[i], y.SFDBLabels[i])) return false;
        }

        return true;
    }
    return SocialGameContext;
});
