define(['min-cif/Status', 'min-cif/Predicate', 'min-cif/Trigger', 'min-cif/CiFSingleton', 'min-cif/SocialFactsDB', 'min-cif/Util'], function(Status, Predicate, Trigger, CiFSingleton, SocialFactsDB, Util) {
    /**
     * Consists of a predicate and a time.
     */
    var TriggerContext = function() {
        this.time = -1;
        this.id;
        this.initiator;
        this.responder;
        this.other;
        this.statusTimeoutChange;
        this.SFDBLabels = [];

        /**********************************************************************
         * SFDBContext Interface implementation.
         *********************************************************************/
        this.getTime = function() { return this.time; }

        this.isSocialGame = function() { return false; }

        this.isTrigger = function() { return true; }

        this.isJuice = function() { return false; }

        this.isStatus = function() { return false; }

        this.getChange = function() {
            if(this.id === Trigger.STATUS_TIMEOUT_TRIGGER_ID) {
                return statusTimeoutChange;

            }
            var trigger = CiFSingleton.getInstance().sfdb.getTriggerByID(this.id);
            return trigger.change;
        }

        this.getCondition = function() {
            var trigger = CiFSingleton.getInstance().sfdb.getTriggerByID(this.id);
            return trigger.condition;
        }

        /**
         * Determines if the TriggerContext represents a status change consistent
         * with the passed-in Predicate.
         * @param	p	Predicate to check for.
         * @param	x	Primary character.
         * @param	y	Secondary character.
         * @param	z	Tertiary character.
         * @return	True if the StatusContext's change is the same as the valuation
         * of p. False if not.
         */
        this.isPredicateInChange = function(p, x, y, z) {
            var cif = CiFSingleton.getInstance();
            var changeRule = this.getChange();
            changeRule.predicates.forEach(function(predInChange) {
                if(Predicate.equalsValuationStructure(p, predInChange)) {
                    if(doPredicateRolesMatchCharacterVariables(predInChange, x, y, z, p)) {
                        return true;
                    }
                }
            });
            return false;
        }

        this.doesSFDBLabelMatch = function(label, firstCharacter, secondCharacter, thirdCharacter, pred) {
            var testBool = false;
            if(this.SFDBLabels) {
                this.SFDBLabels.forEach(function(sfdblabel) {
                    testBool = true;
                    if(!(label == -1 || SocialFactsDB.doesMatchLabelOrCategory(SocialFactsDB.getLabelByNames(sfdblabel.type), label))) {
                        testBool = false;

                    }
                    if(firstCharacter &&
                       firstCharacter.characterName != sfdblabel.from) {
                        testBool = false;
                    }

                    if(secondCharacter &&
                       secondCharacter.characterName != sfdblabel.to) {
                        testBool = false;
                    }

                    if(testBool) { return true; }
                });
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
         *
		 * @param	label			The label to match. If -1 is passed in, all labels are considered to match.
		 * @param	firstCharacter	The first character paramter.
		 * @param	secondCharacter	The second character parameter.
		 * @param	thirdCharacter	The third character paramter (not currently used).
		 * @return	True if this context is a match to the paramters. False if not a match.
		 */
		this.doesSFDBLabelMatchStrict = function(label, firstCharacter, secondCharacter, thirdCharacter, pred) {
			if (this.SFDBLabels) {//the multi-SFDBLabel way
                this.SFDBLables.forEach(function(sfdblabel) {
					if (label == -1 || SocialFactsDB.doesMatchLabelOrCategory(SocialFactsDB.getLabelByName(sfdblabel.type),label)) {
						//in here either the label matches or it is a wild card. check characaters
						if (sfdblabel.from == firstCharacter.characterName) {
							if (secondCharacter) {
								if (secondCharacter.characterName == sfdblabel.to) {
									return true;
								}
							}
							else if (sfdblabel.to == "") {
								return true;
							}
						}
						//no first character was present here -- move on to the next (by doing nothing).
					}
				});
				return false;
			}
			return false;
		}

		/**
		 * Determines if the character variable binding between the context and the predicate's
		 * primary chacacter reference match. This is not bidirectional.
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
                else { return false; }
			}

			if (!this.doesPredicatePrimaryMatch(predInEvalRule, predInChange, x, y, z)) return false;
			if (!this.doesPredicateSecondaryMatch(predInEvalRule, predInChange, x, y, z)) return false;
			if (!this.doesPredicateTertiaryMatch(predInEvalRule, predInChange, x, y, z)) return false;
			return true;
		}

        this.clone = function() {
            var tc = new TriggerContext();
            tc.time = this.time;
            tc.id = this.id;
            tc.SFDBLabels = tis.SFDBLabels.slice(0);
            return tc;
        }
    }

    return TriggerContext;

});
