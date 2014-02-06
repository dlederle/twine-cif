define(["min-cif/CiFSingleton", "min-cif/Rule", "min-cif/SocialNetwork", "min-cif/BuddyNetwork", "min-cif/RomanceNetwork", "min-cif/CoolNetwork", "min-cif/Util", "min-cif/Cast", "min-cif/CulturalKB", "min-cif/SocialFactsDB", "min-cif/Status"], function(CiFSingleton, Rule, SocialNetwork, BuddyNetwork, RomanceNetwork, CoolNetwork, Util, Cast, CulturalKB, SocialFactsDB, Status) {
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
              rtnstr += Predicate.getNameByType(this.type);
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
                        rtnstr += Predicate.getNameByType(this.type);
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

        /**
         * This is similar to evalCKBEntry.  However, unlike evalCKBEntry, which
         * only returns a boolean value if an object that fits the criteria exists
         * or not, here we actually produce a list of all objects that DO fulfill
         * the requirements, and then returns that list of objects as a vector.
         * @see evalCKBEntry
         * @param	first The First Character who holds an opinion on this ckb object
         * @param	second The Second Character who holds an opinion on this ckb object
         * @return
         */

        this.evalCKBEntryForObjects = function(first, second) {
            //get instance of CKB
            var ckb = CulturalKB.getInstance();
            var firstResults = [];
            var secondResults = [];
            var intersectedResults = []
                var i = 0;
            var j = 0;

            if (!second) {
                //determine if the single character constraints results in a match
                firstResults = ckb.findItem(first.characterName, this.firstSubjectiveLink, this.truthLabel);
                //console.debug(this, "evalCKBEntryForObjects() " + first.characterName + " " + this.firstSubjectiveLink + " " + this.truthLabel );
                return firstResults;
            } else {
                //Might want to push this functionality into the CKB
                //determine if the two character constraints result in a match
                //1. find first matches
                firstResults = ckb.findItem(first.characterName, this.firstSubjectiveLink, this.truthLabel);
                //console.debug(this,"evalCKBEntryForObjects() "+this.toString());
                if (secondSubjectiveLink == "") {
                    return firstResults;
                }

                //console.debug(this, "OK, we just filled up first results: " + firstResults.toString());
                //2. find second matches
                secondResults = ckb.findItem(second.characterName, this.secondSubjectiveLink, this.truthLabel);
                //3. see if any of first's matches intersect second's matches.
                for (i = 0; i < firstResults.length ; ++i) {
                    //console.debug(this, "Going through all of the first results... " + firstResults[i]);
                    for (j = 0; j < secondResults.length; ++j) {
                        //console.debug(this, firstResults[i] + " and " + secondResults[j]);
                        //console.debug(this, first.characterName+": "+ firstResults.length + " and " + second.characterName+": " +secondResults.length);
                        if (firstResults[i] == secondResults[j]) {
                            intersectedResults.push(firstResults[i]);
                            //console.debug(this, "evalCKBEntryForObjects() we found a mutual object that fits all requirements! " + firstResults[i]);
                        }
                    }
                }
                return intersectedResults;
            }
            console.debug("WHAAA HOW DID WE GET HERE");
            return "WHAAA HOW DID WE GET HERE?!?!";
        }

        /**
         * Evaluates the truth of the SFDBLabel type Predicate given a set of characters. This
         * evaluation is different from most other predicates in that it is always based in
         * history. Every SFDBLabel type predicate looks back in the social facts database to
         * see if the label of the predicate was true for the characters in the past. If there
         * is a match in history, it is evaluated true.
         *
         * Note: we currently do not allow for a third character to be used.
         *
         * @param {Character} first
         * @param {Character} second
         * @param {Character} third
         * @return
         */
        this.evalSFDBLABEL = function(first, second, third) {
            var cif = CiFSingleton.getInstance();

            //console.debug(this, "evalSFDBLABEL() result: " + cif.sfdb.findLabelFromValues(this.sfdbLabel, first, second, third, this.window).length + " toString: "+this.toString());

            //if it is a category of label
            if (this.sfdbLabel <= SocialFactsDB.LAST_CATEGORY_COUNT && this.sfdbLabel >= 0) {
                for each (var fromCategoryLabel in CiF.SocialFactsDB.CATEGORIES[this.sfdbLabel]) {
                    if (cif.sfdb.findLabelFromValues(fromCategoryLabel, first, second, undefined, this.window, this).length > 0)
                        return (this.negated) ? false : true;
                }
            } else {
                //normal look up
                if (cif.sfdb.findLabelFromValues(this.sfdbLabel, first, second, undefined, this.window, this).length > 0) {
                    return (this.negated) ? false : true;
                }
            }
            return (this.negated) ? true : false;
        }

        /**
         * Determines the character name bound to the first (primary) character variable role in this predicate given
         * a context of characters in roles.
         * @param {Character} initiator
         * @param {Character} responder
         * @param {Character} other
         * @return The name of the primary character associated with the predicate character variable and role context.
         */
        this.primaryCharacterNameFromVariables = function(initiator, responder, other) {
            switch(this.getPrimaryValue()) {
                case "initiator":
                    return initiator.characterName;
                case "responder":
                    return responder.characterName;
                case "other":
                    return other.characterName;
                case "":
                    return "";
            }
            return this.primary;
        }

        /**
         * Determines the character name bound to the second (secondary) character variable role in this predicate given
         * a context of characters in roles.
         * @param {Character} initiator
         * @param {Character} responder
         * @param {Character} other
         * @return The name of the secondary character associated with the predicate character variable and role context.
         */
        this.secondaryCharacterNameFromVariables = function(initiator, responder, other) {
            switch(this.getSecondaryValue()) {
                case "initiator":
                    return initiator.characterName;
                case "responder":
                    return responder.characterName;
                case "other":
                    return other.characterName;
                case "":
                    return "";
            }
            return this.secondary;
        }

        /**
         * Determines the character name bound to the third (tertiary) character variable role in this predicate given
         * a context of characters in roles.
         * @param {Character} initiator
         * @param {Character} responder
         * @param {Character} other
         * @return The name of the tertiary character associated with the predicate character variable and role context.
         */
        this.tertiaryCharacterNameFromVariables = function(initiator, responder, other) {
            switch(this.getTertiaryValue()) {
                case "initiator":
                    return initiator.characterName;
                case "responder":
                    return responder.characterName;
                case "other":
                    return other.characterName;
                case "":
                    return "";
            }
            return this.tertiary;
        }

        /**********************************************************************
         * Utility functions.
         *********************************************************************/
        this.toString = function() {
            var returnstr;
            var switchType = this.type;

            switch(switchType) {
                case Predicate.TRAIT:
                    returnstr = "";
                    if (this.negated) {
                        returnstr += "~";
                    }
                    returnstr += "trait(" + this.primary + ", " + Trait.getNameByNumber(this.trait) + ")";
                    break;
                case Predicate.NETWORK:
                    returnstr = "";
                    if (this.negated) {
                        returnstr += "~";
                    }
                    returnstr += SocialNetwork.getNameFromType(this.networkType) + "Network(" + this.primary + ", " + this.secondary + ") " + this.comparator + " " + this.networkValue;
                    break;
                case Predicate.STATUS:
                    returnstr = "";
                    if (this.negated) {
                        returnstr += "~";
                    }
                    var secondValue = "";
                    if (this.status >= Status.FIRST_DIRECTED_STATUS) secondValue = this.secondary;
                    returnstr += "status(" + this.primary + ", " + secondValue + ", " + Status.getStatusNameByNumber(this.status) + ")";
                    break;
                case Predicate.CKBENTRY:
                    returnstr = "";
                    if (this.negated) {
                        returnstr += "~";
                    }
                    returnstr += "ckb(" + this.primary + ", " + this.firstSubjectiveLink + ", " + this.secondary + ", " + this.secondSubjectiveLink + ", " + this.truthLabel + ")";
                    break;
                    //sfdb not complete
                case Predicate.SFDBLABEL:
                    returnstr = "";
                    if (this.negated) {
                        returnstr += "~";
                    }
                    returnstr += "SFDBLabel(" + SocialFactsDB.getLabelByNumber(this.sfdbLabel) + "," + this.primary + "," + this.secondary;
                    returnstr += "," + this.sfdbOrder + ")";
                    break;
                case Predicate.RELATIONSHIP:
                    returnstr = "";
                    if (this.negated) {
                        returnstr += "~";
                    }
                    returnstr += "relationship(" + this.primary + ", " + this.secondary + ", " + RelationshipNetwork.getRelationshipNameByNumber(this.relationship) + ")";
                    break;
                default:
                    console.debug(this, "tried to make a predicate of unknown type a String.");
                    return "";
            }
            if (isSFDB) returnstr = "[" + returnstr + " window(" + this.window +")]";
            if (intent) return "{" + returnstr + "}";
            return returnstr;

        }

        this.clone = function() {
            var p = new Predicate();
            p.type = this.type;
            p.trait = this.trait;
            p.description = this.description;
            p.primary = this.primary;
            p.secondary = this.secondary;
            p.tertiary = this.tertiary;
            p.networkValue = this.networkValue;
            p.comparator = this.comparator;
            p.operator = this.operator;
            p.relationship = this.relationship;
            p.status = this.status;
            p.networkType = this.networkType;
            p.firstSubjectiveLink = this.firstSubjectiveLink;
            p.secondSubjectiveLink = this.secondSubjectiveLink;
            p.truthLabel = this.truthLabel;
            p.negated = this.negated;
            p.window = this.window;
            p.isSFDB = this.isSFDB;
            p.sfdbLabel = this.sfdbLabel;
            p.intent = this.intent;
            p.numTimesUniquelyTrueFlag = this.numTimesUniquelyTrueFlag;
            p.numTimesUniquelyTrue = this.numTimesUniquelyTrue;
            p.numTimesRoleSlot = this.numTimesRoleSlot;
            p.sfdbOrder = this.sfdbOrder;
            return p;
        }

        /**
         * This function returns a natural language name of the given predicate.
         * So, for example, instead of some weird scary code-looking implementation
         * such as wants_to_pick_on(i->r), it would return something alone the lines of
         * "Karen wants to pick on Robert"  I think, at least for this first pass, that
         * we are not going to care about pronoun replacement, or anything along
         * those lines!
         *
         * @param	primary The actual name of the initiator (eg "Karen")
         * @param	secondary The actual name of the responder (eg "Robert")
         * @param	tertiary The actual name of the other (eg "Edward")
         */
        this.toNaturalLanguageString = function(primary, secondary, tertiary) {
            var predicateName = Predicate.getNameByType(this.type); // "network", "relationship", etc.
            var naturalLanguageName = "";
            //primary = makeFirstLetterUpperCase(primary);
            //secondary = makeFirstLetterUpperCase(secondary);
            //if (tertiary != null) tertiary = makeFirstLetterUpperCase(tertiary);
            //trace("predicate name = " + predicateName);
            if(!this.numTimesUniquelyTrueFlag){ // what follows is the 'normal' stuff -- we need to do something special if it is a num times uniquely true predicate.
                switch (predicateName){
                    case "network":
                        naturalLanguageName = networkToNaturalLanguage(primary, secondary , tertiary);
                        break;
                    case "relationship":
                        naturalLanguageName = relationshipPredicateToNaturalLanguage(primary, secondary, tertiary);
                        break;
                    case "trait":
                        naturalLanguageName = traitPredicateToNaturalLanguage(primary, secondary, tertiary);
                        break;
                    case "status":
                        naturalLanguageName = statusPredicateToNaturalLanguage(primary, secondary, tertiary);
                        break;
                    case "CKB":
                        naturalLanguageName = ckbPredicateToNaturalLanguage(primary, secondary, tertiary);
                        break;
                    case "SFDBLabel":
                        naturalLanguageName = sfdbPredicateToNaturalLanguage(primary, secondary, tertiary);
                        break;
                    default:
                        trace ("Unrecognized predicate type");
                }
            }
            else {
                if (predicateName == "CKB") naturalLanguageName = ckbPredicateToNaturalLanguage(primary, secondary, tertiary); // I handled this case originally!
                else naturalLanguageName = numTimesUniquelyTruePredicateToNaturalLanguage(primary, secondary, tertiary);
            }

            //Append SFDB Window information to the natural language predicate.
            var timeElapsed = "";
            if(this.isSFDB){
                if (this.window < 0) { // THIS IS BACKSTORY
                    timeElapsed = " way back when";
                }
                else if (this.window == 0) { //It means it just has to have been true at some point.
                    timeElapsed = "";
                    if (secondary == "")
                    {
                        //timeElapsed = " new" + timeElapsed;
                        timeElapsed = " " + timeElapsed;
                    }
                }
                else if (this.window > 0 && this.window <= 5) {
                    timeElapsed = " recently";
                }
                else if (this.window > 5 && this.window <= 10) {
                    timeElapsed = " a little while ago";
                }
                else if (this.window > 10) {
                    timeElapsed = " some time ago";
                }
            }
            naturalLanguageName += timeElapsed;

            //If we are dealing with something with an SFDB 'order'
            //we just kind of append that to the end.
            if (this.sfdbOrder > 0) {
                naturalLanguageName += " "
                    naturalLanguageName += sfdbOrderToNaturalLanguage();
            }

            naturalLanguageName += ".";
            return LineOfDialogue.preprocessLine(naturalLanguageName);
        }

        // Network line values (1-100)
        var meansHigh = function(num) {
            if (num >= 60) {
                return true;
            }
            return false;
        }
        var meansMedium = function(num) {
            if (num < 60 && num > 40) {
                return true;
            }
            return false;
        }
        var meansLow = function(num) {
            if (num <= 40) {
                return true;
            }
            return false;
        }
        // Network change deltas (5-30 or so)
        var changeIsSmall = function(num) {
            if (num <= 10) {
                return true;
            }
            return false;
        }
        var changeIsMedium = function(num) {
            if (num > 10 && num < 25) {
                return true;
            }
            return false;
        }
        var changeIsLarge = function(num) {
            if (num >= 25) {
                return true;
            }
            return false;
        }
        var showDegreeAdj = function(num) {
            if (changeIsSmall(num)) return "slightly ";
            else if (changeIsLarge(num)) return "much ";
            else return "";
        }

        /**
         * Specifically handles the converting of a network into a natural language name
         * (e.g. "BudNetHigh(i->r) is converted to "Karen feels strong feelings of buddy towards Responder"
         *
         * @param	primary The actual name of the primary "Karen"
         * @param	secondary The actual name of the secondary "Edward"
         * @param	tertiary The actual name of the tertiary "Robert"
         * @return The natural language name of the network
         */
        this.networkToNaturalLanguage  = function(primary, secondary, tertiary) {
            var naturalLanguageName = "";
            var otherPeoplesOpinion = "";

            //First, discover if the predicate is going to be low, medium, or high.
            var highThreshold = 66;
            var medThreshold = 50;
            var lowThreshold = 33;
            var isHigh = false;
            var isLow = false;
            var isNotHigh = false;
            var isNotLow = false;
            var isAggregateComparator = false;

            var changeIsSmall = false;
            var changeIsMedium = false;
            var changeIsLarge = false;

            /* COMPARATORS:
            //
            //greaterthan
            //lessthan
            //AverageOpinion
            //FriendsOpinion
            //DatingOpinion
            //EnemiesOpinion
            //+
            //-
            //DO WE USE THESE BOTTOM ONES EVER?
            //*
            //=
            //EveryoneUp
            //AllFriendsUp
            //AllDatingUp
            //AllEnemiesUp
            */

            if (this.comparator == "DatingOpinion" || this.comparator == "FriendsOpinion" || this.comparator == "EnemiesOpinion" || this.comparator == "EnemyOpinion" || this.comparator == "AverageOpinion" || this.comparator == "EveryoneUp") isAggregateComparator = true;

            //Since the design tool does not restrict numeric values, we need to estimate whether the condition being asked for is based on values being high, medium, or low (which we approximate with the functions above. Then, we can determine whether something is restricted to being high or low, or being "not high" or "not low" (as in, if we want a value greater than low or the midpoint, all we know is we want something that isn't low.)
            if (meansHigh(this.networkValue) && this.comparator=="greaterthan") isHigh = true;
            else if (meansLow(this.networkValue) && this.comparator == "lessthan") isLow = true;
            else if (meansLow(this.networkValue) && this.comparator == "greaterthan") isNotLow = true;
            else if (meansMedium(this.networkValue) && this.comparator == "greaterthan") isNotLow = true;
            else if (meansHigh(this.networkValue) && this.comparator == "lessthan") isNotHigh = true;
            else if (meansMedium(this.networkValue) && this.comparator == "lessthan") isNotHigh = true;
            else if (isAggregateComparator) {
                // These all assume you mean 'greater than'
                if (meansHigh(this.networkValue)) isHigh = true;
                else isNotLow = true;
            } else if (this.comparator == "+") { // this is a network change thing!
                switch(SocialNetwork.getNameFromType(this.networkType)) {
                    case "buddy":
                        naturalLanguageName = primary + " thinks " + secondary + " is a " + showDegreeAdj(this.networkValue) + "better buddy"; break;
                    case "romance":
                        naturalLanguageName = primary + " is " + showDegreeAdj(this.networkValue) + "more attracted to " + secondary; break;
                    case "cool":
                        naturalLanguageName = primary + " thinks " + secondary + " is " + showDegreeAdj(this.networkValue) + "cooler"; break;
                }
                return naturalLanguageName;
            }
            else if (this.comparator == "-") { // this is a network change thing!
                switch(SocialNetwork.getNameFromType(this.networkType)) {
                    case "buddy":
                        naturalLanguageName = primary + " thinks " + secondary + " is a " + showDegreeAdj(this.networkValue) + "worse buddy"; break;
                    case "romance":
                        naturalLanguageName = primary + " is " + showDegreeAdj(this.networkValue) + "less attracted to " + secondary; break;
                    case "cool":
                        naturalLanguageName = primary + " thinks " + secondary + " is " + showDegreeAdj(this.networkValue) + "less cool"; break;
                }
                return naturalLanguageName;
            }

            if (this.comparator == "DatingOpinion") otherPeoplesOpinion = " is dating someone who";
            else if (this.comparator == "FriendsOpinion") otherPeoplesOpinion = "'s friends";
            else if (this.comparator == "EnemiesOpinion") otherPeoplesOpinion = "'s enemies";
            else otherPeoplesOpinion = " knows people who";

            //Awesome, now I know if it is low, medium, or high.  Now I need to find out which network we are dealing with.
            switch(SocialNetwork.getNameFromType(this.networkType)) {
                case "buddy":
                    if (isHigh) {
                        if (this.comparator == "DatingOpinion")
                            naturalLanguageName = primary + " is dating someone who likes " + secondary;
                        else if (isAggregateComparator)
                            naturalLanguageName = primary + "" + otherPeoplesOpinion + " like " + secondary;
                        else
                            naturalLanguageName = primary + " likes " + secondary;
                    }
                    else if (isNotHigh) {
                        if (this.comparator == "DatingOpinion")
                            naturalLanguageName = primary + " is dating someone who doesn't especially like " + secondary;
                        else if (isAggregateComparator)
                            naturalLanguageName = primary + "" + otherPeoplesOpinion + " don't especially like " + secondary;
                        else
                            naturalLanguageName = primary + " doesn't especially like " + secondary;
                    }
                    else if (isLow) {
                        if (this.comparator == "DatingOpinion")
                            naturalLanguageName = primary + " is dating someone who dislikes " + secondary;
                        else if (isAggregateComparator)
                            naturalLanguageName = primary + "" + otherPeoplesOpinion + " don't like " + secondary;
                        else
                            naturalLanguageName = primary + " dislikes " + secondary;
                    }
                    else if (isNotLow) {
                        if (this.comparator == "DatingOpinion")
                            naturalLanguageName = primary + " is dating someone who's not on bad terms with " + secondary;
                        else if (isAggregateComparator)
                            naturalLanguageName = primary + "" + otherPeoplesOpinion + " are not on bad terms with " + secondary;
                        else
                            naturalLanguageName = primary + " is not on bad terms with " + secondary;
                    }
                    // We don't guarantee this per se, but the code above should always set one of the four variables to true, so the below should hopefully never be run.
                    else naturalLanguageName = "Unrecognized Buddy Value! Value is: " + this.networkValue + " comparator is: " + comparator;
                    break;
                case "romance":
                    if (isHigh) {
                        if (this.comparator == "DatingOpinion")
                            naturalLanguageName = primary + " is dating someone who's attracted to " + secondary;
                        else if (isAggregateComparator)
                            naturalLanguageName = primary + "" + otherPeoplesOpinion + " are generally attracted to " + secondary;
                        else
                            naturalLanguageName = primary + " is attracted to " + secondary;
                    }
                    else if (isNotHigh) {
                        if (this.comparator == "DatingOpinion")
                            naturalLanguageName = primary + " is dating someone who's not attracted to " + secondary;
                        else if (isAggregateComparator)
                            naturalLanguageName = primary + "" + otherPeoplesOpinion + " are generally not attracted to " + secondary;
                        else
                            naturalLanguageName = primary + " is not attracted to " + secondary;
                    }
                    else if (isLow) {
                        if (this.comparator == "DatingOpinion")
                            naturalLanguageName = primary + " is dating someone who's not at all into " + secondary;
                        else if (isAggregateComparator)
                            naturalLanguageName = primary + "" + otherPeoplesOpinion + " are generally not at all into " + secondary;
                        else
                            naturalLanguageName = primary + " is not at all into " + secondary;
                    }
                    else if (isNotLow) {
                        if (this.comparator == "DatingOpinion")
                            naturalLanguageName = primary + " is dating someone who's not grossed out by " + secondary;
                        else if (isAggregateComparator)
                            naturalLanguageName = primary + "" + otherPeoplesOpinion + " are generally not grossed out by " + secondary;
                        else
                            naturalLanguageName = primary + " is not grossed out by " + secondary;
                    }
                    else naturalLanguageName = "Unrecognized Romance Value! Value: " + this.networkValue + " comparator: " + comparator;
                    break;
                case "cool":
                    if (isHigh) {
                        if (this.comparator == "DatingOpinion")
                            naturalLanguageName = primary + " is dating someone who thinks " + secondary + " is totally cool";
                        else if (isAggregateComparator)
                            naturalLanguageName = primary + "" + otherPeoplesOpinion + " think " + secondary + " is totally cool";
                        else
                            naturalLanguageName = primary + " thinks " + secondary + " is totally cool";
                    }
                    else if (isNotHigh) {
                        if (this.comparator == "DatingOpinion")
                            naturalLanguageName = primary + " is dating someone who doesn't think " + secondary + " is that cool";
                        else if (isAggregateComparator)
                            naturalLanguageName = primary + "" + otherPeoplesOpinion + " don't think " + secondary + " is that cool";
                        else
                            naturalLanguageName = primary + " doesn't think " + secondary + " is that cool";
                    }
                    else if (isLow) {
                        if (this.comparator == "DatingOpinion")
                            naturalLanguageName = primary + " is dating someone who thinks " + secondary + " is seriously uncool";
                        else if (isAggregateComparator)
                            naturalLanguageName = primary + "" + otherPeoplesOpinion + " think " + secondary + " is seriously uncool";
                        else
                            naturalLanguageName = primary + " thinks " + secondary + " is seriously uncool";
                    }
                    else if (isNotLow) {
                        if (this.comparator == "DatingOpinion")
                            naturalLanguageName = primary + " is dating someone who doesn't think " + secondary + " is uncool";
                        else if (isAggregateComparator)
                            naturalLanguageName = primary + "" + otherPeoplesOpinion + " don't generally think " + secondary + " is uncool";
                        else
                            naturalLanguageName = primary + " doesn't think " + secondary + " is uncool";
                    }
                    else naturalLanguageName = "Unrecognized Cool Value! Value is: " + this.networkValue + " comparator is: " + comparator;
                    break;
                default:
                    console.debug("unrecognized network type (not buddy, not cool, not romance)");
            }
            return naturalLanguageName;
        }

        /**
         * Here is the function that creates the natural language
         * version of a relationship.  As in "Karen and Edward are Dating"
         * @param	primary The actual name of the primary "Karen"
         * @param	secondary The actual name of the secondary "Edward"
         * @param	tertiary The actual name of the tertiary "Robert"
         * @return The natural language name of the relationship
         */
        this.relationshipPredicateToNaturalLanguage = function(primary, secondary, tertiary) {
            //We care about what type of network we are dealing with.
            var naturalLanguageName = "";
            var notString = "";
            var isString = "";
            var newString = "";

            if (this.negated == true) {
                notString = " not";
            }
            if (this.isSFDB) {
                isString = " was";
                newString = " new";
            }
            else {
                isString = " is";
            }

            switch(RelationshipNetwork.getRelationshipNameByNumber(this.relationship)) {
                case 'friends':
                    if (this.isSFDB) {
                        if (this.negated) {
                            naturalLanguageName = primary + " doesn't make friends with " + secondary;
                        } else {
                            naturalLanguageName = primary + " makes a new friend";
                            if (secondary != " someone") {
                                naturalLanguageName = naturalLanguageName + " in " + secondary;
                            }
                        }
                    } else {
                        naturalLanguageName = primary + isString + notString + " friends with " + secondary;
                    }
                    break;
                case 'dating':
                    if (this.isSFDB) {
                        naturalLanguageName = primary + isString + notString + " in a new relationship with " + secondary;
                    } else {
                        naturalLanguageName = primary + isString + notString + " dating " + secondary;
                    }
                    break;
                case 'enemies':
                    naturalLanguageName = primary + " and " + secondary + " are" + notString + newString + " enemies";
                    break;
                default:
                    naturalLanguageName = "unrecognized relationship (not friends, dating, or enemies)";
            }
            return naturalLanguageName;
        }

        /**
         * @return If it is an intent, returns the intent ID, as defined as consts above. Other wise it returns -1
         */
        this.getIntentType = function() {
            if (!this.intent) return -1;

            if (this.type == Predicate.NETWORK) {
                if (this.networkType == SocialNetwork.BUDDY) {
                    if (this.comparator == "+") {
                        return Predicate.INTENT_BUDDY_UP;
                    } else {
                        return Predicate.INTENT_BUDDY_DOWN;
                    }
                } else if (this.networkType == SocialNetwork.ROMANCE) {
                    if (this.comparator == "+") {
                        return Predicate.INTENT_ROMANCE_UP;
                    } else {
                        return Predicate.INTENT_ROMANCE_DOWN;
                    }
                } else if (this.networkType == SocialNetwork.COOL) {
                    if (this.comparator == "+") {
                        return Predicate.INTENT_COOL_UP;
                    } else {
                        return Predicate.INTENT_COOL_DOWN;
                    }
                }
            }
            else if (this.type == Predicate.RELATIONSHIP)
            {
                if (this.relationship == RelationshipNetwork.FRIENDS)
                {
                    if (this.negated)
                    {
                        return Predicate.INTENT_END_FRIENDS;
                    }
                    else
                    {
                        return Predicate.INTENT_FRIENDS;
                    }
                }
                else if (this.relationship == RelationshipNetwork.DATING)
                {
                    if (this.negated)
                    {
                        return Predicate.INTENT_END_DATING;
                    }
                    else
                    {
                        return Predicate.INTENT_DATING;
                    }
                }
                else if (this.relationship == RelationshipNetwork.ENEMIES)
                {
                    if (this.negated)
                    {
                        return Predicate.INTENT_END_ENEMIES;
                    }
                    else
                    {
                        return Predicate.INTENT_ENEMIES;
                    }
                }
            }
            // if we get here, we weren't one of the accepted intents
            return -1;
        }

        /**
         * Here is the function that creates the natural language
         * version of a trait.  As in "Karen is Shy"
         * @param	primary The actual name of the primary "Karen"
         * @param	secondary The actual name of the secondary "Edward"
         * @param	tertiary The actual name of the tertiary "Robert"
         * @return The natural language name of the relationship
         */
        this.traitPredicateToNaturalLanguage = function(primary = "Karen", secondary = "Edward", tertiary = "Robert") {
            //We care about what type of trait we are dealing with.
            var naturalLanguageName;
            naturalLanguageName = primary;
            var notString = " ";
            if (this.negated) {
                notString = " not ";
            }

            var theTrait = this.trait;

            var cif = CiFSingleton.getInstance();

            if (theTrait <= Trait.LAST_CATEGORY_COUNT) {
                switch(theTrait) {
                    case Trait.CAT_CHARACTER_FLAW:
                        if(this.negated) {
                            naturalLanguageName += " does not have a character flaw";
                        }
                        else {
                            naturalLanguageName += " has a character flaw";
                        }
                        break;
                    case Trait.CAT_CHARACTER_VIRTUE:
                        if(this.negated){
                            naturalLanguageName += " does not have a character virtue";
                        }
                        else {
                            naturalLanguageName += " has a character virtue";
                        }
                        break;
                    case Trait.CAT_EXTROVERTED:
                        if(this.negated){
                            naturalLanguageName += " isn't extroverted";
                        }
                        else {
                            naturalLanguageName += " is extroverted";
                        }
                        break;
                    case Trait.CAT_INTROVERTED:
                        if(this.negated){
                            naturalLanguageName += " isn't introverted";
                        }
                        else {
                            naturalLanguageName += " is introverted";
                        }
                        break;
                    case Trait.CAT_JERK:
                        if(this.negated){
                            naturalLanguageName += " isn't a jerk";
                        }
                        else {
                            naturalLanguageName += " is a jerk";
                        }
                        break;
                    case Trait.CAT_NICE:
                        if(this.negated){
                            naturalLanguageName += " isn't nice";
                        }
                        else {
                            naturalLanguageName += " is nice";
                        }
                        break;
                    case Trait.CAT_SEXY:
                        if(this.negated){
                            naturalLanguageName += " isn't sexy";
                        }
                        else {
                            naturalLanguageName += " is sexy";
                        }
                        break;
                    case Trait.CAT_SHARP:
                        if(this.negated){
                            naturalLanguageName += " isn't sharp";
                        }
                        else {
                            naturalLanguageName += " is sharp";
                        }
                        break;
                    case Trait.CAT_SLOW:
                        if(this.negated){
                            naturalLanguageName += " isn't slow";
                        }
                        else {
                            naturalLanguageName += " is slow";
                        }
                        break;
                    default:
                        console.debug(this, "not a category");
                        break;
                }
                return naturalLanguageName;
            }

            switch(theTrait) {
                case Trait.OUTGOING:
                    naturalLanguageName += " is" + notString + "outgoing"; break;
                case Trait.SHY:
                    naturalLanguageName += " is" + notString + "shy"; break;
                case Trait.ATTENTION_HOG:
                    naturalLanguageName += " is" + notString + "an attention hog"; break;
                case Trait.IMPULSIVE:
                    naturalLanguageName += " is" + notString + "impulsive"; break;
                case Trait.COLD:
                    naturalLanguageName += " is" + notString + "cold";   break;
                case Trait.KIND:
                    naturalLanguageName += " is" + notString + "kind"; break;
                case Trait.IRRITABLE:
                    naturalLanguageName += " is" + notString + "irritable"; break;
                case Trait.LOYAL:
                    naturalLanguageName += " is" + notString + "loyal"; break;
                case Trait.LOVING:
                    naturalLanguageName += " is" + notString + "loving"; break;
                case Trait.SYMPATHETIC:
                    naturalLanguageName += " is" + notString + "sympathetic"; break;
                case Trait.MEAN:
                    naturalLanguageName += " is" + notString + "mean"; break;
                case Trait.CLUMSY:
                    naturalLanguageName += " is" + notString + "clumsy"; break;
                case Trait.CONFIDENT:
                    naturalLanguageName += " is" + notString + "confident"; break;
                case Trait.INSECURE:
                    naturalLanguageName += " is" + notString + "insecure"; break;
                case Trait.MOPEY:
                    naturalLanguageName += " is" + notString + "mopey"; break;
                case Trait.BRAINY:
                    naturalLanguageName += " is" + notString + "brainy"; break;
                case Trait.DUMB:
                    naturalLanguageName += " is" + notString + "dumb"; break;
                case Trait.DEEP:
                    naturalLanguageName += " is" + notString + "deep"; break;
                case Trait.SHALLOW:
                    naturalLanguageName += " is" + notString + "shallow"; break;
                case Trait.SMOOTH_TALKER:
                    naturalLanguageName += " is" + notString + "a smooth talker"; break;
                case Trait.INARTICULATE:
                    naturalLanguageName += " is" + notString + "inarticulate"; break;
                case Trait.SEX_MAGNET:
                    naturalLanguageName += " is" + notString + "a sex magnet"; break;
                case Trait.AFRAID_OF_COMMITMENT:
                    naturalLanguageName += " is" + notString + "afraid of commitment"; break;
                case Trait.DOMINEERING:
                    naturalLanguageName += " is" + notString + "domineering"; break;
                case Trait.HUMBLE:
                    naturalLanguageName += " is" + notString + "humble"; break;
                case Trait.TAKES_THINGS_SLOWLY:
                    naturalLanguageName += (this.negated ? " does not take things slowly" : " takes things slowly"); break;
                case Trait.ARROGANT:
                    naturalLanguageName += " is" + notString + "arrogant"; break;
                case Trait.DEFENSIVE:
                    naturalLanguageName += " is" + notString + "defensive"; break;
                case Trait.HOTHEAD:
                    naturalLanguageName += " is" + notString + "a hothead"; break;
                case Trait.PACIFIST:
                    naturalLanguageName += " is" + notString + "a pacifist"; break;
                case Trait.RIPPED:
                    naturalLanguageName += " is" + notString + "ripped"; break;
                case Trait.WEAKLING:
                    naturalLanguageName += " is" + notString + "a weakling"; break;
                case Trait.FORGIVING:
                    naturalLanguageName += " is" + notString + "forgiving"; break;
                case Trait.EMOTIONAL:
                    naturalLanguageName += " is" + notString + "emotional"; break;
                case Trait.SWINGER:
                    naturalLanguageName += " is" + notString + "a swinger"; break;
                case Trait.JEALOUS:
                    naturalLanguageName += " is" + notString + "jealous"; break;
                case Trait.WITTY:
                    naturalLanguageName += " is" + notString + "witty"; break;
                case Trait.SELF_DESTRUCTIVE:
                    naturalLanguageName += " is" + notString + "self-destructive"; break;
                case Trait.OBLIVIOUS:
                    naturalLanguageName += " is" + notString + "oblivious"; break;
                case Trait.VENGEFUL:
                    naturalLanguageName += " is" + notString + "vengeful"; break;
                case Trait.COMPETITIVE:
                    naturalLanguageName += " is" + notString + "competitive"; break;
                case Trait.STUBBORN:
                    naturalLanguageName += " is" + notString + "stubborn"; break;
                case Trait.DISHONEST:
                    naturalLanguageName += " is" + notString + "dishonest"; break;
                case Trait.HONEST:
                    naturalLanguageName += " is" + notString + "honest"; break;
                case Trait.MALE:
                    naturalLanguageName += " is" + notString + "male"; break;
                case Trait.FEMALE:
                    naturalLanguageName += " is" + notString + "female"; break;
                case Trait.WEARS_A_HAT:
                    naturalLanguageName += (this.negated ? "does not wear" : "wears") + " a hat"; break;
                case Trait.CARES_ABOUT_FASHION:
                    naturalLanguageName += (this.negated ? "does not care" : "cares") + " about fashion"; break;
                case Trait.MUSCULAR:
                    naturalLanguageName += " is" + notString + "muscular"; break;
                default:
                    if (theTrait >= Trait.FIRST_NAME_NUMBER && theTrait <= Trait.LAST_NAME_NUMBER)
                    {
                        naturalLanguageName += " is" + notString + Trait.getNameByNumber(theTrait); break;
                    }
                    else
                    {
                        naturalLanguageName = "unrecognized trait";
                        console.debug(this, "unrecognized eh: " + theTrait);
                    }
            }
            return naturalLanguageName;
        }

        /**
         * Turns a status predicate into a natural language
         * sounding version (Karen is feeling Anxious)
         * @param	primary The actual name of the primary "Karen"
         * @param	secondary The actual name of the secondary "Edward"
         * @param	tertiary The actual name of the tertiary "Robert"
         * @return The natural language name of the relationship
         */
        this.statusPredicateToNaturalLanguage = function(primary, secondary, tertiary) {
            //We care about what type of trait we are dealing with.
            var naturalLanguageName;
            naturalLanguageName = primary;
            var notString = " ";
            var isString = " ";
            if (this.negated) {
                notString = " not ";
            }
            if (this.isSFDB) {
                isString = " was";
            } else {
                isString = " is";
            }
            var theStatus = this.status;

            var cif = CiFSingleton.getInstance();

            if (theStatus <= Status.LAST_CATEGORY_COUNT)// && !(theStatus >= Status.FIRST_TO_IGNORE_NON_DIRECTED && theStatus < Status.FIRST_DIRECTED_STATUS))
            {
                //resolve which trait they actually have
                for each (var s in Status.CATEGORIES[this.status])
                {
                    if (cif.cast.getCharByName(primary.toLowerCase()).getStatus(s))
                    {
                        theStatus = s;
                    }
                }
            }

            switch(theStatus) {
                case Status.EMBARRASSED:
                    naturalLanguageName += isString + notString + "feeling embarrassed"; break;
                case Status.CHEATER:
                    naturalLanguageName += isString + notString + "a cheater"; break;
                case Status.SHAKEN:
                    naturalLanguageName += isString + notString + "all shook up"; break;
                case Status.DESPERATE:
                    naturalLanguageName += isString + notString + "desperate"; break;
                case Status.CLASS_CLOWN:
                    naturalLanguageName += isString + notString + "the class clown"; break;
                case Status.BULLY:
                    naturalLanguageName += isString + notString + "a bully"; break;
                case Status.LOVE_STRUCK:
                    naturalLanguageName += isString + notString + "love-struck"; break;
                case Status.GROSSED_OUT:
                    naturalLanguageName += isString + notString + "grossed out"; break;
                case Status.EXCITED:
                    naturalLanguageName += isString + notString + "excited"; break;
                case Status.POPULAR:
                    naturalLanguageName += isString + notString + "popular"; break;
                case Status.SAD:
                    naturalLanguageName += isString + notString + "feeling sad"; break;
                case Status.ANXIOUS:
                    naturalLanguageName += isString + notString + "feeling anxious"; break;
                case Status.HONOR_ROLL:
                    naturalLanguageName += isString + notString + "on the honor roll"; break;
                case Status.LOOKING_FOR_TROUBLE:
                    naturalLanguageName += isString + notString + "looking for trouble"; break;
                case Status.GUILTY:
                    naturalLanguageName += isString + notString + "feeling guilty"; break;
                case Status.FEELS_OUT_OF_PLACE:
                    if (this.negated) {
                        if (this.isSFDB){
                            naturalLanguageName += "did not feel out of place";
                        }
                        else {
                            naturalLanguageName += "does not feel out of place";
                        }
                    }
                    else {
                        if (this.isSFDB) {
                            naturalLanguageName += notString + " felt out of place";
                        }
                        else {
                            naturalLanguageName += notString + " feels out of place";
                        }
                    }
                    break;
                case Status.CAT_FEELING_BAD:
                    naturalLanguageName += isString + notString + "feeling bad"; break;
                case Status.CAT_FEELING_GOOD:
                    naturalLanguageName += isString + notString + "feeling good"; break;
                case Status.CAT_FEELING_BAD_ABOUT_SOMEONE:
                    naturalLanguageName += isString + notString + "feeling bad about someone"; break;
                case Status.CAT_FEELING_GOOD_ABOUT_SOMEONE:
                    naturalLanguageName += isString + notString + "feeling good about someone"; break;
                case Status.CAT_REPUTATION_BAD:
                    if (this.negated) {
                        if (this.isSFDB) {
                            naturalLanguageName += " did not have a bad reputation";
                        }
                        else {
                            naturalLanguageName += " does not have a bad reputation";
                        }
                    }
                    else {
                        if (this.isSFDB) {
                            naturalLanguageName += " had a bad reputation";
                        }
                        else {
                            naturalLanguageName += " has a bad reputation";
                        }
                    }
                    break;
                case Status.CAT_REPUTATION_GOOD:
                    if (this.negated) {
                        if (this.isSFDB) {
                            naturalLanguageName += " did not have a good reputation";
                        }
                        else {
                            naturalLanguageName += " does not have a good reputation";
                        }
                    }
                    else {
                        if (this.isSFDB) {
                            naturalLanguageName += " had a good reputation";
                        }
                        else {
                            naturalLanguageName += " has a good reputation";
                        }
                    }
                    break;
                case Status.HEARTBROKEN:
                    naturalLanguageName += isString + notString + "heartbroken"; break;
                case Status.CHEERFUL:
                    naturalLanguageName += isString + notString + "feeling cheerful"; break;
                case Status.CONFUSED:
                    naturalLanguageName += isString + notString + "confused"; break;
                case Status.LONELY:
                    naturalLanguageName += isString + notString + "feeling lonely"; break;
                case Status.HOMEWRECKER:
                    naturalLanguageName += isString + notString + "a homewrecker"; break;
                case Status.HAS_A_CRUSH_ON:
                    if (this.negated) {
                        if (this.isSFDB) {
                            naturalLanguageName += " did not have a crush on " + secondary;
                        }
                        else {
                            naturalLanguageName += " does not have a crush on " + secondary;
                        }
                    }
                    else {
                        if (this.isSFDB) {
                            naturalLanguageName += " had a crush on " + secondary;
                        }
                        else {
                            naturalLanguageName += " has a crush on " + secondary;
                        }
                    }
                    break;
                case Status.ANGRY_AT:
                    naturalLanguageName += isString + notString + "angry at " + secondary; break;
                case Status.WANTS_TO_PICK_ON:
                    if (this.negated) {
                        if (this.isSFDB) {
                            naturalLanguageName += " did not want to pick on " + secondary;
                        }
                        else {
                            naturalLanguageName += " does not want to pick on " + secondary;
                        }
                    }
                    else {
                        if (this.isSFDB) {
                            naturalLanguageName += " wanted to pick on " + secondary;
                        }
                        else {
                            naturalLanguageName += " wants to pick on " + secondary;
                        }
                    }
                    break;
                case Status.ANNOYED_WITH:
                    naturalLanguageName += isString + notString + "annoyed with " + secondary; break;
                case Status.SCARED_OF:
                    naturalLanguageName += isString + notString + "scared of " + secondary; break;
                case Status.PITIES:
                    if (this.negated) {
                        if (this.isSFDB) {
                            naturalLanguageName += " did not pity " + secondary;
                        }
                        else {
                            naturalLanguageName += " does not pity " + secondary;
                        }
                    }
                    else {
                        if (this.isSFDB) {
                            naturalLanguageName += " pitied " + secondary;
                        }
                        else {
                            naturalLanguageName += " pities " + secondary;
                        }
                    }
                    break;
                case Status.ENVIES:
                    if (this.negated) {
                        if (this.isSFDB) {
                            naturalLanguageName += " did not envy " + secondary;
                        }
                        else {
                            naturalLanguageName += " does not envy " + secondary;
                        }
                    }
                    else {
                        if (this.isSFDB) {
                            naturalLanguageName += " envied " + secondary;
                        }
                        else {
                            naturalLanguageName += " envies " + secondary;
                        }
                    }
                    break;
                case Status.GRATEFUL_TOWARD:
                    naturalLanguageName += isString + notString + " grateful toward " + secondary; break;
                case Status.TRUSTS:
                    if (this.negated) {
                        if (this.isSFDB) {
                            naturalLanguageName += " did not trust " + secondary;
                        }
                        else {
                            naturalLanguageName += " does not trust " + secondary;
                        }
                    }
                    else {
                        if (this.isSFDB) {
                            naturalLanguageName += " trusted " + secondary; 
                        }
                        else {
                            naturalLanguageName += " trusts " + secondary; 
                        }
                    }
                    break;
                case Status.FEELS_SUPERIOR_TO:
                    if (this.negated) {
                        if (this.isSFDB) {
                            naturalLanguageName += " did not feel superior to " + secondary;
                        }
                        else {
                            naturalLanguageName += " does not feel superior to " + secondary;
                        }
                    }
                    else {
                        if (this.isSFDB) {
                            naturalLanguageName += " felt superior to " + secondary; 
                        }
                        else {
                            naturalLanguageName += " feels superior to " + secondary; 
                        }
                    }
                    break;
                case Status.CHEATING_ON:
                    naturalLanguageName += isString + notString + "cheating on " + secondary; break;
                case Status.CHEATED_ON_BY:
                    naturalLanguageName += isString + notString + "cheated on by " + secondary; break;
                case Status.HOMEWRECKED:
                    if(this.negated){
                        if (this.isSFDB) {
                            naturalLanguageName += " did not homewreck " + secondary; break;
                        }
                        else {
                            naturalLanguageName += " is not homewrecking " + secondary; break;
                        }
                    }
                    else{
                        if (this.isSFDB) {
                            naturalLanguageName += " homewrecked " + secondary; break;
                        }
                        else {
                            naturalLanguageName += " is homewrecking " + secondary; break;
                        }
                    }
                default:
                    naturalLanguageName += " not a known status id = " + theStatus;
            }

            naturalLanguageName = naturalLanguageName.split("  ").join(" "); // if there are any double spaces, change it to just a single space.
            return naturalLanguageName;
        }

        /**
         * Turns a ckb thing into a natural language thing.
         * @param	primary The actual name of the primary "Karen"
         * @param	secondary The actual name of the secondary "Edward"
         * @param	tertiary The actual name of the tertiary "Robert"
         * @return The natural language name of the ckb
         */
        this.ckbPredicateToNaturalLanguage = function(primary, secondary, tertiary) {
            var naturalLanguageName = "";
            var amountOfThings = "";
            var gestaltTruth = "";
            var negatedString = "";
            if (negated) {
                negatedString = "it isn't the case that ";
            }

            //CKB((i,likes),(r,likes),cool) == I and R both like something cool
            //CKB((i,likes),(r,likes),) == I and R both like something
            //CKB((i,likes),(r,),cool) == I likes something cool
            //CKB((i,likes),(,),cool) == I likes something cool
            //CKB((i,likes),(,dislikes),cool) == I likes something cool that SOMEONE dislikes, maybe?

            gestaltTruth = this.truthLabel; // cool, lame, romantic, etc.
            if (gestaltTruth != "") gestaltTruth = " " + gestaltTruth;

            if ( this.firstSubjectiveLink != this.secondSubjectiveLink) {
                //PRIMARY AND SECONDARY DISAGREE

                //based on the num times uniquely true, it will use a different word to describe it!
                //But where do I handle negation?
                if (this.numTimesUniquelyTrue == 1 || this.numTimesUniquelyTrue == 0 ) amountOfThings = "something" + gestaltTruth;
                if (this.numTimesUniquelyTrue == 2) amountOfThings = "a couple" + gestaltTruth + " things";
                if (this.numTimesUniquelyTrue >= 3) amountOfThings = "a lot of" + gestaltTruth + " things";

                naturalLanguageName = negatedString + primary + " " + this.firstSubjectiveLink + " " + amountOfThings;
                if (secondary != "" && this.secondSubjectiveLink != "")
                    naturalLanguageName += " that " + secondary + " " + this.secondSubjectiveLink;
            }
            else if (this.firstSubjectiveLink == this.secondSubjectiveLink) {
                //PRIMARY AND SECONDARY AGREE
                var theirFeeling;

                if (this.firstSubjectiveLink == "likes") theirFeeling = "like";
                else if (this.firstSubjectiveLink == "dislikes") theirFeeling = "dislike";
                else if (this.firstSubjectiveLink == "wants") theirFeeling = "want";
                else if (this.firstSubjectiveLink == "has") theirFeeling = "have";

                //based on the num times uniquely true, it will use a different word to describe it!
                if (this.numTimesUniquelyTrue == 1 || this.numTimesUniquelyTrue == 0 ) naturalLanguageName = negatedString + primary + " and " + secondary + " both " + theirFeeling + (gestaltTruth == "" ? " the same thing" : " something" + gestaltTruth);
                if (this.numTimesUniquelyTrue == 2) naturalLanguageName = negatedString + primary + " and " + secondary + " both " + theirFeeling + " a couple" + gestaltTruth + " things";
                if (this.numTimesUniquelyTrue >= 3) naturalLanguageName = negatedString + primary + " and " + secondary + " both " + theirFeeling + " lots of" + gestaltTruth + " things";
            }

            naturalLanguageName = naturalLanguageName.split("  ").join(" "); // if there are any double spaces, change it to just a single space.
            return naturalLanguageName;
        }

        /**
         * Turns a sfdb thing into a natural language thing.
         * @param	primary The actual name of the primary "Karen"
         * @param	secondary The actual name of the secondary "Edward"
         * @param	tertiary The actual name of the tertiary "Robert"
         * @return The natural language name of the sfdb
         */
        this.sfdbPredicateToNaturalLanguage(primary, secondary, tertiary) {
            var naturalLanguageName = "";
            var timeElapsed = "";
            var label = this.sfdbLabel;

            var sfdbLabelType = SocialFactsDB.getLabelByNumber(label);
            if (SocialFactsDB.CAT_POSITIVE == label) {
                sfdbLabelType = "generally positive";
            }
            else if (SocialFactsDB.CAT_NEGATIVE == label){
                sfdbLabelType = "generally negative";
            }
            else if (SocialFactsDB.CAT_FLIRT == label){
                sfdbLabelType = "flirty";
            }

            //Going to try to move timeElapsed stuff to the outerloop.
            //naturalLanguageName = primary + " did something " + sfdbLabelType + " to " + secondary + " " + timeElapsed;
            if (sfdbLabelType == "misunderstood") {
                naturalLanguageName = primary + " did something that was misunderstood by " + secondary;
            } else if (sfdbLabelType == "failed romance") {
                naturalLanguageName = primary + " did something romantic that was rejected by " + secondary;
            } else if (sfdbLabelType == "lame") {
                naturalLanguageName = primary + " did something lame in front of " + secondary;
            } else if (sfdbLabelType == "embarrassing") {
                naturalLanguageName = primary + " did something embarrassing in front of " + secondary;	
            } else if (sfdbLabelType.search("_ACT") != -1) {
                naturalLanguageName = primary + " played part of a story sequence with " + secondary;
            }
            else {
                naturalLanguageName = primary + " did something " + sfdbLabelType + " to " + secondary;
            }

            if (primary == secondary || secondary == "") {
                //This is a case where the SFDB should only care about the primary person.
                //naturalLanguageName = primary + " did something " + sfdbLabelType + " " + timeElapsed;
                naturalLanguageName = primary + " did something " + sfdbLabelType;
                return naturalLanguageName;
            }

            naturalLanguageName = naturalLanguageName.split("  ").join(" "); // if there are any double spaces, change it to just a single space.
            naturalLanguageName = naturalLanguageName.replace(" .", "."); // replace an extra space before period with no space.

            return naturalLanguageName;
        }

        var directedPluralNegatedFirst = function(strIfMultiple, strIfSingle, numTimes) {
            var returnStr = " ";
            if (numTimes == 1) {
                returnStr += strIfSingle + " anybody";
            } else {
                returnStr += strIfMultiple + " fewer than " + numTimes + " people";
            }
            return returnStr;
        }

        var directedPluralNegatedSecond = function(strIfMultiple, strIfSingle, numTimes) {
            var returnStr = " ";
            if (numTimes == 1) {
                returnStr += "Nobody " + strIfSingle + " ";
            } else {
                returnStr += "Fewer than " + numTimes + " people " + strIfMultiple + " ";
            }
            return returnStr;
        }

        var directedPluralNonNegatedSecond = function(strIfMultiple, strIfSingle, numTimes) {
            var returnStr = " ";
            if (numTimes == 1) {
                returnStr += "Somebody " + strIfSingle + " ";
            } else {
                returnStr += "At least " + numTimes + " people " + strIfMultiple + " ";
            }
            return returnStr;
        }

        /**
         * We need to do some special garbage if we are dealing with num times uniquely true predicates.
         * Specifically, what we need to do is still go through each kind of predicate (because it is going
         * to be special for each kind of predicate, relationship, network, etc).  and come up with special
         * I think it might even be wildly different depending on who the role slot is.  Or, well, maybe
         * only it is different if it is both.
         * phrases for each one.
         * @param	primary The actual name of the primary "Karen"
         * @param	secondary The actual name of the secondary "Edward"
         * @param	tertiary The actual name of the tertiary "Robert"
         * @return  The natural language of the num times uniquely true predicate
         */
        this.numTimesUniquelyTruePredicateToNaturalLanguage = function(primary, secondary, tertiary) {
            var heroName = "";
            var naturalLanguageName = "";
            var numTimes = this.numTimesUniquelyTrue;
            var predicateName = Predicate.getNameByType(this.type); // "network", "relationship", etc.
            var notString = "";
            var isHigh = false;
            var isLow = false;
            var isNotHigh = false;
            var isNotLow = false;
            var numTimesRoleSlot = this.NumTimesRoleSlot.toLowerCase();

            var label = this.sfdbLabel;

            if (this.negated == true) {
                notString = " not";
            }
            var people = " people ";
            var isAre = " are ";
            var plurS = " ";
            var dont = " don't ";
            if (numTimes == 1) {
                people = " person ";
                isAre = " is ";
                plurS = "s ";
                dont = " doesn't ";
            }

            if (numTimesRoleSlot.toLowerCase() == "first") {
                heroName = primary;
            }
            else if (numTimesRoleSlot.toLowerCase() == "second") {
                heroName = secondary;
            }
            else if (numTimesRoleSlot.toLowerCase() == "both") {
                heroName = primary + " and " + secondary;
            }

            switch (predicateName) {
                case "network": // this one is hard because we need to worry about directionality.

                    if (meansHigh(this.networkValue) && this.comparator=="greaterthan") isHigh = true;
                    else if (meansLow(this.networkValue) && this.comparator == "lessthan") isLow = true;
                    else if (meansLow(this.networkValue) && this.comparator == "greaterthan") isNotLow = true;
                    else if (meansMedium(this.networkValue) && this.comparator == "greaterthan") isNotLow = true;
                    else if (meansHigh(this.networkValue) && this.comparator == "lessthan") isNotHigh = true;
                    else if (meansMedium(this.networkValue) && this.comparator == "lessthan") isNotHigh = true;

                    //let's think about it for a second.
                    //let's say that 'first' is the role slot that we care about.
                    //then we are interested in things like "First finds 5 people to be cool, or first finds 3 people to be buddis > 60"
                    //If 'second' is the role slot that we care about,
                    //then we are interested in things like "5 people find second to be cool"
                    //I don't think we need to worry about friend's average opinion for this? Maybe we do, I am going to not worry about it for right now.
                    //OK, so, now too bad.
                    if (numTimesRoleSlot.toLowerCase() == "first") {
                        switch(SocialNetwork.getNameFromType(this.networkType)) {
                            case "buddy":
                                if (isLow) {
                                    if (this.negated) {
                                        naturalLanguageName = "there " + isAre + " not even " + numTimes + people + " who " + heroName + " dislikes"; break;
                                    }
                                    else {
                                        naturalLanguageName = heroName + " dislikes at least " + numTimes + people; break;
                                    }
                                }
                                else if (isNotLow) {
                                    if (this.negated) {
                                        naturalLanguageName = heroName + " does not even like " + numTimes + people; break;
                                    }
                                    else {
                                        naturalLanguageName = heroName + " doesn't dislike at least " + numTimes + people; break;
                                    }
                                }
                                else if (isHigh) {
                                    if (this.negated) {
                                        naturalLanguageName = "there" + isAre + "not even " + numTimes + people + " who " + heroName + " likes"; break;
                                    }
                                    else {
                                        naturalLanguageName = heroName + " likes at least " + numTimes + people; break;
                                    }
                                }
                                else if (isNotHigh) {
                                    if (this.negated) {
                                        naturalLanguageName = heroName + " doesn't dislike at least " + numTimes + people; break;
                                    }
                                    else {
                                        naturalLanguageName = heroName + " does not even like " + numTimes + people; break;
                                    }
                                }
                                else {
                                    naturalLanguageName = "problem with numTimesUniqelyTrue network predicate to Natural Language";
                                    break;
                                }
                            case "romance":
                                if (isLow) {
                                    if (this.negated) {
                                        naturalLanguageName = "there" + isAre + "not even " + numTimes + people + " who " + heroName + " is attracted to"; break;
                                    }
                                    else {
                                        naturalLanguageName = heroName + " is actively unattracted to at least " + numTimes + people; break;
                                    }
                                }
                                else if (isNotLow) {
                                    if (this.negated) {
                                        naturalLanguageName = "there " + isAre + " not even  " + numTimes + people + " who do not turn " + heroName + " off"; break;
                                    }
                                    else {
                                        naturalLanguageName = "there " + isAre + " at least " + numTimes + people + " who do not turn " + heroName + " off"; break;
                                    }
                                }
                                else if (isHigh) {
                                    if (this.negated) {
                                        naturalLanguageName = "there " + isAre + " not even " + numTimes + people + " who " + heroName + " is romantically interested in"; break;
                                    }
                                    else {
                                        naturalLanguageName = heroName + " is romantically interested in at least " + numTimes + people; break;
                                    }
                                }
                                else if (isNotHigh) {
                                    if (this.negated) {
                                        naturalLanguageName = "there " + isAre + " not even " + numTimes + people + "who do not turn " + heroName + " on"; break;
                                    }
                                    else {
                                        naturalLanguageName = "there " + isAre + " at least " + numTimes + people + "who do not turn " + heroName + " on"; break;
                                    }
                                }
                                else {
                                    naturalLanguageName = "problem with numTimesUniqelyTrue network predicate to Natural Language";
                                    break;
                                }
                            case "cool":
                                if (isLow) {
                                    if (this.negated) {
                                        naturalLanguageName = "there" + isAre + "not even " + numTimes + people + "who " + heroName + " thinks" + isAre + "uncool"; break;
                                    }
                                    else {
                                        naturalLanguageName = heroName + " thinks at least " + numTimes + people + isAre + " uncool"; break;
                                    }
                                }
                                else if (isNotLow) {
                                    if (this.negated) {
                                        naturalLanguageName = heroName + " does not even think " + numTimes + people + isAre + " not uncool"; break;
                                    }
                                    else {
                                        naturalLanguageName = heroName + " thinks at least " + numTimes + people + isAre + " not uncool"; break;
                                    }
                                }
                                else if (isHigh) {
                                    if (this.negated) {
                                        naturalLanguageName = "there " + isAre + " not even " + numTimes + people + "who " + heroName + " thinks " + isAre + "cool"; break;
                                    }
                                    else {
                                        naturalLanguageName = heroName + " thinks at least " + numTimes + people + isAre + "cool"; break;
                                    }
                                }
                                else if (isNotHigh) {
                                    if (this.negated) {
                                        naturalLanguageName = heroName + " thinks at least " + numTimes + people + isAre + "cool"; break;
                                    }
                                    else {
                                        naturalLanguageName = heroName + " does not even think " + numTimes + people + isAre + "cool"; break;
                                    }
                                }
                                else {
                                    naturalLanguageName = "problem with numTimesUniqelyTrue network predicate to Natural Language";
                                    break;
                                }
                        }
                    }
                    else if (numTimesRoleSlot.toLowerCase() == "second") { // these are referring to there being someone who is the recipient of many opinions!
                        switch(SocialNetwork.getNameFromType(this.networkType)) {
                            case "buddy":
                                if (isLow) {
                                    if (this.negated) {
                                        naturalLanguageName = "There" + isAre + "not even " + numTimes + people + " who dislike " + heroName; break;
                                    }
                                    else {
                                        naturalLanguageName = "At least " + numTimes + people + " dislike " + heroName; break;
                                    }

                                }
                                else if (isNotLow) {
                                    if (this.negated) {
                                        naturalLanguageName = "There" + isAre + "not even " + numTimes + people + " who don't dislike " + heroName; break;
                                    }
                                    else {
                                        naturalLanguageName = "At least " + numTimes + people + " don't dislike " + heroName; break;
                                    }
                                }
                                else if (isHigh) {
                                    if (this.negated) {
                                        naturalLanguageName = "There" + isAre + "not even " + numTimes + people + " who like " + heroName; break;
                                    }
                                    else {
                                        naturalLanguageName = "At least " + numTimes + people + " like " + heroName; break;
                                    }
                                }
                                else if (isNotHigh) {
                                    if (this.negated) {
                                        naturalLanguageName = "There" + isAre + "not even " + numTimes + people + " who " + isAre + " not good buddies with " + heroName; break;
                                    }
                                    else {
                                        naturalLanguageName = "At least " + numTimes + people + isAre + " not good buddies with " + heroName; break;
                                    }
                                }
                                else {
                                    naturalLanguageName = "problem with numTimesUniqelyTrue network predicate to Natural Language";
                                    break;
                                }
                            case "romance":
                                if (isLow) {
                                    if (this.negated) {
                                        naturalLanguageName = "There" + isAre + "not even " + numTimes + people + " turned off by " + heroName; break;
                                    }
                                    else {
                                        naturalLanguageName = "At least " + numTimes + " people " + isAre + " turned off by " + heroName; break;
                                    }
                                }
                                else if (isNotLow) {
                                    if (this.negated) {
                                        naturalLanguageName = "There" + isAre + "not even " + numTimes + people + " who" + isAre + "not turned off by " + heroName; break;
                                    }
                                    else {
                                        naturalLanguageName = "At least " + numTimes + people + isAre + "turned off by " + heroName; break;
                                    }
                                }
                                else if (isHigh) {
                                    if (this.negated) {
                                        naturalLanguageName = "There" + isAre + "not even " + numTimes + people + " who" + isAre + " turned on by " + heroName; break;
                                    }
                                    else {
                                        naturalLanguageName = "At least " + numTimes + people + isAre + "turned on by " + heroName; break;
                                    }
                                }
                                else if (isNotHigh) {
                                    if (this.negated) {
                                        naturalLanguageName = "There" + isAre + "not even " + numTimes + people + " who aren't turned on by " + heroName; break;
                                    }
                                    else {
                                        naturalLanguageName = "At least " + numTimes + people + isAre + "not turned on by " + heroName; break;
                                    }
                                }
                                else {
                                    naturalLanguageName = "problem with numTimesUniqelyTrue network predicate to Natural Language";
                                    break;
                                }
                            case "cool":
                                if (isLow) {
                                    if (this.negated) {
                                        naturalLanguageName = "There" + isAre + "not even " + numTimes + people + " who think" + plurS + heroName + " is totally uncool"; break;
                                    }
                                    else {
                                        naturalLanguageName = "At least " + numTimes + people + "think" + plurS + heroName + " is totally uncool"; break;
                                    }
                                }
                                else if (isNotLow) {
                                    if (this.negated) {
                                        naturalLanguageName = "There" + isAre + "not even " + numTimes + people + " who think" + plurS + heroName + " is not totally uncool"; break;
                                    }
                                    else {
                                        naturalLanguageName = "At least " + numTimes + people + "think" + plurS + heroName + " is not totally uncool"; break;
                                    }
                                }
                                else if (isHigh) {
                                    if (this.negated) {
                                        naturalLanguageName = "There" + isAre + "not even " + numTimes + people + " who think" + plurS + heroName + " is cool"; break;
                                    }
                                    else {
                                        naturalLanguageName = "At least " + numTimes + people + "think" + plurS + heroName + " is cool"; break;
                                    }
                                }
                                else if (isNotHigh) {
                                    if (this.negated) {
                                        naturalLanguageName = "There" + isAre + "not even " + numTimes + people + " who " + dont + "think " + heroName + " is cool"; break;
                                    }
                                    else {
                                        naturalLanguageName = "At least " + numTimes + people + dont + "think " + heroName + " is cool"; break;
                                    }
                                }
                                else {
                                    naturalLanguageName = "problem with numTimesUniqelyTrue network predicate to Natural Language";
                                    break;
                                }
                        }
                    }
                    break;
                case "relationship": // I don't think we need to worry about the 'both' for this situation. This one is easy because we don't need to worry about directionality.
                    var relationshipIsString = " is";
                    var relationshipHasString = " has";
                    if (this.isSFDB) {
                        relationshipIsString = " was";
                        relationshipHasString = " had";
                    }
                    switch(RelationshipNetwork.getRelationshipNameByNumber(this.relationship)) {
                        case 'friends':
                            if (this.negated) {
                                if (numTimes == 1) {
                                    naturalLanguageName = heroName + relationshipHasString + " no friends"; break;
                                } else {
                                    naturalLanguageName = heroName + relationshipIsString + " friends with fewer than " + numTimes + " people"; break;
                                }
                            }
                            else {
                                if (numTimes == 1) {
                                    naturalLanguageName = heroName + relationshipHasString + " a friend"; break;
                                } else {
                                    naturalLanguageName = heroName + relationshipIsString + " friends with at least " + numTimes + " people"; break;
                                }
                            }
                        case 'dating':
                            if (this.negated) {
                                if (numTimes == 1) {
                                    naturalLanguageName = heroName + relationshipIsString + " single"; break;
                                } else {
                                    naturalLanguageName = heroName + relationshipIsString + " dating fewer than " + numTimes + " people"; break;
                                }
                            }
                            else {
                                if (numTimes == 1) {
                                    naturalLanguageName = heroName + relationshipIsString  + " dating someone"; break;
                                } else {
                                    naturalLanguageName = heroName + relationshipIsString  + " dating at least " + numTimes + " people"; break;
                                }
                            }
                        case 'enemies':
                            if (this.negated) {
                                if (numTimes == 1) {
                                    naturalLanguageName = heroName + relationshipHasString + " no enemies"; break;
                                } else {
                                    naturalLanguageName = heroName + relationshipHasString + " less than " + numTimes + " enemies"; break;
                                }
                            }
                            else {
                                if (numTimes == 1) {
                                    naturalLanguageName = heroName + relationshipHasString  + " an enemy"; break;
                                } else {
                                    naturalLanguageName = heroName + relationshipHasString  + " at least " + numTimes + " enemies"; break;
                                }
                            }
                        default:
                            naturalLanguageName = "unrecognized relationship (not friends, dating, or enemies)";
                    }
                    break;
                case "trait":
                    // Pretty sure trait's can't be num times uniquely true thingermajiggers.
                    console.debug(this, "trait's can't be num times uniquely true!");
                    break;
                case "status": // we need to think about these guys a little bit too, because direction matters.
                    //First of all, we only care about directed statuses.
                    //Second of all, we either care about I have a crush on 10 people.
                    //OR we care about 10 people have a crush on me.
                    //Again, I don't think both comes into play here, which is kind of nice.
                    //UMMMMMMMM What about "I was lonely 5 times?!!?!?!?!?!?!!?"
                    //It seems like we DO need to worry about non-directed statuses, too!  But it is 'easier' than directed.
                    //We don't care babout role in that case, and we only care if IsSFDB has been checked.
                    var theStatus = this.status;

                    var cif = CiFSingleton.getInstance();

                    if (theStatus <= Status.LAST_CATEGORY_COUNT)
                    {
                        //resolve which trait they actually have
                        for each (var s in Status.CATEGORIES[this.status])
                        {
                            if (cif.cast.getCharByName(heroName.toLowerCase()).getStatus(s))
                            {
                                theStatus = s;
                            }
                        }
                    }

                    naturalLanguageName = heroName;
                    var pluralString = " at least " + numTimes + " times";
                    var directedPluralNonNegated = " at least " + numTimes + " people";
                    if (theStatus < Status.FIRST_DIRECTED_STATUS && this.isSFDB) { // I think we can assume that the initiator is the person we care about, and only care about the past (since we can't have multiple statuses in the present).
                        if (numTimes == 1) {
                            pluralString = "";
                            directedPluralNonNegated = " someone";
                        }
                        if (numTimes == 2) {
                            pluralString = " at least twice";
                        }
                        switch(theStatus){
                            case Status.EMBARRASSED:
                                if (this.negated) naturalLanguageName += " has got over feeling embarrassed" + pluralString;
                                else naturalLanguageName += " has felt embarrassed" + pluralString;
                                break;
                            case Status.CHEATER:
                                if (this.negated) naturalLanguageName += " has lost the reputation of being a cheater" + pluralString;
                                else naturalLanguageName += " has been a cheater" + pluralString;
                                break;
                            case Status.SHAKEN:
                                if (this.negated) naturalLanguageName += " has stopped feeling shaken" + pluralString;
                                else naturalLanguageName += " has felt shaken" + pluralString;
                                break;
                            case Status.DESPERATE:
                                if (this.negated) naturalLanguageName += " has stopped feeling desperate" + pluralString;
                                else naturalLanguageName += " has felt desperate" + pluralString;
                                break;
                            case Status.CLASS_CLOWN:
                                if (this.negated) naturalLanguageName += " has stopped feeling like the class clown" + pluralString;
                                else naturalLanguageName += " has felt like the class clown" + pluralString;
                                break;
                            case Status.BULLY:
                                if (this.negated) naturalLanguageName += " has stopped feeling like a bully" + pluralString;
                                else naturalLanguageName += " has felt like a bully" + pluralString;
                                break;
                            case Status.LOVE_STRUCK:
                                if (this.negated) naturalLanguageName += " has stopped feeling love struck" + pluralString;
                                else naturalLanguageName += " has felt love struck" + pluralString;
                                break;
                            case Status.GROSSED_OUT:
                                if (this.negated) naturalLanguageName += " has stopped feeling grossed out" + pluralString;
                                else naturalLanguageName += " has felt grossed out" + pluralString;
                                break;
                            case Status.EXCITED:
                                if (this.negated) naturalLanguageName += " has stopped feeling excited" + pluralString;
                                else naturalLanguageName += " has felt excited" + pluralString;
                                break;
                            case Status.POPULAR:
                                if (this.negated) naturalLanguageName += " has stopped being popular" + pluralString;
                                else naturalLanguageName += " has been popular" + pluralString;
                                break;
                            case Status.SAD:
                                if (this.negated) naturalLanguageName += " has stopped feeling sad" + pluralString;
                                else naturalLanguageName += " has felt sad" + pluralString;
                                break;
                            case Status.ANXIOUS:
                                if (this.negated) naturalLanguageName += " has stopped feeling anxious" + pluralString;
                                else naturalLanguageName += " has felt anxious" + pluralString;
                                break;
                            case Status.HONOR_ROLL:
                                if (this.negated) naturalLanguageName += " has been taken off the honor roll" + pluralString;
                                else naturalLanguageName += " has been on the honor roll" + pluralString;
                                break;
                            case Status.LOOKING_FOR_TROUBLE:
                                if (this.negated) naturalLanguageName += " has stopped looking for trouble" + pluralString;
                                else naturalLanguageName += " has looked for trouble" + pluralString;
                                break;
                            case Status.GUILTY:
                                if (this.negated) naturalLanguageName += " has stopped feeling guilty" + pluralString;
                                else naturalLanguageName += " has felt guilty" + pluralString;
                                break;
                            case Status.FEELS_OUT_OF_PLACE:
                                if (this.negated) naturalLanguageName += " has stopped feeling out of place" + pluralString;
                                else naturalLanguageName += " has felt out of place" + pluralString;
                                break;
                            case Status.HEARTBROKEN:
                                if (this.negated) naturalLanguageName += " has stopped feeling heartbroken" + pluralString;
                                else naturalLanguageName += " has felt heartbroken" + pluralString;
                                break;
                            case Status.CHEERFUL:
                                if (this.negated) naturalLanguageName += " has stopped feeling cheerful" + pluralString;
                                else naturalLanguageName += " has felt cheerful" + pluralString;
                                break;
                            case Status.CONFUSED:
                                if (this.negated) naturalLanguageName += " has stopped feeling confused" + pluralString;
                                else naturalLanguageName += " has felt confused" + pluralString;
                                break;
                            case Status.LONELY:
                                if (this.negated) naturalLanguageName += " has stopped feeling lonely" + pluralString;
                                else naturalLanguageName += " has felt lonely" + pluralString;
                                break;
                            case Status.HOMEWRECKER:
                                if (this.negated) naturalLanguageName += " has stopped being regarded as a homewrecker" + pluralString;
                                else naturalLanguageName += " has been regarded as a homewrecker" + pluralString;
                                break;
                            default:
                                naturalLanguageName += "numTimesUniquelyTrue predicate to string -- unrecognized undirected status";
                        }
                    }
                    else if(numTimesRoleSlot.toLowerCase() == "first"){ // we care about this person having a crush on lots of other people
                        switch(theStatus) {
                            case Status.HAS_A_CRUSH_ON:
                                if (this.negated) naturalLanguageName = directedPluralNegatedFirst("has a crush on", "does not have a crush on", numTimes) + heroName;
                                else naturalLanguageName += " has a crush on" + directedPluralNonNegated;
                                break;
                            case Status.ANGRY_AT:
                                if (this.negated) naturalLanguageName = directedPluralNegatedFirst("is angry with", "is not angry with", numTimes) + heroName;
                                else naturalLanguageName += " is angry with" + directedPluralNonNegated;
                                break;
                            case Status.WANTS_TO_PICK_ON:
                                if (this.negated) naturalLanguageName = directedPluralNegatedFirst("wants to pick on", "does not want to pick on", numTimes) + heroName;
                                else naturalLanguageName += " wants to pick on" + directedPluralNonNegated;
                                break;
                            case Status.ANNOYED_WITH:
                                if (this.negated) naturalLanguageName = directedPluralNegatedFirst("is annoyed with", "is not annoyed with", numTimes) + heroName;
                                else naturalLanguageName += " is annoyed with" + directedPluralNonNegated;
                                break;
                            case Status.SCARED_OF:
                                if (this.negated) naturalLanguageName = directedPluralNegatedFirst("is scared of", "is not scared of", numTimes) + heroName;
                                else naturalLanguageName += " is scared of" + directedPluralNonNegated;
                                break;
                            case Status.PITIES:
                                if (this.negated) naturalLanguageName = directedPluralNegatedFirst("pities", "does not pity", numTimes) + heroName;
                                else naturalLanguageName += " pities" + directedPluralNonNegated;
                                break;
                            case Status.ENVIES:
                                if (this.negated) naturalLanguageName = directedPluralNegatedFirst("envies", "does not envy", numTimes) + heroName;
                                else naturalLanguageName += " envies" + directedPluralNonNegated;
                                break;
                            case Status.GRATEFUL_TOWARD:
                                if (this.negated) naturalLanguageName = directedPluralNegatedFirst("is grateful towards", "is not grateful towards", numTimes) + heroName;
                                else naturalLanguageName += " is grateful towards" + directedPluralNonNegated;
                                break;
                            case Status.TRUSTS:
                                if (this.negated) naturalLanguageName = directedPluralNegatedFirst("trusts", "does not trust", numTimes) + heroName;
                                else naturalLanguageName += " trusts" + directedPluralNonNegated;
                                break;
                            case Status.FEELS_SUPERIOR_TO:
                                if (this.negated) naturalLanguageName = directedPluralNegatedFirst("feels superior to", "does not feel superior to", numTimes) + heroName;
                                else naturalLanguageName += " feels superior to" + directedPluralNonNegated;
                                break;
                            case Status.CHEATING_ON:
                                if (this.negated) naturalLanguageName = directedPluralNegatedFirst("is cheating on", "is not cheating on", numTimes) + heroName;
                                else naturalLanguageName += " is cheating on" + directedPluralNonNegated;
                                break;
                            default:
                                naturalLanguageName += " not a known/directed status id = " + theStatus;
                        }
                    }
                    else if (numTimesRoleSlot.toLowerCase() == "second") { // we care about other people having this opinion towards the responder.
                        naturalLanguageName = ""; // we don't want to start with the person's name for these.
                        switch(theStatus) {
                            case Status.HAS_A_CRUSH_ON:
                                if (this.negated) naturalLanguageName = directedPluralNegatedSecond("have a crush on", "has a crush on", numTimes);
                                else naturalLanguageName = directedPluralNonNegatedSecond("have a crush on", "has a crush on", numTimes); 
                                break;
                            case Status.ANGRY_AT:
                                if (this.negated) naturalLanguageName = directedPluralNegatedSecond("are angry at", "is angry at", numTimes);
                                else naturalLanguageName = directedPluralNonNegatedSecond("are angry at", "is angry at", numTimes); 
                                break;
                            case Status.WANTS_TO_PICK_ON:
                                if (this.negated) naturalLanguageName = directedPluralNegatedSecond("wants to pick on", "wants to pick on", numTimes);
                                else naturalLanguageName = directedPluralNonNegatedSecond("wants to pick on", "wants to pick on", numTimes); 
                                break;
                            case Status.ANNOYED_WITH:
                                if (this.negated) naturalLanguageName = directedPluralNegatedSecond("are annoyed with", "is annoyed with", numTimes);
                                else naturalLanguageName = directedPluralNonNegatedSecond("are annoyed with", "is annoyed with", numTimes);  
                                break;
                            case Status.SCARED_OF:
                                if (this.negated) naturalLanguageName = directedPluralNegatedSecond("are scared of", "is scared of", numTimes);
                                else naturalLanguageName = directedPluralNonNegatedSecond("ared scared of", "is scared of", numTimes); 
                                break;
                            case Status.PITIES:
                                if (this.negated) naturalLanguageName = directedPluralNegatedSecond("pity", "pities", numTimes);
                                else naturalLanguageName = directedPluralNonNegatedSecond("pity", "pities", numTimes); 
                                break;
                            case Status.ENVIES:
                                if (this.negated) naturalLanguageName = directedPluralNegatedSecond("envy", "envies", numTimes);
                                else naturalLanguageName = directedPluralNonNegatedSecond("envy", "envies", numTimes); 
                                break;
                            case Status.GRATEFUL_TOWARD:
                                if (this.negated) naturalLanguageName = directedPluralNegatedSecond("are grateful towards", "is grateful towards", numTimes);
                                else naturalLanguageName = directedPluralNonNegatedSecond("are grateful towards", "is grateful towards", numTimes); 
                                break;
                            case Status.TRUSTS:
                                if (this.negated) naturalLanguageName = directedPluralNegatedSecond("trust", "trusts", numTimes);
                                else naturalLanguageName = directedPluralNonNegatedSecond("trust", "trusts", numTimes); 
                                break;
                            case Status.FEELS_SUPERIOR_TO:
                                if (this.negated) naturalLanguageName = directedPluralNegatedSecond("feel superior to", "feels superior to", numTimes);
                                else naturalLanguageName = directedPluralNonNegatedSecond("feel superior to", "feels superior to", numTimes); 
                                break;
                            case Status.CHEATING_ON:
                                if (this.negated) naturalLanguageName = directedPluralNegatedSecond("are cheating on", "is cheating on", numTimes);
                                else naturalLanguageName = directedPluralNonNegatedSecond("are cheating on", "is cheating on", numTimes); 
                                break;
                            case Status.CHEATED_ON_BY:
                                if (this.negated) naturalLanguageName = directedPluralNegatedSecond("are being cheated on by", "is being cheated on", numTimes);
                                else naturalLanguageName = directedPluralNonNegatedSecond("are being cheated on by", "is being cheated on", numTimes); 
                                break;
                            case Status.HOMEWRECKED:
                                if (this.negated) naturalLanguageName = directedPluralNegatedSecond("are homewrecking", "is homewrecking", numTimes);
                                else naturalLanguageName = directedPluralNonNegatedSecond("are homewrecking", "is homewrecking", numTimes); 
                                break;
                            default:
                                naturalLanguageName += " not a known/directed status id = " + theStatus;
                        }
                        naturalLanguageName += " " + heroName;
                    }
                    break;
                case "CKB": // OK, these require a little bit of thought too.
                    //I think we definitely need to use the magic of variables here to shorten the amount of work.
                    //And, also of important note, is that I believe this is the first time that 'both' is actually an important player.
                    //But, fortunately, I don't think there is any distinction between the first and the second.
                    //So, we could be interested in something that the primary person has an opinion on (e.g. primary has five things they like)
                    //or the secondary person (e.g. secondary has five cool things they like)
                    //or it could be explicitly both (there are five things that primary likes and secondary dislikes)

                    //APPARANTLY I HANDLED THIS ALREADY FOR CKB IN THE NORMAL CKB PREDICATE THING!
                    //SO I DON'T NEED TO WORRY ABOUT IT HERE!

                    break;
                case "SFDBLabel":
                    //OK, the last one!  Sweet!
                    //this is the dooozy... because all three cases have to be treated seperately.
                    //If first is selected -- we are interested in the initiator doing a lot of nice thngs.
                    //if second is selected -- we are interested in nicet hings happening to second.
                    //if both are selected -- we are interested in first doing nice things to second.
                    //lets get started!

                    var sfdbLabelType = SocialFactsDB.getLabelByNumber(label);
                    var timeElapsed = "";
                    if (SocialFactsDB.CAT_POSITIVE == label) {
                        sfdbLabelType = "generally positive";
                    }
                    else if (SocialFactsDB.CAT_NEGATIVE == label){
                        sfdbLabelType = "generally negative";
                    }
                    else if (SocialFactsDB.CAT_FLIRT == label){
                        sfdbLabelType = "flirty";
                    }
                    notString = "at least ";
                    if (negated) {
                        notString = "fewer than ";
                    }
                    //console.debug(this, "label: " + label + " sfdbLabelType: " + sfdbLabelType);
                    if (numTimesRoleSlot.toLowerCase() == "first") { // these are things that the initiator did -- we don't care to who!
                        if (numTimes == 1 && negated) {
                            naturalLanguageName = heroName + " hasn't done anything " + sfdbLabelType;
                        } else if (numTimes == 1 && !negated) {
                            naturalLanguageName = heroName + " did something " + sfdbLabelType;
                        } else {
                            naturalLanguageName = heroName + " did " + notString + numTimes + " " + sfdbLabelType + " things";// + timeElapsed;
                        }
                    }
                    else if (numTimesRoleSlot.toLowerCase() == "second") { // these are things that happened to the responder -- we don't care who did them!
                        if (numTimes == 1 && negated) {
                            naturalLanguageName = "Nothing " + sfdbLabelType + " happened to " + heroName;
                        } else if (numTimes == 1 && !negated) {
                            naturalLanguageName = "Something " + sfdbLabelType + " happened to " + heroName;
                        } else {
                            naturalLanguageName = notString + numTimes + " " + sfdbLabelType + " things happened to " + heroName;// + timeElapsed;
                        }
                    }
                    else if (numTimesRoleSlot.toLowerCase() == "both") { // these are things that happened to the responder -- we don't care who did them!
                        if (numTimes == 1 && negated) {
                            naturalLanguageName = heroName + " hasn't done anything " + sfdbLabelType + " to " + secondary;
                        } else if (numTimes == 1 && !negated) {
                            naturalLanguageName = heroName + " did something " + sfdbLabelType + " to " + secondary;
                        } else {
                            naturalLanguageName = primary + " did " + notString + numTimes + " " + sfdbLabelType + " things to " + secondary;// + timeElapsed;
                        }
                    }
                    else {
                        naturalLanguageName = "poorly specified role slot when dealing with sfdb labels to natural language name";
                    }
                    break;
                default:
                    console.debug("Unrecognized predicate type");
            }
            return naturalLanguageName;
        }

        /**
         * This function is the easiest of the easiest.
         * It looks at the value of the sfdbOrder value
         * and simply returns an english string that describes it. At least
         * at first.  We may change it to be smarter later on, but it is good enough for now.
         * @return
         */
        this.sfdbOrderToNaturalLanguage = function() {
            switch(sfdbOrder) {
                case 1: return "first";
                case 2: return "second";
                case 3: return "third";
                case 4: return "fourth";
                case 5: return "fifth";
                case 6: return "sixth";
                case 7: return "seventh";
                case 8: return "eighth";
                case 9: return "ninth";
                case 10: return "tenth";
                default: return "after a lot of other delicate stuff fell into place, too!";
            }
        }

        //Given a string (firUpp), it makes the first letter of that string upper case.
        //Perfect for fixing people's names!
        this.makeFirstLetterUpperCase = function(firUpp) {
            if(firUpp){
                if (firUpp.length == 0) return "";
                return firUpp.charAt(0).toUpperCase() + firUpp.substring(1, firUpp.length);
            }
            else {
                return "";
            }
        }


    }; //End of Predicate

    Predicate.getIntentNameByNumber = function(intentID) {
        switch(intentID)
        {
            case Predicate.INTENT_FRIENDS:
                return "intent(friends)";
            case Predicate.INTENT_END_FRIENDS:
                return "intent(end_friends)";
            case Predicate.INTENT_DATING:
                return "intent(dating)";
            case Predicate.INTENT_END_DATING:
                return "intent(end_dating)";
            case Predicate.INTENT_ENEMIES:
                return "intent(enemies)";
            case Predicate.INTENT_END_ENEMIES:
                return "intent(end_enemies)";
            case Predicate.INTENT_BUDDY_UP:
                return "intent(buddy_up)";
            case Predicate.INTENT_BUDDY_DOWN:
                return "intent(buddy_down)";
            case Predicate.INTENT_ROMANCE_UP:
                return "intent(romance_up)";
            case Predicate.INTENT_ROMANCE_DOWN:
                return "intent(romance_down)";
            case Predicate.INTENT_COOL_UP:
                return "intent(cool_up)";
            case Predicate.INTENT_COOL_DOWN:
                return "intent(cool_down)";
            default:
                return "";
        }
    }

    /**
     * This is a semantic equality function where select properties are
     * tested for equality such that the two predicates have the same
     * meaning.
     * @param	x	First predicate to test for equality.
     * @param	y	Second predicate to test for equality.
     * @return 	True if the predicates have the same meaning or false if
     * they do not.
     */
    Predicate.equals = function(x, y) {
        if (x.type != y.type) return false;
        if (x.intent != y.intent) return false;
        if (x.description != y.description) return false;
        if (x.negated != y.negated) return false;
        if (x.isSFDB != y.isSFDB) return false;
        if (x.numTimesUniquelyTrueFlag != y.numTimesUniquelyTrueFlag) return false;
        if (x.numTimesUniquelyTrue != y.numTimesUniquelyTrue) return false;
        if (x.numTimesUniquelyTrueFlag)
        {
            // only check this if we have are a numTimesUniquelyTrue type predicate.
            // This helps get around a problem where a lot of the roles are set wrong.
            if (x.numTimesRoleSlot != y.numTimesRoleSlot) return false;
        }

        switch(x.type) {
            case Predicate.TRAIT:
                if (x.trait != y.trait) return false;
                if (x.primary != y.primary) return false;
                break;
            case Predicate.STATUS:
                if (x.status != y.status) return false;
                if (x.primary != y.primary) return false;
                if (x.secondary != y.secondary) return false;
                break;
            case Predicate.RELATIONSHIP:
                if (x.relationship != y.relationship) return false;
                if (!((x.primary == y.primary) || (x.primary == y.secondary))) return false;
                if (!((x.secondary == y.primary) || (x.secondary == y.secondary))) return false;
                break;
            case Predicate.NETWORK:
                if (x.primary != y.primary) return false;
                if (x.secondary != y.secondary) return false;
                if (x.networkType != y.networkType) return false;
                if (x.networkValue != y.networkValue) return false;
                if (x.comparator!= y.comparator) return false;
                if (x.operator != y.operator) return false;
                break;
            case Predicate.CKBENTRY:
                if (x.primary != y.primary) return false;
                if (x.secondary != y.secondary) return false;
                if (x.firstSubjectiveLink!= y.firstSubjectiveLink) return false;
                if (x.secondSubjectiveLink!= y.secondSubjectiveLink) return false;
                if (x.truthLabel != y.truthLabel) return false;
                break;
            case Predicate.SFDBLABEL:
                if (x.primary != y.primary) return false;
                if (x.secondary != y.secondary) return false;
                if (x.sfdbLabel != y.sfdbLabel) return false;
                if (x.negated != y.negated) return false;
                if (x.sfdbOrder!= y.sfdbOrder) return false;
                break;
            default:
                console.debug(x, "equals(): unknown Predicate type checked for equality: " + x.type);
                return false;
        }
        return true;
    }

    /**
     * Determines if the structures of two Predicates are equal where
     * structure is every Predicate parameter other than the character
     * variables (primary, secondary, and tertiary) and isSFDB.
     * @param	x
     * @param	y
     * @return	True if the structures of the Predicate match or false if they do not.
     */
    Predicate.equalsEvaluationStructure = function(x, y) {
        if (x.type != y.type) return false;
        if (x.intent != y.intent) return false;
        if (x.negated != y.negated) return false;
        //if (x.isSFDB != y.isSFDB) return false;
        if (x.numTimesUniquelyTrueFlag != y.numTimesUniquelyTrueFlag) return false;
        if (x.numTimesUniquelyTrue != y.numTimesUniquelyTrue) return false;
        if (x.numTimesRoleSlot != y.numTimesRoleSlot) return false;

        switch(x.type) {
            case Predicate.TRAIT:
                if (x.trait != y.trait) return false;
                break;
            case Predicate.STATUS:
                if (x.status != y.status) return false;
                break;
            case Predicate.RELATIONSHIP:
                if (x.relationship != y.relationship) return false;
                break;
            case Predicate.NETWORK:
                if (x.networkType != y.networkType) return false;
                if (x.networkValue != y.networkValue) return false;
                if (x.comparator!= y.comparator) return false;
                if (x.operator != y.operator) return false;
                break;
            case Predicate.CKBENTRY:
                if (x.firstSubjectiveLink!= y.firstSubjectiveLink) return false;
                if (x.secondSubjectiveLink!= y.secondSubjectiveLink) return false;
                if (x.truthLabel != y.truthLabel) return false;
                break;
            case Predicate.SFDBLABEL:
                if (x.sfdbLabel != y.sfdbLabel) return false;
                if (x.negated != y.negated) return false;
                break;
            default:
                console.debug(x, "structureEquals(): unknown Predicate type checked for equality: " + x.type);
                return false;
        }
        return true;
    }

    /**
     * Determines if the structures of two Predicates are equal where
     * structure is every Predicate parameter other than the character
     * variables (primary, secondary, and tertiary) and isSFDB.
     * This function is for comparing ordered rules (which represent change)
     * with effect change rules in SGs played in the past.
     *
     * @param	x
     * @param	y
     * @return	True if the structures of the Predicate match or false if they do not.
     */
    Predicate.equalsValuationStructure = function(x, y) {
        if (x.type != y.type) return false;
        if (x.intent != y.intent) return false;
        if (x.negated != y.negated) return false;
        //if (x.isSFDB != y.isSFDB) return false;
        if (x.numTimesUniquelyTrueFlag != y.numTimesUniquelyTrueFlag) return false;
        if (x.numTimesUniquelyTrue != y.numTimesUniquelyTrue) return false;
        if (x.numTimesRoleSlot != y.numTimesRoleSlot) return false;

        switch(x.type) {
            case Predicate.TRAIT:
                if (x.trait != y.trait) return false;
                break;
            case Predicate.STATUS:
                if (x.status != y.status) return false;
                break;
            case Predicate.RELATIONSHIP:
                if (x.relationship != y.relationship) return false;
                break;
            case Predicate.NETWORK:
                if (x.networkType != y.networkType) return false;
                //Ignore network value -- the type of change is enough.
                //if (x.networkValue != y.networkValue) return false;
                if (x.operator != y.operator) return false;
                break;
            case Predicate.CKBENTRY:
                if (x.firstSubjectiveLink!= y.firstSubjectiveLink) return false;
                if (x.secondSubjectiveLink!= y.secondSubjectiveLink) return false;
                if (x.truthLabel != y.truthLabel) return false;
                break;
            case Predicate.SFDBLABEL:
                if (x.sfdbLabel != y.sfdbLabel) return false;
                if (x.negated != y.negated) return false;
                break;
            default:
                console.debug(x, "structureEquals(): unknown Predicate type checked for equality: " + x.type);
                return false;
        }
        return true;

    }

    Predicate.deepEquals = function(x, y) {
        if (x.type != y.type) return false;
        if (x.trait != y.trait) return false;
        if (x.intent != y.intent) return false;
        if (x.description != y.description) return false;
        if (x.primary != y.primary) return false;
        if (x.secondary != y.secondary) return false;
        if (x.tertiary != y.tertiary) return false;
        if (x.networkValue != y.networkValue) return false;
        if (x.comparator != y.comparator) return false;
        if (x.operator != y.operator) return false;
        if (x.relationship != y.relationship) return false;
        if (x.status != y.status) return false;
        if (x.networkType != y.networkType) return false;
        if (x.firstSubjectiveLink != y.firstSubjectiveLink) return false;
        if (x.secondSubjectiveLink != y.secondSubjectiveLink) return false;
        if (x.truthLabel != y.truthLabel) return false;
        if (x.negated != y.negated) return false;
        if (x.window != y.window) return false;
        if (x.isSFDB != y.isSFDB) return false;
        if (x.sfdbLabel != y.sfdbLabel) return false;
        if (x.numTimesUniquelyTrueFlag != y.numTimesUniquelyTrueFlag) return false;
        if (x.numTimesUniquelyTrue != y.numTimesUniquelyTrue) return false;
        if (x.numTimesRoleSlot != y.numTimesRoleSlot) return false;
        if (x.sfdbOrder!= y.sfdbOrder) return false;
        return true;
    }

    Predicate.equalsForMicrotheoryDefinitionAndSocialGameIntent = function(x, y) {
        if (x.type != y.type) return false;
        //if (x.intent != y.intent) return false;
        if (x.negated != y.negated) return false;
        if (x.isSFDB != y.isSFDB) return false;

        if (x.numTimesUniquelyTrueFlag != y.numTimesUniquelyTrueFlag) return false;
        if (x.numTimesUniquelyTrue != y.numTimesUniquelyTrue) return false;
        if (x.numTimesRoleSlot != y.numTimesRoleSlot) return false;
        if (x.sfdbOrder!= y.sfdbOrder) return false;
        switch(x.type) {
            case Predicate.TRAIT:
                if (x.trait != y.trait) return false;
                if (x.primary != y.primary) return false;
                break;
            case Predicate.STATUS:
                if (x.status != y.status) return false;
                if (x.primary != y.primary) return false;
                if (x.secondary != y.secondary) return false;
                break;
            case Predicate.RELATIONSHIP:
                if (x.relationship != y.relationship) return false;
                if (x.primary != y.primary) return false;
                if (x.secondary != y.secondary) return false;
                break;
            case Predicate.NETWORK:
                if (x.primary != y.primary) return false;
                if (x.secondary != y.secondary) return false;
                if (x.networkType != y.networkType) return false;
                if (x.networkValue != y.networkValue) return false;
                if (x.comparator!= y.comparator) return false;
                if (x.operator != y.operator) return false;
                break;
            case Predicate.CKBENTRY:
                if (x.primary != y.primary) return false;
                if (x.secondary != y.secondary) return false;
                if (x.firstSubjectiveLink!= y.firstSubjectiveLink) return false;
                if (x.secondSubjectiveLink!= y.secondSubjectiveLink) return false;
                if (x.truthLabel != y.truthLabel) return false;
                break;
            case Predicate.SFDBLABEL:
                if (x.primary != y.primary) return false;
                if (x.secondary != y.secondary) return false;
                if (x.sfdbLabel != y.sfdbLabel) return false;
                if (x.negated != y.negated) return false;
                break;
            default:
                console.debug(x, "equals(): unknown Predicate type checked for equality: " + x.type);
                return false;
        }
        return true;
    }
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
