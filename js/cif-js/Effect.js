define(['CiFSingleton', 'Rule', 'Character', 'Predicate', 'SocialGameContext', 'Status', 'RelationshipNetwork'], function(CiFSingleton, Rule, Character, Predicate, SocialGameContext, Status, RelationshipNetwork) {
    /**
     * This class implements the pairing of a Rule class with a set of
     * SocialChange classes. Multiple Effect classes are aggregated by
     * the SocialGame class to process the outcome of social game play.
     * <p>This class knows the specificity of the rule (aka the number of
     * preconditions in the Rule part of the Effect) so the SocialGame can
     * pick the most salient effect of those who's Rule evaluates to true.</p>
     * <p>The class also stores the ID of it's associated social game
     * instantiation.</p>
     * @see CiF.SocialGame
     * @see CiF.Rule
     * @see CiF.SocialChange
     * @see CiF.Predicate
     */

    var Effect = function(opts) {
        opts = opts || {};
        this._salience;

        /**
         * The conditions for which this effect can be take.
         */
        this.condition = opts.condition || new Rule();
        /**
         * The rule containing the social change associated with the effect.
         */
        this.change = opts.change || new Rule();
        /**
         * Stores what last cif.time the instantiation was seen last
         */
        this.lastSeenTime = opts.lastSeenTime || -1;
        /**
         * Salience Score is an approximate measure of how "awesome" we we think this effect oughta be
         */
        this.salienceScore = opts.salienceScore; //Defaults to undefined
        /**
         * Locutions that comprise this effect's performance realization string
         */
        this.locutions = opts.locutions || [];
        /**
         * True if the Effect is in the accept branch of the social game and
         * false if the Effect is in the reject branch.
         */
        this.isAccept = opts.isAccept || true;
        /**
         * The english interpretation of the Effect's outcome to be used when
         * this effect is referenced in later game play.
         */
        this.referenceAsNaturalLanguage = opts.referenceAsNaturalLanguage || "";
        /**
         * The ID of the instantiation this effect uses for performance
         * realization.
         */
        this.instantiationID = opts.instantiationID || -1;
        this.id = opts.id || -1;

        /**
         * Evaluations the condition of the Effect for truth given the current
         * game state.
         * @param	initiator	The initiator of the social game.
         * @param	responder	The responder of the social game.
         * @param	other		A third party in the social game.
         * @return True if all the predicates in the condition are true. Otherwise,
         * false.
         */
        this.evaluateCondition = function(initiator, responder, other) {
            return this.condition.evaluate(initiator, responder, other);
        }

        /**
         * Updates the social state if given the predicates in this valuation
         * rule.
         *
         * @param	initiator	The initiator of the social game.
         * @param	responder	The responder of the social game.
         * @param	other		A third party in the social game.
         */
        this.valuation = function(initiator, responder, other) {
            this.change.valuation(initiator, responder, other);
        }

        /**
         * Determines if the Effect instantiation requires a third character.
         * @return True if a third character requires or false if one is not.
         */
        this.requiresThirdCharacter = function() {
            return this.condition.requiresThirdCharacter() || this.change.requiresThirdCharacter();
        }

        /**
         * Determines if the Effect instantiation requires a second character.
         * @return True if a third character requires or false if one is not.
         */
        this.requiresOnlyOneCharacter = function() {
            return this.condition.requiresOnlyOneCharacter() || this.change.requiresOnlyOneCharacter();
        }

        /**
         * Checks the Effect's condition rule for a CKB predicate (which
         * constitutes a CKB item reference).
         *
         * @return True if a CKB reference exists in the Effect's change rule,
         * false if none exists.
         */
        this.hasCKBReference = function() {
            this.condition.predicates.forEach(function(p) {
                if (p.type == Predicate.CKBENTRY) {
                    return true;
                }
            });
            return false;
        }

        /**
         * Returns the Predicate that holds the CKB reference for the Effect.
         * @return A Predicate of type CKBENTRY or undefined if no CKBENTRY
         * Predicate exists in the Effect's condition Rule.
         */
        this.getCKBReferencePredicate = function() {
            this.condition.predicates.forEach(function(p) {
                if (p.type == Predicate.CKBENTRY) {
                    return p;
                }
            });
        }



        /**
         * Checks the Effect's condition rule for a SFDB LAbel
         * @return True if a SFDB label exists in the Effect's change rule,
         * false if none exists.
         */
        this.hasSFDBLabel = function() {
            this.change.predicates.forEach(function(p) {
                if (p.type == Predicate.SFDBLABEL) {
                    return true;
                }
            });
            return false;
        }



        /**
         * Returns the Predicate that holds the SFDB Label for the Effect.
         * @return A Predicate of type SFDBLabel or undefined if no SFDBLabel
         * Predicate exists in the Effect's condition Rule.
         */
        this.getSFDBLabelPredicate = function() {
            this.change.predicates.forEach(function(p) {
                if (p.type == Predicate.SFDBLABEL) {
                    return p;
                }
            });
        }

        this.renderTextNotForDialogue = function(currentInitiator, currentResponder, currentOther) {
            if (!currentOther) {
                currentOther = new Character();
            }

            var returnString = "";

            this.locutions.forEach(function(loc) {
                returnString += loc.renderText(currentInitiator, currentResponder, currentOther, undefined);
            });

            return returnString;
        }

        this.get_salience = function() { return this._salience; }

        this.set_salience = function(x) {
            var oldValue = this._salience;
            this._salience = x;
            if (30 == this.instantiationID || 43 == this.instantiationID) {
                console.debug(this, "salience() is now " + this._salience + " and was " + oldValue + " on " + this.condition);
            }
        }

        this.scoreSalience = function() {
            //var salience = 0;
            salience = 0;
            var pred;

            this.change.predicates.forEach(function(pred) {
                if (pred.type == Predicate.SFDBLABEL) {
                    if (pred.sfdbLabel > SocialFactsDB.FIRST_STORY_SEQUENCE) {
                        salience += 6;
                    }
                }
            });

            this.condition.predicates.forEach(function(pred) {
                switch (pred.type) {
                    case Predicate.RELATIONSHIP:
                        if (pred.negated)
            {
                salience += 1
            }
                        else
            {
                salience += 3
            }
            break;
                    case Predicate.NETWORK:
            if (pred.comparator == "lessthan" && pred.networkValue == 34) {
                //We are dealing with a 'low' network.
                salience += LOW_NETWORK_SALIENCE;
            }
            else if (pred.comparator == "greaterthan" && pred.networkValue == 66) {
                //we are dealing with a high network.
                salience += HIGH_NETWORK_SALIENCE;
            }
            else if (pred.comparator == "greaterthan" && pred.networkValue == 33) {
                //We are dealing with MEDIUM network don't pay attention to the 'other half' of a network.
                salience += MEDIUM_NETWORK_SALIENCE;
            }
            else if (pred.comparator == "lessthan" && pred.networkValue == 67) {
                //Technically this is 'medium', but we are going to ignore it in here, because we already caught it in the previous if.
            }
            else {
                //There was an 'unrecognized network value!' here.  Lets give it some salience anyway.
                salience += UNRECOGNIZED_NETWORK_SALIENCE;
                //console.debug(this, "scoreSalience() effect id: " + id + " linked to instantiation " + instantiationID + " had a 'non-standard' network value used.");
            }
            /*
            //a cruddy way to not get the second medium network value
            if (pred.comparator != "lessthan" && pred.networkValue != 67)
            {
            salience += 2
            }
            */
            break;
                    case Predicate.STATUS:
            if (pred.negated)
            {
                salience += 1
            }
            else
            {
                salience += 3
            }
            break;
                    case Predicate.TRAIT:
            if (pred.trait == Trait.TRIP || pred.trait == Trait.GRACE)
            {
                salience += 10000;
            }
            if (pred.negated)
            {
                salience += 1
            }
            else
            {
                salience += 4
            }
            break;
                    case Predicate.CKBENTRY:
            //TODO: current I don't take into consideration whether or not first or second subjective link
            if (pred.primary == "" || pred.secondary == "")
            {
                if (pred.truthLabel == "")
                {
                    salience += 3
                }
                else
                {
                    salience += 4
                }
            }
            else if (pred.truthLabel == "")
            {
                salience += 4
            }
            else
            {
                //this means all are speciufied
                salience += 5
            }
            break;
                    case Predicate.SFDBLABEL:
            if (pred.primary == "" || pred.secondary == "")
            {
                if (pred.sfdbLabel < 0)
                {
                    salience += 8
                }
                else
                {
                    salience += 8
                }
            }
            else if (pred.sfdbLabel < 0)
            {
                salience += 10
            }
            else
            {
                //this means all are specified
                salience += 10
            }
            break;
                    default:
            console.debug(this, "scoring salience for a predicate without an unrecoginzed type of: " + pred.type);
                }
                if (Status.getStatusNameByNumber(pred.status) == "cheating on")
                {
                    salience += 3;
                }
                else if (RelationshipNetwork.getInstance().getRelationshipNameByNumber(pred.relationship) == "enemies")
                {
                    salience += 3;
                }
                else if (RelationshipNetwork.getInstance().getRelationshipNameByNumber(pred.relationship) == "dating")
                {
                    salience += 3;
                }
            });

            if (this.lastSeenTime >= 0) {
                //this means we've seen this effect before
                var penalty;
                penalty = 1000 - (CiF.time - this.lastSeenTime);
                salience = salience - penalty;
            }

            this.salienceScore = salience;
        }

        this.toString = function() {
            var result = (this.isAccept)?"Accept: ":"Reject: ";
            result += this.condition.toString();
            result += " | ";
            result += this.change.toString();
            return result;
        }

        this.clone= function() {
            var e = new Effect();
            e.change = new Rule();
            e.condition = new Rule();
            this.condition.predicates.forEach(function(p) {
                e.condition.predicates.push(p.clone());
            });
            this.change.predicates.forEach(function(p) {
                e.change.predicates.push(p.clone());
            });
            e.id = this.id;
            e.isAccept = this.isAccept;
            e.referenceAsNaturalLanguage = this.referenceAsNaturalLanguage;
            e.instantiationID = this.instantiationID;
            return e;
        }

        this.isCharacterReferencedPresent = function(currentInitiator, currentResponder, currentOther, sgContext, speaker) {
            var referencedInitiator = sgContext.getInitiator();
            var referencedResponder = sgContext.getResponder();
            var referencedOther = sgContext.getOther();

            if (currentInitiator.characterName.toLowerCase() == referencedInitiator.characterName.toLowerCase() ||
                    currentResponder.characterName.toLowerCase() == referencedResponder.characterName.toLowerCase() ||
                    currentOther.characterName.toLowerCase() == referencedOther.characterName.toLowerCase())
            {
                return true;
            }

            return false;
        }

    } //End of Effect

    Effect.equals = function(x, y) {
        if (!Rule.equals(x.change, y.change)) return false;
        if (!Rule.equals(x.condition, y.condition)) return false;
        if (x.id != y.id) return false;
        if (x.isAccept != y.isAccept) return false;
        return true;
    }

    Effect.renderText = function(currentInitiator, currentResponder, currentOther, sgContext, speaker, locs, otherPresent, speakerAddressing) {
        if (!currentOther) {
            currentOther = new Character();
        }

        var realizedString = "";

        var pronounLocution;
        var charLocutionReferenceLocution;
        var thisList;
        var thisPOV;

        var referencedInitiator = sgContext.getInitiator();
        var referencedResponder = sgContext.getResponder();
        var referencedOther = sgContext.getOther();


        var speakerName;
        var listenerName;
        if (speaker == "initiator" || speaker == "i") {
            speakerName = currentInitiator.characterName.toLowerCase();
            listenerName = currentResponder.characterName.toLowerCase();
        }
        else if (speaker == "responder" || speaker == "r") {
            speakerName = currentResponder.characterName.toLowerCase();
            listenerName = currentInitiator.characterName.toLowerCase();
        }
        else if (speaker == "other" || speaker == "o") {
            speakerName = currentOther.characterName.toLowerCase();
            listenerName = currentInitiator.characterName.toLowerCase();
        }
        else {
            console.debug(Effect,"No speaker info was passed in");
        }

        if (speakerAddressing != "") {
            if (speakerAddressing == "initiator" || speakerAddressing == "i") {
                listenerName = currentInitiator.characterName.toLowerCase();
            }
            else if (speakerAddressing == "responder" || speakerAddressing == "r")
            {
                listenerName = currentResponder.characterName.toLowerCase();
            }
            else if (speakerAddressing == "other" || speakerAddressing == "o")
            {
                listenerName = currentOther.characterName.toLowerCase();
            }
        }


        var subjectName = "";
        //this means we need to loop through the locutions again to determine subject
        //by convention, all that aren't the subject are the object.

        if(locs) {
            locs.forEach(function(loc) {
                if (subjectName == "") {
                    if (loc.getType() === "CharacterReferenceLocution") {
                        if (loc.type == "I" || loc.type == "IP")
            {
                subjectName = referencedInitiator.characterName.toLowerCase();//"i"; //the referred to initiator
            }
                        else if (loc.type == "R" || loc.type == "RP")
            {
                subjectName = referencedResponder.characterName.toLowerCase();
            }
                        else if (loc.type == "O" || loc.type == "OP")
            {
                subjectName = referencedOther.characterName.toLowerCase();//"o";
            }
                    }
                    else if (loc.getType() == "ListLocution") {
                        if (loc.who1 == "i") {
                            subjectName = referencedInitiator.characterName.toLowerCase();//"i"; //the referred to initiator
                        }
                        else if (loc.who1 == "r") {
                            subjectName = referencedResponder.characterName.toLowerCase();
                        }
                        else if (loc.who1 == "o") {
                            subjectName = referencedOther.characterName.toLowerCase();//"o";
                        }
                    }
                }
            });


            var currentCharacterName = "";
            var tempSubjectName = "";

            //the we know who the speaker is, and who is the subject, we can render the text
            this.locs.forEach(function(locution) {
                //is the person being referred to present?

                //who is the person being referred to?

                if (locution.getType() == "PronounLocution") {
                    pronounLocution = locution;
                    if (pronounLocution.who == "i") {
                        currentCharacterName = sgContext.getInitiator().characterName.toLowerCase()//referencedInitiator.characterName.toLowerCase();
                    }
                    else if (pronounLocution.who == "r") {
                        currentCharacterName = sgContext.getResponder().characterName.toLowerCase()
                    }
                    else if (pronounLocution.who == "o") {
                        currentCharacterName = sgContext.getOther().characterName.toLowerCase()
                    }

            tempSubjectName = subjectName;
            if (pronounLocution.isSubject)
            {
                tempSubjectName = currentCharacterName;
            }

            if (Effect.isCurrentCharacterPresent(currentCharacterName, currentInitiator, currentResponder, currentOther,otherPresent))
            {
                /*
                 *	PronounLocution (for all types, but he's/she's):
                 * 		- can be speaker and subject, which means "I"
                 * 		- can be speaker and object, which means "me"
                 * 		- can be speakee and subject, which means "you"
                 * 		- can be speakee and object, which means "you"
                 */
                /*
                 *	PronounLocution (for he's/she's):
                 * 		- can be speaker, they're being referred to, and subject, which means "I'm"
                 * 		- can be speaker and object, which means "I'm"
                 * 		- can be speakee and subject, which means "you're"
                 * 		- can be speakee and object, which means "you're"
                 */
                if (pronounLocution.type != "he's/she's" && pronounLocution.type != "was/were")
                {
                    if (pronounLocution.type == "his/her"
                            && currentCharacterName != speakerName
                            //&& currentCharacterName == subjectName)
                        && currentCharacterName == listenerName)
                        {
                            //special case 1
                            realizedString += "your";
                        }
                    else if (pronounLocution.type == "his/her"
                            && currentCharacterName == speakerName
                            && currentCharacterName != tempSubjectName)
                    {
                        //special case 1
                        realizedString += "my";
                    }
                    else if (pronounLocution.type == "him/her"
                            && currentCharacterName == tempSubjectName
                            && currentCharacterName == speakerName)
                    {
                        //special case 2
                        realizedString += "me";
                    }
                    //"normal cases"
                    else if (currentCharacterName == tempSubjectName && currentCharacterName == speakerName)
                    {
                        if (pronounLocution.isSubject)
                        {
                            realizedString += "I";
                        }
                        else {
                            realizedString += "my"
                        }
                    }
                    else if (currentCharacterName != tempSubjectName && currentCharacterName == speakerName)
                    {
                        realizedString += "me";
                    }
                    else if (currentCharacterName != speakerName && currentCharacterName == tempSubjectName)
                    {
                        realizedString += "you";
                    }
                    else if (currentCharacterName != speakerName && currentCharacterName != tempSubjectName)
                    {
                        realizedString += "you";
                    }
                }
                else if (pronounLocution.type == "he's/she's")
                {
                    if (currentCharacterName == tempSubjectName && currentCharacterName == speakerName)
                    {
                        realizedString += "I'm";
                    }
                    else if (currentCharacterName != tempSubjectName && currentCharacterName == speakerName)
                    {
                        realizedString += "I'm";
                    }
                    else if (currentCharacterName != speakerName && currentCharacterName == tempSubjectName)
                    {
                        realizedString += "you're";
                    }
                    else if (currentCharacterName != speakerName && currentCharacterName != tempSubjectName)
                    {
                        realizedString += "you're";
                    }
                    else
                    {
                        realizedString += locution.renderText(referencedInitiator, referencedResponder, referencedOther, undefined);
                    }
                }
                else  // pronounLocution.type == "was/were"
                {
                    if (currentCharacterName == listenerName)
                    {
                        realizedString += "were";
                    }
                    else
                    {
                        realizedString += locution.renderText(referencedInitiator, referencedResponder, referencedOther, undefined);
                    }
                }
            }
            // !Effect.isCurrentCharacterPresent
            else {
                realizedString += locution.renderText(referencedInitiator, referencedResponder, referencedOther, undefined);
            }
                }
                else if (locution.getType() == "CharacterReferenceLocution") {
                    charLocution = locution;

                    var isPossessive = false;
                    if (charLocution.type == "IP" || charLocution.type == "RP" || charLocution.type == "OP")
                    {
                        isPossessive = true;
                    }

                    if (charLocution.type == "I" || charLocution.type == "IP" || charLocution.type == "IS")
                    {
                        currentCharacterName = referencedInitiator.characterName.toLowerCase();
                    }
                    else if (charLocution.type == "R" || charLocution.type == "RP" || charLocution.type == "RS")
                    {
                        currentCharacterName = referencedResponder.characterName.toLowerCase();
                    }
                    else if (charLocution.type == "O" || charLocution.type == "OP" || charLocution.type == "OS")
                    {
                        currentCharacterName = referencedOther.characterName.toLowerCase();
                    }
                    tempSubjectName = subjectName;
                    if (charLocution.type == "IS" || charLocution.type == "RS" || charLocution.type == "OS")
                    {
                        tempSubjectName = currentCharacterName;
                    }

                    if (Effect.isCurrentCharacterPresent(currentCharacterName, currentInitiator, currentResponder, currentOther,otherPresent))
                    {
                        /*
                         * CharacterReferenceLocution:
                         * 		- can be speaker: I or my
                         * 		- can be !speaker, but there can be a speaker:
                         */

                        //at this stage we do know that SOMEONE who will be talking is being referenced

                        //now we have to find out if the locution is the speaker or not

                        if (currentCharacterName == speakerName
                                && !isPossessive
                                && tempSubjectName != speakerName)
                        {
                            realizedString += "me";
                        }
                        else if (currentCharacterName == speakerName && !isPossessive)
                        {
                            realizedString += "I";
                        }
                        else if (currentCharacterName == speakerName
                                && isPossessive
                                && tempSubjectName == speakerName)
                        {
                            realizedString += "mine";
                        }
                        else if (currentCharacterName == speakerName && isPossessive)
                        {
                            realizedString += "my";
                        }
                        else if (currentCharacterName != speakerName && !isPossessive)
                        {
                            realizedString += "you";
                        }
                        else if (currentCharacterName != speakerName && isPossessive)
                        {
                            realizedString += "your";
                        }
                        else
                        {
                            realizedString += locution.renderText(referencedInitiator, referencedResponder, referencedOther, undefined);
                        }
                    }
                    else // NOT Effect.isCurrentCharacterPresent
                    {
                        realizedString += locution.renderText(referencedInitiator, referencedResponder, referencedOther, undefined);
                    }
                }
                else if (locution.getType() == "ListLocution") {
                    thisList = locution;
                    var list1Name = "";
                    var list2Name = "";

                    // Get character names.
                    if (thisList.who1 == "i") {
                        list1Name = sgContext.getInitiator().characterName.toLowerCase()//referencedInitiator.characterName.toLowerCase();
                    }
                    else if (thisList.who1 == "r") {
                        list1Name = sgContext.getResponder().characterName.toLowerCase()
                    }
                    else if (thisList.who1 == "o") {
                        list1Name = sgContext.getOther().characterName.toLowerCase()
                    }
                    if (thisList.who2 == "i") {
                        list2Name = sgContext.getInitiator().characterName.toLowerCase()//referencedInitiator.characterName.toLowerCase();
                    }
                    else if (thisList.who2 == "r") {
                        list2Name = sgContext.getResponder().characterName.toLowerCase()
                    }
                    else if (thisList.who2 == "o") {
                        list2Name = sgContext.getOther().characterName.toLowerCase()
                    }

                    if (thisList.type == "we/they") {
                        // If either speaker is i, listener is i, speaker is r, or listener is r, use "we"
                        if (speakerName == list1Name || speakerName == list2Name) {
                            realizedString += "we";
                        } else if (listenerName == list1Name || listenerName == list2Name) {
                            realizedString += "you";
                        } else {
                            realizedString += "they";
                        }
                    }
                    else if (thisList.type == "us/them")
                    {
                        if (speakerName == list1Name || speakerName == list2Name) {
                            realizedString += "us";
                        } else if (listenerName == list1Name || listenerName == list2Name) {
                            realizedString += "you";
                        } else {
                            realizedString += "them";
                        }
                    }
                    else if (thisList.type == "our/their")
                    {
                        if (speakerName == list1Name || speakerName == list2Name) {
                            realizedString += "our";
                        } else if (listenerName == list1Name || listenerName == list2Name) {
                            realizedString += "your";
                        } else {
                            realizedString += "their";
                        }
                    }
                    else if (thisList.type == "and")
                    {
                        if ((list1Name == speakerName && list2Name == listenerName) ||
                                (list2Name == speakerName && list1Name == listenerName))
                        {
                            realizedString += "you and me";
                        }
                        else if (list1Name == speakerName)
                        {
                            realizedString += list2Name + " and I";
                        }
                        else if (list2Name == speakerName)
                        {
                            realizedString += list1Name + " and I";
                        }
                        else if (list1Name == listenerName)
                        {
                            realizedString += "you and " + list2Name;
                        }
                        else if (list2Name == listenerName)
                        {
                            realizedString += "you and " + list1Name;
                        }
                        else
                        {
                            realizedString += locution.renderText(referencedInitiator, referencedResponder, referencedOther, undefined);
                        }
                    }
                    else if (thisList.type == "andp")
                    {
                        if ((list1Name == speakerName && list2Name == listenerName) ||
                                (list2Name == speakerName && list1Name == listenerName))
                        {
                            realizedString += "our";
                        }
                        else if (list1Name == speakerName)
                        {
                            realizedString += list2Name + "'s and my";
                        }
                        else if (list2Name == speakerName)
                        {
                            realizedString += list1Name + "'s and my";
                        }
                        else if (list1Name == listenerName)
                        {
                            realizedString += "your and " + list2Name + "'s";
                        }
                        else if (list2Name == listenerName)
                        {
                            realizedString += "your and " + list1Name + "'s";
                        }
                        else
                        {
                            realizedString += locution.renderText(referencedInitiator, referencedResponder, referencedOther, undefined);
                        }
                    }
                }
                else if (locution.getType() == "POVLocution")
                {
                    // This is still not pulling up the right characters... don't use this for now :(
                    thisPOV = locution;
                    if (currentCharacterName == speakerName && currentCharacterName == sgContext.getInitiator().characterName.toLowerCase()) {
                        realizedString += thisPOV.initiatorString;
                    }
                    else if (currentCharacterName == speakerName && currentCharacterName == sgContext.getResponder().characterName.toLowerCase()) {
                        realizedString += thisPOV.responderString;
                    }
                    else {
                        realizedString += locution.renderText(referencedInitiator, referencedResponder, referencedOther, undefined);
                    }
                }
                else {
                    // NOT locution.getType() == "PronounLocution" || locution.getType() == "CharacterReferenceLocution"
                    //just do the normal thing because no one involved in the thing referenced is talking
                    realizedString += locution.renderText(referencedInitiator, referencedResponder, referencedOther, undefined);
                }
            });
        }

        return realizedString;
    }

    Effect.isCurrentCharacterPresent = function(currentCharacterName, currentInitiator, currentResponder, currentOther, otherPresent) {
        if (currentInitiator.characterName.toLowerCase() == currentCharacterName ||
                currentResponder.characterName.toLowerCase() == currentCharacterName)
        {
            return true;
        }
        if (currentOther.characterName.toLowerCase() == currentCharacterName && otherPresent)
        {
            return true;
        }
        return false;
    }

    Effect.EFFECT_TOO_SOON_TIME = 6;
    Effect.LOW_NETWORK_SALIENCE = 2;
    Effect.MEDIUM_NETWORK_SALIENCE = 2;
    Effect.HIGH_NETWORK_SALIENCE = 2;
    Effect.UNRECOGNIZED_NETWORK_SALIENCE = 2;

    return Effect;
});
