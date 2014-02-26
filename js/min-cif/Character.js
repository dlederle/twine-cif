define(["Cast", "Status", "ProspectiveMemory", "Trait"], function(Cast, Status, ProspectiveMemory, Trait) {

    /**
     * The Character class stores the basic information a character needs to
     * operate in CiF. Characters have a set of traits, a name, a network ID
     * and a prospective memory to store their social game scores.
     * @see CiF.Character
     * @see CiF.SocialNetwork
     * @see CiF.ProspectiveMemory
     * TODO: if a trait is already assigned to a character, make sure it doesn't appear twice.
     */
    var Character = function(opts) {
        opts = opts || {};
        /**
         * The name of the character.
         */
        this.characterName = opts.characterName || "";
        /**
         * The traits associated with a character.
         */
        this.traits = opts.traits || [];
        /**
         * The gender of the character.
         */
        this.gender = opts.gender || "";
        /**
         * The statuses associated with a character.
         */
        this.statuses = opts.statuses || [];
        /**
         * The character's unique ID wrt social networks.
         */
        //Edgecase where it can be 0
        this.networkID = opts.networkID === undefined ? -1 : opts.networkID;
        /**
         * The character's prospective memory used by intent formation and
         * goal setting.
         */
        this.prospectiveMemory = new ProspectiveMemory();
        /**
         * speakerForMixInLocution -- flagged as true if this is the character meant to say something for a mix in locution
         */
        this.isSpeakerForMixInLocution = false;
        /**
         * The character specific mix ins that are used in performance realizations
         */
        this.locutions = {};

        /**
         * The character's main "best friend" "girlfriend" "worst enemy"
         */

        var defaultLocutions = {};
        defaultLocutions["greeting"] = "What's up";
        defaultLocutions["shocked"] = "Holy crap!!!";
        defaultLocutions["positiveadj"] = "cool";
        defaultLocutions["pejorative"] = "loser";
        defaultLocutions["sweetie"] = "sweetie";
        defaultLocutions["buddy"] = "dude";

        //defaultLocutions["buddyMale"] = "dude";
        //defaultLocutions["buddyFemale"] = "dudette";

        this.characterLabels = [];
        for (var i = 0; i < Character.NUM_LABELS; i++ ) {
            this.characterLabels[i] = "";
        }

        /**
         * This function upates who a character think their best friend is, etc.
         */
        this.updateCharacterLabels = function() {
            for (var i = 0; i < Character.NUM_LABELS; i++ ) {
                switch (i)
                {
                    case Character.LABEL_BEST_FRIEND:
                        this.characterLabels[i] = getBestFriend();
                        break;
                    case Character.LABEL_BIGGEST_LOSER:
                        this.characterLabels[i] = getBiggestLoser();
                        break;
                    case Character.LABEL_DATING:
                        this.characterLabels[i] = getDating();
                        break;
                    case Character.LABEL_IDOL:
                        this.characterLabels[i] = getIdol();
                        break;
                    case Character.LABEL_TRUE_LOVE:
                        this.characterLabels[i] = getTrueLove();
                        break;
                    case Character.LABEL_WORST_ENEMY:
                        this.characterLabels[i] = getWorstEnemy();
                        break;
                }
            }
        }

        this.getBestFriend = function() {
            var bestFriend = "";
            var highestNetwork = 0;
            var forChar = cif.cast.getCharByName(this.characterName);
            cif.cast.characters.forEach(function(char) {
                if (char.characterName != forChar.characterName) {
                    if (cif.relationshipNetwork.getRelationship(RelationshipNetwork.FRIENDS, forChar, char)) {
                        var budScore = cif.buddyNetwork.getWeight(forChar.networkID, char.networkID);
                        if (budScore > 66) {
                            if (budScore > highestNetwork) {
                                bestFriend = char.characterName;
                                highestNetwork = budScore;
                            }
                        }
                    }
                }
            });
            return bestFriend;
        }

        this.getIdol = function() {
            var idol = "";
            var highestNetwork = 0;
            var forChar = cif.cast.getCharByName(this.characterName);
            cif.cast.characters.forEach(function(char) {
                if (char.characterName != forChar.characterName) {
                    var coolScore = cif.coolNetwork.getWeight(forChar.networkID, char.networkID);
                    if (coolScore > 66) {
                        if (coolScore > highestNetwork) {
                            idol = char.characterName;
                            highestNetwork = coolScore;
                        }
                    }
                }
            });
            return idol;
        }

        this.getTrueLove = function() {
            var trueLove = "";
            var highestNetwork = 0;
            var forChar = cif.cast.getCharByName(this.characterName);
            cif.cast.characters.forEach(function(char) {
                if (char.characterName != forChar.characterName) {
                    var romanceScore = cif.romanceNetwork.getWeight(forChar.networkID, char.networkID);
                    if (romanceScore > 66) {
                        if (romanceScore > highestNetwork || (forChar.hasStatus(Status.HAS_A_CRUSH_ON,char) && romanceScore > (highestNetwork - 20)) ) {
                            trueLove = char.characterName;
                            highestNetwork = romanceScore;
                        }
                    }
                }
            });
            return trueLove;
        }

        this.getBiggestLoser = function() {
            var biggestLoser = "";
            var lowestNetwork = 20;
            var forChar = cif.cast.getCharByName(this.characterName);

            cif.cast.characters.forEach(function(char) {
                if (char.characterName != forChar.characterName) {
                    if (!cif.relationshipNetwork.getRelationship(RelationshipNetwork.FRIENDS, forChar, char)) {
                        var coolScore = cif.coolNetwork.getWeight(forChar.networkID, char.networkID);
                        if (coolScore < 20) {
                            if (coolScore < lowestNetwork) {
                                biggestLoser = char.characterName;
                                lowestNetwork = coolScore;
                            }
                        }
                    }
                }
            });
            return biggestLoser;
        }

        this.getDating = function() {
            var dating = "";
            var highestNetwork = 0;
            var forChar = cif.cast.getCharByName(this.characterName);
            cif.cast.characters.forEach(function(char) {
                if (char.characterName != forChar.characterName) {
                    if (cif.relationshipNetwork.getRelationship(RelationshipNetwork.DATING, forChar, char)) {
                        var romanceScore = cif.coolNetwork.getWeight(forChar.networkID, char.networkID);
                        if (romanceScore > highestNetwork) {
                            dating = char.characterName;
                            highestNetwork = romanceScore;
                        }
                    }
                }
            });
            return dating;
        }

        this.getWorstEnemy = function() {
            var worstEnemy = "";
            var lowestNetwork = 0;
            var forChar = cif.cast.getCharByName(this.characterName);
            cif.cast.characters.forEach(function(char) {
                if (char.characterName != forChar.characterName) {
                    if (cif.relationshipNetwork.getRelationship(RelationshipNetwork.ENEMIES, forChar, char)) {
                        var budScore = cif.buddyNetwork.getWeight(forChar.networkID, char.networkID);
                        if (budScore < 34) {
                            if (budScore < lowestNetwork) {
                                worstEnemy = char.characterName;
                                lowestNetwork = budScore;
                            }
                        }
                    }
                }
            });
            return worstEnemy;
        }

        /**
         * Assigns a trait to the character.
         * @param t
         */
        this.setTrait = function(t) {
            if (t <= Trait.LAST_CATEGORY_COUNT) {
                Trait.CATEGORIES.forEach(function(i) {
                    this.traits.push(i);
                });
            }
            else {
                this.traits.push(t);
            }
        }

        /**
         * Returns true if the character has the specified trait. It matches 
         * the number in traits vector with the const indentifiers in the Trait
         * class.
         * @param t
         * @return
         */
        this.hasTrait = function(t) {
            var i = 0;
            if (t <= Trait.LAST_CATEGORY_COUNT) {
                Trait.CATEGORIES[t].forEach(function(cat_trait) {
                    for (i = 0; i < this.traits.length; ++i) {
                        if (this.traits[i] == cat_trait) return true;
                    }
                });
            }
            else {
                for (i = 0; i < this.traits.length; ++i) {
                    if (this.traits[i] == t) {
                        return true;
                    }
                }
            }
            return false
        }

        /**
         * @param	nid
         */
        this.setNetworkID = function(nid) {
            this.networkID = nid;
        }

        /**
         * Sets a name for the character
         * @param newName
         */
        this.setName = function(newName) {
            this.characterName = newName;
        }

        /**********************************************************************
         * Status Functions
         *********************************************************************/

        /**
         * Determines if the character has a status with a type with a character
         * status target if the status is directed.
         * @param	statusType		The type of the status.
         * @param	towardCharacter	The character the status is directed to.
         * @return	True if the character has the status, false if he does not.
         */
        this.hasStatus = function(statusID, towardChar) {
            var i = 0;
            if (statusID <= Status.LAST_CATEGORY_COUNT) {
                Status.CATEGORIES[statusID].forEach(function(cat_status) {
                    this.statuses.forEach(function(status2) {
                        if (status2.type == cat_status) return true;
                    });
                });
            }
            else {
                this.statuses.forEach(function(status) {
                    if (statusID == status.type) {
                        if (statusID >= Status.FIRST_DIRECTED_STATUS) {
                            if (towardChar) {
                                if (status.directedToward.toLocaleLowerCase() == towardChar.characterName.toLowerCase()) {
                                    return true;
                                }
                            }
                        }
                        else {
                            return true;
                        }
                    }
                });
            }
            //console.debug(this,"getStatus() "+this.characterName+" does not have the status "+Status.getStatusNameByNumber(statusID));

            return false;
        }

        /**
         * Give the character a status with a type and a character status target
         * if the status is directed.
         * @param	statusType		The type of the status.
         * @param	towardCharacter	The character the status is directed to.
         */
        this.addStatus = function(statusType, towardCharacter) {
            var status;

            //if the type is a status category
            if (statusType < Status.FIRST_NOT_DIRECTED_STATUS) {
                //apply all statuses in that category
                Status.CATEGORIES[statusType].forEach(function(type) {
                    if (!this.getStatus(type, towardCharacter)) {
                        console.debug(this,"addStatus() HEY! Don't do this! Don't add category statuses, it's just weird.");
                        status = new Status();
                        status.type = type;
                        if (status.type >= Status.FIRST_DIRECTED_STATUS)
                    if (!towardCharacter) console.debug(this, "addStatus(): Tried to add a directed status without providing a target Character.");
                    else status.directedToward = towardCharacter.characterName;
                this.statuses.push(status);
                    }
                });
            }
            else {
                if (this.getStatus(statusType, towardCharacter)) {
                    return;
                }

                status = new Status();
                status.type = statusType;
                //if (status.isDirected)
                if (status.type >= Status.FIRST_DIRECTED_STATUS)
                    if (!towardCharacter) console.debug(this, "addStatus(): Tried to add a directed status without providing a target Character.");
                    else status.directedToward = towardCharacter.characterName;
                //console.debug(this, "addStatus(): status added to " + this.characterName + " - " + Status.getStatusNameByNumber(statusType) + " " + statusType );
                //this.statuses[statusType] = status;
                this.statuses.push(status);
            }
            //console.debug(this, "addStatus(): adding status of " + Status.getStatusNameByNumber(status.type) + " " + this.characterName + ((towardCharacter)?" to " + towardCharacter.characterName : ""));
        }

        /**
         * Removes a status from the character according to status type.
         * @param	statusType	The type of status to remove.
         */
        this.removeStatus = function(statusType, towardCharacter) {
            //if the type is a status category
            var i = 0;
            var status;
            if (statusType <= Status.LAST_CATEGORY_COUNT) {
                //delete all statuses in that category
                Status.CATEGORIES[statusType].forEach(function(type) {
                    for (i = 0; i < this.statuses.length; i++ ) {
                        status = new Status();
                        //status.directedToward //??????
                        if (this.statuses[i].type == statusType) {
                            if (statusType >= Status.FIRST_DIRECTED_STATUS) {
                                if (this.statuses[i].directedToward.toLowerCase() == towardCharacter.characterName.toLowerCase()) {
                                    this.statuses.splice(i, 1);
                                }
                            }
                            else {
                                //not directed
                                this.statuses.splice(i, 1);
                            }
                        }
                    }
                });
            }
            else {
                for (i = 0; i < this.statuses.length; i++ ) {
                    status = new Status();
                    //status.directedToward //??????
                    if (this.statuses[i].type == statusType) {
                        if (statusType >= Status.FIRST_DIRECTED_STATUS) {
                            if (this.statuses[i].directedToward.toLowerCase() == towardCharacter.characterName.toLowerCase()) {
                                this.statuses.splice(i, 1);
                            }
                        }
                        else {
                            //not directed
                            this.statuses.splice(i, 1);
                        }
                    }
                }
            }
        }

        /**
         * Give the character a trait.  This should only be done in 'special circumstances' like
         * on the console, OR maybe if the player has omnipotent god like powers!
         * @param	traitType		The type of the trait.
         */
        this.addTrait = function(traitType) {
            if (this.hasTrait(traitType)) {
                return;
            }
            this.traits.push(traitType);
        }

        /**
         * Removes a trait from the character according to trait type.
         * Should only be used on the console or if giving the player
         * special god-like powers to fundamentally change the nature of characters.
         * @param	statusType	The type of status to remove.
         */
        this.removeTrait = function(traitType) {
            var i = 0;
            for (i = 0; i < this.traits.length; i++ ) {
                if (this.traits[i] == traitType) {
                    this.traits.splice(i, 1);
                }
            }
        }

        /**
         * Returns the status if the character has it
         */
        this.getStatus = function(statusID, towardChar) {
            this.statuses.forEach(function(status) {
                if (statusID == status.type) {
                    if (statusID >= Status.FIRST_DIRECTED_STATUS) {
                        if (towardChar) {
                            if (status.directedToward.toLocaleLowerCase() == towardChar.characterName.toLowerCase()) {
                                return status;
                            }
                        }
                    }
                    else {
                        return status;
                    }
                }
            });
        }

        /**
         * Returns the number of the trait if the character has it, -1 if the character does not.
         */
        this.getTrait = function(traitID) {
            this.traits.forEach(function(trait) {
                if (traitID == trait) {
                    return trait
                }
            });

            return -1;
        }

        /**
         * Updates the duration of all statuses held by the character. Removes
         * statuses that have 0 or less remaining duration.
         * TODO: add the status removal to the SFDB.
         * @param	timeElapsed	The amount of time to remove from the statuses.
         */
        this.updateStatusDurations = function(timeElapsed) {
            this.statuses.forEach(function(status) {
                if (status.type != Status.POPULAR) {
                    status.remainingDuration -= timeElapsed;
                    if (status.remainingDuration <= 0) {
                        removeStatus(status.type, Cast.getCharByName(status.directedToward));
                    }
                }
            });
        }

        /**********************************************************************
         * Utility Functions
         *********************************************************************/
        this.clone = function() {
            var ch = new Character();
            var status;
            var locution;
            ch.characterName = this.characterName;
            ch.networkID = this.networkID;
            ch.prospectiveMemory = this.prospectiveMemory;
            ch.traits = this.traits.slice(0);
            this.statuses.forEach(function(status) {
                //status = this.statuses[key] as Status;
                ch.addStatus(status.type, cif.cast.getCharByName(status.directedToward));
            });
            this.locutions.forEach(function(key) {
                locution = this.locutions[key];
                ch.locutions[key] = locution;
            });
            return ch;
        }
    }

    Character.equals = function(x, y) {
        if (x.traits.length !=y.traits.length) return false;
        for (var i = 0; i < x.traits.length; ++i) {
            if ((x.traits[i] != y.traits[i])) return false;
        }
        if (x.characterName != y.characterName) return false;
        if (x.networkID != y.networkID) return false;
        if (x.prospectiveMemory != y.prospectiveMemory) return false;
        return true;
    }

    Character.getLabelNameByID = function(id) {
        switch(id)
        {
            case Character.LABEL_BEST_FRIEND:
                return "Best Friend";
            case Character.LABEL_BIGGEST_LOSER:
                return "Lamest";
            case Character.LABEL_DATING:
                return "Dating";
            case Character.LABEL_IDOL:
                return "Idol";
            case Character.LABEL_TRUE_LOVE:
                return "True Love";
            case Character.LABEL_WORST_ENEMY:
                return "Rival";
            default:
                console.debug(Character, "getLabelNameByID() " + id + " is not a valid id number");
        }
        return "";
    }

    Character.LABEL_BEST_FRIEND = 0;
    Character.LABEL_DATING = 1;
    Character.LABEL_TRUE_LOVE = 2;
    Character.LABEL_IDOL = 3;
    Character.LABEL_BIGGEST_LOSER = 4;
    Character.LABEL_WORST_ENEMY = 5;
    Character.NUM_LABELS = 6;

    return Character;
});
