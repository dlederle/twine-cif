define(['Predicate', 'Cast'], function(Predicate, Cast) {
    var sfdb = function() {
        var instance;
        function SocialFactsDB() {
            if (instance) {
                return instance;
            }
            instance = this;

            this.contexts = [];
            this.triggers = [];
            this.triggersAllChars = [];
            this.storyTriggers = [];

            this.getContextsAtTime = function(time) {
                var contextsToReturn = [];
                this.contexts.forEach(function(context) {
                    if(context.getTime() === time) {
                        contextsToReturn.push(context);
                    }
                    else if(context.getTime < time) {
                        return contextsToReturn;
                    }
                });
                return contextsToReturn;
            }

            this.getTriggerContextsAtTime = function(time) {
                var triggersToReturn = [];
                this.contexts.forEach(function(context) {
                    if(context.getTime() === time && context.isTrigger()) {
                        triggersToReturn.push(context);
                    }
                    else if(context.getTime < time) {
                        return triggersToReturn;
                    }
                });
                return triggersToReturn;
            }

            this.getStatusContextsAtTime = function(time) {
                var statusesToReturn = [];
                this.contexts.forEach(function(context) {
                    if(context.getTime() === time && context.isStatus()) {
                        statusesToReturn.push(context);
                    }
                    else if(context.getTime < time) {
                        return statusesToReturn;
                    }
                });
                return statusesToReturn;
            }

            this.getSocialGameContextsAtTime = function(time) {
                var sgcsToReturn = [];
                this.contexts.forEach(function(context) {
                    if(context.getTime() === time && context.isSocialGame()) {
                        sgcsToReturn.push(context);
                    }
                    else if(context.getTime < time) {
                        return sgcsToReturn;
                    }
                });
                return sgcsToReturn;
            }

            this.getTriggerById = function(id) {
                this.triggers.forEach(function(trigger) {
                    if(trigger.id == id) { return trigger; }
                });
            }

            /**
             * Determines the predicate was true in any change in any SFDBContext within
             * the time window specified in the predicate p.
             *
             * @param	p	Predicate to check for.
             * @param	x	Primary character.
             * @param	y	Secondary character.
             * @param	z	Tertiary character.
             * @return	True if the predicate was found, false if not.
             */
            this.isPredicateInHistory = function(p, x, y, z) {
                return (this.timeOfPredicateInHistory(p, x, y, z) != SocialFactsDB.PREDICATE_NOT_FOUND);
            }

            /**
             * Returns the most recent time a predciate was true in social change associated with
             * a SFDBContext.
             *
             * @param	p	Predicate to check for.
             * @param	x	Primary character.
             * @param	y	Secondary character.
             * @param	z	Tertiary character.
             * @return	The time when the predciate was true if found. SocialFactsDB.PREDICATE_NOT_FOUND if not found.
             */
            this.timeOfPredicateInHistory = function(p, x, y, z) {
                var latestTimeInSFDB = this.getLatestContextTime();
                var window = (p.window > 0 && p.isSFDB && p.sfdbOrder < 1) ?  p.window : latestTimeInSFDB + 1;
                //time iterator
                var t = latestTimeInSFDB;

                this.contexts.forEach(function(ctx) {
                    if (ctx.isPredicateInChange(p, x, y, z))
                        return ctx.getTime();
                });

                if (p.sfdbOrder != 0) {
                    if ((latestTimeInSFDB - window) <= 0) {
                        var predForTest = p.clone();
                        predForTest.sfdbOrder = 0;
                        //if we've run out of history to check, treat it like it was true at time 0.
                        if (predForTest.evaluate(x, y, z)) {
                            return 0;
                        }
                    }
                }
                return SocialFactsDB.PREDICATE_NOT_FOUND; //predicate was not found in the window
            }

            this.sortDescendingTime = function(x, y) {
                return (y.getTime() - x.getTime());
            }

            /**
             * Determines if the change denoted by a predicate is in an SFDB's
             * social change in a time window that starts at current time and ends
             * at current time - p.window.
             * @param	p	The predicate denoted the social change to find.
             * @return	The index of the first found SFDBContext with the matching
             * social state change or -1 if change was not found in the window.
             */
            this.findPredicateInChange = function(p) {
                var lastContextTime = this.contexts[this.contexts.length - 1].getTime();
                var i;
                var j;
                var r; //Rule
                var window= (p.window <= 0) ? lastContextTime : p.window;
                for (i = this.contexts.length-1; i > -1 && lastContextTime - window <= this.contexts[i].getTime(); --i) {
                    r = this.contexts[i].getChange();
                    for (j = r.predicates.length - 1; j >= 0; --j) {
                        if (Predicate.equals(p, r.predicates[j])) {
                            return i;
                        }
                    }
                }
                return -1;
            }

            /**
             * findLabelFromValues returns a vector of ints, i.e. matchingIndices by
             * looking at all the socialgame or trigger contexts in the window, and returns the
             * indices of contexts that match the arguments label, firstCharacter, secondCharater.
             * @param	label			The SFDB label to locate.
             * @param	firstCharacter	First character (from) slot.
             * @param	secondCharacter	Second character (to) slot.
             * @param	w				The window in SFDB time to look back for matches. A window
             * of 0 means the entire history is checked.
             * @return	A vector containing the timestamp of the matching social
             * facts database context entries.
             */
            this.findLabelFromValues = function(label, firstCharacter, secondCharacter, thirdCharacter,  w, pred) {
                w = w || 0;
                //console.debug(this, "findLabelFromValues: entering!");
                if (this.contexts.length < 1) {
                    console.debug(this, "findLabelFromValues: exiting early!");
                    return [];
                }

                var lastContextTime = this.getLatestContextTime();
                var i;
                var sgc;
                var sc;
                var tc;
                var matchingIndexes = [];
                var window = (w <= 0) ? lastContextTime : w;
                var labelMatches = false;
                var firstMatches = false;
                var secondMatches = false;
                var thirdMatches = false;

                var timeToHaltSearch;
                if (w <= 0) {
                    timeToHaltSearch = this.getLowestContextTime()-1;
                } else {
                    timeToHaltSearch = lastContextTime - window;
                }

                //console.debug(this, "findLabelFromValues() last context time: " + lastContextTime + " first context time: " + this.getLowestContextTime() + " timeToHaltSearch: " + timeToHaltSearch);


                //NOTE: this assumes that all entries are in order such that the most recent action is last in contexts
                //console.debug(this, "findLabelFromValue() incoming values: label: " + getLabelByNumber(label) + " first: " + ((firstCharacter)?firstCharacter.characterName:"undefined") + " second: " + ((secondCharacter)?secondCharacter.characterName:"undefined"));
                //for (i = this.contexts.length - 1; i > -1; --i)
                //NOTE: the following for case assumes the contexts are in descending order by time
                for (i = 0; i < this.contexts.length; ++i) {
                    if ( (this.contexts[i].isSocialGame() || this.contexts[i].isTrigger()) && (timeToHaltSearch < this.contexts[i].getTime())) {
                        //console.debug(this, "findLabelFromValues() current context time: " + this.contexts[i].getTime());
                        if(this.contexts[i].isSocialGame()) {
                            sgc = this.contexts[i];
                            /*
                               if (sgc.time == -51 && sgc.initiator.toLowerCase() == "nicholas" && sgc.responder.toLowerCase() == "kate") {
                               console.debug(this, "testing SFDBwindow(0) for SFDBLabel predicates");
                               }
                               */
                            if(pred && pred.numTimesUniquelyTrueFlag) {
                                //Call a strict version of this. Which requires a from because it is numTimesUniquelyTrue
                                if (sgc.doesSFDBLabelMatchStrict(label, firstCharacter, secondCharacter, thirdCharacter, pred)) {
                                    matchingIndexes.push(sgc.getTime());
                                    //console.debug(this, "findLabelFromValues() pushing a context index on the matching indexes. sgc: " + sgc.toXMLString());
                                }
                            }
                            else if (!this.contexts[i].isJuice()) {
                                //The normal case
                                if (sgc.doesSFDBLabelMatch(label, firstCharacter, secondCharacter, thirdCharacter, pred)) {
                                    matchingIndexes.push(sgc.getTime());
                                    //console.debug(this, "findLabelFromValues() pushing a context index on the matching indexes. sgc: " + sgc.toXMLString());
                                }
                            }
                        }else if (this.contexts[i].isTrigger()) {
                            tc = this.contexts[i];
                            if (pred && pred.numTimesUniquelyTrueFlag)
                            {
                                if (tc.doesSFDBLabelMatchStrict(label, firstCharacter, secondCharacter, thirdCharacter, pred)) 
                                {
                                    matchingIndexes.push(sgc.getTime());
                                }
                            }
                            else
                            {
                                if (tc.doesSFDBLabelMatch(label, firstCharacter, secondCharacter, thirdCharacter, pred)) 
                                {
                                    matchingIndexes.push(sgc.getTime());
                                }
                            }
                        }
                    }
                }

                return matchingIndexes;
            }


            /**
             * This function is used to deal with when we are seeing is a label is in a category.
             * If predicateLabel is not a category, returns false if it doesn't match contextLabel: true otherwise.
             * If predicateLabel is a category, it will loop through that category to see if contextLabel matches any in the category.
             * @param	contextLabel
             * @param	predicateLabel
             * @return
             */
            this.doesMatchLabelOrCategory = function(contextLabel, predicateLabel) {
                if (predicateLabel <= SocialFactsDB.LAST_CATEGORY_COUNT)
                {
                    SocialFactsDB.CATEGORIES[predicateLabel].forEach(function(cat_label) {
                        if (cat_label === contextLabel)
                    {
                        return true;
                    }
                    });
                    return false;
                }
                else if (contextLabel != predicateLabel)
                {
                    return false;
                }
                return true;
            }


            this.getLatestSocialGameContext = function() {
                var latestContextTime = -1000;// this.getLatestContextTime();

                //console.debug(this, "getLatestSocialGameContext() LatestContextTime: " + latestContextTime);

                var contextWithHighestTime;

                this.contexts.forEach(function(context) {
                    if (context.getTime() > latestContextTime && context.isSocialGame()) {
                        latestContextTime = context.getTime();
                        contextWithHighestTime = context;
                        //return context as SocialGameContext;
                    }
                });

                return contextWithHighestTime;
            }

            this.getLatestTriggerContexts = function() {
                var latestContextTime = this.getLatestContextTime();

                var triggerContexts = [];
                this.contexts.forEach(function(context) {
                    if(context.getTime() === latestContextTime && context.isTrigger()) {
                        triggerContexts.push(context);
                    }
                    else if(context.getTime < time) {
                        return triggersToReturn;
                    }
                });

                return triggerContexts;
            }

            /**
             * Returns the timestamp of the latest SFDB comtext in game time.
             *
             * @return the time of the latest context time
             */
            this.getLatestContextTime = function() {
                //since we sort after the initial SFDB loading process and after each context is added,
                //the highest context time will always be at the beginning of the vector.
                if(this.contexts[0]) {
                    return this.contexts[0].getTime();
                }
            }

            /**
             * Returns the timestamp of the first context relative to game time. This value is
             * likely to be negative due to authored backstory.
             *
             * @return the time of the first context time
             */
            this.getLowestContextTime = function() {
                //since we sort after the initial SFDB loading process and after each context is added,
                //the lowest context time will always be at the end of the vector.
                if(this.contexts[this.contexts.length-1]) {
                    return this.contexts[this.contexts.length-1].getTime();
                }
            }

            /**
             * Returns the timestamp of the first context relative to game time. This value is
             * likely to be negative due to authored backstory.
             *
             * @return the time of the first context time
             */
            this.getEarliestContextTime = function() {
                return this.getLowestContextTime();
            }

            /**
             * findLabelFromPredicate takes in a predicate, and returns a vector of ints
             * Makes use of findLabelFromValues to assign appropriate labels and values to predicate
             * @see findLabelFromValues
             * @param	p
             * @return
             */
            this.findLabelFromPredicate = function(p) {
                var cast = Cast.getInstance();
                return this.findLabelFromValues(p.sfdbLabel, cast.getCharByName(p.primary), cast.getCharByName(p.secondary), cast.getCharByName(p.tertiary), p.window, p);
            }


            /**
             * Returns the first social game context from this.contexts that occurred at time time.
             *
             * @param	time
             * @return
             */
            this.getSocialGameContextAtTime = function(time) {
                this.contexts.forEach(function(context) {
                    if(context.isSocialGame() && context.getTime() === time) {
                        return context;
                    }
                });
            }

            /**
             * Runs all the triggers over the social facts database for each
             * character. Meant to be called after platGame.
             */
            this.runTriggers = function(cast) {
                var potentialCharacters = cast || Cast.getInstance().characters;

                var towardChar;
                var fromChar;

                //console.debug(this, "runTriggers() about to run triggers.");
                //console.debug(this, "runTriggers() number of triggers is " + this.triggers.length);

                var triggersToApply = [];
                var firstRoles = [];
                var secondRoles = [];
                var thirdRoles = [];

                //run each trigger on every duple of characters or triple where needed by the trigger.
                this.triggers.forEach(function(trigger) {
                    potentialCharacters.forEach(function(firstChar) {
                        potentialCharacters.forEach(function(secondChar) {
                            //don't evaluate a trigger with the same character in both roles
                            if(firstChar.characterName != secondChar.characterName) {
                                //run the trigger for each character triple if a third character is needed by the trigger.
                                if (trigger.requiresThirdCharacter()) {
                                    //console.debug(this, "runTriggers() trigger for 3 characters is being evaluated: " + firstChar.characterName + " " + secondChar.characterName + " with third to be determined"  );
                                    potentialCharacters.forEach(function(thirdChar) {
                                        //make sure that each role has a unique character
                                        //aleady checked that the first two characters were unique so check for third
                                        if (thirdChar != firstChar && thirdChar != secondChar) {
                                            //if (trigger.referenceAsNaturalLanguage == "If someone is romantic to your date more than once, you are angry at them" && firstChar.characterName == "Zack" && secondChar.characterName == "Simon" && thirdChar.characterName == "Monica")
                                            //{
                                            //console.debug(this,"BREAK!");
                                            //}

                                            if (trigger.evaluateCondition(firstChar, secondChar, thirdChar)) {
                                                //if (trigger.id == 10 && !trigger.useAllChars)
                                                //{
                                                //trace("------");
                                                //}


                                                //console.debug(this, "runTriggers() Trigger True: " + trigger.toString());
                                                //console.debug(this, "runTriggers() trigger for 3 characters was true and is being valuated: " + firstChar.characterName + " " + secondChar.characterName + " " + thirdChar.characterName + " " );
                                                //valuate the trigger

                                                triggersToApply.push(trigger);
                                                firstRoles.push(firstChar);
                                                secondRoles.push(secondChar);
                                                thirdRoles.push(thirdChar);

                                            }
                                        }
                                    });
                                }
                                else {
                                    //only two characters are required
                                    //see if trigger's condition is true
                                    //console.debug(this, "runTriggers() Trigger True: " + trigger.toString());
                                    //console.debug(this, "runTriggers() trigger for 2 characters was true and is being valuated: " + firstChar.characterName + " " + secondChar.characterName + " " );
                                    if (trigger.evaluateCondition(firstChar, secondChar)) {
                                        //if (trigger.id == 10 && !trigger.useAllChars)
                                        //{
                                        //trace("------");
                                        //}
                                        triggersToApply.push(trigger);
                                        firstRoles.push(firstChar);
                                        secondRoles.push(secondChar);
                                        thirdRoles.push(undefined);
                                    }
                                }
                            }
                        });
                    });
                });

                //now that we have collected all the the triggers and characters involved, valuate them all

                // aPredHasValuated will be used to keep track of whether or not a triggerContext should be created
                // because it may be the case that the status was already the case, and thus a trigger context should not be created
                var aPredHasValuated;
                for (var i = 0; i < triggersToApply.length; i++ ) {
                    trigger = triggersToApply[i];
                    firstChar = firstRoles[i];
                    secondChar = secondRoles[i];
                    thirdChar = thirdRoles[i];


                    aPredHasValuated = false;
                    // go through each change predicate and treat status that are already the case different than those that aren't
                    //this is all part of making sure that we don't contantly display "cheating" every turn while someone is dating two characters
                    trigger.change.predicates.forEach(function(changePred) {

                        //console.debug(this, cif.time + ": Trigger Change Pred: " + changePred.toString()+ " first: " + firstChar.characterName + " second: " + secondChar.characterName + " third: " + thirdChar.characterName);

                        //figure out who the predicate should be applied to
                        var primaryValue = changePred.getPrimaryValue();
                        switch (primaryValue)
                    {
                        case "initiator":
                            fromChar = firstChar;
                            break;
                        case "responder":
                            fromChar = secondChar;
                            break;
                        case "other":
                            fromChar = thirdChar;
                            break;
                        default:
                            fromChar = Cast.getInstance().getCharByName(primaryValue);
                    }

                    if (changePred.type == Predicate.STATUS)
                    {
                        towardChar = undefined;
                        if (changePred.status >= Status.FIRST_DIRECTED_STATUS)
                        {
                            //figure out who the status should be direct towards
                            var secondaryValue = changePred.getSecondaryValue();
                            switch (secondaryValue)
                            {
                                case "initiator":
                                    towardChar = firstChar;
                                    break;
                                case "responder":
                                    towardChar = secondChar;
                                    break;
                                case "other":
                                    towardChar = thirdChar;
                                    break;
                                default:
                                    towardChar = Cast.getInstance().getCharByName(secondaryValue);
                            }
                        }


                        if (fromChar.getStatus(changePred.status,towardChar))
                        {
                            //if we are here, then we know that the fromChar has the status
                            if (changePred.negated)
                            {
                                //this deals with removing status, which warrants a new trigger context
                                aPredHasValuated = true;
                                //console.debug(this, cif.time + ": Negated Valuation: " + changePred.toString()+ " first: " + firstChar.characterName + " second: " + secondChar.characterName + " third: " + thirdChar.characterName);
                                changePred.valuation(firstChar, secondChar, thirdChar);
                            }
                            else
                            {
                                //this is the case where rather than apply the status, we only reset its remaining duration. This is the
                                //case that we do not want to create a new trigger context for.
                                //console.debug(this, "Reset the duration of: " + Status.getStatusNameByNumber(changePred.status) + " for " + firstChar.characterName + " at time " + cif.time+ " first: " + firstChar.characterName + " second: " + secondChar.characterName + " third: " + thirdChar.characterName);
                                fromChar.getStatus(changePred.status, towardChar).remainingDuration = Status.DEFAULT_INITIAL_DURATION;
                            }
                        }
                        else if (!changePred.negated)
                        {
                            //this is the "normal case" where we simple apply the change predicate
                            aPredHasValuated = true;
                            //console.debug(this, cif.time + ": Normal Valuation: " + changePred.toString() + " first: " + firstChar.characterName + " second: " + secondChar.characterName + " third: " + thirdChar.characterName);
                            changePred.valuation(firstChar, secondChar, thirdChar);
                        }
                        else
                        {
                            //console.debug(this, cif.time + ": Nothing Done with this: " + changePred.toString()+ " first: " + firstChar.characterName + " second: " + secondChar.characterName + " third: " + thirdChar.characterName);
                        }
                    }
                    else
                    {
                        //this is the normal, non-status case
                        aPredHasValuated = true;
                        //console.debug(this, cif.time + ": Normal Valuation: " + changePred.toString()+ " first: " + firstChar.characterName + " second: " + secondChar.characterName + " third: " + thirdChar.characterName);
                        changePred.valuation(firstChar, secondChar, thirdChar);
                    }
                    });
                    //make a trigger context and put it in the SFDB 
                    if (aPredHasValuated)
                    {
                        var tc1 = trigger.makeTriggerContext(cif.time, firstChar, secondChar,thirdChar);
                        //console.debug(this, "runTriggers() Trigger: " + trigger.toString())
                        //console.debug(this, "runTriggers() Context: " + tc1.toXML())
                        this.addContext(tc1);
                    }
                }
                //console.debug(this, "runTriggers() finished running triggers.");
            }

            /**
             * Adds a context to the SFDB then sorts the SFDB by descending time.
             * @param	context	The SFDB context to be added to the SFDB.
             */
            this.addContext = function(context) {
                this.contexts.push(context);
                this.contexts.sort(this.sortDescendingTime);
            }

            /**
             * @return boolean
             */
            this.isEmpty = function() {
                return (this.contexts.length == 0);
            }
        } //End of SocialFactsDB

        SocialFactsDB.getInstance = function() {
            return instance || new SocialFactsDB;
        }

        SocialFactsDB.CAT_NEGATIVE = 0;
        SocialFactsDB.CAT_POSITIVE = 1;
        SocialFactsDB.CAT_LAME = 2;
        SocialFactsDB.CAT_FLIRT = 3; //this category is for romantic acts where whether it was accepted or rejected doesn't matter

        SocialFactsDB.LAST_CATEGORY_COUNT = 3;
        SocialFactsDB.FIRST_DIRECTED_LABEL = 4;

        SocialFactsDB.COOL = 4;
        SocialFactsDB.LAME = 5; //!
        SocialFactsDB.ROMANTIC = 6; //!
        SocialFactsDB.FAILED_ROMANCE = 7; //!
        SocialFactsDB.GROSS = 8;
        SocialFactsDB.FUNNY = 9;
        SocialFactsDB.BAD_ASS = 10;
        SocialFactsDB.MEAN = 11; //!
        SocialFactsDB.NICE = 12; //!
        SocialFactsDB.TABOO = 13;
        SocialFactsDB.RUDE = 14;
        SocialFactsDB.EMBARRASSING = 15;
        SocialFactsDB.MISUNDERSTOOD = 16;

        SocialFactsDB.FIRST_STORY_SEQUENCE = 17;

        SocialFactsDB.SS1_ACT1 = 17;
        SocialFactsDB.SS1_ACT2 = 18;
        SocialFactsDB.SS1_ACT3 = 19;
        SocialFactsDB.SS1_ACT4 = 20;

        SocialFactsDB.SS2_ACT1 = 21;
        SocialFactsDB.SS2_ACT2 = 22;
        SocialFactsDB.SS2_ACT3 = 23;
        SocialFactsDB.SS2_ACT4 = 24;

        SocialFactsDB.SS3_ACT1 = 25;
        SocialFactsDB.SS3_ACT2 = 26;
        SocialFactsDB.SS3_ACT3 = 27;
        SocialFactsDB.SS3_ACT4 = 28;

        SocialFactsDB.SS4_ACT1 = 29;
        SocialFactsDB.SS4_ACT2 = 30;
        SocialFactsDB.SS4_ACT3 = 31;
        SocialFactsDB.SS4_ACT4 = 32;

        SocialFactsDB.SS5_ACT1 = 33;
        SocialFactsDB.SS5_ACT2 = 34;
        SocialFactsDB.SS5_ACT3 = 35;
        SocialFactsDB.SS5_ACT4 = 36;

        SocialFactsDB.SS6_ACT1 = 37;
        SocialFactsDB.SS6_ACT2 = 38;
        SocialFactsDB.SS6_ACT3 = 39;
        SocialFactsDB.SS6_ACT4 = 40;

        SocialFactsDB.SS7_ACT1 = 41;
        SocialFactsDB.SS7_ACT2 = 42;
        SocialFactsDB.SS7_ACT3 = 43;
        SocialFactsDB.SS7_ACT4 = 44;

        SocialFactsDB.SS8_ACT1 = 45;
        SocialFactsDB.SS8_ACT2 = 46;
        SocialFactsDB.SS8_ACT3 = 47;
        SocialFactsDB.SS8_ACT4 = 48;
        SocialFactsDB.SS8_ACT5 = 49;

        SocialFactsDB.SS9_ACT1 = 50;
        SocialFactsDB.SS9_ACT2 = 51;
        SocialFactsDB.SS9_ACT3 = 52;
        SocialFactsDB.SS9_ACT4 = 53;

        SocialFactsDB.SS10_ACT1 = 54;
        SocialFactsDB.SS10_ACT2 = 55;
        SocialFactsDB.SS10_ACT3 = 56;
        SocialFactsDB.SS10_ACT4 = 57;

        SocialFactsDB.LABEL_COUNT = 58;

        //the value of a predicate not being found in a change rule search
        SocialFactsDB.PREDICATE_NOT_FOUND = -99999;

        SocialFactsDB.CATEGORIES = {};
        // This block is run once when the class is first accessed
        SocialFactsDB.CATEGORIES[SocialFactsDB.CAT_POSITIVE] = [SocialFactsDB.COOL, SocialFactsDB.ROMANTIC, SocialFactsDB.FUNNY, SocialFactsDB.BAD_ASS, SocialFactsDB.NICE];
        SocialFactsDB.CATEGORIES[SocialFactsDB.CAT_NEGATIVE] = [SocialFactsDB.MEAN, SocialFactsDB.TABOO, SocialFactsDB.RUDE]; // Note: Aaron removed gross from this list since well-meaning characters often do gross things unintentionally, so it's not always fair to tar them with a cat: negative action.
        SocialFactsDB.CATEGORIES[SocialFactsDB.CAT_LAME] = [SocialFactsDB.EMBARRASSING, SocialFactsDB.LAME];
        SocialFactsDB.CATEGORIES[SocialFactsDB.CAT_FLIRT] = [SocialFactsDB.ROMANTIC,SocialFactsDB.FAILED_ROMANCE];
        /*		SocialFactsDB.DISAGREEMENT = 14;
                SocialFactsDB.HARASSMENT = 15;*/

        SocialFactsDB.getLabelByName = function(name) {
            if (name) {
                switch(name.toLowerCase())
                {
                    case "cool":
                        return SocialFactsDB.COOL;
                    case "lame":
                        return SocialFactsDB.LAME;
                    case "romantic":
                        return SocialFactsDB.ROMANTIC;
                    case "failed romance":
                        return SocialFactsDB.FAILED_ROMANCE;
                    case "gross":
                        return SocialFactsDB.GROSS;
                    case "funny":
                        return SocialFactsDB.FUNNY;
                    case "bad ass":
                        return SocialFactsDB.BAD_ASS;
                    case "mean":
                        return SocialFactsDB.MEAN;
                    case "nice":
                        return SocialFactsDB.NICE;
                    case "taboo":
                        return SocialFactsDB.TABOO;
                    case "rude":
                        return SocialFactsDB.RUDE;
                    case "embarrassing":
                        return SocialFactsDB.EMBARRASSING;
                    case "misunderstood":
                        return SocialFactsDB.MISUNDERSTOOD;
                    case "cat: negative":
                               return SocialFactsDB.CAT_NEGATIVE;
                    case "cat: positive":
                               return SocialFactsDB.CAT_POSITIVE;
                    case "cat: lame":
                               return SocialFactsDB.CAT_LAME;
                    case "cat: flirt":
                               return SocialFactsDB.CAT_FLIRT;
                    case "ss1_act1":
                               return SocialFactsDB.SS1_ACT1;
                    case "ss1_act2":
                               return SocialFactsDB.SS1_ACT2;
                    case "ss1_act3":
                               return SocialFactsDB.SS1_ACT3;
                    case "ss1_act4":
                               return SocialFactsDB.SS1_ACT4;
                    case "ss2_act1":
                               return SocialFactsDB.SS2_ACT1;
                    case "ss2_act2":
                               return SocialFactsDB.SS2_ACT2;
                    case "ss2_act3":
                               return SocialFactsDB.SS2_ACT3;
                    case "ss2_act4":
                               return SocialFactsDB.SS2_ACT4;
                    case "ss3_act1":
                               return SocialFactsDB.SS3_ACT1;
                    case "ss3_act2":
                               return SocialFactsDB.SS3_ACT2;
                    case "ss3_act3":
                               return SocialFactsDB.SS3_ACT3;
                    case "ss3_act4":
                               return SocialFactsDB.SS3_ACT4;
                    case "ss4_act1":
                               return SocialFactsDB.SS4_ACT1;
                    case "ss4_act2":
                               return SocialFactsDB.SS4_ACT2;
                    case "ss4_act3":
                               return SocialFactsDB.SS4_ACT3;
                    case "ss4_act4":
                               return SocialFactsDB.SS4_ACT4;
                    case "ss5_act1":
                               return SocialFactsDB.SS5_ACT1;
                    case "ss5_act2":
                               return SocialFactsDB.SS5_ACT2;
                    case "ss5_act3":
                               return SocialFactsDB.SS5_ACT3;
                    case "ss5_act4":
                               return SocialFactsDB.SS5_ACT4;
                    case "ss6_act1":
                               return SocialFactsDB.SS6_ACT1;
                    case "ss6_act2":
                               return SocialFactsDB.SS6_ACT2;
                    case "ss6_act3":
                               return SocialFactsDB.SS6_ACT3;
                    case "ss6_act4":
                               return SocialFactsDB.SS6_ACT4;
                    case "ss7_act1":
                               return SocialFactsDB.SS7_ACT1;
                    case "ss7_act2":
                               return SocialFactsDB.SS7_ACT2;
                    case "ss7_act3":
                               return SocialFactsDB.SS7_ACT3;
                    case "ss7_act4":
                               return SocialFactsDB.SS7_ACT4;
                    case "ss8_act1":
                               return SocialFactsDB.SS8_ACT1;
                    case "ss8_act2":
                               return SocialFactsDB.SS8_ACT2;
                    case "ss8_act3":
                               return SocialFactsDB.SS8_ACT3;
                    case "ss8_act4":
                               return SocialFactsDB.SS8_ACT4;
                    case "ss8_act5":
                               return SocialFactsDB.SS8_ACT5;
                    case "ss9_act1":
                               return SocialFactsDB.SS9_ACT1;
                    case "ss9_act2":
                               return SocialFactsDB.SS9_ACT2;
                    case "ss9_act3":
                               return SocialFactsDB.SS9_ACT3;
                    case "ss9_act4":
                               return SocialFactsDB.SS9_ACT4;
                    case "ss10_act1":
                               return SocialFactsDB.SS10_ACT1;
                    case "ss10_act2":
                               return SocialFactsDB.SS10_ACT2;
                    case "ss10_act3":
                               return SocialFactsDB.SS10_ACT3;
                    case "ss10_act4":
                               return SocialFactsDB.SS10_ACT4;
                    default:
                               return -1;
                }
            }
            return -1;
        }

        SocialFactsDB.getLabelByNumber = function(n) {
            switch (n) {
                case SocialFactsDB.COOL:
                    return "cool";
                case SocialFactsDB.LAME:
                    return "lame";
                case SocialFactsDB.ROMANTIC:
                    return "romantic";
                case SocialFactsDB.FAILED_ROMANCE:
                    return "failed romance";
                case SocialFactsDB.GROSS:
                    return "gross";
                case SocialFactsDB.FUNNY:
                    return "funny";
                case SocialFactsDB.BAD_ASS:
                    return "bad ass";
                case SocialFactsDB.MEAN:
                    return "mean";
                case SocialFactsDB.NICE:
                    return "nice";
                case SocialFactsDB.TABOO:
                    return "taboo";
                case SocialFactsDB.RUDE:
                    return "rude";
                case SocialFactsDB.EMBARRASSING:
                    return "embarrassing";
                case SocialFactsDB.MISUNDERSTOOD:
                    return "misunderstood";
                case SocialFactsDB.CAT_NEGATIVE:
                    return "cat: negative";
                case SocialFactsDB.CAT_POSITIVE:
                    return "cat: positive";
                case SocialFactsDB.CAT_FLIRT:
                    return "cat: flirt";
                case SocialFactsDB.CAT_LAME:
                    return "cat: lame";

                case SocialFactsDB.SS1_ACT1:
                    return "ss1_act1";
                case SocialFactsDB.SS1_ACT2:
                    return "ss1_act2";
                case SocialFactsDB.SS1_ACT3:
                    return "ss1_act3";
                case SocialFactsDB.SS1_ACT4:
                    return "ss1_act4";

                case SocialFactsDB.SS2_ACT1:
                    return "ss2_act1";
                case SocialFactsDB.SS2_ACT2:
                    return "ss2_act2";
                case SocialFactsDB.SS2_ACT3:
                    return "ss2_act3";
                case SocialFactsDB.SS2_ACT4:
                    return "ss2_act4";

                case SocialFactsDB.SS3_ACT1:
                    return "ss3_act1";
                case SocialFactsDB.SS3_ACT2:
                    return "ss3_act2";
                case SocialFactsDB.SS3_ACT3:
                    return "ss3_act3";
                case SocialFactsDB.SS3_ACT4:
                    return "ss3_act4";

                case SocialFactsDB.SS4_ACT1:
                    return "ss4_act1";
                case SocialFactsDB.SS4_ACT2:
                    return "ss4_act2";
                case SocialFactsDB.SS4_ACT3:
                    return "ss4_act3";
                case SocialFactsDB.SS4_ACT4:
                    return "ss4_act4";

                case SocialFactsDB.SS5_ACT1:
                    return "ss5_act1";
                case SocialFactsDB.SS5_ACT2:
                    return "ss5_act2";
                case SocialFactsDB.SS5_ACT3:
                    return "ss5_act3";
                case SocialFactsDB.SS5_ACT4:
                    return "ss5_act4";

                case SocialFactsDB.SS6_ACT1:
                    return "ss6_act1";
                case SocialFactsDB.SS6_ACT2:
                    return "ss6_act2";
                case SocialFactsDB.SS6_ACT3:
                    return "ss6_act3";
                case SocialFactsDB.SS6_ACT4:
                    return "ss6_act4";

                case SocialFactsDB.SS7_ACT1:
                    return "ss7_act1";
                case SocialFactsDB.SS7_ACT2:
                    return "ss7_act2";
                case SocialFactsDB.SS7_ACT3:
                    return "ss7_act3";
                case SocialFactsDB.SS7_ACT4:
                    return "ss7_act4";

                case SocialFactsDB.SS8_ACT1:
                    return "ss8_act1";
                case SocialFactsDB.SS8_ACT2:
                    return "ss8_act2";
                case SocialFactsDB.SS8_ACT3:
                    return "ss8_act3";
                case SocialFactsDB.SS8_ACT4:
                    return "ss8_act4";
                case SocialFactsDB.SS8_ACT5:
                    return "ss8_act5";

                case SocialFactsDB.SS9_ACT1:
                    return "ss9_act1";
                case SocialFactsDB.SS9_ACT2:
                    return "ss9_act2";
                case SocialFactsDB.SS9_ACT3:
                    return "ss9_act3";
                case SocialFactsDB.SS9_ACT4:
                    return "ss9_act4";

                case SocialFactsDB.SS10_ACT1:
                    return "ss10_act1";
                case SocialFactsDB.SS10_ACT2:
                    return "ss10_act2";
                case SocialFactsDB.SS10_ACT3:
                    return "ss10_act3";
                case SocialFactsDB.SS10_ACT4:
                    return "ss10_act4";
                default:
                    return "";
            }
        }

        return SocialFactsDB;
    }
    return sfdb();
});
