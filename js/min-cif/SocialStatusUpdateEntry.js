define(['min-cif/CiFSingleton', 'min-cif/Predicate', 'min-cif/Status', 'min-cif/RelationshipNetwork'], function(CiFSingleton, Predicate, Status, RelationshipNetwork) {
    var SocialStatusUpdateEntry = function() {
        /**
         * Locutions that comprise this effect's performance realization string
         */
        this.locutions = [];

        /**
         * The original string with the tempalte stuff
         */
        this.originalTemplateString;

        /**
         * The rule that allows someone to use this update
         */
        this.condition;

        /**
         * The last time this entry was used
         */
        this.lastSeenTime = -1000;

        /**
         * Salience Score is an approximate measure of how "awesome" we we think this update is
         */
        this.salienceScore;

        this.hasBeenSeen = false;

        /**
         * The character who last used this entry
         */
        this.lastUsedCharacter;

        this.scoreSalience = function() {
            var salience = 0;
            var pred;
            this.conditions.predicates.forEach(function(pred) {
                switch (pred.type)
                {
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
                            //We are dealing with MEDIUM network (don't pay attention to the 'other half' of a network.
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
                                salience += 3
                            }
                            else
                            {
                                salience += 4
                            }
                        }
                        else if (pred.sfdbLabel < 0)
                        {
                            salience += 4
                        }
                        else
                        {
                            //this means all are specified
                            salience += 5
                        }
                        break;
                    default:
                        console.debug(this, "scoring salience for a predicate without an unrecoginzed type of: " + pred.type);
                }
                if (Status.getStatusNameByNumber(pred.status) == "cheating on")
                {
                    salience += 3;
                }
                else if (RelationshipNetwork.getRelationshipNameByNumber(pred.relationship) == "enemies")
                {
                    salience += 3;
                }
                else if (RelationshipNetwork.getRelationshipNameByNumber(pred.relationship) == "dating")
                {
                    salience += 3;
                }
            });

            if (this.lastSeenTime >= 0)
            {
                //this means we've seen this effect before
                if ((CiFSingleton.getInstance().time - this.lastSeenTime) < Effect.EFFECT_TOO_SOON_TIME)
                {
                    salience -= (Effect.EFFECT_TOO_SOON_TIME - (CiFSingleton.getInstance().time - this.lastSeenTime));
                }
            }

            /*if (this.lastSeenTime == CiFSingleton.getInstance().time)
              {
              salience -= 5;
              }*/

            this.salienceScore = salience;
        }
    } //End of SocialStatusUpdateEntry

    SocialStatusUpdateEntry.LOW_NETWORK_SALIENCE = 2;
    SocialStatusUpdateEntry.MEDIUM_NETWORK_SALIENCE = 2;
    SocialStatusUpdateEntry.HIGH_NETWORK_SALIENCE = 2;
    SocialStatusUpdateEntry.UNRECOGNIZED_NETWORK_SALIENCE = 2;

    return SocialStatusUpdateEntry;
});
