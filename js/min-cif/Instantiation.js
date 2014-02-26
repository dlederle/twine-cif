define(['ToCLocution', 'Rule', 'LineOfDialogue'], function(ToCLocution, Rule, LineOfDialogue) {

    /**
     * Instantiations store the performance realization for a particular Effect
     * brance when performing social game play.
     * The Instantiation class aggregates lines of dialogs into Instantiations
     * to be associated with Effects of SocialGames.
     * @see CiF.LineOfDialog
     */

    var Instantiation = function(opts) {
        opts = opts || {};
        /**
         * The vector of LineOfDialogue class that comprises the animations,
         * dialogue, and timing of an instantiation.
         */
        this.lines = opts.lines || [];
        /**
         * The ID of the instantiation used to link social game effects with
         * instantiations.
         */
        this.name = opts.name || "";

        /**
         * The bank of conditional rules for use in performance
         * realization tags -- especially the if/conditional tags.
         */

        this.toc1 = new ToCLocution();
        this.toc1.tocID = 1;
        this.toc2 = new ToCLocution();
        this.toc2.tocID = 2;
        this.toc3 = new ToCLocution();
        this.toc3.tocID = 3;
        this.id = -1;
        this.conditionalRules = [];

        this.realizeDialogue = function(initiator, responder, other) {
            var newInst = new Instantiation();

            //render toc strings
            var newLod;
            var locution;
            var tocLoc;
            var conditionalLocution;
            var i;
            var conditionalStringAdded;

            this.lines.forEach(function(line) {
                newLod = line.clone();

                newLod.initiatorLine = "";
                newLod.responderLine = "";
                newLod.otherLine = "";

                line.initiatorLocutions.forEach(function(locution) {
                    toc1.speaker = "initiator";
                    toc2.speaker = "initiator";
                    toc3.speaker = "initiator";

                    toc1.renderText(initiator, responder, other, line);
                    toc2.renderText(initiator, responder, other, line);
                    toc3.renderText(initiator, responder, other, line);
                    if (locution.getType() == "ToCLocution") {
                        tocLoc = locution;
                        if (tocLoc.tocID == 1) {
                            newLod.initiatorLine += toc1.realizedString;
                        }
                        else if (tocLoc.tocID == 2) {
                            newLod.initiatorLine += toc2.realizedString;
                        }
                        else if (tocLoc.tocID == 3) {
                            newLod.initiatorLine += toc3.realizedString;
                        }
                    }
                    else if (locution.getType() == "MixInLocution") {
                        initiator.isSpeakerForMixInLocution = true;
                        newLod.initiatorLine += locution.renderText(initiator, responder, other, line);
                        initiator.isSpeakerForMixInLocution = false;
                    }
                    else if (locution.getType() == "ConditionalLocuation") {
                        conditionalLocution = locution;
                        conditionalStringAdded = false;

                        if (conditionalLocution.ifRuleID < this.conditionalRules.length) {
                            if (this.conditionalRules[conditionalLocution.ifRuleID].evaluate(initiator, responder, other)) {
                                newLod.initiatorLine += conditionalLocution.ifRuleString;
                                conditionalStringAdded = true;
                            }
                        }

                        if (!conditionalStringAdded) {
                            for (i = 0; i < conditionalLocution.elseIfRuleIDs.length; i++ ) {
                                if (conditionalLocution.elseIfRuleIDs[i] > this.conditionalRules.length - 1) continue;
                                if (this.conditionalRules[conditionalLocution.elseIfRuleIDs[i]].evaluate(initiator, responder, other)) {
                                    newLod.initiatorLine += conditionalLocution.elseIfStrings[i];
                                    conditionalStringAdded = true;
                                    break;
                                }
                            }
                        }

                        if (!conditionalStringAdded) {
                            newLod.initiatorLine += conditionalLocution.elseString;
                        }

                    }
                    else {
                        if (locution.getType() == "SFDBLabelLocution") {
                            locution.speaker = "i";
                        }
                        //console.debug(this, "realizeDialogue(): initiator locution: " + l);
                        newLod.initiatorLine += locution.renderText(initiator, responder, other, line);
                    }
                });
                //make the responder line

                line.responderLocutions.forEach(function(locution) {
                    toc1.speaker = "responder";
                    toc2.speaker = "responder";
                    toc3.speaker = "responder";

                    toc1.renderText(initiator, responder, other, line);
                    toc2.renderText(initiator, responder, other, line);
                    toc3.renderText(initiator, responder, other, line);
                    if (locution.getType() == "ToCLocution") {
                        tocLoc = locution;
                        if (tocLoc.tocID == 1) {
                            newLod.responderLine += toc1.realizedString;
                        }
                        else if (tocLoc.tocID == 2) {
                            newLod.responderLine += toc2.realizedString;
                        }
                        else if (tocLoc.tocID == 3) {
                            newLod.responderLine += toc3.realizedString;
                        }
                    }
                    else if (locution.getType() == "MixInLocution") {
                        responder.isSpeakerForMixInLocution = true;
                        newLod.responderLine += locution.renderText(initiator, responder, other, line);
                        responder.isSpeakerForMixInLocution = false;
                    }
                    else if (locution.getType() == "ConditionalLocuation") {
                        conditionalLocution = locution;
                        conditionalStringAdded = false;

                        if (conditionalLocution.ifRuleID < this.conditionalRules.length) {
                            if (this.conditionalRules[conditionalLocution.ifRuleID].evaluate(initiator, responder, other)) {
                                newLod.responderLine += conditionalLocution.ifRuleString;
                                conditionalStringAdded = true;
                            }
                        }

                        if (!conditionalStringAdded) {
                            for (i = 0; i < conditionalLocution.elseIfRuleIDs.length; i++ ) {
                                if (conditionalLocution.elseIfRuleIDs[i] > this.conditionalRules.length - 1) continue;
                                if (this.conditionalRules[conditionalLocution.elseIfRuleIDs[i]].evaluate(initiator, responder, other)) {
                                    newLod.responderLine += conditionalLocution.elseIfStrings[i];
                                    conditionalStringAdded = true;
                                    break;
                                }
                            }
                        }

                        if (!conditionalStringAdded) {
                            newLod.responderLine += conditionalLocution.elseString;
                        }

                    }
                    else {
                        if (locution.getType() == "SFDBLabelLocution") {
                            locution.speaker = "r";
                        }

                        //console.debug(this, "realizeDialogue(): initiator locution: " + l);
                        newLod.responderLine += locution.renderText(initiator, responder, other,line);
                    }
                });
                //make the other line
                line.otherLocutions.forEach(function(locution) {
                    toc1.speaker = "other";
                    toc2.speaker = "other";
                    toc3.speaker = "other";

                    toc1.renderText(initiator, responder, other, line);
                    toc2.renderText(initiator, responder, other, line);
                    toc3.renderText(initiator, responder, other, line);
                    if (locution.getType() == "ToCLocution") {
                        tocLoc = locution;
                        if (tocLoc.tocID == 1) {
                            newLod.otherLine += toc1.realizedString;
                        }
                        else if (tocLoc.tocID == 2) {
                            newLod.otherLine += toc2.realizedString;
                        }
                        else if (tocLoc.tocID == 3) {
                            newLod.otherLine += toc3.realizedString;
                        }
                    }
                    else if (locution.getType() == "MixInLocution") {
                        other.isSpeakerForMixInLocution = true;
                        newLod.otherLine += locution.renderText(initiator, responder, other, line);
                        other.isSpeakerForMixInLocution = false;
                    }
                    else if (locution.getType() == "ConditionalLocuation") {
                        conditionalLocution = locution;
                        conditionalStringAdded = false;

                        if (conditionalLocution.ifRuleID < this.conditionalRules.length) {
                            if (this.conditionalRules[conditionalLocution.ifRuleID].evaluate(initiator, responder, other)) {
                                newLod.otherLine += conditionalLocution.ifRuleString;
                                conditionalStringAdded = true;
                            }
                        }

                        if (!conditionalStringAdded) {
                            for (i = 0; i < conditionalLocution.elseIfRuleIDs.length; i++ ) {
                                if (conditionalLocution.elseIfRuleIDs[i] > this.conditionalRules.length - 1) continue;
                                if (this.conditionalRules[conditionalLocution.elseIfRuleIDs[i]].evaluate(initiator, responder, other)) {
                                    newLod.otherLine += conditionalLocution.elseIfStrings[i];
                                    conditionalStringAdded = true;
                                    break;
                                }
                            }
                        }

                        if (!conditionalStringAdded) {
                            newLod.otherLine += conditionalLocution.elseString;
                        }

                    }
                    else {
                        if (locution.getType() == "SFDBLabelLocution") {
                            locution.speaker = "o";
                        }

                        //console.debug(this, "realizeDialogue(): initiator locution: " + l);
                        newLod.otherLine += locution.renderText(initiator, responder, other, line);
                    }
                });
                newInst.lines.push(newLod);
            });

            return newInst;
        }


        this.requiresOtherToPerform = function() {
            this.lines.forEach(function(lod) {
                if (lod.otherApproach || lod.otherLine != "") {
                    return true;
                }
            });
            return false;
        }

        /**********************************************************************
         * Utility Functions
         *********************************************************************/

        this.toString = function() {
            var returnstr = "";
            for (var i = 0; i < this.lines.length; ++i) {
                returnstr += this.lines[i];
                if (i < this.lines.length - 1) {
                    //returnstr += "^";
                }
                returnstr += "\n";
            }
            return returnstr;
        }

        this.clone = function() {
            var i = new Instantiation();
            i.id = this.id;
            i.name = this.name;
            i.lines = this.lines.slice(0);

            if(this.conditionRules) {
                this.conditionRules.forEach(function(r) {
                    i.conditionalRules.push(r.clone());
                });
            }


            i.toc1.rawString = this.toc1.rawString;
            i.toc2.rawString = this.toc2.rawString;
            i.toc3.rawString = this.toc3.rawString;

            return i;
        }
    } //End of Instantiation

    Instantiation.equals = function(x, y) {
        if (x.id != y.id) return false;
        if (x.name != y.name) return false;
        if (x.lines.length != y.lines.length) return false;
        if (x.toc1.rawString != y.toc1.rawString) return false;
        if (x.toc2.rawString != y.toc2.rawString) return false;
        if (x.toc3.rawString != y.toc3.rawString) return false;

        for (var i = 0; i < x.conditionalRules.length; ++i) {
            if (!Rule.equals(x.conditionalRules[i], y.conditionalRules[i])) return false;
        }

        for (i = 0; i < x.lines.length; ++i) {
            if (!LineOfDialogue.equals(x.lines[i], y.lines[i])) return false;
        }
        return true;
    }

    return Instantiation;
});
