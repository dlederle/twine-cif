define(["min-cif/CiFSingleton", "min-cif/Rule", "min-cif/SocialNetwork", "min-cif/BuddyNetwork", "min-cif/RomanceNetwork", "min-cif/CoolNetwork", "min-cif/Util", "min-cif/Cast", "min-cif/CulturalKB"], function(CiFSingleton, Rule, SocialNetwork, BuddyNetwork, RomanceNetwork, CoolNetwork, Util, Cast, CulturalKB) {
    /**
     * @class Predicate
     * The Predicate class is the terminal and functional end of the logic
     * constructs in CiF. All rules, influence rules, rule sets, and social
     * changes are composed of predicates.
     *
     * <p>Predicates have two major functions: evaluation (to determine truth
     * given the current social state) and valuation (to modify the current
     * social state). Each type of predicate has its own valuation and evaluation
     * functions to enact the logical statement within CiFs data structures.</p>
     *
     */

    var Predicate = function() {
        this.type = -1;
        this.trait = -1;
        this.description = "";
        this.primary = "";
        this.secondary = "";
        this.tertiary = "";
        this.networkValue = 0;
        this.comparator = "~";
        this.status = -1;
        this.networkType = -1;
        this.firstSubjectiveLink = "";
        this.secondSubjectiveLink = "";
        this.truthLabel = "";
        this.negated = false;
        this.window = 0;
        this.isSFDB = false;
        this.sfdbLabel = -1;
        this.intent = false;
        this.currentGameName = "";
        this.numTimesUniquelyTrueFlag = false;
        this.numTimesUniquelyTrue = 0;
        this.numTimesRoleSlot = "";
        this.sfdbOrder = 0;
        Predicate.creationCount++;

        // Getters and Setters
        this.getFirst = function() {
            return this.primary;
        }
        this.getPrimary = this.getFirst;

        this.getSecond = function() {
            return this.secondary;
        }
        this.getSecondary = this.getSecond;

        /**
         * @param {String} first
         */
        this.setFirst = function(first) {
            this.primary = first;
        }
        this.setPrimary = this.setFirst;

        /**
         * @param {String} second
         */
        this.setSecond = function(second) {
            this.secondary = second;
        }
        this.setSecondary = this.setSecondary;

        // Predicate Initializers

        /**
         * Initializes this instance of the Predicate class as a trait or ~trait
         * predicate.
         * @example <listing version="3.0">
         * var p = new Predicate();
         * p.setTraitPredicate("x", Trait.SEX_MAGNET, Predicate.NOTTRAIT);
         * </listing>
         * @param	first The character variable to which this predicate applies.
         * @param	trait The enumerated representation of a trait.
         * @param	isNegated True if the predicate is to be negated.
         */

        this.setTraitPredicate = function(first, trait, isNegated, isSFDB) {
            this.type = Predicate.TRAIT;
            this.trait = trait || 0;
            this.primary = first || "initiator";
            this.negated = isNegated || false;
            this.isSFDB = isSFDB || false;
        }

        /**
         * Initializes this instance of the Predicate class as a network
         * predicate.
         * TODO: list the types of permissible network comparisions.
         * @example <listing version="3.0">
         * var p = new Predicate();
         * p.setNetworkPredicate("x", "y", "", 70, SocialNetwork.ROMANCE);
         * </listing>
         * @param	first The character variable of the first predicate parameter.
         * @param	second The character variable of the second predciate parameter.
         * @param	operator The comparision or valuation operation to perform the
         * network predicate evaulation or valuation by.
         * @param	networkValue The network value used in the comparison.
         * @param	networkType The network on which the comparison is to be made.
         */
        this.setNetworkPredicate = function(first, second, op, networkValue, networkType, isNegated, isSFDB) {
            this.type = Predicate.NETWORK;
            this.networkValue = networkValue || 0;
            this.networkType = networkType || 0
                this.primary = first || "initiator";
            this.secondary = second || "responder";
            this.comparator = op || "lessthan";
            this.operator = op || "lessthan";
            this.negated = isNegated || false;
            this.isSFDB = isSFDB || false;
        }
        /**
         * Initializes this instance of the Predicate class as a relationship
         * predicate.
         *
         * @param	first The character variable of the first predicate parameter.
         * @param	second The character variable of the second predciate parameter.
         * @param	relationship The relationship of the predicate.
         * @param	type The type of the predicate as either Predicate.RELATIONSHIP (default)
         * or Predicate.NOTRELATIONSHIP (have to include as an argument).
         */
        this.setRelationshipPredicate = function(first, second, relationship, isNegated, isSFDB) {
            this.type = Predicate.RELATIONSHIP;
            this.primary = first || "initiator";
            this.secondary = second || "responder";
            this.relationship = relationship || 0;
            this.negated = isNegated || false;
            this.isSFDB = isSFDB || false;
        }

        /**
         * Initializes this instance of the Predicate class as a status
         * predicate.
         *
         * @example <listing version="3.0">
         * var p = new Predicate();
         * p.setStatusPredciate("x", "y", Status.HAS_CRUSH);
         * </listing>
         *
         * @param	first The character variable of the first predicate parameter.
         * @param	second The character variable of the second predciate parameter.
         * @param	status The status of the predicate.
         * @param	type The type of the predicate as either Predicate.STATUS (default)
         * or Predicate.NOTSTATUS (have to include as an argument).
         */
        this.setStatusPredicate = function(first, second, status, isNegated, isSFDB) {
            this.type = Predicate.STATUS;
            this.primary = first || "initiator";
            this.secondary = second || "responder";
            this.status = status || 0;
            this.negated = isNegated;
            this.isSFDB = isSFDB;
        }

        /**
         * Initializes the Predicate as a CKB predicate.
         *
         * @example <listing version="3.0"> 
         * var p:Predicate = new Predicate();
         * p.setCKBPredciate("x", "y", "likes", "dislikes", "cool");
         * </listing>
         * @param	first Character variable of the first parameter.
         * @param	second Character variable of the second parameter.
         * @param	firstSub Subjective link to the item from the first character.
         * @param	secondSub Subjective link to the item from the second character.
         * @param	truth The truth label of the item.
         * @param	negated true means that the predicate IS negated (i.e. these conditions must NOT exist for the predicate to be evaluated to true)
         */
        this.setCKBPredicate = function(first, second, firstSub, secondSub, truth, isNegated) {
            this.type = Predicate.CKBENTRY;
            this.primary = first || "initiator";
            this.secondary = second || "responder";
            this.firstSubjectiveLink = firstSub || "likes";
            this.secondSubjectiveLink = secondSub || "likes";
            this.truthLabel = truth || "cool";
            this.negated = isNegated || false;
        }

        /**
         * Initializes the Predicate as a CURRENTSOCIALGAME predicate.
         * @example <listing version="3.0">
         * var p = new Predicate();
         * p.setCurrentSocialGamePredicate("True Love's Kiss", true);
         * </listing>
         * @param	name	Name of to check the current social game's name against.
         * @param	negated true means that the predicate IS negated (i.e. these conditions must NOT exist for the predicate to be evaluated to true)
         */
        this.setCurrentSocialGamePredicate = function(name, isNegated) {
            this.type = Predicate.CURRENTSOCIALGAME;
            this.currentGameName = name || "brag";
            this.negated = isNegated || false;
        }

        /**
         * Modifies the type of the predicate to make it an SFDB entry or make
         * it not a SFDB entry. The subType and the type are swapped or otherwise
         * modified to mark the predicate as or not a SFDB entry.
         */
        this.makeSFDB = function() {
            this.isSFDB = true;
        }

        /**
         * Makes the predicate not an SFDB entry. SFDBLABEL type Predicates
         * cannot have their isSFDB property undone.
         */
        this.undoSFDB = function() {
            //SFDBLABEL types of predicates must be SFDB
            if (Predicate.SFDBLABEL === this.type) {
                console.debug(this, "undoSFDB(): instances of Predicate with the type of SFDBLABEL have their isSFDB flag set to false");
            } else {
                this.isSFDB = false;
            }
        }

        /**
         * Initializes the predicate to be of type SFDBLABEL. This is the only
         * initiator that sets the the isSFDB flag to true. Predicates of type
         * SFDBLABEL are invalid of their isSFDB is false.
         * @param	first Character variable of the first parameter.
         * @param	second Character variable of the second parameter.
         * @param	sfdbLabel The specific SFDB label.
         * @param	isNegated The truth label of the item.
         */
        this.setSFDBLabelPredicate = function(first, second, label, isNegated, window1) {
            this.isSFDB = true;
            this.primary = first  = "initiator";
            this.secondary = second = "responder";
            this.type = Predicate.SFDBLABEL;
            this.negated = isNegated || false;
            this.sfdbLabel = label || 0;
            this.window = window1 || 0;
        }

        /**
         * Initializes the predicate by type enumeration. Default values are
         * assigned according to the type provided.
         * @param	t	An enumerated value that corresponds to a predicate type.
         */
        this.setByTypeDefault = function(t) {
            switch (t) {
                case Predicate.TRAIT:
                    this.setTraitPredicate();
                    break;
                case Predicate.NETWORK:
                    this.setNetworkPredicate();
                    break;
                case Predicate.STATUS:
                    this.setStatusPredicate();
                    break;
                case Predicate.CKBENTRY:
                    this.setCKBPredicate();
                    break;
                case Predicate.SFDBLABEL:
                    this.setSFDBLabelPredicate();
                    break;
                case Predicate.RELATIONSHIP:
                    this.setRelationshipPredicate();
                    break;
                case Predicate.CURRENTSOCIALGAME:
                    this.setCurrentSocialGamePredicate();
                    break;
                default:
                    console.debug(this, "setByTypeDefault(): unknown type found.");
            }
        }

        /**
         * Determines the value class of the primary property and returns a
         * value based on that class. If it is a role class, "initiator",
         * "responder" or "other" will be returned. If it is a variable class,
         * "x","y" or "z" will be returned. If it is anything else (character
         * name or a mispelling), the raw value will be returned.
         * @return The value based on the value class of the primary property.
         */
        this.getPrimaryValue = function() {
            var cif = CiFSingleton.getInstance();
            switch (this.primary.toLowerCase()) {
                case "init":
                case "initiator":
                case "i":
                    return "initiator"
                case "r":
                case "res":
                case "responder":
                        return "responder";
                case "o":
                case "oth":
                case "other":
                        return "other";
                case "x":
                        return "x";
                case "y":
                        return "y";
                case "z":
                        return "z";
                case "":
                        return "";
                        console.debug(this, "getPrimaryValue(): primary was not set.");
                default:
                        if (cif.cast.getCharByName(this.primary))
                            return this.primary;
                        console.debug(this, "getPrimaryValue() primary could not be placed in a known class: " + this.primary + " " + this);
            }
            return "";
        }

        /**
         * Determines the value class of the secondary property and returns a
         * value based on that class. If it is a role class, "initiator",
         * "responder" or "other" will be returned. If it is a variable class,
         * "x","y" or "z" will be returned. If it is anything else (character
         * name or a mispelling), the raw value will be returned.
         * @return The value based on the value class of the secondary property.
         */
        this.getSecondaryValue = function() {
            var cif = CiFSingleton.getInstance();
            switch (this.secondary.toLowerCase()) {
                case "i":
                case "init":
                case "initiator":
                    return "initiator"
                case "r":
                case "res":
                case "responder":
                        return "responder";
                case "o":
                case "oth":
                case "other":
                        return "other";
                case "x":
                        return "x";
                case "y":
                        return "y";
                case "z":
                        return "z";
                case "":
                        //console.debug(this, "getSecondaryValue(): secondary was not set.");
                        return "";
                default:
                        if (cif.cast.getCharByName(this.secondary))
                            return this.secondary;
                        //console.debug(this, "getSecondaryValue() primary could not be placed in a known class: " + this.secondary);
            }
            return "";
        }

        /**
         * Determines the value class of the tertiary property and returns a
         * value based on that class. If it is a role class, "initiator",
         * "responder" or "other" will be returned. If it is a variable class,
         * "x","y" or "z" will be returned. If it is anything else (character
         * name or a mispelling), the raw value will be returned.
         * @return The value based on the value class of the teriary property.
         */
        this.getTertiaryValue = function() {
            var cif = CiFSingleton.getInstance();
            switch (this.tertiary.toLowerCase()) {
                case "i":
                case "init":
                case "initiator":
                    return "initiator"
                case "r":
                case "res":
                case "responder":
                        return "responder";
                case "o":
                case "oth":
                case "other":
                        return "other";
                case "x":
                        return "x";
                case "y":
                        return "y";
                case "z":
                        return "z";
                case "":
                        //console.debug(this, "getTertiaryValue(): tertiary was not set.");
                        return "";
                default:
                        if (cif.cast.getCharByName(this.tertiary))
                            return this.tertiary;
                        console.debug(this, "getTertiaryValue(): tertiary could not be placed in a known class: " + this.tertiary);
            }
            return "";
        }

        /**
         * Determines the names of any character who was
         * explicitly bound to a character variable in this predicate.
         * @return the names of any character who was
         * explicitly bound to a character variable in this predicate.
         */
        this.getBoundCharacterNames = function() {
            var boundCharNames = [];

            if (isVariableExplicitlyBound("primary"))
                boundCharNames.push(this.primary);
            if (isVariableExplicitlyBound("secondary"))
                boundCharNames.push(this.secondary);
            if (isVariableExplicitlyBound("teriary"))
                boundCharNames.push(this.tertiary);
            return boundCharNames;
        }

        /**
         * Determines if the character variable (either first, second, or third or primary, secondary, tertiary)
         * is explicitly bound to a character (i.e. this.first == "Edward").
         * @param variable	The string representation of a character variable. Can either be "first", "second", or "third".
         * @return true if the variable is explicitly bound to a character or false if not.
         */
        this.isVariableExplicitlyBound = function(variable) {
            var slot;
            var cif = CiFSingleton.getInstance();

            switch(variable) {
                case "first":
                case "primary":
                    slot = this.primary;
                    break;
                case "second":
                case "secondary":
                    slot = this.secondary;
                    break;
                case "third":
                case "teriary":
                    slot = this.tertiary
                        break;
                default:
                    console.debug(this, "isVariableExplicitlyBound() could not determine a character variable slot from: " + variable);
            }

            switch (slot.toLowerCase()) {
                case "i":
                case "init":
                case "initiator":
                case "r":
                case "res":
                case "responder":
                case "o":
                case "oth":
                case "other":
                case "x":
                case "y":
                case "z":
                case "":
                    //console.debug(this, "getTertiaryValue(): tertiary was not set.");
                    return false;
                default:
                    if (cif.cast.getCharByName(slot))
                        return true;
                    console.debug(this, "isVariableExplicitlyBound(): slot was not a role type or a recognized character. slot: " + slot.toLowerCase());
            }
            return false;
        }

        /**********************************************************************
         * Valuatation
         *********************************************************************/

        /**
         * Performs the predicate as a valuation (aka a change to the current game model/social state).
         * @param	first Character variable of the first predicate parameter.
         * @param	second Character variable of the second predicate parameter.
         * @param	third Character variable of the third predicate parameter.
         * @param   sg SocialGame
         */
        this.valuation = function(x, y, z, sg) {
            var first;
            var second;
            var third;

            var cif = CiFSingleton.getInstance();

            Predicate.valuationCount++;

            //trace(Predicate.getNameByType(this.type));

            /**
             * Need to determine if the predicate's predicate variables reference
             * roles (initiator,responder), generic variables (x,y,z), or
             * characters (edward, karen).
             */
            //if this.primary is not a reference to a character, determine if 
            //it is either a role or a generic variable
            if (!(first = cif.cast.getCharByName(this.primary))) {
                switch (this.getPrimaryValue()) {
                    case "initiator":
                    case "x":
                        first = x;
                        break;
                    case "responder":
                    case "y":
                        first = y;
                        break;
                    case "other":
                    case "z":
                        first = z;
                        break;
                    default:
                        //trace("Predicate: the first variable was not bound to a character!");
                        if(this.type != Predicate.CURRENTSOCIALGAME)
                            console.debug(this, "the first variable was not bound to a character; it could be a binding problem.");
                        //default first is not bound
                }
            }

            if (!(second = cif.cast.getCharByName(this.secondary))) {
                switch (this.getSecondaryValue()) {
                    case "initiator":
                    case "x":
                        second = x;
                        break;
                    case "responder":
                    case "y":
                        second = y;
                        break;
                    case "other":
                    case "z":
                        second = z;
                        break;
                    default:
                        second = null;
                }
            }

            if (!(third = cif.cast.getCharByName(this.tertiary))) {
                switch (this.getTertiaryValue()) {
                    case "initiator":
                    case "x":
                        third = x;
                        break;
                    case "responder":
                    case "y":
                        third = y;
                        break;
                    case "other":
                    case "z":
                        third = z;
                        break;
                    default:
                        third = null;
                }
            }

            /*var rtnstr = "first: ";
              rtnstr += first?first.characterName:"N/A" ;
              rtnstr += " second: ";
              rtnstr += second?second.characterName:"N/A";
              rtnstr += " type: ";
              rtnstr += getNameByType(this.type);
              console.debug(this, rtnstr); */

            /*
             * At this point only first has to be set. Any other bindings might
             * not be valid depending on the type of the predicate. For example
             * a CKBENTRY type could only have a first character variable
             * specified and would work properly. If second or third are not set
             * their value is set to null so the proper evaluation functions can
             * determine how to hand the different cases of character variable
             * specification.
             */

            switch (this.type)
            {
                case TRAIT:
                    console.debug(this, "Traits cannot be subject to valuation.");
                    break;
                case NETWORK:
                    updateNetwork(first, second);
                    break;
                case STATUS:
                    updateStatus(first, second);
                    break;
                case CKBENTRY:
                    console.debug(this, "CKBENTRIES cannot be subject to valuation.");
                    break;
                case SFDBLABEL:
                    //console.debug(this, "SFDBLABELs cannot be subject to valuation.");
                    break;
                case RELATIONSHIP:
                    updateRelationship(first, second);
                    break;
                case CURRENTSOCIALGAME:
                    console.debug(this, "CURRENTSOCIALGAMEs cannot be subject to valuation.");
                default:
                    console.debug(this, "preforming valuation a predicate without a recoginzed type.");
            }
        }

        /**
         * Updates the social status state with a status predicate via valuation.
         * @param	first Character variable of the first predicate parameter.
         * @param	second Character variable of the second predicate parameter.
         */
        var updateStatus = function(first, second) {
            if (this.negated)
                first.removeStatus(this.status, second);
            else
                first.addStatus(this.status, second);
        }

        /**
         * Updates the relationship state with a status predicate via valuation.
         * @param	first Character variable of the first predicate parameter.
         * @param	second Character variable of the second predicate parameter.
         */
        var updateRelationship = function(first, second) {
            var rel = RelationshipNetwork.getInstance();
            if (this.negated)
            {
                rel.removeRelationship(this.relationship, first, second);
                //rel.removeRelationship(this.relationship, second, first);
                //console.debug(this, "updateRelationship() " + RelationshipNetwork.getRelationshipNameByNumber(this.relationship) + "relationship removed.");
            }
            else
            {
                //console.debug(this, "updateRelationship() change reached." + this.toNaturalLanguageString(first.characterName, second.characterName,""));
                rel.setRelationship(this.relationship, first, second);
            }
        }

        /**
         * Updates a social network according to the Predicate's parameters via
         * valuation.
         * @param	first Character variable of the first predicate parameter.
         * @param	second Character variable of the second predicate parameter.
         */
        var updateNetwork = function(first, second) {
            var net;
            var firstID = first.networkID;
            var secondID;
            var cif = CiFSingleton.getInstance();
            var character;

            if (second)
                secondID = second.networkID;

            //get the proper singleton based on desired network type.
            if (this.networkType == SocialNetwork.BUDDY)
                net = BuddyNetwork.getInstance();
            if (this.networkType == SocialNetwork.ROMANCE)
                net = RomanceNetwork.getInstance();
            if(this.networkType == SocialNetwork.COOL)
                net = CoolNetwork.getInstance();

            switch (getOperatorByName(this.operator)) {
                case Predicate.ADD:
                    net.addWeight(this.networkValue, first.networkID, second.networkID);
                    break;
                case Predicate.SUBTRACT:
                    net.addWeight( -this.networkValue, first.networkID, second.networkID);
                    break;
                case Predicate.MULTIPLY:
                    net.multiplyWeight(first.networkID, second.networkID, this.networkValue);
                    break;
                case Predicate.ASSIGN:
                    net.setWeight(first.networkID, second.networkID, this.networkValue);
                    break;
                case Predicate.EVERYONEUP:
                    for (character in cif.cast.characters) {
                        net.addWeight(this.networkValue, character.networkID, firstID);
                    }
                    break;
                case Predicate.ALLFRIENDSUP:
                    for (character in cif.cast.characters) {
                        if (cif.relationshipNetwork.getRelationship(RelationshipNetwork.FRIENDS, first, second)
                                && first.characterName != character.characterName)
                            net.addWeight(this.networkValue, character.networkID, firstID);
                    }
                    break;
                case Predicate.ALLDATINGUP:
                    for (character in cif.cast.characters) {
                        if (cif.relationshipNetwork.getRelationship(RelationshipNetwork.DATING, first, second)
                                && first.characterName != character.characterName)
                            net.addWeight(this.networkValue, character.networkID, firstID);
                    }
                    break;
                case Predicate.ALLENEMYUP:
                    for (character in cif.cast.characters) {
                        if (cif.relationshipNetwork.getRelationship(RelationshipNetwork.ENEMIES, first, second)
                                && first.characterName != character.characterName)
                            net.addWeight(this.networkValue, character.networkID, firstID);
                    }
                    break;
            }
        }

		/**********************************************************************
		 * Predicate evalutation functions.
		 *********************************************************************/

		/**
		 * Evaluates the predicate for truth given the characters involved
		 * bound to the parameters. The process of evaluating truth depends
		 * on the type of the specific instance of the predicate.
		 * @param	first Character variable of the first predicate parameter.
		 * @param	second Character variable of the second predicate parameter.
		 * @param	third Character variable of the third predicate parameter.
		 * @return True of the predicate evaluates to true. False if it does not.
		 */
		this.evaluate = function(x, y, z, sg) {

			var first;
			var second;
			var third;
			var cif = CiFSingleton.getInstance();
			//there is a third character we need to account for.
			var isThird = false;
			var pred;
			var rule;
			var intentIsTrue = false;

			Predicate.evaluationCount++;

			/**
			 * Need to determine if the predicate's predicate variables reference
			 * roles (initiator,responder), generic variables (x,y,z), or
			 * characters (edward, karen).
			 */
			//if this.primary is not a reference to a character, determine if
			//it is either a role or a generic variable
			if (!(first = cif.cast.getCharByName(this.primary))) {
				switch (this.getPrimaryValue()) {
					case "initiator":
					case "x":
						first = x;
						break;
					case "responder":
					case "y":
						first = y;
						break;
					case "other":
					case "z":
						first = z;
						break;
					default:
						if(this.type != CURRENTSOCIALGAME)
							console.debug(this, "the first variable was not bound to a character!");
					//default first is not bound
				}
			}
			if (!(second = cif.cast.getCharByName(this.secondary))) {
				switch (this.getSecondaryValue()) {
					case "initiator":
					case "x":
						second = x;
						break;
					case "responder":
					case "y":
						second = y;
						break;
					case "other":
					case "z":
						second = z;
						break;
					default:
						second = null;
				}
			}

			if (!(third = cif.cast.getCharByName(this.tertiary))) {
				switch (this.getTertiaryValue()) {
					case "initiator":
					case "x":
						third = x;
						isThird = true;
						break;
					case "responder":
					case "y":
						third = y;
						isThird = true;
						break;
					case "other":
					case "z":
						third = z;
						isThird = true;
						break;
					default:
						isThird = false;
						third = null;
				}
			}

/*			var rtnstr:String = "first: ";
			rtnstr += first?first.characterName:"N/A" ;
			rtnstr += " second: ";
			rtnstr += second?second.characterName:"N/A";
			rtnstr += " type: ";
			rtnstr += getNameByType(this.type);
			console.debug(this, rtnstr);
*/
			/*
			 * At this point only first has to be set. Any other bindings might
			 * not be valid depending on the type of the predicate. For example
			 * a CKBENTRY type could only have a first character variable
			 * specified and would work properly. If second or third are not set
			 * their value is set to null so the proper evaluation functions can
			 * determine how to hand the different cases of character variable
			 * specification.
			 */

			/**
			 * If isSFDB is true, we want to look over the Predicate's window
			 * in the SFDB for this predicate's context. If found, the predicate
			 * is true. Otherwise, it is false.
			 *
			 * This is the only evaluation needed for a Predicate with isSFDB
			 * being true.
			 */
			if (this.isSFDB && this.type != Predicate.SFDBLABEL) {
				return evalIsSFDB(x, y, z, sg);
			}

			/*
			 * If the predicate is intent, we want to check it against all of the
			 * intent predicates in the intentent rule in the passed-in social game.
			 * If this predicate matches any predicate in any rule of the intent
			 * rule vector of the social game, we return true.
			 *
			 * Intents can only be networks and relationships.
			 */
			if (this.intent) {
				//console.debug(this, "evaluate() in intent processing. sg: " + sg);
				if (this.type == Predicate.RELATIONSHIP) {
					if (!sg.intents) {
						console.debug(this, "evaluate(): intent predicate evaluation: the social game context has no intent");
					} else {
						for (rule in sg.intents) {
							for (pred in rule.predicates) {
								if (pred.relationship == this.relationship &&
									pred.primary == this.primary &&
									pred.secondary == this.secondary &&
									pred.negated == this.negated) {

									return true;
								}
							}
						}
					}
				}
				//is it a network
				else if (this.type == Predicate.NETWORK) {
					if (!sg.intents) {
						console.debug(this, "evaluate(): intent predicate evaluation: the social game context has no intent");
					} else {
						for each(rule in sg.intents) {
							for each(pred in rule.predicates) {
								if (pred.networkType == this.networkType &&
									pred.comparator == this.comparator &&
									pred.primary == this.primary &&
									pred.secondary == this.secondary &&
									pred.negated == this.negated) {

									return true;
								}
							}
						}
					}
				}
				//is it a sfdbLabel
				else if (this.type == Predicate.SFDBLABEL)
				{
					if (!sg.intents) {
						console.debug(this, "evaluate(): intent predicate evaluation: the social game context has no intent");
					} else {
						for each(rule in sg.intents) {
							for each(pred in rule.predicates) {
								if (pred.sfdbLabel == this.sfdbLabel &&
									pred.primary == this.primary &&
									pred.secondary == this.secondary &&
									pred.negated == this.negated) {

									return true;
								}
							}
						}
					}
				}
				/* We either have no predicate match to the sg's intent rules
				 * or we are not a predicate type that can encompass intent. In
				 * either case, return false.
				 */
				return false;
			}

			if (numTimesUniquelyTrueFlag) {
				//console.debug(this, this.toString());
				var numTimesResult = evalForNumberUniquelyTrue(first, second, third, sg);
				return (this.negated) ? !numTimesResult : numTimesResult;
			}

			switch (this.type)
			{
				case TRAIT:
					return this.negated ? !evalTrait(first) : evalTrait(first);
				case NETWORK:
					//var isNetworkEvalTrue:Boolean = this.negated ? !evalNetwork(first, second) : evalNetwork(first, second);
					//console.debug(this, "evaluate() ^ returned " + isNetworkEvalTrue);
					return evalNetwork(first, second);
				case STATUS:
					//if (first == null) console.debug(this, "found it: "+this.toString());
					return this.negated ? !evalStatus(first, second) : evalStatus(first, second);
				case CKBENTRY:
					return evalCKBEntry(first, second);
				case SFDBLABEL:
					return evalSFDBLABEL(first, second, third);
				case RELATIONSHIP:
					//console.debug(this, "Going in here: "+this.toString() + " first: " + first.characterName);
					//console.debug(this, "Going in here: "+this.toString() + " second: " + second.characterName);
					return this.negated ? !evalRelationship(first, second) : evalRelationship(first, second);
				case CURRENTSOCIALGAME:
					if (!sg) return false;
					if (this.negated) {
						return this.currentGameName.toLowerCase() != sg.name.toLowerCase();
					} else {
						return this.currentGameName.toLowerCase() == sg.name.toLowerCase();
					}
				default:
					//trace(  "Predicate: evaluating a predicate without a recoginzed type.");
					console.debug(this, "evaluating a predicate without a recoginzed type of: " + this.type);
			}
			return false;
		}

		this.requiresThirdCharacter = function() {

			var thirdNeeded = false;
			if (this.numTimesUniquelyTrueFlag) {
				switch(this.numTimesRoleSlot.toLowerCase()) {
					case "first":
						//if the first role is an 'other', then return true.  Otherwise, we can move on to the next predicate.
						if (this.primary.toLowerCase() == "other") {
							return true;
						}
						break;
					case "second":
						//if the second role is an 'other', then return true.  Otherwise, we can move on to the next predicate.
						if (this.secondary.toLowerCase() == "other") {
							return true;
						}
						break;
					case "both":
						//if either the first or second role is an 'other', then return true.  Otherwise we move on to next predicate.
						if (this.primary.toLowerCase() == "other" || this.secondary.toLowerCase() == "other") {
							return true;
						}
						break;
				}
			}

			switch(this.getPrimaryValue()) {
				case "other":
				case "z":
					thirdNeeded = true;
				default:
			}
			switch(this.getSecondaryValue()) {
				case "other":
				case "z":
					thirdNeeded = true;
				default:
			}

			switch(this.getTertiaryValue()) {
				case "other":
				case "z":
					thirdNeeded = true;
				default:
			}

			if (thirdNeeded) {
				//console.debug(this, "requiresThirdCharacter() is true in predicate: " + this.toString() );
				//console.debug(this, "requiresThirdCharacter() " + this.getPrimaryValue() + " " + this.getSecondaryValue() + " " + this.getTertiaryValue() + " ");
				return true;
			}

			return false;
		}

		this.evaluatePredicateForInitiatorAndCast = function(initiator, charsToUse) {

			var possibleChars = (charsToUse) ? charsToUse : CiFSingleton.getInstance().cast.characters;

			for each (var responder in possibleChars)
			{
				if (initiator.characterName != responder.characterName)
				{
					if (this.requiresThirdCharacter())
					{
						for each (var other:Character in possibleChars)
						{
							if (other.characterName != initiator.characterName && other.characterName != initiator.characterName)
							{
								if (this.evaluate(initiator, responder, other))
								{
									return true;
								}
							}
						}
					}
					else
					{
						if (this.evaluate(initiator, responder))
						{
							return true;
						}
					}
				}
			}
			return false;
		}

		/**
		 * Looks through the SFDB
		 * @param	first Character variable of the first predicate parameter.
		 * @param	second Character variable of the second predicate parameter.
		 * @param	third Character variable of the third predicate parameter.
		 * @return True if the predicate evaluates to true. False if it does not.
		 */
		this.evalIsSFDB = function(x, y, z, sg) {
			return CiFSingleton.getInstance().sfdb.isPredicateInHistory(this, x, y, z);
		}

		/**
		 * Evaluates the predicate for truth given the characters involved
		 * bound to the parameters and determines how many times the predicate is
		 * uniquely true. The process of evaluating truth depends
		 * on the type of the specific instance of the predicate and the number of times
		 * the predicate is uniquely true.
		 * @param	x Character variable of the first predicate parameter.
		 * @param	y Character variable of the second predicate parameter.
		 * @param	z Character variable of the third predicate parameter.
		 * @return True of the predicate evaluates to true. False if it does not.
		 */
		this.evalForNumberUniquelyTrue = function(x, y, z, sg) {
			var cif = CiFSingleton.getInstance();

			var numTimesTrue = 0;

			var predTrue = false;
			var primaryCharacterOfConsideration;
			var secondaryCharacterOfConsideration;

			if (!this.numTimesRoleSlot) {
				this.numTimesRoleSlot = "first";
				//TODO: Fix where the numTimesRoleSlot is unspecified. Author/Tool problem
			}

			switch(this.numTimesRoleSlot) {
				case "first":
					primaryCharacterOfConsideration = x;
					break;
				case "second":
					primaryCharacterOfConsideration = y;
					break;
				case "third":
					primaryCharacterOfConsideration = z;
					break;
				case "both":
					primaryCharacterOfConsideration = x;
					secondaryCharacterOfConsideration = y;
					break;
				default:
					//TODO: Address this hack for where author or the tool didn't properly give the role
					primaryCharacterOfConsideration = x;
					this.numTimesRoleSlot = "first";
					console.debug(this, "evalForNumberUniquelyTrue() role slot not recognized: " + this.numTimesRoleSlot);
			}

			if (this.numTimesRoleSlot == "both") {
				switch (this.type) {
					case CKBENTRY:
						numTimesTrue = evalCKBEntryForObjects(primaryCharacterOfConsideration, secondaryCharacterOfConsideration).length;
						break;
					case SFDBLABEL:
						numTimesTrue = cif.sfdb.findLabelFromValues(this.sfdbLabel, primaryCharacterOfConsideration, secondaryCharacterOfConsideration, z, this.window,this).length;
						//console.debug(this, "numTimes(): primary ("+primaryCharacterOfConsideration.characterName + ") did a "+SocialFactsDB.getLabelByNumber(this.sfdbLabel)+" thing to secondary ("+ secondaryCharacterOfConsideration.characterName+") "+numTimesTrue+" times.");
						break;
					default:
						console.debug(this, "evalForNumberUniquelyTrue() Doesn't make sense consider 'both' role type for pred types not CKB or SFDB " + this.type);
				}
			} else {
				for each (var char in cif.cast.characters) {
					//console.debug(this,"evalForNumberUniquelyTrue() "+this.toString());
					predTrue = false;
					//if (!primaryCharacterOfConsideration) return false;
					if (char.characterName != primaryCharacterOfConsideration.characterName) {
						switch (this.type) {
							case TRAIT:
								predTrue = evalTrait(primaryCharacterOfConsideration);
								break;
							case NETWORK:
								if ("second" == numTimesRoleSlot) {
									predTrue = evalNetwork(char, primaryCharacterOfConsideration);
								} else {
									predTrue = evalNetwork(primaryCharacterOfConsideration, char);
									//console.debug(this, "evaluate() ^ returned " + isNetworkEvalTrue);
								}
								break;
							case STATUS:
								if ("second" == numTimesRoleSlot) {
									predTrue = evalStatus(char, primaryCharacterOfConsideration);
								} else {
									predTrue = evalStatus(primaryCharacterOfConsideration, char);
								}
								break;
							case CKBENTRY:
								predTrue = evalCKBEntry(primaryCharacterOfConsideration, char);
								break;
							case SFDBLABEL:
								if ("second" == numTimesRoleSlot) {
									//predTrue = evalSFDBLABEL(char, primaryCharacterOfConsideration, z);
									numTimesTrue += cif.sfdb.findLabelFromValues(this.sfdbLabel, char, primaryCharacterOfConsideration, undefined, this.window, this).length;
								} else {
									//predTrue = evalSFDBLABEL(primaryCharacterOfConsideration, char, z);
									numTimesTrue += cif.sfdb.findLabelFromValues(this.sfdbLabel, primaryCharacterOfConsideration, char, undefined, this.window, this).length;
								}
								break;
							case RELATIONSHIP:
								predTrue = evalRelationship(primaryCharacterOfConsideration, char);
								break;
							case CURRENTSOCIALGAME:
								//console.debug(this, "evalForNumberUniquelyTrue() Trying to print out the number of times a name of a social game is true doesn't make sense")
								predTrue = this.currentGameName.toLowerCase() == sg.name;
								break;
							default:
								//trace(  "Predicate: evaluating a predicate without a recoginzed type.");
								console.debug(this, "evaluating a predicate without a recoginzed type of: " + this.type);
						}
						if (predTrue) numTimesTrue++;
					}
				}
			}

			// This is a special case for where we want to count numTimesTrue for contexts labels that don't have the nonPrimary roile specified
			if (this.type == Predicate.SFDBLABEL && this.numTimesUniquelyTrueFlag) {
				//commented out this because because it handles a case that doesn't make sense: i.e. sfdblabel having no from and only a to.
				//if ("second" == numTimesRoleSlot)
				//{
					//numTimesTrue += cif.sfdb.findLabelFromValues(this.sfdbLabel, null, primaryCharacterOfConsideration, null, this.window, this).length;
				//}
				//else
				if ("first" == numTimesRoleSlot) {
					numTimesTrue += cif.sfdb.findLabelFromValues(this.sfdbLabel, primaryCharacterOfConsideration, null, null, this.window, this).length;
				}
			}

			if (numTimesTrue >= this.numTimesUniquelyTrue) {
				return true;
			}
			return false;
		}

		 /**
		 * Evaluates the predicate for truth given the characters involved
		 * bound to the parameters and determines how many times the predicate is
		 * uniquely true. The process of evaluating truth depends
		 * on the type of the specific instance of the predicate and the number of times
		 * the predicate is uniquely true. BUT here we keep track of who the characters are
		 * and store the resulting truth values in a dictionary, to reason over later.
		 * @param	x Character variable of the first predicate parameter.
		 * @param	y Character variable of the second predicate parameter.
		 * @param	z Character variable of the third predicate parameter.
		 * @return True of the predicate evaluates to true. False if it does not.
		 */
		this.evalForNumberUniquelyTrueKeepChars = function(x, y, z, sg) {
			var cif = CiFSingleton.getInstance();
			var charDictionary = {}; // will store the names of people who satisfy the requirements.
			var numTimesTrue = 0;

			var predTrue = false;
			var primaryCharacterOfConsideration;
			var secondaryCharacterOfConsideration;

			if (!this.numTimesRoleSlot) {
				this.numTimesRoleSlot = "first";
				//TODO: Fix where the numTimesRoleSlot is unspecified. Author/Tool problem
			}

			switch(this.numTimesRoleSlot) {

				case "first":
					primaryCharacterOfConsideration = x;
					break;
				case "second":
					primaryCharacterOfConsideration = y;
					break;
				case "third":
					primaryCharacterOfConsideration = z;
					break;
				case "both":
					primaryCharacterOfConsideration = x;
					secondaryCharacterOfConsideration = y;
					break;
				default:
					//TODO: Address this hack fro where author or the tool didn't properly give the role
					primaryCharacterOfConsideration = x;
					numTimesRoleSlot = "first";
					console.debug(this, "evalForNumberUniquelyTrue() role slot not recognized: "+ this.numTimesRoleSlot);
			}

			if (this.numTimesRoleSlot == "both") {
				switch (this.type) {
					case CKBENTRY:
						numTimesTrue = evalCKBEntryForObjects(primaryCharacterOfConsideration, secondaryCharacterOfConsideration).length;
						break;
					case SFDBLABEL:
						numTimesTrue = cif.sfdb.findLabelFromValues(this.sfdbLabel, primaryCharacterOfConsideration, secondaryCharacterOfConsideration, z, this.window,this).length;
						//console.debug(this, "numTimes(): primary ("+primaryCharacterOfConsideration.characterName + ") did a "+SocialFactsDB.getLabelByNumber(this.sfdbLabel)+" thing to secondary ("+ secondaryCharacterOfConsideration.characterName+") "+numTimesTrue+" times.");
						break;
					default:
						console.debug(this, "evalForNumberUniquelyTrue() Doesn't make sense consider 'both' role type for pred types not CKB or SFDB " + this.type);
				}
			} else {
				for each (var char in cif.cast.characters) {
					//console.debug(this,"evalForNumberUniquelyTrue() "+this.toString());
					predTrue = false;
					if (char.characterName != primaryCharacterOfConsideration.characterName) {
						switch (this.type) {
							case TRAIT:
								predTrue = evalTrait(primaryCharacterOfConsideration);
								break;
							case NETWORK:
								if ("second" == numTimesRoleSlot) {
									predTrue = evalNetwork(char, primaryCharacterOfConsideration);
								} else {
									predTrue = evalNetwork(primaryCharacterOfConsideration, char);
									//console.debug(this, "evaluate() ^ returned " + isNetworkEvalTrue);
								}
								break;
							case STATUS:
								if ("second" == numTimesRoleSlot) {
									predTrue = evalStatus(char, primaryCharacterOfConsideration);
								} else {
									predTrue = evalStatus(primaryCharacterOfConsideration, char);
								}
								break;
							case CKBENTRY:
								predTrue = evalCKBEntry(primaryCharacterOfConsideration, char);
								break;
							case SFDBLABEL:
								if ("second" == numTimesRoleSlot) {
									//predTrue = evalSFDBLABEL(char, primaryCharacterOfConsideration, z);
									numTimesTrue += cif.sfdb.findLabelFromValues(this.sfdbLabel, char, primaryCharacterOfConsideration, undefined, this.window, this).length;
								} else {
									//predTrue = evalSFDBLABEL(primaryCharacterOfConsideration, char, z);
									numTimesTrue += cif.sfdb.findLabelFromValues(this.sfdbLabel, primaryCharacterOfConsideration, char, undefined, this.window, this).length;
								}
								break;
							case RELATIONSHIP:
								predTrue = evalRelationship(primaryCharacterOfConsideration, char);
								break;
							case CURRENTSOCIALGAME:
								//console.debug(this, "evalForNumberUniquelyTrue() Trying to print out the number of times a name of a social game is true doesn't make sense")
								predTrue = this.currentGameName.toLowerCase() == sg.name;
								break;
							default:
								//trace(  "Predicate: evaluating a predicate without a recoginzed type.");
								console.debug(this, "evaluating a predicate without a recoginzed type of: " + this.type);
						}
						if (predTrue) {
							numTimesTrue++;
							charDictionary[char.characterName.toLowerCase()] = "true";
						}
						else {
							charDictionary[char.characterName.toLowerCase()] = "false";
						}
					}
				}
			}
			// This is a special case for where we want to count numTimesTrue for contexts labels that don't have the nonPrimary roile specified
			if (this.type == Predicate.SFDBLABEL && this.numTimesUniquelyTrueFlag) {
				//commented out this because because it handles a case that doesn't make sense: i.e. sfdblabel having no from and only a to.
				//if ("second" == numTimesRoleSlot)
				//{
					//numTimesTrue += cif.sfdb.findLabelFromValues(this.sfdbLabel, null, primaryCharacterOfConsideration, null, this.window, this).length;
				//}
				//else
				if ("first" == numTimesRoleSlot) {
					numTimesTrue += cif.sfdb.findLabelFromValues(this.sfdbLabel, primaryCharacterOfConsideration, undefined, undefined, this.window, this).length;
				}
			}

			charDictionary["numTimesTrue"] = numTimesTrue; // a special index that stores this number.
			return charDictionary;

			if (numTimesTrue >= this.numTimesUniquelyTrue) {
				//return true;
				return null;
			}
			//return false;
			return null;
		}

		/**
		 * Returns true if the character in the first parameter has the trait
		 * noted in the trait field of this class.
		 * @param first The character for which the existence of the trait is ascertained.
		 * @return True if the character has the trait. False if the trait is not present.
		 */
		var evalTrait = function(first) {
			if (first.hasTrait(this.trait))
				return true;
			return false;
		}

		/**
		 * This function is used to see if a predicate is used just to establish a character role in a rule or not.
		 * @return
		 */
		this.isCharNameTrait = function() {
			if (this.type == Predicate.TRAIT) {
				if (this.trait >= Trait.FIRST_NAME_NUMBER && this.trait <= Trait.LAST_NAME_NUMBER) {
					return true;
				}
			}
			return false;
		}

		/**
         * Returns true if the character in the first parameter has the relationship
		 * noted in the trait field of this class.
		 *
		 * @param first The character for which the existence of the trait is ascertained.
		 * @return True if the character has the trait. False if the trait is not present.
		 */
		var evalRelationship = function(first, second) {
			var sn = RelationshipNetwork.getInstance();
			//console.debug(this, "evalRelationship: " + first.characterName + " " + second.characterName + " " + this.toString());
			if (sn.getRelationship(this.relationship, first, second))
				return true;
			return false;
		}

		/**
         * Returns true if the character in the first parameter has the relationship
		 * noted in the trait field of this class.
		 *
		 * @param first The character for which the existence of the status is ascertained.
		 * @return True if the character has the status. False if the status is not present.
		 */
		var evalStatus = function(first, second) {
			//console.debug(this, "evalStatus() 1=" + first.characterName + " 2=" + second.characterName + " " + this.toString());
			return first.hasStatus(this.status, second);
		}

		/**
		 * @param {Character} first
		 * @param {Character} second
		 * @return
		 */
		var evalNetwork = function(first, second) {
			var net;
			var firstID = first.networkID;
			var secondID;

			if (second)
				secondID = second.networkID;

			//get the proper singleton based on desired network type.
			if (this.networkType == SocialNetwork.BUDDY)
				net = BuddyNetwork.getInstance();
			if (this.networkType == SocialNetwork.ROMANCE)
				net = RomanceNetwork.getInstance();
			if(this.networkType == SocialNetwork.COOL)
				net = CoolNetwork.getInstance();

			//console.debug(this, "evalNetwork(" + first.characterName + ", " + second.characterName + ") this: " + this + " netvalue: " + net.getWeight(firstID, secondID) );

			if (Predicate.getNumberFromComparator(this.comparator) == Predicate.LESSTHAN) {
				//need social network as class
				if (net.getWeight(firstID, secondID) < this.networkValue)
					return Util.xor(this.negated, true);
			} else if (Predicate.getNumberFromComparator(this.comparator)== Predicate.GREATERTHAN) {
				//need social network as class
				if (net.getWeight(firstID, secondID) > this.networkValue)
					return Util.xor(this.negated, true);
			} else if (Predicate.getNumberFromComparator(this.comparator) == Predicate.AVERAGEOPINION) {
				if (net.getAverageOpinion(firstID) > this.networkValue) {
					return Util.xor(this.negated, true);
				}
			} else if (Predicate.getNumberFromComparator(this.comparator) == Predicate.FRIENDSOPINION ||
						Predicate.getNumberFromComparator(this.comparator) == Predicate.DATINGOPINION ||
						Predicate.getNumberFromComparator(this.comparator) == Predicate.ENEMIESOPINION ) {

				//get the Cast singleton
				//know the person who is the obj of opinion
				//know the person's friends
				//get the id's of A's friends
				var cast = Cast.getInstance();
				var rel = RelationshipNetwork.getInstance();
				var sum = 0.0;
				var relationshipCount = 0.0;
				var i = 0;

				for each(var char in cast.characters) {
					//first's friends opinion about second

					//are they first's friend? test example:
					//first is robert
					//second is karen
					if (char.characterName != first.characterName && char.characterName != second.characterName) {
						if(Predicate.getNumberFromComparator(this.comparator) == Predicate.FRIENDSOPINION) {
							if (rel.getRelationship(RelationshipNetwork.FRIENDS, char, first)) {
								//console.debug(this, char.characterName + "'s opinion used: " + net.getWeight(char.networkID, second.networkID), 5);
								sum += net.getWeight(char.networkID, second.networkID);
								relationshipCount++;
							}
						} else if(Predicate.getNumberFromComparator(this.comparator) == DATINGOPINION) {
							if (rel.getRelationship(RelationshipNetwork.DATING, char, first)) {
								//console.debug(this, char.characterName + "'s opinion used: " + net.getWeight(char.networkID, second.networkID), 5);
								sum += net.getWeight(char.networkID, second.networkID);
								relationshipCount++;
							}
						} else if(Predicate.getNumberFromComparator(this.comparator) == ENEMIESOPINION) {
							if (rel.getRelationship(RelationshipNetwork.ENEMIES, char, first)) {
								//console.debug(this, char.characterName + "'s opinion used: " + net.getWeight(char.networkID, second.networkID), 5);
								sum += net.getWeight(char.networkID, second.networkID);
								relationshipCount++;
							}
						}
						//if A's friend is the target, they don't count
					}
				}
				if (relationshipCount < 1) {
					return false;
				}

				//console.debug(this, "FriendsOpinion " + sum + " " + friendCount, 5);
				if(relationshipCount > 0.0) {
					if ( (sum / relationshipCount) < this.networkValue) {
						return Util.xor(this.negated, true);
					}
				}
			}
			//default return
			return Util.xor(this.negated, false);
		}

		var evalCKBEntry = function(first, second) {
			//get instance of CKB
			var ckb = CulturalKB.getInstance();
			var firstResults = [];
			var secondResults = [];
			var i = 0;
			var j = 0;

			if(!second) {
			//determine if the single character constraints results in a match
				firstResults = ckb.findItem(first.characterName, this.firstSubjectiveLink, this.truthLabel);
				//console.debug(this, first.characterName + " " + this.firstSubjectiveLink + " " + this.truthLabel );
				return firstResults.length > 0;
			} else {
				//Might want to push this functionality into the CKB
				//determine if the two character constraints result in a match
				//1. find first matches
				firstResults = ckb.findItem(first.characterName, this.firstSubjectiveLink, this.truthLabel);
				//2. find second matches
				secondResults = ckb.findItem(second.characterName, this.secondSubjectiveLink, this.truthLabel);
				//3. see if any of first's matches intersect second's matches.
				for (i = 0; i < firstResults.length ; ++i) {
					for (j = 0; j < secondResults.length; ++j) {
						//console.debug(this, firstResults[i] + " and " + secondResults[j]);
						if (firstResults[i] == secondResults[j]) {
							//console.debug(this, "evalCKBEntry() "+this.toString());
							//console.debug(this, "evalCKBEntry() first: "+firstResults[i]+" second: "+secondResults[j]);
							return true;
						}
					}
				}
				return false;
			}
			return false;
		}



    }; //End of Predicate

    /**********************************************************************
     * Predicate meta information.
     *********************************************************************/

    /**
     * Given the integer representation of a Predicate type, this function
     * returns the String representation of that type. This is intended to
     * be used in UI elements of the design tool.
     * @example <listing version="3.0">
     * Predicate.getNameByType(Predicate.TRAIT); //returns "trait"
     * </listing>
     * @param	type The Predicate type as an integer.
     * @return The string representation of the Predicate type.
     */
    Predicate.getNameByType = function(t) {
        switch (t) {
            case TRAIT:
                return "trait";
            case NETWORK:
                return "network";
            case STATUS:
                return "status";
            case CKBENTRY:
                return "CKB";
            case SFDBLABEL:
                return "SFDBLabel";
            case RELATIONSHIP:
                return "relationship";
            case CURRENTSOCIALGAME:
                return "currentSocialGame";
            default:
                return "type not declared";
        }
    }

    Predicate.getTypeByName = function(name) {
        switch (name.toLowerCase()) {
            case "trait":
                return TRAIT;
            case "network":
                return NETWORK;
            case "status":
                return STATUS;
            case "ckb":
                return CKBENTRY;
            case "sfdblabel":
                return SFDBLABEL;
            case "relationship":
                return RELATIONSHIP;
            case "currentSocialGame":
                return CURRENTSOCIALGAME;
            default:
                return -1;
        }
    }

    Predicate.getCompatorByNumber = function(n) {
        switch (n) {
            case LESSTHAN:
                return "lessthan";
            case GREATERTHAN:
                return "greaterthan";
            case AVERAGEOPINION:
                return "AverageOpinion";
            case FRIENDSOPINION:
                return "FriendsOpinion";
            case DATINGOPINION:
                return "DatingOpinion";
            case ENEMIESOPINION:
                return "EnemiesOpinion";
            default:
                return "";
        }
    }

    Predicate.getNumberFromComparator = function(name) {
        switch (name.toLowerCase()) {
            case "<":
            case "lessthan":
            case "less than":
            case "less":
                return LESSTHAN;
            case ">":
            case "greaterthan":
            case "greater than":
            case "greater":
                return GREATERTHAN;
            case "average opinion":
            case "averageopinion":
                return AVERAGEOPINION;
            case "friendsopinion":
            case "friends opinion":
            case "friends'opinion":
            case "friends' opinion":
                return FRIENDSOPINION;
            case "datingopinion":
            case "dates opinion":
            case "Dates' opinion":
            case "Date's opinion":
                return DATINGOPINION;
            case "enemiesopinion":
            case "enemies opinion":
            case "enemies'opinion":
            case "enemy's opinion":
                return ENEMIESOPINION;

            default:
                return -1;
        }
    }

    Predicate.getOperatorByNumber = function(n) {
        switch (n) {
            case ADD:
                return "+";
            case SUBTRACT:
                return "-";
            case MULTIPLY:
                return "*";
            case ASSIGN:
                return "=";
            case EVERYONEUP:
                return "EveryoneUp";
            case ALLFRIENDSUP:
                return "AllFriendsUp";
            case ALLDATINGUP:
                return "AllDatingUp";
            case ALLENEMYUP:
                return "AllEnemyUp";
            default:
                return "";
        }
    }

    Predicate.getOperatorByName = function(name) {
        switch (name.toLowerCase()) {
            case "+":
                return ADD;
            case "-":
                return SUBTRACT;
            case "*":
                return MULTIPLY;
            case "=":
                return ASSIGN;
            case "everyoneup":
                return EVERYONEUP;
            case "allfriendsup":
                return ALLFRIENDSUP;
            case "alldatingup":
                return ALLDATINGUP;
            case "allenemyup":
                return ALLENEMYUP;
            default:
                return -1;
        }
    }
    Predicate.creationCount = 0.0;
    Predicate.evaluationCount = 0.0;
    Predicate.valuationCount = 0.0;
    Predicate.evalutionComputationTime = 0.0;

    //----Consts----

    //The number of distinct predicate types.
    Predicate.TYPE_COUNT= 7;

    Predicate.TRAIT = 0;
    Predicate.NETWORK = 1;
    Predicate.STATUS = 2;
    Predicate.CKBENTRY = 3;
    Predicate.SFDBLABEL = 4;
    Predicate.RELATIONSHIP = 5;
    Predicate.CURRENTSOCIALGAME = 6;

    Predicate.NEGATE = true;

    // The number of distinct social network comparators.
    Predicate.COMPARATOR_COUNT = 6;
    //Network comparision operators (a.k.a. comparators).
    Predicate.LESSTHAN = 0;
    Predicate.GREATERTHAN = 1;
    Predicate.AVERAGEOPINION = 2;
    Predicate.FRIENDSOPINION = 3;
    Predicate.DATINGOPINION = 4;
    Predicate.ENEMIESOPINION = 5;

    /**
     * The number of social change operators over social networks.
     */
    Predicate.OPERATOR_COUNT = 8;
    //network operators
    Predicate.ADD = 0;
    Predicate.SUBTRACT = 1;
    Predicate.MULTIPLY = 2;
    Predicate.ASSIGN = 3;
    Predicate.EVERYONEUP = 4;
    Predicate.ALLFRIENDSUP = 5;
    Predicate.ALLDATINGUP = 6;
    Predicate.ALLENEMYUP = 7;


    // The following numbers are for referenceing the twelve intent types
    Predicate.INTENT_BUDDY_UP = 0;
    Predicate.INTENT_BUDDY_DOWN = 1;
    Predicate.INTENT_ROMANCE_UP = 2;
    Predicate.INTENT_ROMANCE_DOWN = 3;
    Predicate.INTENT_COOL_UP = 4;
    Predicate.INTENT_COOL_DOWN = 5;
    Predicate.INTENT_FRIENDS = 6;
    Predicate.INTENT_END_FRIENDS = 7;
    Predicate.INTENT_DATING = 8;
    Predicate.INTENT_END_DATING = 9;
    Predicate.INTENT_ENEMIES = 10;
    Predicate.INTENT_END_ENEMIES = 11;

    Predicate.NUM_INTENT_TYPES = 12;

    return Predicate;
});
