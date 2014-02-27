//Its Global. Woops
var _CiFDeps = ['SocialNetwork', 'RelationshipNetwork', 'BuddyNetwork', 'RomanceNetwork', 'CoolNetwork', 'CulturalKB', 'SocialFactsDB', 'SocialGamesLib', 'Predicate', 'SocialGameContext', 'Cast', 'ProspectiveMemory', 'GameScore', 'RuleRecord', 'Util', 'InfluenceRule', 'Rule', 'Character', 'SocialGame', 'Trait', 'Status', 'Effect', 'Instantiation', 'LineOfDialogue', 'StatusContext', 'Proposition', "InfluenceRuleSet"];

var CiFSingleton;

define(_CiFDeps, function(SocialNetwork, RelationshipNetwork, BuddyNetwork, RomanceNetwork, CoolNetwork, CulturalKB, SocialFactsDB, SocialGamesLib, Predicate, SocialGameContext, Cast, ProspectiveMemory, GameScore, RuleRecord, Util, InfluenceRule, Rule, Character, SocialGame, Trait, Status, Effect, Instantiation, LineOfDialogue, StatusContext, Proposition, InfluenceRuleSet) {

    var cif = function() {

        var instance;
        function CiFSingleton() {

            if(instance) { return instance; }
            instance = this;

            //Global pollution
            CiFSingleton = this;
            //Hack to expose SFDB do dependent modules
            CiFSingleton.SocialFactsDB = SocialFactsDB;
            CiFSingleton.Predicate = Predicate;

            this._time = 0;

            this.relationshipNetwork = new RelationshipNetwork();
            this.buddyNetwork = new BuddyNetwork();
            this.romanceNetwork = new RomanceNetwork();
            this.coolNetwork = new CoolNetwork();
            this.ckb = new CulturalKB();
            this.sfdb = new SocialFactsDB();
            this.socialGamesLib = new SocialGamesLib();
            this.cast = Cast.getInstance();
            this.currentContext = new SocialGameContext();

            this.socialStatusUpdates = [];
            this.socialStatusUpdatesNotInLevel = [];
            this.microtheories = [];
            this.lastResponderOther;
            this.useMicrotheoryCache;
            this.microtheoryCache;

            this.traits = Trait.getTraitList();

            this.resetNetworks = function() {
                this.relationshipNetwork.initialize(this.cast.characters.length);
                this.buddyNetwork.initialize(this.cast.characters.length);
                this.romanceNetwork.initialize(this.cast.characters.length);
                this.coolNetwork.initialize(this.cast.characters.length);
            }

            this.clearProspectiveMemory = function() {
                this.cast.characters.forEach(function(character) {
                    character.prospectiveMemory = new ProspectiveMemory();
                });
            }

            //TODO
            this.valuateHistory = function() {
                this.resetLastSeenTimes();
            }

            this.resetLastSeenTimes = function() {
                this.socialGamesLib.games.forEach(function(sg) {
                    sg.effects.forEach(function(e) {
                        e.lastSeenTime = -1;
                    });
                });
            }

            /**
             * Performs intent planning for a single character. This process scores
             * all possible social games for all other characters and stores the
             * score in the character's prospective memory
             * @param	character The subject of the intent formation process.
             */
            this.formIntentOld = function(character) {
                var score, maxTrueRuleCount, currentScore, trueOther;

                character.prospectiveMemory = new ProspectiveMemory();

                var that = this;
                this.cast.characters.forEach(function(potentialResponder) {
                    var start = that.getTime();
                    if(potentialResponder.characterName != character.characterName) {
                        /* To save the re-evaluation of many
                         * predicates in microtheory rules,
                         * score all MT rules for this cast
                         * other than the intent predicates.
                         * As microtheory rules are considered
                         * in a per-socialgame context,
                         * the rule's intent is compared to the
                         * social game's intent. If the
                         * intents match and the non-intent
                         * predicates all evaluated to true, we add
                         * the rule's weight to the running total.
                         */
                        this.socialGamesLib.games.forEach(function(sg) {
                            score = 0;
                            maxTrueRuleCount = 0;
                            currentScore = 0;
                            trueOther = undefined;
                            if(sg.thirdParty) {
                                this.cast.characters.forEach(function(potentialPatsy) {
                                    if(!((potentialPatsy.characterName.toLowerCast() === character.characterName.toLowerCase()) || (potentialPatsy.characterName.toLowerCase() === potentialResponder.characterName.toLowerCase()))) {
                                        if(sg.patsyRule.evaluate(character, potentialResponder, potentialPatsy)) {
                                            if(sg.checkPreconditions(character, potentialResponder, potentialPatsy)) {
                                                if(sg.checkPreconditions(character, potentialResponder, potentialPatsy)) {
                                                    currentScore = scoreInitiatorWithMicrotheories(sg, character, potentialResponder, potentialPatsy);
                                                    gameScore = new GameScore();
                                                    if(sg.thirdPartTalkAboutSomeone) {
                                                        gameScore.initiator = character.characterName;
                                                        gameScore.responder = potentialPatsy.characterName;
                                                        gameScore.other = potentialResponder.characterName;
                                                    } else {
                                                        gameScore.initiator = character.characterName;
                                                        gameScore.responder = potentialResponder.characterName;
                                                        gameScore.other = potentialPatsy.characterName;
                                                    }
                                                    gameScore.score = currentScore;
                                                    gameScore.name = sg.name;
                                                    character.prospectiveMemory.scores.push(gameScore);
                                                }
                                            }
                                        }

                                    }
                                });
                            }
                            else if (sg.thirdForIntentFormation()) {
                                gameScore = new GameScore();
                                this.cast.characters.forEach(function(char) {
                                    if(char.characterName.toLowerCase() != character.characterName.toLowerCase() && char.characterName.toLowerCase() != potentialResponder.characterName.toLowerCase()) {
                                        if(sg.checkPreconditions(character, potentialResponder, char)) {
                                            currentScore = scoreInitiatorWithMicrotheories(sg, character, potentialResponder, char);
                                            if(currentScore > gameScore.score) {
                                                trueOther = char;
                                                gameScore.initiator = character.characterName;
                                                gameScore.responder = potentialResponder.characterName;
                                                gameScore.other = char.characterName;
                                                gameScore.score = currentScore;
                                                gameScore.name = sg.name;
                                            }
                                        }
                                    }
                                });
                                if(gameScore.score > 0) {
                                    character.prospectiveMemory.scores.push(gameScore);
                                }
                            }
                            else {
                                if(sg.checkPreconditions(character, potentialResponder)) {
                                    score = scoreInitiatorWithMicrotheories(sg, character, potentialResponder);
                                    gameScore = new GameScore();
                                    gameScore.initiator = character.characterName;
                                    gameScore.responder = potentialResponder.characterName;
                                    gameScore.score = score;
                                    gameScore.name = sg.name;
                                    character.prospectiveMemory.scores.push(gameScore);
                                }
                            }
                        });
                    }
                });

            }

            this.formIntentForAll = function(activeInitiatorAndResponderCast, activeOtherCast) {
                this.clearProspectiveMemory();
                var castToUse = activeInitiatorAndResponderCast || this.cast.characters;
                var that = this;
                castToUse.forEach(function(char) {
                    that.formIntent(char, activeInitiatorAndResponderCast, activeOtherCast);
                });
            }

            /**
             * Performs intent planning for a single character. This process scores
             * all possible social games for all other characters and stores the
             * score in the character's prospective memory.
             * @param	initiator 	The subject of the intent formation process.
             * @param	activeCast	An optional cast of characters that can be responders.
             */
            this.formIntent = function(initiator, activeInitiatorAndResponderCast, activeOtherCast, setOfGames) {
                var possibleResponders = activeInitiatorAndResponderCast || this.cast.characters;
                var possibleOthers = activeOtherCast || this.cast.characters;
                var currentSetOfSocialGames = setOfGames || this.socialGamesLib.games;

                var that = this;
                possibleResponders.forEach(function(responder) {
                    var start = that.getTime();
                    if(responder.characterName != initiator.characterName) {
                        that.formIntentForSocialGames(initiator, responder, possibleOthers, currentSetOfSocialGames);
                    }
                });
            }

            this.formIntentForSocialGames = function(initiator, responder, activeOtherCast, setOfGames) {
                var possibleOthers = activeOtherCast || this.cast.characters;
                var currentSetOfSocialGames = setOfGames || this.socialGamesLib.games;
                var that = this;
                currentSetOfSocialGames.forEach(function(sg) {
                    that.formIntentForASocialGame(sg, initiator, responder, possibleOthers);
                });
            }

            this.formIntentForASocialGame = function(sg, initiator, responder, activeOtherCast) {
                var possibleResponders = activeOtherCast || this.cast.characters;
                this.formIntentThirdParty(sg, initiator, responder, possibleResponders);
            }

            this.getResponderScore = function(sg, initiator, responder, activeOtherCast) {
                var score = 0.0;
                var possibleOthers = activeOtherCast || this.cast.characters;
                //Score the social game
                score += sg.scoreGame(initator, responder, possibleOthers, true);

                if (responder.prospectiveMemory.intentScoreCache[initiator.networkID][sg.intents[0].predicates[0].getIntentType()] != ProspectiveMemory.DEFAULT_INTENT_SCORE)
                {
                    score += responder.prospectiveMemory.intentScoreCache[initiator.networkID][sg.intents[0].predicates[0].getIntentType()];
                }
                return score;
            }

            /**
             * Forms the intents, each consisting of a gameScore, between an initiator,
             * responder,and an other determined by this function. The other is chosen
             * first by permissibility (does he/she satisfy the preconditions of the
             * game) and then by desirability (highest volition score). The chosen other
             * is then placed along with the social game, initiator, and responder
             * in a game score which is stored in the initiator's perspective memory.
             * @param	sg			The social game to contextualize the intent formation.
             * @param	initiator	The character in the initiator role.
             * @param	responder	The character in the responder role.
             */
            this.formIntentThirdParty = function(sg, initiator, responder, activeOtherCast) {
                var score = 0.0;
                var possibleOthers = activeOtherCast || this.cast.characters;
                var gameScore, singleScore;
                //score the social games
                if (sg.checkPreconditionsVariableOther(initiator, responder, possibleOthers)) {
                    score += sg.scoreGame(initiator, responder, possibleOthers);
                    if(sg.intents[0]) {
                        if (initiator.prospectiveMemory.intentScoreCache[responder.networkID][sg.intents[0].predicates[0].getIntentType()] == ProspectiveMemory.DEFAULT_INTENT_SCORE) {
                            singleScore = scoreAllMicrotheoriesForType(sg, initiator, responder, possibleOthers);
                            initiator.prospectiveMemory.intentScoreCache[responder.networkID][sg.intents[0].predicates[0].getIntentType()] = singleScore;
                            score += singleScore;
                        }
                        else {
                            score += initiator.prospectiveMemory.intentScoreCache[responder.networkID][sg.intents[0].predicates[0].getIntentType()];
                        }
                    } else {
                        console.debug("Social game doesn't have any intents", sg);
                    }
                }
                else {
                    //this means there's no way in heck that we are going to play this game. We don't even pass the precondition!
                    score = -100;
                }
                // create the game score
                gameScore = new GameScore();
                gameScore.score = score;
                gameScore.name = sg.name;
                gameScore.initiator = initiator.characterName;
                gameScore.responder = responder.characterName;
                initiator.prospectiveMemory.scores.push(gameScore);

            }

            /**
             * Scores all microtheories for either "initiator" or "responder"
             * @param	type
             * @param	sg
             * @param	initiator
             * @param	responder
             * @param	activeOtherCast
             * @return
             */
            this.scoreAllMicrotheoriesForType = function(sg, initiator, responder, activeOtherCast) {
                var possibleOthers = activeOtherCast || this.cast.characters;
                var totalScore = 0;
                this.microtheories.forEach(function(theory) {
                    totalScore += theory.scoreMicrotheoryByType(initiator, responder, sg, possibleOthers);
                });
                return totalScore;
            }

            /**
             * Forms the intents, each consisting of a gameScore, between an initiator,
             * responder, and 0 to length of cast combinations with the specified
             * social game. Each potential patsy is considered in combination with the
             * given initiator and responder. If the score with the patsy is greater than
             * 0, a game score representation of that specific set of characters, the social
             * game, and the volition score are stored in the initiator's prospective memory.
             * @param	sg			The social game to contextualize the intent formation.
             * @param	initiator	The character in the initiator role.
             * @param	responder	The character in the responder role.
             */
            this.formIntentWithPatsy = function(sg, initiator, responder, activeOtherCast) {
                var gameScore;
                var score = 0;
                var possibleOthers = activeOtherCast || this.cast.characters;
                this.possibleOthers.forEach(function(potentialPatsy) {
                    if(!((potentialPatsy.characterName.toLowerCase() === initiator.characterName.toLowerCase()) || (potentialPatsy.characterName.toLowerCase() === responder.characterName.toLowerCase()))) {
                        if(sg.patsyRule.evaluate(initiator, responder, potentialPatsy)) {
                            if(sg.checkPreconditions(initiator, responder, potentialPatsy)) {
                                score = scoreInitatorWithMicrotheories(sg, initiator, responder, potentialPatsy, possibleOthers);
                                if(score > 0) {
                                    gameScore = new GameScore();
                                    if(sg.thirdPartTalkAboutSomeone) {
                                        gameScore.initiator = initiator.characterName;
                                        gameScore.responder = potentialPatsy.characterName;
                                        gameScore.other = responder.characterName;
                                    } else {
                                        gameScore.initiator = initiator.characterName;
                                        gameScore.responder = responder.characterName;
                                        gameScore.other = potentialPatsy.characterName;
                                    }
                                    gameScore.score = score;
                                    gameScore.name = sg.name;
                                    initiator.prospectiveMemory.scores.push(gameScore);
                                }
                            }
                        }
                    }
                });
            }

            /**
             * Forms intent between characters in the initiator, responder,
             * and an explicitly-named other roles for a specific social game.
             * This results in a game score being placed into
             * the initiator's prospective memory if the score was greater than 0.
             * @param	sg			The social game to be scored.
             * @param	initiator	The character in the initiator role.
             * @param	responder	The character in the responder role.
             * @param	other		The character in the other role.
             */
            this.formIntentExplicitThirdParty = function(sg, initiator, responder, other, otherCast) {
                var gameScore;
                var score = 0;
                var possibleOthers = activeOtherCast || this.cast.characters;

                if(sg.checkPreconditions(initiator, responder, other)) {
                    score = scoreInitiatorWithMicrotheories(sg, initiator, responder, other, possibleOthers);
                    if(score > 0) {
                        gameScore = new GameScore();
                        gameScore.initiator = initiator.characterName;
                        gameScore.responder = responder.characterName;
                        gameScore.other = other.characterName;
                        gameScore.score = score;
                        gameScore.name = sg.name;
                        initiator.prospectiveMemory.scores.push(gameScore);
                    }

                }
            }

            /**
             * Forms intent between characters in the initiator and responder
             * roles for a specific social game. No other/third party is
             * considered. This results in a game score being placed into
             * the initiator's prospective memory if the score was greater
             * than 0.
             * @param	sg			The social game to be scored.
             * @param	initiator	The character in the initiator role.
             * @param	responder	The character in the responder role.
             */
            this.formIntentNoThird = function(sg, initiator, responder) {
                var gameScore;
                var score= 0;
                if(sg.checkPreconditions(initiator, responder)) {
                    score = scoreInitiatorWithMicrotheories(sg, initiator, responder);

                    //only put games possible to play in the prospective memory
                    if(score > 0) {
                        gameScore = new GameScore();
                        gameScore.initiator = initiator.characterName;
                        gameScore.responder = responder.characterName;
                        gameScore.score = score;
                        gameScore.name = sg.name;
                        initiator.prospectiveMemory.scores.push(gameScore);
                    }
                }
            }

            this.formIntentByName = function(characterName) {
                this.formIntent(cast.getCharByName(characterName));
            }

            /**
             * Figures out how important each predicate was in the initiator's desire to play a game
             * @param	sg			The social game context.
             * @param	initiator	The initiator.
             * @param	responder	The responder.
             * @param	other		The other character.
             * @return	A vector of influence rules where each rule has only one p[redicate and the weight on
             * 			on the rule is the percent that the rule contributed to the initiator wanting
             * 			to play that game.
             */
            this.getPredicateRelevance = function(sgc, initiator, responder, other, forRole, otherCast, mode) {
                forRole = forRole || "initiator";
                mode = mode || "positive";

                var sg = this.socialGamesLib.getByName(sgc.gameName);
                var possibleOthers = activeOtherCast || this.cast.characters;
                var testFlag = false;
                var totalScore = 0;
                var totalPosScore = 0;
                var totalNegScore = 0;
                var newRuleRecord, ruleRecordIntentIndex, ruleRecordIntent;

                var relevantRuleRecords = [];
                var relevantPosRuleRecords = [];
                var relevantNegRuleRecords = [];

                if(forRole === "initiator") {
                    initiator.prospectiveMemory.ruleRecords.forEach(function(ruleRecord) {
                        if (ruleRecord.initiator == initiator.characterName && ruleRecord.responder == responder.characterName) {
                            if (ruleRecord.type == RuleRecord.SOCIAL_GAME_TYPE) {
                                if (ruleRecord.name == sg.name) {
                                    newRuleRecord = ruleRecord.clone();
                                    newRuleRecord.influenceRule.weight = newRuleRecord.influenceRule.weight/2;
                                    if(newRuleRecord.influencerule.weight < 0) {
                                        totalNegScore += newRuleRecord.influenceRule.weight;
                                        relevantNegRuleRecords.push(newRuleRecord);
                                    } else {
                                        totalPosScore += newRuleRecord.influenceRule.weight;
                                        relevantPosRuleRecords.push(newRuleRecord);
                                    }
                                    totalScore += newRuleRecord.influenceRule.weight/2;
                                    relevantRuleRecords.push(newRuleRecord);
                                }
                            } else if (ruleRecord.type == RuleRecord.MICROTHEORY_TYPE) {
                                ruleRecordIntentIndex = ruleRecord.influenceRule.findIntentIndex();
                                if (ruleRecordIntentIndex < 0) {
                                    console.debug(this, "setDebugInfo() Microtheory " + ruleRecord.name + " has a rule without an intent: " + ruleRecord.influenceRule.toString());
                                } else {
                                    ruleRecordIntent = ruleRecord.influenceRule.predicates[ruleRecordIntentIndex].getIntentType();
                                    if (sg.intents[0].predicates[0].getIntentType() == ruleRecordIntent) {
                                        newRuleRecord = ruleRecord.clone();
                                        // add the MTs definition to the rule
                                        theory = this.getMicrotheoryByName(ruleRecord.name);
                                        theory.definition.predicates.forEach(function(pred) {
                                            newRuleRecord.influenceRule.predicates.push(pred.clone());
                                        });
                                        if (newRuleRecord.influenceRule.weight < 0) {
                                            totalNegScore += newRuleRecord.influenceRule.weight;
                                            relevantNegRuleRecords.push(newRuleRecord);
                                        } else {
                                            totalPosScore += newRuleRecord.influenceRule.weight;
                                            relevantPosRuleRecords.push(newRuleRecord);
                                        }
                                        totalScore += newRuleRecord.influenceRule.weight;
                                        relevantRuleRecords.push(newRuleRecord);
                                    }
                                }

                            }
                        }
                    });
                } else if (forRole === "responder") {
                    responder.prospectiveMemory.ruleRecords.forEach(function(ruleRecord) {
                        if (ruleRecord.initiator === responder.characterName && ruleRecord.responder === initiator.characterName) {
                            if (ruleRecord.type === RuleRecord.MICROTHEORY_TYPE) {
                                ruleRecordIntentIndex = ruleRecord.influenceRule.findIntentIndex();
                                if (ruleRecordIntentIndex < 0) {
                                    console.debug(this, "setDebugInfo() Microtheory " + ruleRecord.name + " has a rule without an intent: " + ruleRecord.influenceRule.toString());
                                } else {
                                    ruleRecordIntent = ruleRecord.influenceRule.predicates[ruleRecordIntentIndex].getIntentType();
                                    if (sg.intents[0].predicates[0].getIntentType() == ruleRecordIntent) {
                                        newRuleRecord = ruleRecord.clone();
                                        theory = this.getMicrotheoryByName(ruleRecord.name);
                                        theory.definition.predicates.forEach(function(pred) {
                                            newRuleRecord.influenceRule.predicates.push(pred.clone());
                                        });
                                        if (newRuleRecord.influenceRule.weight < 0) {
                                            totalNegScore += newRuleRecord.influenceRule.weight;
                                            relevantNegRuleRecords.push(newRuleRecord);
                                        } else {
                                            totalPosScore += newRuleRecord.influenceRule.weight;
                                            relevantPosRuleRecords.push(newRuleRecord);
                                        }
                                        totalScore += newRuleRecord.influenceRule.weight;
                                        relevantRuleRecords.push(newRuleRecord);
                                    }
                                }
                            }
                        }
                    });
                    responder.prospectiveMemory.responseSGRuleRecords.forEach(function(ruleRecord) {
                        if (ruleRecord.initiator == initiator.characterName && ruleRecord.responder == responder.characterName) {
                            if (ruleRecord.type == RuleRecord.SOCIAL_GAME_TYPE) {
                                if (ruleRecord.name == sg.name) {
                                    newRuleRecord = ruleRecord.clone();
                                    //just screwing around making sg influence rules not matter as much by half
                                    newRuleRecord.influenceRule.weight = newRuleRecord.influenceRule.weight / 2;

                                    // for some reason, I need to swap these... I'm not 100% sure why. But it works, OK?!?!
                                    newRuleRecord.influenceRule.reverseInitiatorAndResponderRoles();
                                    if (newRuleRecord.influenceRule.weight < 0) {
                                        totalNegScore += newRuleRecord.influenceRule.weight;
                                        relevantNegRuleRecords.push(newRuleRecord);
                                    } else {
                                        totalPosScore += newRuleRecord.influenceRule.weight;
                                        relevantPosRuleRecords.push(newRuleRecord);
                                    }
                                    totalScore += newRuleRecord.influenceRule.weight;
                                    relevantRuleRecords.push(newRuleRecord);
                                }
                            }
                        }
                    });
                }
                var shouldAddToPredicateRelevance;
                var HOW_IMPORTANT_EFFECT_CONDITIONS_ARE = 25;
                if (forRole === "responder" && mode === "reject") {
                    HOW_IMPORTANT_EFFECT_CONDITIONS_ARE *= -1;
                }
                //now we need to go thorugh all predicates in the effect condition and create rule records for them
                sg.getEffectByID(sgc.effectID).condition.predicates.forEach(function(pred) {
                    //make sure to only add it to the right predicate relevance, this is connected to forRole
                    shouldAddToPredicateRelevance = true;
                    if (pred.type == Predicate.TRAIT) {
                        //if this trait pred isn't about the person we are computing relevnace, and the trait isn't the sort of thing that has to do with reputation
                        if (forRole != pred.primary) {
                            if (!Trait.isTraitInCategory(pred.trait, Trait.CAT_REPUTATION)) {
                                if (pred.trait != Trait.CAT_JERK) {
                                    shouldAddToPredicateRelevance = false;
                                }
                            }
                        }
                    } else if (pred.type == Predicate.Status) {
                        //if this trait pred isn't about the person we are computing relevnace, and the status isn't the sort of thing that has to do with reputation
                        if (forRole != pred.primary) {
                            if(!Status.isStatusInCategory(pred.trait, Status.CAT_REPUTATION_BAD) && !Status.isStatusInCategory(pred.trait, Status.CAT_REPUTATION_GOOD)) {
                                shouldAddToPredicateRelevance = false;
                            }
                        }
                    } else if (pred.type == Predicate.NETWORK) {
                        if (pred.primary != forRole) {
                            shouldAddToPredicateRelevance = false;
                        }
                    } else if (pred.type == Predicate.RELATIONSHIP) {
                        if (pred.negated) {
                            shouldAddToPredicateRelevance = false;
                        }
                    } else if (pred.type == Predicate.SFDBLABEL) {
                        //in this case, there probably needs to be some sort of switching. Like... hmmmmmm, I'm not sure... all iI know is that the roles gor swapped sometime when they shouldn't have one time.
                    }
                    if (pred.negated) {
                        shouldAddToPredicateRelevance = false;
                    }
                    if (shouldAddToPredicateRelevance) {
                        newRuleRecord = new RuleRecord();
                        infRule = new InfluenceRule();
                        infRule.predicates.push(pred.clone());
                        infRule.weight = (HOW_IMPORTANT_EFFECT_CONDITIONS_ARE / sg.getEffectByID(sgc.effectID).condition.length);
                        newRuleRecord.influenceRule = infRule;
                        newRuleRecord.initiator = sgc.initiator;
                        newRuleRecord.responder = sgc.responder;
                        newRuleRecord.other = sgc.other;
                        newRuleRecord.type = RuleRecord.SOCIAL_GAME_TYPE;
                        newRuleRecord.name = "sg effect condition";
                        relevantRuleRecords.push(newRuleRecord);
                        if (forRole == "responder") {
                            // for some reason, I need to swap these... I'm not 100% sure why. But it works, OK?!?!
                            newRuleRecord.influenceRule.reverseInitiatorAndResponderRoles();
                        }
                        if (newRuleRecord.influenceRule.weight < 0) {
                            totalNegScore += newRuleRecord.influenceRule.weight;
                            relevantNegRuleRecords.push(newRuleRecord);
                        } else {
                            totalPosScore += newRuleRecord.influenceRule.weight;
                            relevantPosRuleRecords.push(newRuleRecord);
                        }
                        totalScore += newRuleRecord.influenceRule.weight;
                    }
                });
                // at this point, relevantRuleRecords holds all the info we are interested in
                //now go through all relevantRuleRecords and break them into their predicate pieces (each as its own rule record)
                var uniquePredicateRuleRecords = [];
                var presentInUniquePredicateRuleRecords;
                var numIntents;
                relevantRuleRecords.forEach(function(relevantRuleRecord) {
                    //before we can determine the number of predicates in relevantRuleRecord, we need to know how many "intent" type preds to *not* include in the count
                    numIntents = 0;
                    relevantRuleRecord.influenceRule.predicates.forEach(function(pred1) {
                        if (pred1.intent) {
                            numIntents++;
                        }
                    });
                    relevantRuleRecord.influenceRule.predicates.forEach(function(pred1) {
                        presentInUniquePredicateRuleRecords = false;
                        if (!pred.intent) {
                            // do not count preds that are the "second half" of medium networks
                            if (!(pred.comparator == Predicate.getCompatorByNumber(Predicate.LESSTHAN)
                                    && pred.networkValue == 67)) {
                                        //if this predicate has not been seen yet. To determine this, we need to go through all of uniquePredicateRuleRecords
                                        uniquePredicateRuleRecords.forEach(function(ruleRecord) {
                                            // if we already that the record in uniquePredicateRuleRecords (which requires the other to be the same! We don't use RuleRecord.equals because the weights of the inf rules might not be the same)
                                            if (Predicate.equals(pred, ruleRecord.influenceRule.predicates[0]) && relevantRuleRecord.other == ruleRecord.other) {
                                                presentInUniquePredicateRuleRecords = true;
                                                //console.debug(this,"predRelevance() " + testPredRule.weight);
                                                ruleRecord.influenceRule.weight += relevantRuleRecord.influenceRule.weight / ((relevantRuleRecord.influenceRule.predicates.length - numIntents));
                                            }
                                        });
                                        if (!presentInUniquePredicateRuleRecords) {
                                            newRuleRecord = new RuleRecord();
                                            infRule = new InfluenceRule();
                                            infRule.predicates.push(pred.clone());
                                            infRule.weight = relevantRuleRecord.influenceRule.weight / ((relevantRuleRecord.influenceRule.predicates.length - numIntents));
                                            newRuleRecord.influenceRule = infRule;
                                            newRuleRecord.initiator = relevantRuleRecord.initiator;
                                            newRuleRecord.responder = relevantRuleRecord.responder;
                                            newRuleRecord.other = relevantRuleRecord.other;
                                            newRuleRecord.type = relevantRuleRecord.type;
                                            newRuleRecord.name = relevantRuleRecord.name;
                                            uniquePredicateRuleRecords.push(newRuleRecord);
                                        }

                                    }
                        }
                    });
                });
                totalScore = 0;
                var uniquePredicateRuleRecordsToReturn = [];
                uniquePredicateRuleRecords.forEach(function(ruleRecord) {
                    if (forRole == "responder" && mode == "reject") {
                        if (ruleRecord.influenceRule.weight < 0) {
                            //if we are looking for responder reject rules, we want the highest negative
                            ruleRecord.influenceRule.weight = Math.abs(ruleRecord.influenceRule.weight);
                            uniquePredicateRuleRecordsToReturn.push(ruleRecord);
                            totalScore += ruleRecord.influenceRule.weight;
                        }
                    }
                    else if (ruleRecord.influenceRule.weight > 0) {
                        uniquePredicateRuleRecordsToReturn.push(ruleRecord);
                        totalScore += ruleRecord.influenceRule.weight;
                    }
                });
                uniquePredicateRuleRecordsToReturn.sort(compPos);

                //now that we have the influence rules we need to normalize the weights.
                //console.debug(this, "getInitiatorPredicateRelevance() Relevance of Initiator Predicates for "+initiator.characterName+" playing "+sg.name+" with "+responder.characterName+":");
                uniquePredicateRuleRecordsToReturn.forEach(function(ruleRecord) {
                    ir = ruleRecord.influenceRule;
                    ir.weight = Math.round(ir.weight / totalScore * 100);
                });

                return uniquePredicateRuleRecordsToReturn;
            }

            this.compPos = function(x, y) {
                if (x.influenceRule.weight < y.influenceRule.weight) {
                    return 1.0;
                }
                else if (x.influenceRule.weight > y.influenceRule.weight) {
                    return -1.0;
                }
                else {
                    return 0;
                }
            }

            this.compNeg = function(x, y) {
                if (x.influenceRule.weight > y.influenceRule.weight) {
                    return 1.0;
                }
                else if (x.influenceRule.weight < y.influenceRule.weight) {
                    return -1.0;
                }
                else {
                    return 0;
                }
            }

            /**
             * Evaluates all the predicates of all the microtheories rules given a
             * cast with the exclusion of intent predicates. The results are stored
             * in the rule. This excludes the evaluation of all rules that require
             * a thrid party.
             * @param	sg			The social game context
             * @param	initiator	The initiator.
             * @param	responder	The responder.
             */
            this.scoreMicrotheoriesWithoutIntent = function(initiator, responder) {
                this.microtheores.forEach(function(theory) {
                    theory.initiatorIRS.influenceRules.forEach(function(ir) {
                        if (ir.requiresThirdCharacter()) {
                            //loop through all characters that are not I or R, determine truth, and score.
                            this.cast.characters.forEach(function(c) {
                                if (c.characterName != initiator.characterName && c.characterName != responder.characterName) {
                                    if (ir.evaluateAllNonIntent(initiator, responder, c)) {
                                        ir.allButIntentTrue = true;
                                        ir.evaluatedWeight += ir.weight;
                                    }else {
                                        ir.allButIntentTrue = false;
                                        ir.evaluatedWeight = 0;
                                    }
                                }
                            });
                        }else {
                            if (ir.evaluateAllNonIntent(initiator, responder)) {
                                ir.allButIntentTrue = true;
                                ir.evaluatedWeight += ir.weight;
                            }else {
                                ir.allButIntentTrue = false;
                                ir.evaluatedWeight = 0;
                            }
                        }
                        //ir.allButIntentTrue = ir.evaluateAllNonIntent(initiator, responder);
                    });
                });
            }

            this.initializeMicrotheoryCache = function() {
                this.microtheoryCache = {};
            }

            /**
             * Scores the initiator's influence rules including those rules
             * specifed in microtheories.
             * @param	sg			The social game context.
             * @param	initiator	The initiator.
             * @param	responder	The responder.
             * @param	other		The other character.
             * @return	The initiator's volitions score.
             */
            this.scoreInitiatorWithMicrotheories = function(sg, initiator, responder, other, otherCast) {
                var totalScore = 0.0;
                var possibleOthers = otherCast || this.cast.characters;

                /**
                 * When counting rules with others that could be true many times,
                 * this variable will contain true if the rule was satisfied 1 time or more.
                 */
                var isTrue = false;
                /**
                 * The total weight of a rule that could be true multiple times.
                 */
                var runningIRTotal = 0.0;
                var currentMTScore = 0.0;
                var c;
                var cif = CiFSingleton.getInstance();

                var cacheIndex = initiator.characterName + responder.characterName + sg.intents[0].generateRuleName();
                var wentThroughMTs = false;

                wentThroughMTs = true;
                this.microtheories.forEach(function(theory) {
                    currentMTScore = 0.0;
                    if (theory.definition.evaluate(initiator, responder, other, sg)) {

                        theory.initiatorIRS.lastScores = [];
                        theory.initiatorIRS.lastTruthValues = [];

                        /*
                         * Here we decouple the intent of a microtheory rule from the other predicates
                         * to help reduce the number of evaluations we perform during intent formation.
                         */
                        theory.initiatorIRS.influencerules.forEach(function(ir) {
                            var pass = false; //allows the rule to pass if there's no intent
                            var intentIndex = ir.findIntentIndex();
                            runningIRTotal = 0.0;

                            if (intentIndex < 0) pass = true;
                            else if (ir.predicates[intentIndex].evaluate(initiator, responder, other, sg)) pass = true;

                            if (pass) {
                                //if the rule has not been evaluated sans intent predicate, do it now
                                if (!ir.evaluated) {
                                    if (ir.requiresThirdCharacter()) {
                                        //third character required in a MT rule -- for each possible third party
                                        //in the cast, evaluate the rule and add the weight to the rule total if true.
                                        possibleOthers.forEach(function(c) {
                                            if (c.characterName != initiator.characterName && c.characterName != responder.characterName) {
                                                if (ir.evaluateAllNonIntent(initiator, responder, c)) {
                                                    ruleRecord = new RuleRecord();
                                                    ruleRecord.type = RuleRecord.MICROTHEORY_TYPE;
                                                    ruleRecord.name = theory.name;
                                                    ruleRecord.influenceRule = ir.clone();
                                                    ruleRecord.initiator = initiator.characterName;
                                                    ruleRecord.responder = responder.characterName;
                                                    ruleRecord.other = c.characterName;
                                                    initiator.prospectiveMemory.ruleRecords.push(ruleRecord);
                                                    ir.allButIntentTrue = true;
                                                    ir.evaluatedWeight += ir.weight;
                                                } else {
                                                    ir.allButIntentTrue = false;
                                                    ir.evaluatedWeight = 0;
                                                }
                                            }
                                        });
                                    } else {
                                        //evaluateion sans intent predicate for no third character
                                        if (ir.evaluateAllNonIntent(initiator, responder)) {
                                            ruleRecord = new RuleRecord();
                                            ruleRecord.type = RuleRecord.MICROTHEORY_TYPE;
                                            ruleRecord.name = theory.name;
                                            ruleRecord.influenceRule = ir.clone();
                                            ruleRecord.initiator = initiator.characterName;
                                            ruleRecord.responder = responder.characterName;
                                            initiator.prospectiveMemory.ruleRecords.push(ruleRecord);
                                            ir.evaluatedWeight = ir.weight;
                                            ir.allButIntentTrue = true;
                                        } else {
                                            ir.evaluatedWeight = 0.0;
                                            ir.allButIntentTrue = false;
                                        }
                                    }
                                }
                                //at this point we have a rule with true intent and all non-intent predicates are true
                                if (ir.allButIntentTrue) {
                                    runningIRTotal += ir.evaluatedWeight;
                                    theory.initiatorIRS.lastScores.push(runningIRTotal);
                                    theory.initiatorIRS.lastTruthValues.push(true);
                                } else {
                                    //the intent is true but the conjunction of the other predicates is false
                                    theory.initiatorIRS.lastScores.push(0.0);
                                    theory.initiatorIRS.lastTruthValues.push(false);
                                }
                            } else {
                                //the ir is false because the intent is false.
                                theory.initiatorIRS.lastScores.push(0.0);
                                theory.initiatorIRS.lastTruthValues.push(false);
                            }

                            totalScore += theory.initiatorIRS.lastScores[theory.initiatorIRS.lastScores.length - 1];

                            // if the intent score cache hasn't bees set yet, set it to zero
                            if (initiator.prospectiveMemory.intentPosScoreCache[responder.networkID][sg.intents[0].predicates[0].getIntentType()] == ProspectiveMemory.DEFAULT_INTENT_SCORE) {
                                initiator.prospectiveMemory.intentPosScoreCache[responder.networkID][sg.intents[0].predicates[0].getIntentType()] = 0;
                            }
                            if (initiator.prospectiveMemory.intentNegScoreCache[responder.networkID][sg.intents[0].predicates[0].getIntentType()] == ProspectiveMemory.DEFAULT_INTENT_SCORE) {
                                initiator.prospectiveMemory.intentNegScoreCache[responder.networkID][sg.intents[0].predicates[0].getIntentType()] = 0;
                            }

                            if (theory.initiatorIRS.lastScores[theory.initiatorIRS.lastScores.length - 1] >= 0) {
                                initiator.prospectiveMemory.intentPosScoreCache[responder.networkID][sg.intents[0].predicates[0].getIntentType()] += theory.initiatorIRS.lastScores[theory.initiatorIRS.lastScores.length - 1]
                            }
                            else {
                                initiator.prospectiveMemory.intentNegScoreCache[responder.networkID][sg.intents[0].predicates[0].getIntentType()] += theory.initiatorIRS.lastScores[theory.initiatorIRS.lastScores.length - 1]
                            }

                            currentMTScore += theory.initiatorIRS.lastScores[theory.initiatorIRS.lastScores.length - 1];

                        });
                        theory.lastScore = currentMTScore;
                        theory.lastScoreValid = true;
                        //console.debug(this, "scoreInitiatorWithMicrotheories() rescored currentMTScore: " + currentMTScore + " totalScore: " + totalScore + " truthCount: " + theory.initiatorIRS.truthCount);
                    }
                    else {
                        theory.initiatorIRS.lastScores = [];
                        theory.initiatorIRS.lastTruthValues = [];
                        //fill the last truth values with all false
                        for (var i = 0; i < theory.initiatorIRS.influenceRules.length; i++) {
                            theory.initiatorIRS.lastScores.push(0.0);
                            theory.initiatorIRS.lastTruthValues.push(false);
                            theory.lastScore = 0.0;
                            theory.lastScoreValid = true;
                        }
                        //console.debug(this, "scoreInitiatorWithMicrotheories() false currentMTScore: " + currentMTScore + " totalScore: " + totalScore);
                    }
                });
                if (useMicrotheoryCache) {
                    //set the microtheory value into the prospective memory the the initiator
                    if (totalScore > initiator.prospectiveMemory.intentScoreCache[responder.networkID][sg.intents[0].predicates[0].getIntentType()]) {
                        initiator.prospectiveMemory.intentScoreCache[responder.networkID][sg.intents[0].predicates[0].getIntentType()] = totalScore;
                    }
                }

                //now that we've dealt with the MT, add the score of the SG
                if (useMicrotheoryCache) {
                    totalScore = initiator.prospectiveMemory.intentScoreCache[responder.networkID][sg.intents[0].predicates[0].getIntentType()] + sg.getInitiatorScore(initiator, responder, other, sg);
                }
                else {
                    totalScore += sg.getInitiatorScore(initiator, responder, other, sg);
                }
                return totalScore;
            }

            /**
             * Scores the responders's influence rules including those rules
             * specifed in microtheories.
             * @param	sg			The social game context.
             * @param	initiator	The initiator.
             * @param	responder	The responder.
             * @param	other		The other character.
             * @return	The initiator's volitions score.
             */
            this.scoreResponderWithMicrotheories = function(sg, initiator, responder, other ,otherCast) {
                var totalScore = 0;

                var possibleOthers = otherCast || this.cast.characters;
                /**
                 * When counting rules with others that could be true many times,
                 * this variable will contain true if the rule was satisfied 1 time or more.
                 */
                var isTrue = false;
                /**
                 * The total weight of a rule that could be true multiple times.
                 */
                var runningIRTotal = 0.0;
                var cif = CiFSingleton.getInstance();
                //if the MT requires a third party and other is passed in as undefined, we need to pick a third character

                var cacheIndex = initiator.characterName + responder.characterName + sg.intents[0].generateRuleName();
                //console.debug(this,"CacheString: " + cacheIndex);
                //if (!microtheoryCache[cacheIndex])
                if (initiator.prospectiveMemory.intentScoreCache[responder.networkID][sg.intents[0].predicates[0].getIntentType()] == ProspectiveMemory.DEFAULT_INTENT_SCORE) {
                    this.microtheories.forEach(function(theory) {
                        theory.responderIRS.lastScores = [];
                        theory.responderIRS.lastTruthValues = [];
                        // Only need to swap in the definition!
                        if (theory.definition.evaluate(responder,initiator, other, sg)) {
                            theory.responderIRS.influenceRules.forEach(function(ir) {
                                runningIRTotal = 0.0;
                                isTrue = false;
                                if (ir.requiresThirdCharacter()) {
                                    //loop through all characters that are not I or R, determine truth, and score.
                                    possibleOthers.forEach(function(c) {
                                        if (c.characterName != initiator.characterName && c.characterName != responder.characterName) {
                                            if (ir.evaluate(initiator, responder,c, sg)) {
                                                runningIRTotal += ir.weight;
                                                isTrue = true;
                                            }
                                        }
                                    });
                                    theory.responderIRS.lastScores.push(runningIRTotal);
                                    theory.responderIRS.lastTruthValues.push(isTrue);
                                }
                                else if (ir.evaluate(initiator,responder, undefined, sg)) {
                                    runningIRTotal += ir.weight;
                                    theory.responderIRS.lastScores.push(runningIRTotal);
                                    theory.responderIRS.lastTruthValues.push(true);
                                    theory.responderIRS.truthCount += 1;
                                }else {
                                    theory.responderIRS.lastScores.push(0.0);
                                    theory.responderIRS.lastTruthValues.push(false);
                                }

                            totalScore += theory.responderIRS.lastScores[theory.responderIRS.lastScores.length - 1];
                            // if the intent score cache hasn't bees set yet, set it to zero
                            if (initiator.prospectiveMemory.intentPosScoreCache[responder.networkID][sg.intents[0].predicates[0].getIntentType()] == ProspectiveMemory.DEFAULT_INTENT_SCORE)
                            {
                                initiator.prospectiveMemory.intentPosScoreCache[responder.networkID][sg.intents[0].predicates[0].getIntentType()] = 0;
                            }
                            if (initiator.prospectiveMemory.intentNegScoreCache[responder.networkID][sg.intents[0].predicates[0].getIntentType()] == ProspectiveMemory.DEFAULT_INTENT_SCORE)
                            {
                                initiator.prospectiveMemory.intentNegScoreCache[responder.networkID][sg.intents[0].predicates[0].getIntentType()] = 0;
                            }

                            // add the weight of this true rule to the correct intent score cache
                            if (theory.responderIRS.lastScores[theory.responderIRS.lastScores.length - 1] >= 0)
                            {
                                initiator.prospectiveMemory.intentPosScoreCache[responder.networkID][sg.intents[0].predicates[0].getIntentType()] += theory.responderIRS.lastScores[theory.responderIRS.lastScores.length - 1]
                            }
                            else
                            {
                                initiator.prospectiveMemory.intentNegScoreCache[responder.networkID][sg.intents[0].predicates[0].getIntentType()] += theory.responderIRS.lastScores[theory.responderIRS.lastScores.length - 1]
                            }
                            });
                        }
                        else {
                            //fill the last truth values with all false
                            for (var i = 0; i < theory.responderIRS.influenceRules.length; i++) {
                                theory.responderIRS.lastScores.push(0.0);
                                theory.responderIRS.lastTruthValues.push(false);
                            }
                        }
                    });
                    if (useMicrotheoryCache) {
                        //this.microtheoryCache[cacheIndex] = totalScore;
                        initiator.prospectiveMemory.intentScoreCache[responder.networkID][sg.intents[0].predicates[0].getIntentType()] = totalScore;
                    }
                }

                //score the game's rules
                //totalScore += sg.getResponderScore(initiator, responder, other, sg);
                if (this.useMicrotheoryCache)
                {
                    //totalScore = this.microtheoryCache[cacheIndex] + sg.getResponderScore(initiator, responder, other, sg);

                    totalScore = initiator.prospectiveMemory.intentScoreCache[responder.networkID][sg.intents[0].predicates[0].getIntentType()] + sg.getResponderScore(initiator, responder, other, sg);

                }
                else
                {
                    totalScore += sg.getResponderScore(initiator, responder, other, sg);
                }

                return totalScore;
            }

            /**
             * Scores the responders's influence rules including those rules
             * specifed in microtheories.
             * @param	sg			The social game context.
             * @param	initiator	The initiator.
             * @param	responder	The responder.
             * @param	other		The other character.
             * @return	The initiator's volitions score.
             */
            this.scoreResponderToPatsyWithMicrotheories = function(sg, initiator, responder, other, otherCast) {
                var possibleOthers = otherCast || this.cast.characters;

                var totalScore = 0;

                var budUpIntentSG = new SocialGame();
                var intentRule = new Rule();
                var budUpPred = new Predicate();
                budUpPred.intent = true;
                budUpPred.setNetworkPredicate("responder", "initiator", "+", 0, SocialNetwork.BUDDY);
                intentRule.predicates.push(budUpPred);
                budUpIntentSG.intents.push(intentRule);

                this.microtheories.forEach(function(theory) {
                    //here is where some role reversal happens
                    if (theory.definition.evaluate(responder, other, undefined, budUpIntentSG)) {
                        totalScore += theory.responderIRS.scoreRules(responder, other, undefined, budUpIntentSG);
                    }
                    else {
                        theory.responderIRS.lastScores = [];
                        theory.responderIRS.lastTruthValues = [];
                        //fill the last truth values with all false
                        for (var i = 0; i < theory.responderIRS.influenceRules.length; i++) {
                            theory.responderIRS.lastScores.push(0.0);
                            theory.responderIRS.lastTruthValues.push(false);
                        }
                    }
                });

                return totalScore;
            }

            /**
             * Invalidates the last score of the microtheories.
             * This is used when the context of characters has change from the last
             * time the microtheories were evaluated.
             */
            this.invalidateMicrotheories = function() {
                this.microtheories.forEach(function(theory) {
                    theory.lastScore = 0.0;
                    theory.lastScoreValid = false;
                });
            }


            /**********************************************************************
             * Social game play.
             *********************************************************************/

            this.playGameByName = function(gameName, initiator, responder, otherundefined, otherCast) {
                var contextContext = this.playGame(socialGamesLib.getByName(gameName), initiator, responder, other,otherCast);
            }

            this.playGame = function(sg, initiator, responder, other, otherCast, levelCast, negateResponderScore, acceptThreshold, responderBoost, forcedInstantiation) {
                //The fact that other was ever passed in at all is an artifact of cif from days long gone.
                //NOW we figure out who the other is in THIS function, when we call 'getSalientOtherAndEffect'
                //Since other part of this function (playGame) depend on other being undefined, we are going
                //to just set it to undefined here explicitly (since passing in, say, an instantiated yet 'blank' character with no name
                //will cause issues and heartbreak).
                other = undefined;

                if (!levelCast) {
                    console.debug(this, "playGame() You need to pass in a level cast!!! ERROR!!!");
                }
                var possibleOthers = otherCast || this.cast.characters;

                //get responder IRS score
                var highestSaliencyEffect;
                //var highestSaliencyCount:int = -1;
                var socialGameContextContext = new SocialGameContext();
                var score=0;
                //keeps track of the maxiumum true IR rules of the IRSs ran to find
                //a third character.
                var maxTrueRuleCount = 0;
                var currentScore = 0;
                //true if the game was accept, false if it was a reject
                var acceptGameIntent = true;
                //iterator for finding the SFDB label predicates

                // get the responder score
                score = this.getResponderScore(sg, initiator, responder, possibleOthers);
                score += responderBoost;

                if (score >= acceptThreshold) acceptGameIntent = true;
                else acceptGameIntent = false;

                if (negateResponderScore) acceptGameIntent = !acceptGameIntent; //hee hee!  If they use a magic power, reverse whether the game is accepted or rejected!

                var otherAndEffect = this.getSalientOtherAndEffect(sg, acceptGameIntent, initiator, responder, possibleOthers, levelCast, forcedInstantiation);


                //the other to use when all cases of other being passed in and a
                //third character being needed when one is not provided.
                var trueOther;
                //determine if we need to find a third character
                if (!other && sg.thirdForSocialGamePlay()) {
                    trueOther = otherAndEffect["other"];
                }else {
                    trueOther = other;
                }

                //TODO: sort of a hack. I want this in GameEngine... this is part of separating playGame and changeSocialState
                this.lastResponderOther = trueOther;

                // this is ineffiicient because we are looking through all others and all effects again (which we already did above in getSalientOther)
                // want to return other and effect in getSalientOther, but you can't... fix later!
                highestSaliencyEffect = otherAndEffect["effect"];//this.getSalientEffect(sg, acceptGameIntent, initiator, responder, trueOther);

                //TODO: CRASHES HERE IF THE GAME DOESN"T USE CKB!!!
                if (highestSaliencyEffect.hasCKBReference()) {
                    socialGameContext.chosenItemCKB = pickAGoodCKBObject(initiator, responder, trueOther, highestSaliencyEffect.getCKBReferencePredicate());
                }

                socialGameContext.gameName = sg.name;

                socialGameContext.effectID = highestSaliencyEffect.id;
                socialGameContext.initiator = initiator.characterName;
                socialGameContext.responder = responder.characterName;


                if (highestSaliencyEffect.hasSFDBLabel()) {
                    highestSaliencyEffect.change.predicates.forEach(function(pred) {
                        //console.debug(this, "changeSocialState() change has SFDBLabel. Predicate considered: " + pred.toString());
                        if (Predicate.SFDBLABEL == pred.type) {
                            var label = new SFDBLabel();
                            label.to = pred.secondaryCharacterNameFromVariables(initiator, responder, trueOther);
                            label.from = pred.primaryCharacterNameFromVariables(initiator, responder, trueOther);
                            label.type = SocialFactsDB.getLabelByNumber(pred.sfdbLabel);
                            socialGameContext.SFDBLabels.push(label);
                        }
                    });
                }

                socialGameContext.other = (trueOther)?trueOther.characterName:"";
                socialGameContext.time = this.time;

                if(socialGameContext.gameName != "FORECAST") {//only score games for the initiator that don't have anything to do with forecasts.
                    socialGameContext.initiatorScore = initiator.prospectiveMemory.getGameScoreByGameName(sg.name,responder).score;
                }
                socialGameContext.responderScore = score;

                return socialGameContext;
            }


            this.changeSocialState = function(socialGameContextContext,otherCast) {
                var possibleOthers = otherCast || this.cast.characters;

                var sg = this.socialGamesLib.getByName(socialGameContext.gameName);
                var highestSaliencyEffect = sg.getEffectByID(socialGameContext.effectID);

                var initiator = this.cast.getCharByName(socialGameContext.initiator);
                var responder = this.cast.getCharByName(socialGameContext.responder);
                var other = this.cast.getCharByName(socialGameContext.other);

                highestSaliencyEffect.change.valuation(initiator, responder, other);

                //set the last seen time to now so that it won't be used again very soon
                highestSaliencyEffect.lastSeenTime = this.time;

                this.sfdb.addContext(socialGameContext);

                //update all of the status to be one turn older now that we've chosen salient effects
                //in other words, the status lives "through" this spot in cif.time
                //and new statuses are not decremented yet, as they start on the next time step.
                possibleOthers.forEach(function(char) {
                    //for now, just update the possible others (i.e. people whoa ren't present don't change)
                    char.statuses.forEach(function(status) {
                        if (status.remainingDuration <= 1) 
                    {
                        var pred = new Predicate();
                        pred.setStatusPredicate(char.characterName, status.directedToward, status.type, true);
                        var directedToward = this.cast.getCharByName(status.directedToward);
                        pred.valuation(char, directedToward);

                        var statusContext = new StatusContext();
                        statusContext.time = this.time;
                        statusContext.negated = true;
                        statusContext.statusType = status.type;
                        statusContext.to = this.cast.getCharByName(status.directedToward);
                        statusContext.from = char;
                        this.sfdb.addContext(statusContext);
                    }
                    });
                    //decrement status counters of all players
                    char.updateStatusDurations(1);
                });

                //now that we have changed the state, updated statuses, we should run the triggers
                //for now, triggers will happen *at the same cif time* as the change that caused them to trigger
                //
                //NOTE: I think the status.remainingTime should not be updated until after this call, to be consistent, but
                // that would require not updating the status.time's that were made the case from triggers and.... well, no. Not now.
                // the down side to this is that some statuses will have been made no more, that should probably be considered in the triggers
                this.sfdb.runTriggers(possibleOthers);
                //increment system time after the context has been added
                this.time++;
            }

            this.getCharacterFromRole = function(roleName, initiator, responder, other) {
                if (roleName == "initiator") {
                    return initiator.characterName;
                }
                else if (roleName == "responder") {
                    return responder.characterName;
                }
                else if (roleName == "other") {
                    return other.characterName;
                }
                else {
                    console.debug(this, "getCharacterFromRole() roleName does not match a role");
                    return "";
                }
            }

            this.getSalientOtherAndEffect = function(sg, accepted, initiator, responder, otherCast, levelCast, forcedInstantiationID) {
                forcedInstantiationID = forcedInstantiation || -1;
                var possibleOthers = otherCast || this.cast.characters;

                if (!levelCast) {
                    levelCast = possibleOthers;
                }

                var possibleSalientEffects = [];
                var possibleSalientOthers = [];

                var castMemberPresent = false;


                var genericEffect; // used to store a generic effect, just to make sure that we have ONE option!


                //find all valid effects
                //--make sure to go through all others
                sg.effects.forEach(function(effect) {
                    if (effect.isAccept == accepted) {
                        if (effect.condition.predicates.length == 0) genericEffect = effect; // store the generic effect for later, just in case we need it.
                        //only look at this effect if we don't care about forcing an instantiation, OR if we do force an instantiation, this effect matches the forced instantiation id.
                        if( forcedInstantiationID == -1 || effect.instantiationID == forcedInstantiationID){
                            if (effect.requiresThirdCharacter())
                {
                    possibleOthers.forEach(function(char) {
                        castMemberPresent = false;
                        if (char.characterName != initiator.characterName && char.characterName != responder.characterName) {
                            //make sure the character is in the level if the instantiation requires him to be
                            instantiation = sg.getInstantiationById(effect.instantiationID);
                            if (instantiation.requiresOtherToPerform()) {
                                //See if the other is in the level
                                levelCast.forEach(function(castMember) {
                                    if (castMember.characterName == char.characterName) {
                                        castMemberPresent = true; // we found a match!
                                    }
                                });
                            }
                            else {
                                castMemberPresent = true;
                            }

                    //if we have passed the check that the character is in the level (or it doesn't matter if they are or not)
                    if (castMemberPresent) {
                        //check to see if this i,r,o group satisfies the condition
                        if (effect.condition.evaluate(initiator, responder, char,sg)) {
                            possibleSalientEffects.push(effect);
                            possibleSalientOthers.push(char);
                        }
                    }
                        }
                    });
                }
                            else
                            {
                                // this is the case where we don't care about the other
                                if (effect.condition.evaluate(initiator, responder,undefined,sg))
                                {
                                    possibleSalientEffects.push(effect);
                                    possibleSalientOthers.push(undefined);
                                }
                            }
                        }
                    }
                });

                if (forcedInstantiationID != -1 && possibleSalientEffects.length == 0) {
                    // if we got here, then we WANT to force an instantiation BUT we somehow screwed up and the effect conditions of the instantiation are no longer true.
                    //In this case, just use the generic effect that we stored for this very purpose!
                    possibleSalientEffects.push(genericEffect);
                    possibleSalientOthers.push(undefined);
                }

                //go through all valid effects and choose the ones that have the highest salience score
                //at this point, we know all effects and others are valid
                var mostSalientOther;
                var mostSalientEffect;
                var maxSaliency = -1000;
                var mostSalientOthers = [];
                var mostSalientEffects = [];
                for (var i = 0; i < possibleSalientEffects.length; i++ )
                {
                    //console.debug(this, "" + sg.name + " effect id is: " + possibleSalientEffects[i].id + " and is linked to instantiation: " + possibleSalientEffects[i].instantiationID + " score was: " + possibleSalientEffects[i].salienceScore);
                    possibleSalientEffects[i].scoreSalience();
                    //console.debug(this, "Same thing after score salience: Social game: " + sg.name + " effect id is: " + possibleSalientEffects[i].id + " and is linked to instantiation: " + possibleSalientEffects[i].instantiationID + " score was: " + possibleSalientEffects[i].salienceScore);
                    if (maxSaliency < possibleSalientEffects[i].salienceScore)
                    {
                        maxSaliency = possibleSalientEffects[i].salienceScore;
                        mostSalientEffect = possibleSalientEffects[i];
                        mostSalientOther = possibleSalientOthers[i];
                        mostSalientOthers = [];
                        mostSalientOthers.push(possibleSalientOthers[i]);
                        mostSalientEffects = [];
                        mostSalientEffects.push(possibleSalientEffects[i]);
                    }
                    else if (maxSaliency == possibleSalientEffects[i].salienceScore)
                    {
                        mostSalientOthers.push(possibleSalientOthers[i]);
                        mostSalientEffects.push(possibleSalientEffects[i]);
                    }
                }

                var randomIndex = Util.randRange(0, mostSalientEffects.length - 1);

                var returnDictionary = {};
                returnDictionary["effect"] = mostSalientEffects[randomIndex];//mostSalientEffect;
                returnDictionary["other"] = mostSalientOthers[randomIndex];//mostSalientOther;
                return returnDictionary;
            }

            /**
             * Returns the effect with the highest saliency given a social game
             * and full character parameterization
             * @param	sg			The social game containing the Effects to check.
             * @param	initiator	The initiator.
             * @param	responder	The responder.
             * @param	other		The other.
             * @return	Highest saliency effect.
             */
            this.getSalientEffect = function(sg, accepted, initiator, responder, other) {
                var highestSaliencyCount = -1;
                var highestSaliencyNumber= -100000;
                var highestSaliencyEffect;

                sg.effects.forEach(function(e) {
                    if (e.evaluateCondition(initiator, responder, other) && e.isAccept == accepted) {
                        e.scoreSalience();
                        if (e.salienceScore >= highestSaliencyNumber) {
                            highestSaliencyNumber = e.salienceScore;
                            highestSaliencyEffect = e;
                        }
                    }
                });
                if(!highestSaliencyEffect) {
                    console.debug(this, "getSalientEffect() the social game had no effects when looking for the most salient effect. social game name: " + sg.name, 1);
                }
                return highestSaliencyEffect;
            }

            /**
             * Smartly chooses a CKB object from those specified by the parameterized
             * characters and CKBENTRY predicate.
             * @param	initiator		The character in the role of initiator.
             * @param	responder		The character in the role of responder.
             * @param	ckbPredicate	The CKBENTRY type Predicate holding the
             * constraints on sought-after CKB objects.
             * @return	The name of the chosen CKB object.
             */
            this.pickAGoodCKBObject = function(initiator, responder, other, ckbPredicate) {
                var first = this.cast.getCharByName(ckbPredicate.primaryCharacterNameFromVariables(initiator, responder, other));
                var second = this.cast.getCharByName(ckbPredicate.secondaryCharacterNameFromVariables(initiator, responder, other));
                var potentialCKBObjects = ckbPredicate.evalCKBEntryForObjects(first, second);
                //return a randon one for now.
                var ckbIndex = Math.floor(Math.random() * potentialCKBObjects.length);

                return potentialCKBObjects[ckbIndex];
            }

            /**********************************************************************
             * Performance Realization
             *********************************************************************/

            this.instantiationFromContext = function(context){
                var sg = this.socialGamesLib.getByName(context.gameName);
                var instantiationID = sg.getEffectByID(context.effectID).instantiationID;
                return sg.getInstantiationById(instantiationID);
            }

            /**
             * Maps the string representations of the role-generic (aka still have
             * tags) to a vector of locutions -- prepping the dialog for performance
             * realization.
             */
            this.prepareLocutions = function() {
                this.socialGamesLib.games.forEach(function(sg) {
                    sg.effects.forEach(function(e) {
                        //console.debug(this, "prepareLocutions() "+e.referenceAsNaturalLanguage);
                        e.locutions = Util.createLocutionVectors(e.referenceAsNaturalLanguage);
                    });
                    sg.instantiations.forEach(function(inst) {
                        //deals with ToC's
                        inst.toc1.locutions = Util.createLocutionVectors(inst.toc1.rawString);
                        inst.toc2.locutions = Util.createLocutionVectors(inst.toc2.rawString);
                        inst.toc3.locutions = Util.createLocutionVectors(inst.toc3.rawString);

                        inst.lines.forEach(function(lod) {
                            //console.debug(this, "prepareLocutions() for game " + sg.name);
                            lod.initiatorLocutions = Util.createLocutionVectors(lod.initiatorLine);
                            lod.responderLocutions = Util.createLocutionVectors(lod.responderLine);
                            lod.otherLocutions = Util.createLocutionVectors(lod.otherLine);
                            //console.debug(this, "prepareLocutions(): initiatior loction count for line: " + lod.initiatorLocutions.length);
                        });
                    });
                });
            }

            /**********************************************************************
             * Utility Functions
             *********************************************************************/

            /**
             * Virtual setter for time.
             */
            this.setTime = function(t) {
                this._time = t;
            }

            /**
             * Virtual getter for time.
             */
            this.getTime = function(){
                return this._time;
            }

            /**
             * Seaches the microtheories in CiF and tries to find a name match.
             * @param	name	The name to search for.
             * @return	A matching Microtheory or undefined if no match is found.
             */
            this.getMicrotheoryByName = function(name){
                this.microtheories.forEach(function(theory) {
                    if (theory.name.toLowerCase() == name.toLowerCase()) {
                        return theory;
                    }
                });
                return undefined;
            }

            /**
             * Finds the index of a microtheory of a certain name.
             * @param	name	The name to search for.
             * @return	The index of the matching microtheory or -1 if no match.
             */
            this.getMicrotheoryIndexByName = function(name){
                for (var i = 0; i < this.microtheories.length; ++i) {
                    if (name.toLowerCase() == this.microtheories[i].name.toLowerCase()) {
                        return i;
                    }
                }
                return -1;
            }

            /**
             * Resets CiF's data structures to a default state.
             */
            this.defaultState = function() {
                //Populate the cast with some defaults for test purposes.

                this.cast.characters = [];
                var robert  = new Character();
                var karen = new Character();
                var lily = new Character();

                //var cast:Cast = Cast.getInstance();
                robert.setName( "Robert" );
                karen.setName("Karen");
                lily.setName("Lily");

                robert.networkID = 0;
                karen.networkID = 1;
                lily.networkID = 2;

                this.cast.addCharacter(robert);
                this.cast.addCharacter(karen);
                this.cast.addCharacter(lily);

                //set traits

                //console.debug(this, "hi");

                this.relationshipNetwork.initialize(this.cast.characters.length);
                this.buddyNetwork.initialize(this.cast.characters.length);
                this.romanceNetwork.initialize(this.cast.characters.length);
                this.coolNetwork.initialize(this.cast.characters.length);

                //add some social games to the social game library

                var traitPred;
                var relationshipPred;
                var statusPred;
                var ckbPred;
                var networkPred;
                var sfdbPred;

                var brag = new SocialGame();
                traitPred = new Predicate();
                relationshipPred = new Predicate();
                statusPred = new Predicate();
                ckbPred = new Predicate();
                networkPred = new Predicate();
                sfdbPred = new Predicate();

                traitPred.setTraitPredicate("initiator", Trait.CONFIDENT, false);
                networkPred.setNetworkPredicate("initiator", "responder", "greaterthan", 40, SocialNetwork.BUDDY);
                ckbPred.setCKBPredicate("initiator", "responder", "likes", "dislikes", "cool");
                relationshipPred.setRelationshipPredicate("initiator", "responder", RelationshipNetwork.DATING, true);


                //add some social games to the social game library

                brag.name = "Brag";
                var p = new Predicate();

                //preconditions
                //<Predicate type="SFDB label" first="initiator" second="initiator" label="cool" negated="false" isSFDB="true" window="0"/>
                var r = new Rule();
                p.setSFDBLabelPredicate("initiator", "initiator", SocialFactsDB.COOL);
                r.predicates.push(p.clone());
                brag.preconditions.push(r.clone());

                //initiator IRS
                var ir = new InfluenceRule();

                p.setTraitPredicate("initiator", Trait.CONFIDENT);
                ir = new InfluenceRule();
                ir.predicates.push(p.clone());
                ir.weight = 20;
                brag.initiatorIRS.influenceRules.push(ir.clone());

                p.setTraitPredicate("initiator", Trait.ATTENTION_HOG);
                ir = new InfluenceRule();
                ir.predicates.push(p.clone());
                ir.weight = 10;
                brag.initiatorIRS.influenceRules.push(ir.clone());

                p.setNetworkPredicate("initiator", "responder", "greaterthan", 39, SocialNetwork.BUDDY);
                ir = new InfluenceRule();
                ir.predicates.push(p.clone());
                ir.weight = 10;
                brag.initiatorIRS.influenceRules.push(ir.clone());

                p.setNetworkPredicate("initiator", "responder", "lessthan", 40, SocialNetwork.BUDDY);
                ir = new InfluenceRule();
                ir.predicates.push(p.clone());
                ir.weight = -10;
                brag.initiatorIRS.influenceRules.push(ir.clone());

                p.setTraitPredicate("initiator", Trait.HUMBLE);
                ir = new InfluenceRule();
                ir.predicates.push(p.clone());
                ir.weight = -20;
                brag.initiatorIRS.influenceRules.push(ir.clone());


                //RESPONDER INFUENCE RULE SET
                p.setTraitPredicate("initiator", Trait.SMOOTH_TALKER);
                ir = new InfluenceRule();
                ir.predicates.push(p.clone());
                ir.weight = 20;
                brag.responderIRS.influenceRules.push(ir.clone());

                ir = new InfluenceRule();
                p.setNetworkPredicate("responder", "initiator", "greaterthan", 39);
                ir.predicates.push(p.clone());
                ir.weight = 10;
                brag.responderIRS.influenceRules.push(ir.clone());

                p.setTraitPredicate("responder", Trait.HUMBLE);
                ir = new InfluenceRule();
                ir.predicates.push(p.clone());
                ir.weight = -30;
                brag.responderIRS.influenceRules.push(ir.clone());

                ir = new InfluenceRule();
                //p.setStatusPredicate("responder", Status.getStatusNameByNumber(Status.JEALOUS));
                p.setStatusPredicate("responder", "initiator", Status.ENVIES);
                ir.predicates.push(p.clone());
                ir.weight = -20;
                brag.responderIRS.influenceRules.push(ir.clone());

                //EFFECTS
                var e = new Effect();
                e.isAccept = true;
                p.setNetworkPredicate("responder", "initiator", "+", 20, SocialNetwork.COOL);
                e.change.predicates.push(p.clone());
                e.id = 1;
                e.referenceAsNaturalLanguage = "%i% bragged about pizza";
                brag.effects.push(e.clone());


                e = new Effect();
                e.isAccept = false;
                p.setNetworkPredicate("responder", "initiator", "-", 20, SocialNetwork.COOL);
                e.change.predicates.push(p.clone());
                e.id = 3;
                e.referenceAsNaturalLanguage = "%i% was not so cool at %CKB_((i,dislikes),(r,dislikes),(mean))%";
                brag.effects.push(e.clone());

                e = new Effect();
                e.isAccept = false;
                e.condition.predicates.push(p.clone());
                p.setNetworkPredicate("responder", "initiator", "-", 20, SocialNetwork.COOL);
                e.change.predicates.push(p.clone());
                e.change.predicates.push(p.clone());
                e.id = 4;
                e.referenceAsNaturalLanguage = "%r% was jealous about %ip% %CKB_((i,dislikes),(r,dislikes),(mean))%";
                brag.effects.push(e.clone());

                e = new Effect();
                e.isAccept = false;
                p.setTraitPredicate("responder", Trait.HUMBLE);
                e.condition.predicates.push(p.clone());
                p.setNetworkPredicate("responder", "initiator", "-", 20, SocialNetwork.COOL);
                e.change.predicates.push(p.clone());
                p.setNetworkPredicate("responder", "initiator", "-", 20, SocialNetwork.BUDDY);
                e.change.predicates.push(p.clone());
                e.id = 5;
                e.referenceAsNaturalLanguage = "%i% was totally humble about %CKB_((i,dislikes),(r,dislikes),(mean))%";
                brag.effects.push(e.clone());

                var inst= new Instantiation();
                var lod= new LineOfDialogue();
                inst.id = 1;

                lod.lineNumber = 0;
                lod.initiatorLine = "Hey %r%";
                lod.responderLine = "";
                lod.otherLine = "";
                lod.primarySpeaker = "initiator";
                lod.initiatorBodyAnimation = "accuse";
                lod.initiatorFaceAnimation = "happy";
                lod.responderBodyAnimation = "accuse";
                lod.responderFaceAnimation = "happy";
                lod.otherBodyAnimation = "accuse";
                lod.otherFaceAnimation = "happy";
                lod.time = 5;
                lod.initiatorIsThought = false;
                lod.responderIsThought = false;
                lod.otherIsThought = false;
                lod.initiatorIsPicture = false;
                lod.responderIsPicture = false;
                lod.otherIsPicture = false;
                lod.initiatorAddressing = "responder";
                lod.responderAddressing = "initiator";
                lod.otherAddressing = "initiator";
                lod.isOtherChorus = false;

                inst.lines.push(lod);

                var lod1= new LineOfDialogue();
                lod1.lineNumber = 1;
                lod1.initiatorLine = "";
                lod1.responderLine = "Oh, hi %i%";
                lod1.otherLine = "";
                lod1.primarySpeaker = "initiator";
                lod1.initiatorBodyAnimation = "accuse";
                lod1.initiatorFaceAnimation = "happy";
                lod1.responderBodyAnimation = "accuse";
                lod1.responderFaceAnimation = "happy";
                lod1.otherBodyAnimation = "accuse";
                lod1.otherFaceAnimation = "happy";
                lod1.time = 5;
                lod1.initiatorIsThought = false;
                lod1.responderIsThought = false;
                lod1.otherIsThought = false;
                lod1.initiatorIsPicture = false;
                lod1.responderIsPicture = false;
                lod1.otherIsPicture = false;
                lod1.initiatorAddressing = "responder";
                lod1.responderAddressing = "initiator";
                lod1.otherAddressing = "initiator";
                lod1.isOtherChorus = false;

                inst.lines.push(lod1);

                var lod2= new LineOfDialogue();
                lod2.lineNumber = 2;
                lod2.initiatorLine = "How's it going?";
                lod2.responderLine = "";
                lod2.otherLine = "";
                lod2.primarySpeaker = "initiator";
                lod2.initiatorBodyAnimation = "accuse";
                lod2.initiatorFaceAnimation = "happy";
                lod2.responderBodyAnimation = "accuse";
                lod2.responderFaceAnimation = "happy";
                lod2.otherBodyAnimation = "accuse";
                lod2.otherFaceAnimation = "happy";
                lod2.time = 5;
                lod2.initiatorIsThought = false;
                lod2.responderIsThought = false;
                lod2.otherIsThought = false;
                lod2.initiatorIsPicture = false;
                lod2.responderIsPicture = false;
                lod2.otherIsPicture = false;
                lod2.initiatorAddressing = "responder";
                lod2.responderAddressing = "initiator";
                lod2.otherAddressing = "initiator";
                lod2.isOtherChorus = false;

                inst.lines.push(lod2);

                var lod3= new LineOfDialogue();
                lod3.lineNumber = 3;
                lod3.initiatorLine = "";
                lod3.responderLine = "Good.  What did you do this weekend?";
                lod3.otherLine = "";
                lod3.primarySpeaker = "initiator";
                lod3.initiatorBodyAnimation = "accuse";
                lod3.initiatorFaceAnimation = "happy";
                lod3.responderBodyAnimation = "accuse";
                lod3.responderFaceAnimation = "happy";
                lod3.otherBodyAnimation = "accuse";
                lod3.otherFaceAnimation = "happy";
                lod3.time = 5;
                lod3.initiatorIsThought = false;
                lod3.responderIsThought = false;
                lod3.otherIsThought = false;
                lod3.initiatorIsPicture = false;
                lod3.responderIsPicture = false;
                lod3.otherIsPicture = false;
                lod3.initiatorAddressing = "responder";
                lod3.responderAddressing = "initiator";
                lod3.otherAddressing = "initiator";
                lod3.isOtherChorus = false;

                inst.lines.push(lod3);

                var lod4= new LineOfDialogue();
                lod4.lineNumber = 4;
                lod4.initiatorLine = "Just a %SFDB_(i, cool)%";
                lod4.responderLine = "";
                lod4.otherLine = "";
                lod4.primarySpeaker = "initiator";
                lod4.initiatorBodyAnimation = "accuse";
                lod4.initiatorFaceAnimation = "happy";
                lod4.responderBodyAnimation = "accuse";
                lod4.responderFaceAnimation = "happy";
                lod4.otherBodyAnimation = "accuse";
                lod4.otherFaceAnimation = "happy";
                lod4.time = 5;
                lod4.initiatorIsThought = false;
                lod4.responderIsThought = false;
                lod4.otherIsThought = false;
                lod4.initiatorIsPicture = false;
                lod4.responderIsPicture = false;
                lod4.otherIsPicture = false;
                lod4.initiatorAddressing = "responder";
                lod4.responderAddressing = "initiator";
                lod4.otherAddressing = "initiator";
                lod4.isOtherChorus = false;

                inst.lines.push(lod4);

                var lod5= new LineOfDialogue();
                lod5.lineNumber = 5;
                lod5.initiatorLine = "";
                lod5.responderLine = "Oh wow! That's amazing! I didn't even know you could even do that!  That sounds awesome!";
                lod5.otherLine = "";
                lod5.primarySpeaker = "initiator";
                lod5.initiatorBodyAnimation = "accuse";
                lod5.initiatorFaceAnimation = "happy";
                lod5.responderBodyAnimation = "accuse";
                lod5.responderFaceAnimation = "happy";
                lod5.otherBodyAnimation = "accuse";
                lod5.otherFaceAnimation = "happy";
                lod5.time = 5;
                lod5.initiatorIsThought = false;
                lod5.responderIsThought = false;
                lod5.otherIsThought = false;
                lod5.initiatorIsPicture = false;
                lod5.responderIsPicture = false;
                lod5.otherIsPicture = false;
                lod5.initiatorAddressing = "responder";
                lod5.responderAddressing = "initiator";
                lod5.otherAddressing = "initiator";
                lod5.isOtherChorus = false;

                inst.lines.push(lod5);


                inst.id = 1;
                brag.instantiations.push(inst.clone());


                //II (Accept with better results)

                //III (Reject flavorless)

                //IV (Based in Jealousy)

                //V(Reject based on humility)


                //console.debug(this, "bye");


                //Add our game to the social games library!
                this.socialGamesLib.addGame(brag);

                //SFDB
                p.setStatusPredicate("Edward", "Karen", Status.HAS_A_CRUSH_ON);
                var sc =  new StatusContext();
                sc.time = 0;
                sc.predicate = p.clone();
                this.sfdb.contexts.push(sc);

            }

            /**
             * Clears all CiF data structures.
             */
            this.clear = function() {
                this.cast.characters = [];
                this.resetNetworks();
                this.microtheories = [];
                this.socialGamesLib.games = [];
                this.ckb.propsSubjective = [];
                this.ckb.propsTruth = [];
                this.sfdb.contexts = [];
            }

            var checkUndefined = function(obj, reqs) {
                reqs.forEach(function(req) {
                    if(obj[req] === undefined) {
                        throw new Error("Invalid loading, missing " + req + " from: ", obj);
                    }
                });
            }

            //Loading
            this.loadJSON = function(loadData) {
                this.clear();
                for(var klass in loadData) {
                    if(this.load[klass]) {
                        this.load[klass](loadData[klass]);
                    } else {
                        throw new Error("Incorrect input. No such class " + klass);
                    }
                }
            }
            this.load = {};

            this.load.Cast = function(cast) {
                var load = this;
                cast.forEach(function(character) {
                    if(character.Character) {
                        Cast.getInstance().addCharacter(load.Character(character.Character))
                    } else {
                        throw new Error("Incorrectly formatted character " + character);
                    }
                });
            }

            this.load.Character = function(character) {
                var load = this;
                checkUndefined(character, ["traits"]);
                character.traits.forEach(function(trait, i) {
                    character.traits[i] = load.Trait(trait);
                });
                return new Character(character);
            }

            this.load.Trait = function(trait) {
                return Trait.getNumberByName(trait);
            }

            this.load.SocialFactsDB = function(sfdb) {
                checkUndefined(sfdb, ["contexts"]);
                var load = this;
                sfdb.contexts.forEach(function(context) {
                    //Creates a new context and pushes it into the SFDB
                    var type = Object.keys(context)[0];
                    //Calls different load functions depending on the context type
                    var ctx = load[type](context[type]);
                    SocialFactsDB.getInstance().addContext(ctx);
                });
            }

            this.load.StatusContext = function(context) {
                //Instantiate a new Predicate
                context.Predicate = this.Predicate(context.Predicate);
                return new StatusContext(context);
            }

            this.load.Predicate = function(predicate) {
                predicate.type = Predicate.getTypeByName(predicate.type);
                predicate.status = this.Status(predicate.status);
                predicate.trait = this.Trait(predicate.trait);
                return new Predicate(predicate);
            }

            this.load.Status = function(statusName) {
                return Status.getStatusNumberByName(statusName);
            }

            this.load.SocialGamesLib = function(sgl) {
                var load = this;
                sgl.forEach(function(sg) {
                    SocialGamesLib.getInstance().addGame(load.SocialGame(sg))
                });
            }

            this.load.SocialGame = function(sg) {
                var load = this;
                sg = sg.SocialGame;
                checkUndefined(sg, ["preconditions", "initiatorIRS", "responderIRS", "effects"]);
                sg.preconditions.forEach(function(rule, i) {
                    sg.preconditions[i] = load.Rule(rule.Rule);
                });
                sg.initiatorIRS = load.InfluenceRuleSet(sg.initiatorIRS);
                sg.responderIRS = load.InfluenceRuleSet(sg.responderIRS);
                sg.effects.forEach(function(e, i) {
                    sg.effects[i] = load.Effect(e.Effect);
                });
                if(sg.instantiations !== undefined) {
                    sg.instantiations.forEach(function(ins, i) {
                        sg.instantiations[i] = load.Instantiation(ins.Instantiation);
                    });
                }
                return new SocialGame(sg);
            }

            this.load.InfluenceRuleSet = function(irs) {
                var set = { "influenceRules" :  []};
                var load = this;
                irs.forEach(function(ir, i) {
                    set.influenceRules[i] = load.InfluenceRule(ir.InfluenceRule);
                });
                return new InfluenceRuleSet(set);
            }

            this.load.InfluenceRule = function(ir) {
                checkUndefined(ir, ["predicates"]);
                var load = this;
                ir.predicates.forEach(function(pred, i) {
                    ir.predicates[i] = load.Predicate(pred.Predicate);
                });
                return new InfluenceRule(ir);
            }

            this.load.Rule = function(rule) {
                checkUndefined(rule, ["predicates"]);
                var load = this;
                rule.predicates.forEach(function(pred, i) {
                    rule.predicates[i] = load.Predicate(pred.Predicate);
                });
                return new Rule(rule);
            }

            this.load.Effect = function(effect) {
                if(effect.change) {
                    effect.change = this.Rule(effect.change.Rule);
                }
                if(effect.condition) {
                    effect.condition = this.Rule(effect.condition.Rule);
                }
                if(effect.locutions) {
                    effect.locutions = Util.createLocutionVectors(effect.locutions);
                }

                return new Effect(effect);
            }

            this.load.Instantiation = function(ins) {
                checkUndefined(ins, ["lines"]);
                var load = this;
                ins.lines.forEach(function(l, i) {
                    ins[i] = load.LineOfDialogue(l.LineOfDialogue);
                });
                return new Instantiation(ins);
            }

            this.load.LineOfDialogue = function(line) {
                return new LineOfDialogue(line);
            }

            this.load.CulturalKB = function(ckb) {
                var load = this;
                var tmp;
                ckb.forEach(function(prop) {
                    tmp = load.Proposition(prop.Proposition);
                    if(tmp.type === "subjective") {
                        CulturalKB.getInstance().propsSubjective.push(tmp);
                    } else if(tmp.type === "truth") {
                        CulturalKB.getInstance().propsTruth.push(tmp);
                    } else {
                        throw new Error("Invalid Proposition: ", tmp);
                    }
                });
            }

            this.load.Proposition = function(prop) {
                return new Proposition(prop);
            }

            //One loader for the Networks
            this.load.SocialNetworks = function(networks) {
                networks.forEach(function(sn) {
                    switch(sn.type) {
                        case "romance":
                            RomanceNetwork.getInstance().initialize(sn.numChars, sn.edges);
                            break;
                        case "cool":
                            CoolNetwork.getInstance().initialize(sn.numChars, sn.edges);
                            break;
                        case "buddy":
                            BuddyNetwork.getInstance().initialize(sn.numChars, sn.edges);
                            break;
                    }
                });
            }

        } //End of CiFSingleton

        CiFSingleton.getInstance = function() {
            return instance || new CiFSingleton();
        }


        //Hack to solve some dependency problems

        return CiFSingleton;
    }

    return cif();
});
