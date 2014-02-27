define(['SocialFactsDB', 'Rule', 'CiFSingleton', 'CKBLocution', 'SFDBLabelLocution', 'CharacterReferenceLocution', 'MixInLocution', 'ToCLocution', 'LiteralLocution'], function(SocialFactsDB, Rule, CiFSingleton, CKBLocution, SFDBLabelLocution, CharacterReferenceLocution, MixInLocution, ToCLocution, LiteralLocution) {
    var LineOfDialogue = function(opts) {
        opts = opts || {};
        /**
         * TODO: fill out header documentation
         * TODO: make toString make sense
         * TODO: SFDB locutions in createLocutionVectors().
         */
        //The number in sequence this line of dialog is in it's instantition.
        this.lineNumber = opts.lineNumber || -1;
        //The initiator's dialogue.
        this.initiatorLine = opts.initiatorLine || "";
        //The responders's dialogue.
        this.responderLine = opts.responderLine || "";
        //Other's dialogue.
        this.otherLine = opts.otherLine || "";
        /**
         *  Though multiple people might talk at the same time, (e.g. initiator: "I love you" responder="gasp!" simultaneously)
         *  it might be useful to keep track of the 'important' speaker at any given time stamp (in the example above, "I Love you"
         *  is a more important line to the narrative of the exchange than the gasp, for example)
         */
        this.primarySpeaker = opts.primarySpeaker || "";
        //Initiator's body animation.
        this.initiatorBodyAnimation = "";
        //initiator's face animation.
        this.initiatorFaceAnimation = "";
        this.initiatorFaceState = "";
        //Responders's body animation.
        this.responderBodyAnimation = "";
        //Initiator's face animation.
        this.responderFaceAnimation = "";
        this.responderFaceState = "";
        //Other's body animation.
        this.otherBodyAnimation = "";
        //Other's face animation.
        this.otherFaceAnimation = "";
        this.otherFaceState = "";
        //The performance time of the line of dialogue.
        this.time = opts.time || 0;
        /**
         * A flag to mark whether the initiator's line of dialog is spoken aloud
         * (isThought=false) or meant to be a thought bubble (isThought=true)
         */
        this.initiatorIsThought = opts.initiatorIsThought || false;
        /**
         * A flag to mark whether the responder's line of dialog is spoken aloud
         * (isThought=false) or meant to be a thought bubble (isThought=true)
         */
        this.responderIsThought = opts.responderIsThought || false;
        /**
         * A flag to mark whether the other's line of dialog is spoken aloud
         * (isThought=false) or meant to be a thought bubble (isThought=true)
         */
        this.otherIsThought = opts.otherIsThought || false;
        /**
         * A flag to mark whether any CKB references in the initiator's line of
         * dialogue should be referenced textually (isPicture=false) or
         * pictorally (isPicture=true)
         */
        this.initiatorIsPicture = opts.initiatorIsPicture || false;
        /**
         * A flag to mark whether any CKB references in the responder's line of
         * dialogue should be referenced textually (isPicture=false) or
         * pictorally (isPicture=true)
         */
        this.responderIsPicture = opts.responderIsPicture || false;
        /**
         * A flag to mark whether any CKB references in the other's line of
         * dialogue should be referenced textually (isPicture=false) or
         * pictorally (isPicture=true)
         */
        this.otherIsPicture = opts.otherIsPicture || false;
        this.initiatorIsDelayed = opts.initiatorIsDelayed || false;
        this.responderIsDelayed = false;
        this.otherIsDelayed = false;

        /**
         * A String to represent who the initiator is speaking to
         * (Likely values should be 'responder' or 'other'
         */
        this.initiatorAddressing = "";
        /**
         * A String to represent who the responder is speaking to
         * (Likely values should be 'initiator' or 'other'
         */
        this.responderAddressing = "";
        /**
         * A String to represent who the other is speaking to
         * (Likely values should be 'initiator' or 'responder'
         */
        this.otherAddressing = "";
        /**
         * A flag marking whether this other utterance
         * is indeed spoken by the other (otherIsChorus=false)
         * or is instead spoken by a Greek Chorus of the rest
         * of the student body (otherIsChorus=true)
         */
        this.isOtherChorus = false;

        //Variables used for staging in Prom Week
        this.otherApproach = false;
        this.otherExit = false;

        //Locution Vector for the initiator.
        this.initiatorLocutions = [];
        //Locution Vector for the responder.
        this.responderLocutions = [];
        //Locution Vector for other.
        this.otherLocutions = [];
        /**
         * The rule that stores the Predicates that represent the partial state
         * change associated with this line of dialog. These are not to be
         * evaluated are are present for authoring and display purposes only.
         */
        this.partialChange = new Rule();

        this.chorusRule = new Rule();

        /**
         * Parses the String representations of the role-specific lines of
         * dialogue and creates a synonmous Vector of classes that implement
         * the Locution interface. Explicitly, the three role dialogue strings
         * are parsed with respect to their literal string and tag components
         * and placed into Locutions that make performance realization a bit
         * easier.
         */
        this.createLocutionVectors = function() {
            var parsedLine;
            var tagRegEx = /%/;
            var piece;
            var responderRefReferenceLocution;
            var responderPossessiveRefReferenceLocution;
            var initiatorRefReferenceLocution;
            var initiatorPossessiveRefReferenceLocution;
            var mixInLocution;
            var ckbRef = new CKBLocution();
            var parsedCKB;
            var ckbRegEx = /(\([^)(]+\))+/g; // split by commas
            var ckbPiece;
            var i; // my loop iterator!
            var pred = "";
            var currentTruthLabel;
            var parsedLabel;
            var labelRegEx = /,/;
            var player;
            var tempInt;
            var mySFDBLocution = new SFDBLabelLocution();
            var template = "";
            var labelType = "";
            var window = -999;
            var openParenIndex ;
            var tupleArray;
            var tupleRegEx = /,/; // split by comma
            var parsedUndirectedTag;
            var undirectedTagRegEx = /,/;
            var currentTuple;
            var myLiteralLocution;
            var tocLocution;

            //initiator dialogue
            parsedLine = this.initiatorLine.split(tagRegEx);
            parsedLine.forEach(function(piece) {
                //console.debug(this, "createLocutionVectors(): " + piece);
                if (piece == "r") {
                    responderRef= new CharacterReferenceLocution();
                    responderRef.type = "R";
                    this.initiatorLocutions.push(responderRef);
                }
                else if (piece == "rp") {
                    responderPossessiveRef = new CharacterReferenceLocution();
                    responderPossessiveRef.type = "RP";
                    this.initiatorLocutions.push(responderPossessiveRef);
                }
                else if (piece == "i") {
                    initiatorRef= new CharacterReferenceLocution();
                    initiatorRef.type = "I";
                    this.initiatorLocutions.push(initiatorRef);
                }
                else if (piece == "ip") {
                    initiatorPossessiveRef = new CharacterReferenceLocution();
                    initiatorPossessiveRef.type = "IP";
                    this.initiatorLocutions.push(initiatorPossessiveRef);
                }
                else if (piece == "greeting" || piece == "shocked") {
                    mixInLocution = new MixInLocution();
                    mixInLocution.mixInType = piece;
                    this.initiatorLocutions.push(mixInLocution);
                }
                else if (piece == "toc1") {
                    tocLocution = new ToCLocution();
                    tocLocution.tocID = 1;
                    tocLocution.realizedString = "";
                    this.initiatorLocutions.push(tocLocution);
                }
                else if (piece.substr(0, 3) == "CKB") {
                    // INPUT: CKB_((i,likes),(r,dislikes),(LAME))
                    ckbRef = new CKBLocution();

                    ckbPiece = "";
                    i = 0; // my loop iterator!
                    parsedCKB = piece.match(ckbRegEx);
                    //console.debug(this, "Parsed Thing using Big B's regex: " + parsedCKB);

                    for (i = 0; i < parsedCKB.length; i++) {
                        //every item in here will be one of two things:
                        //1.)  A TUPLE of the form "i, subjective" or "r, subjective"
                        //2.)  A SINGLE of the form lame, or romantic.
                        if (parsedCKB[i].charAt(2) == ",") { // we are dealing with a tuple.
                            tupleArray = [];
                            currentTuple = parsedCKB[i];
                            currentTuple = currentTuple.substr(1, currentTuple.length - 2);
                            tupleArray = currentTuple.split(tupleRegEx);

                            //OK!!! So, at this point,tupleArray[0] is initiator or responder, and tupleArray[1]
                            // is like or dislike!  We ALSO know where we are in the array as a whole via 'i', so
                            //we can use that to determine if we are dealing with 'primary' or 'secondary' or what
                            //have you.


                            pred = "";
                            switch(tupleArray[0]) {
                                case "i" : pred = "initiator"; break;
                                case "r" : pred = "responder"; break;
                                case "o" : pred = "other"; break;
                            }
                            if (i == 0) {
                                ckbRef.pred.primary = pred;
                                ckbRef.pred.firstSubjectiveLink = tupleArray[1];
                            }
                            if (i == 1) {
                                ckbRef.pred.secondary = pred;
                                ckbRef.pred.secondSubjectiveLink = tupleArray[1];
                            }

                        }
                        //Here we are dealing with the zeitgeist Truth label.
                        else {
                            currentTruthLabel = parsedCKB[i];
                            currentTruthLabel = currentTruthLabel.substr(1, currentTruthLabel.length - 2);
                            ckbRef.pred.truthLabel = currentTruthLabel;
                        }
                    }
                    this.initiatorLocutions.push(ckbRef); //OK! We have finally successfully filled this in!
                    //console.debug(this, "createLocutionVectors(): contents of initiator vector pushed ckbref:" + this.initiatorLocutions.toString());
                    //console.debug(this, "sanity check: " + this.initiatorLocutions[0]);
                }
                else if (piece.substr(0, 5) == "SFDB_"){ // And here we are working with an SFDB Locution!
                    mySFDBLocution = new SFDBLabelLocution();
                    template = piece.substr(5, piece.length - 5);
                    labelType = "";
                    window = -999; // window is optional -- it may not be included in what we initially read in.
                    //console.debug(this, template);

                    //Look at the next part of the piece, up until the '('
                    //symbol, to discover what type of SFDB label we are going
                    //to be working with!

                    openParenIndex = template.indexOf("(");
                    labelType = template.substr(0, openParenIndex);
                    //console.debug(this, "SFDB label type: " + labelType);
                    template = template.substr(openParenIndex + 1, template.length - openParenIndex - 2);
                    //console.debug(this, "After label type: " + template);

                    //At this point, labelType should be the 'english'
                    //representation of an SFDB label, e.g. "cool" or "negative"
                    //and template should be a comma seperated list of the
                    //people involved in the SFDB entry, e.g. "first,second"
                    //POTENTIALLY followed by an 'int' representing the window.
                    if (SocialFactsDB.getLabelByName(labelType) < SocialFactsDB.FIRST_DIRECTED_LABEL) {
                        //WE ARE DEALING WITH UNDIRECTED LABELS -- ONE parameter, and MAYBE a window
                        //console.debug(this, "Value of label: " + labelType);
                        //console.debug(this, "Value of template: " + template);
                        if (template.indexOf(",") != -1) {
                            parsedUndirectedTag = [];


                            parsedUndirectedTag = template.split(undirectedTagRegEx);

                            //I believe at this point, it is safe to assume that
                            //parsedLabel[0] = i or r or o And that parsedLabel[1]
                            //should be a string representation of the window.

                            template = parsedUndirectedTag[0];
                            window = parseInt(parsedUndirectedTag[1]);
                            console.debug(this, "Value of window: " + window);

                        }
                        mySFDBLocution.pred.sfdbLabel = SocialFactsDB.getLabelByName(labelType);
                        mySFDBLocution.pred.window = window;
                        mySFDBLocution.pred.primary = template;
                    }
                    else {
                        //WE ARE DEALING WITH DIRECTED LABELS -- TWO parameters and MAYBE a window.
                        //console.debug(this, "Value of label: " + labelType);
                        //console.debug(this, "Value of template: " + template);

                        mySFDBLocution.pred.sfdbLabel = SocialFactsDB.getLabelByName(labelType);

                        parsedLabel = [];
                        player="";
                        tempInt = 0;

                        parsedLabel = template.split(labelRegEx);

                        for (i = 0; i < parsedLabel.length; i++) {
                            player = parsedLabel[i];
                            //console.debug(this, "i: " + i + " player is: " +  player);
                            tempInt = parseInt(player);
                            //console.debug(this, "here is the value of tempInt: " + tempInt);
                            if (tempInt != 0) { // It is a number, referring to the window size!
                                mySFDBLocution.pred.window = tempInt;
                                //console.debug(this, "Set the window size to be: " + tempInt);
                            }
                            else {
                                switch(player) {
                                    case "i" : player = "initiator"; break;
                                    case "r" : player = "responder"; break;
                                    case "o" : player = "other"; break;
                                    default : player = "UNKNOWN PLAYER!"; break;
                                }
                                if (i == 0) {
                                    mySFDBLocution.pred.primary = player;
                                    //console.debug(this, "Set the primary person to be " + player);
                                }
                                if (i == 1) {
                                    mySFDBLocution.pred.secondary = player;
                                    //console.debug(this, "Set the secondary person to be: " + player);
                                }
                            }
                        }
                    }

                    this.initiatorLocutions.push(mySFDBLocution);
                }
                else { // the catch all is just a literal! We can push it in!
                    myLiteralLocution = new LiteralLocution();
                    myLiteralLocution.content = piece;
                    this.initiatorLocutions.push(myLiteralLocution);
                }
            });
            //console.debug(this, "createLocutionVectors(): initiatorLine:" + this.initiatorLine);
            //responder dialogue
            parsedLine = this.responderLine.split(tagRegEx);
            parsedLine.forEach(function(piece) {
                //console.debug(this, "createLocutionVectors(): " + piece);
                if (piece == "r") {
                    responderRef= new CharacterReferenceLocution();
                    responderRef.type = "R";
                    this.responderLocutions.push(responderRef);
                }
                else if (piece == "rp") {
                    responderPossessiveRef = new CharacterReferenceLocution();
                    responderPossessiveRef.type = "RP";
                    this.responderLocutions.push(responderPossessiveRef);
                }
                else if (piece == "i") {
                    initiatorRef= new CharacterReferenceLocution();
                    initiatorRef.type = "I";
                    this.responderLocutions.push(initiatorRef);
                }
                else if (piece == "ip") {
                    initiatorPossessiveRef = new CharacterReferenceLocution();
                    initiatorPossessiveRef.type = "IP";
                    this.responderLocutions.push(initiatorPossessiveRef);
                }
                else if (piece == "greeting" || piece == "shocked") {
                    mixInLocution = new MixInLocution();
                    mixInLocution.mixInType = piece;
                    this.responderLocutions.push(mixInLocution);
                }
                else if (piece.substr(0, 3) == "CKB") {
                    // INPUT: CKB_((i,likes),(r,dislikes),(LAME))
                    ckbRef = new CKBLocution();
                    ckbPiece = "";
                    i = 0; // my loop iterator!
                    parsedCKB = piece.match(ckbRegEx);
                    //console.debug(this, "Parsed Thing using Big B's regex: " + parsedCKB);

                    for (i = 0; i < parsedCKB.length; i++) {
                        //every item in here will be one of two things:
                        //1.)  A TUPLE of the form "i, subjective" or "r, subjective"
                        //2.)  A SINGLE of the form lame, or romantic.
                        if (parsedCKB[i].charAt(2) == ",") { // we are dealing with a tuple.
                            tupleArray = [];
                            currentTuple = parsedCKB[i];
                            currentTuple = currentTuple.substr(1, currentTuple.length - 2);
                            tupleArray = currentTuple.split(tupleRegEx);

                            //OK!!! So, at this point,tupleArray[0] is initiator or responder, and tupleArray[1]
                            // is like or dislike!  We ALSO know where we are in the array as a whole via 'i', so
                            //we can use that to determine if we are dealing with 'primary' or 'secondary' or what
                            //have you.


                            pred = "";
                            switch(tupleArray[0]) {
                                case "i" : pred = "initiator"; break;
                                case "r" : pred = "responder"; break;
                                case "o" : pred = "other"; break;
                            }
                            if (i == 0) {
                                ckbRef.pred.primary = pred;
                                ckbRef.pred.firstSubjectiveLink = tupleArray[1];
                            }
                            if (i == 1) {
                                ckbRef.pred.secondary = pred;
                                ckbRef.pred.secondSubjectiveLink = tupleArray[1];
                            }

                        }
                        //Here we are dealing with the zeitgeist Truth label.
                        else {
                            currentTruthLabel = parsedCKB[i];
                            currentTruthLabel = currentTruthLabel.substr(1, currentTruthLabel.length - 2);
                            ckbRef.pred.truthLabel = currentTruthLabel;
                        }
                    }
                    this.responderLocutions.push(ckbRef); //OK! We have finally successfully filled this in!
                    //console.debug(this, "createLocutionVectors(): contents of initiator vector pushed ckbref:" + this.responderLocutions.toString());
                    //console.debug(this, "sanity check: " + this.responderLocutions[0]);
                }
                else if (piece.substr(0, 5) == "SFDB_") { // And here we are working with an SFDB Locution!
                    mySFDBLocution = new SFDBLabelLocution();
                    template = piece.substr(5, piece.length - 5);
                    labelType = "";
                    window = -999; // window is optional -- it may not be included in what we initially read in.
                    //console.debug(this, template);

                    //Look at the next part of the piece, up until the '('
                    //symbol, to discover what type of SFDB label we are going
                    //to be working with!

                    openParenIndex = template.indexOf("(");
                    labelType = template.substr(0, openParenIndex);
                    //console.debug(this, "SFDB label type: " + labelType);
                    template = template.substr(openParenIndex + 1, template.length - openParenIndex - 2);
                    //console.debug(this, "After label type: " + template);

                    //At this point, labelType should be the 'english'
                    //representation of an SFDB label, e.g. "cool" or "negative"
                    //and template should be a comma seperated list of the
                    //people involved in the SFDB entry, e.g. "first,second"
                    //POTENTIALLY followed by an 'int' representing the window.
                    if (SocialFactsDB.getLabelByName(labelType) < SocialFactsDB.FIRST_DIRECTED_LABEL) {
                        //WE ARE DEALING WITH UNDIRECTED LABELS -- ONE parameter, and MAYBE a window
                        //console.debug(this, "Value of label: " + labelType);
                        //console.debug(this, "Value of template: " + template);
                        if (template.indexOf(",") != -1) {
                            parsedUndirectedTag = [];


                            parsedUndirectedTag = template.split(undirectedTagRegEx);

                            //I believe at this point, it is safe to assume that
                            //parsedLabel[0] = i or r or o And that parsedLabel[1]
                            //should be a string representation of the window.

                            template = parsedUndirectedTag[0];
                            window = parseInt(parsedUndirectedTag[1]);
                            //console.debug(this, "Value of window: " + window);

                        }
                        mySFDBLocution.pred.sfdbLabel = SocialFactsDB.getLabelByName(labelType);
                        mySFDBLocution.pred.window = window;
                        mySFDBLocution.pred.primary = template;
                    }
                    else {
                        //WE ARE DEALING WITH DIRECTED LABELS -- TWO parameters and MAYBE a window.
                        console.debug(this, "Value of label: " + labelType);
                        console.debug(this, "Value of template: " + template);

                        mySFDBLocution.pred.sfdbLabel = SocialFactsDB.getLabelByName(labelType);

                        parsedLabel = [];
                        player="";
                        tempInt = 0;

                        parsedLabel = template.split(labelRegEx);

                        for (i = 0; i < parsedLabel.length; i++) {
                            player = parsedLabel[i];
                            console.debug(this, "i: " + i + " player is: " +  player);
                            tempInt = parseInt(player);
                            //console.debug(this, "here is the value of tempInt: " + tempInt);
                            if (tempInt != 0) { // It is a number, referring to the window size!
                                mySFDBLocution.pred.window = tempInt;
                                console.debug(this, "Set the window size to be: " + tempInt);
                            }
                            else {
                                switch(player) {
                                    case "i" : player = "initiator"; break;
                                    case "r" : player = "responder"; break;
                                    case "o" : player = "other"; break;
                                    default : player = "UNKNOWN PLAYER!"; break;
                                }
                                if (i == 0) {
                                    mySFDBLocution.pred.primary = player;
                                    console.debug(this, "Set the primary person to be " + player);
                                }
                                if (i == 1) {
                                    mySFDBLocution.pred.secondary = player;
                                    console.debug(this, "Set the secondary person to be: " + player);
                                }
                            }
                        }
                    }

                    this.responderLocutions.push(mySFDBLocution);
                }
                else { // the catch all is just a literal! We can push it in!
                    myLiteralLocution = new LiteralLocution();
                    myLiteralLocution.content = piece;
                    this.responderLocutions.push(myLiteralLocution);
                }
            });
            //other dialogue
            parsedLine = this.otherLine.split(tagRegEx);
            parsedLine.forEach(function(piece) {
                //console.debug(this, "createLocutionVectors(): " + piece);
                if (piece == "r") {
                    responderRef= new CharacterReferenceLocution();
                    responderRef.type = "R";
                    this.otherLocutions.push(responderRef);
                }
                else if (piece == "rp") {
                    responderPossessiveRef = new CharacterReferenceLocution();
                    responderPossessiveRef.type = "RP";
                    this.otherLocutions.push(responderPossessiveRef);
                }
                else if (piece == "i") {
                    initiatorRef= new CharacterReferenceLocution();
                    initiatorRef.type = "I";
                    this.otherLocutions.push(initiatorRef);
                }
                else if (piece == "ip") {
                    initiatorPossessiveRef = new CharacterReferenceLocution();
                    initiatorPossessiveRef.type = "IP";
                    this.otherLocutions.push(initiatorPossessiveRef);
                }
                else if (piece == "greeting" || piece == "shocked") {
                    mixInLocution = new MixInLocution();
                    mixInLocution.mixInType = piece;
                    this.otherLocutions.push(mixInLocution);
                }
                else if (piece.substr(0, 3) == "CKB") {
                    // INPUT: CKB_((i,likes),(r,dislikes),(LAME))
                    ckbRef = new CKBLocution();

                    ckbPiece = "";
                    i = 0; // my loop iterator!
                    parsedCKB = piece.match(ckbRegEx);
                    //console.debug(this, "Parsed Thing using Big B's regex: " + parsedCKB);

                    for (i = 0; i < parsedCKB.length; i++) {
                        //every item in here will be one of two things:
                        //1.)  A TUPLE of the form "i, subjective" or "r, subjective"
                        //2.)  A SINGLE of the form lame, or romantic.
                        if (parsedCKB[i].charAt(2) == ",") { // we are dealing with a tuple.
                            tupleArray = [];
                            currentTuple = parsedCKB[i];
                            currentTuple = currentTuple.substr(1, currentTuple.length - 2);
                            tupleArray = currentTuple.split(tupleRegEx);

                            //OK!!! So, at this point,tupleArray[0] is initiator or responder, and tupleArray[1]
                            // is like or dislike!  We ALSO know where we are in the array as a whole via 'i', so
                            //we can use that to determine if we are dealing with 'primary' or 'secondary' or what
                            //have you.


                            pred = "";
                            switch(tupleArray[0]) {
                                case "i" : pred = "initiator"; break;
                                case "r" : pred = "responder"; break;
                                case "o" : pred = "other"; break;
                            }
                            if (i == 0) {
                                ckbRef.pred.primary = pred;
                                ckbRef.pred.firstSubjectiveLink = tupleArray[1];
                            }
                            if (i == 1) {
                                ckbRef.pred.secondary = pred;
                                ckbRef.pred.secondSubjectiveLink = tupleArray[1];
                            }

                        }
                        //Here we are dealing with the zeitgeist Truth label.
                        else {
                            currentTruthLabel = parsedCKB[i];
                            currentTruthLabel = currentTruthLabel.substr(1, currentTruthLabel.length - 2);
                            ckbRef.pred.truthLabel = currentTruthLabel;
                        }
                    }
                    this.otherLocutions.push(ckbRef); //OK! We have finally successfully filled this in!
                    //console.debug(this, "createLocutionVectors(): contents of initiator vector pushed ckbref:" + this.otherLocutions.toString());
                    //console.debug(this, "sanity check: " + this.otherLocutions[0]);
                }
                else if (piece.substr(0, 5) == "SFDB_"){ // And here we are working with an SFDB Locution!
                    mySFDBLocution = new SFDBLabelLocution();
                    template = piece.substr(5, piece.length - 5);
                    labelType = "";
                    window = -999; // window is optional -- it may not be included in what we initially read in.
                    //console.debug(this, template);

                    //Look at the next part of the piece, up until the '('
                    //symbol, to discover what type of SFDB label we are going
                    //to be working with!

                    openParenIndex = template.indexOf("(");
                    labelType = template.substr(0, openParenIndex);
                    //console.debug(this, "SFDB label type: " + labelType);
                    template = template.substr(openParenIndex + 1, template.length - openParenIndex - 2);
                    //console.debug(this, "After label type: " + template);

                    //At this point, labelType should be the 'english'
                    //representation of an SFDB label, e.g. "cool" or "negative"
                    //and template should be a comma seperated list of the
                    //people involved in the SFDB entry, e.g. "first,second"
                    //POTENTIALLY followed by an 'int' representing the window.
                    if (SocialFactsDB.getLabelByName(labelType) < SocialFactsDB.FIRST_DIRECTED_LABEL) {
                        //WE ARE DEALING WITH UNDIRECTED LABELS -- ONE parameter, and MAYBE a window
                        //console.debug(this, "Value of label: " + labelType);
                        //console.debug(this, "Value of template: " + template);
                        if (template.indexOf(",") != -1) {
                            parsedUndirectedTag = [];


                            parsedUndirectedTag = template.split(undirectedTagRegEx);

                            //I believe at this point, it is safe to assume that
                            //parsedLabel[0] = i or r or o And that parsedLabel[1]
                            //should be a string representation of the window.

                            template = parsedUndirectedTag[0];
                            window = parseInt(parsedUndirectedTag[1]);
                            console.debug(this, "Value of window: " + window);

                        }
                        mySFDBLocution.pred.sfdbLabel = SocialFactsDB.getLabelByName(labelType);
                        mySFDBLocution.pred.window = window;
                        mySFDBLocution.pred.primary = template;
                    }
                    else {
                        //WE ARE DEALING WITH DIRECTED LABELS -- TWO parameters and MAYBE a window.
                        //console.debug(this, "Value of label: " + labelType);
                        //console.debug(this, "Value of template: " + template);

                        mySFDBLocution.pred.sfdbLabel = SocialFactsDB.getLabelByName(labelType);

                        parsedLabel = [];
                        player="";
                        tempInt = 0;

                        parsedLabel = template.split(labelRegEx);

                        for (i = 0; i < parsedLabel.length; i++) {
                            player = parsedLabel[i];
                            console.debug(this, "i: " + i + " player is: " +  player);
                            tempInt = parseInt(player);
                            //console.debug(this, "here is the value of tempInt: " + tempInt);
                            if (tempInt != 0) { // It is a number, referring to the window size!
                                mySFDBLocution.pred.window = tempInt;
                                console.debug(this, "Set the window size to be: " + tempInt);
                            }
                            else {
                                switch(player) {
                                    case "i" : player = "initiator"; break;
                                    case "r" : player = "responder"; break;
                                    case "o" : player = "other"; break;
                                    default : player = "UNKNOWN PLAYER!"; break;
                                }
                                if (i == 0) {
                                    mySFDBLocution.pred.primary = player;
                                    console.debug(this, "Set the primary person to be " + player);
                                }
                                if (i == 1) {
                                    mySFDBLocution.pred.secondary = player;
                                    console.debug(this, "Set the secondary person to be: " + player);
                                }
                            }
                        }
                    }

                    this.otherLocutions.push(mySFDBLocution);
                }
                else { // the catch all is just a literal! We can push it in!
                    myLiteralLocution = new LiteralLocution();
                    myLiteralLocution.content = piece;
                    this.otherLocutions.push(myLiteralLocution);
                }
            });
        }

        /**
         * Realizes the dialogue with reference to the players of the roles in
         * the current social game.
         * @param	initiator	The initator of the social game.
         * @param	responder	The responder of the social game.
         * @param	other		A third party in the social game.
         * @return	The line of dialogue to present to the player in their
         * proper role locations.
         */
        this.realizeDialogue = function(initiator, responder, other) {
            var lod = this.clone();
            var l;

            lod.initiatorLine = "";
            lod.responderLine = "";
            lod.otherLine= "";
            //console.debug(this, "realizeDialogue(): initiator locutions length: " + this.initiatorLocutions.length);
            this.initiatorLocutions.forEach(function(l) {
                if (l.getType() == "MixInLocution") {
                    initiator.isSpeakerForMixInLocution = true;
                    lod.initiatorLine += l.renderText(initiator, responder, other, lod);
                    initiator.isSpeakerForMixInLocution = false;
                }
                else {
                    //console.debug(this, "realizeDialogue(): initiator locution: " + l);
                    lod.initiatorLine += l.renderText(initiator, responder, other, lod) + " ";
                }
            });
            this.responderLocutions.forEach(function(l) {
                if (l.getType() == "MixInLocution") {
                    responder.isSpeakerForMixInLocution = true;
                    lod.responderLine += l.renderText(undefined, responder, undefined, lod);
                    responder.isSpeakerForMixInLocution = false;
                }
                else {
                    lod.responderLine += l.renderText(initiator, responder, other, lod) + " ";
                }
            });
            this.otherLocutions.forEach(function(l) {
                if (l.getType() == "MixInLocution") {
                    other.isSpeakerForMixInLocution = true;
                    lod.otherLine += l.renderText(initiator, responder, other, lod);
                    other.isSpeakerForMixInLocution = false;
                }
                else {
                    lod.otherLine += l.renderText(initiator, responder, other, lod) + " ";
                }
            });
            return lod;
        }

        /**********************************************************************
         * Utility Functions
         *********************************************************************/
        this.toString = function() {
            var returnstr = "";

            //only print out a single line at a time... and make it the line of the primary speaker.
            if (this.primarySpeaker == "initiator") {
                returnstr += (lineNumber + "\ninitiator:" + initiatorLine + "\n" + initiatorBodyAnimation + "\n" + initiatorFaceAnimation + "\n" + initiatorFaceState + "\n" + responderBodyAnimation + "\n" + responderFaceAnimation + "\n" + responderFaceState + "\n" + otherBodyAnimation + "\n" + otherFaceAnimation + "\n" + otherFaceState + "\n" + time + "\n" + initiatorIsThought + "\n" + initiatorIsDelayed + "\n" + initiatorIsPicture + "\n" + initiatorAddressing + "\n" + isOtherChorus);
            }
            else if (this.primarySpeaker == "responder") {
                returnstr += (lineNumber + "\nresponder:" + responderLine + "\n" + initiatorBodyAnimation + "\n" + initiatorFaceAnimation + "\n" + initiatorFaceState + "\n" + responderBodyAnimation + "\n" + responderFaceAnimation + "\n" + responderFaceState + "\n" + otherBodyAnimation + "\n" + otherFaceAnimation + "\n" + otherFaceState + "\n" + time + "\n" + responderIsThought + "\n" + responderIsDelayed + "\n" + responderIsPicture + "\n" + responderAddressing + "\n" + isOtherChorus);
            }
            else if (this.primarySpeaker == "other") {
                returnstr += (lineNumber + "\nother:" + otherLine + "\n" + initiatorBodyAnimation + "\n" + initiatorFaceAnimation + "\n" + initiatorFaceState + "\n" + responderBodyAnimation + "\n" + responderFaceAnimation + "\n" + responderFaceState + "\n" + otherBodyAnimation + "\n" + otherFaceAnimation + "\n" + otherFaceState + "\n" + time + "\n" + otherIsThought + "\n" + otherIsDelayed + "\n" + otherIsPicture+ "\n" + otherAddressing + "\n" + isOtherChorus + "\n" + otherApproach + "\n" + otherExit);
            }
            else {
                console.debug(this, "toString() -- not sure who is the primary speaker");
            }
            return returnstr;
        }

        this.clone = function() {
            var l = new LineOfDialogue();
            l.lineNumber = this.lineNumber;
            l.initiatorLine = this.initiatorLine;
            l.responderLine = this.responderLine;
            l.otherLine = this.otherLine;
            l.primarySpeaker = this.primarySpeaker;
            l.initiatorBodyAnimation = this.initiatorBodyAnimation;
            l.initiatorFaceAnimation = this.initiatorFaceAnimation;
            l.initiatorFaceState = this.initiatorFaceState;
            l.responderBodyAnimation = this.responderBodyAnimation;
            l.responderFaceAnimation = this.responderFaceAnimation;
            l.responderFaceState = this.responderFaceState;
            l.otherBodyAnimation = this.otherBodyAnimation;
            l.otherFaceAnimation = this.otherFaceAnimation;
            l.otherFaceState = this.otherFaceState;
            l.time = this.time;
            l.partialChange = this.partialChange.clone();
            l.initiatorIsThought = this.initiatorIsThought;
            l.responderIsThought = this.responderIsThought;
            l.otherIsThought = this.otherIsThought;
            l.initiatorIsDelayed = this.initiatorIsDelayed;
            l.responderIsDelayed = this.responderIsDelayed;
            l.otherIsDelayed = this.otherIsDelayed;
            l.initiatorIsPicture = this.initiatorIsPicture;
            l.responderIsPicture = this.responderIsPicture;
            l.otherIsPicture = this.otherIsPicture;
            l.initiatorAddressing = this.initiatorAddressing;
            l.responderAddressing = this.responderAddressing;
            l.otherAddressing = this.otherAddressing;
            l.isOtherChorus = this.isOtherChorus;
            l.otherApproach = this.otherApproach;
            l.otherExit= this.otherExit;

            l.initiatorLocutions = this.initiatorLocutions.concat();
            l.responderLocutions = this.responderLocutions.concat();
            l.otherLocutions = this.otherLocutions.concat();

            l.chorusRule = this.chorusRule.clone();

            return l;
        }

    } //End of LineOfDialogue

    LineOfDialogue.equals = function(x, y) {
        if (x.lineNumber != y.lineNumber) return false;
        if (x.initiatorLine != y.initiatorLine) return false;
        if (x.responderLine != y.responderLine) return false;
        if (x.otherLine != y.otherLine) return false;
        if (x.primarySpeaker != y.primarySpeaker) return false;
        if (x.initiatorBodyAnimation != y.initiatorBodyAnimation) return false;
        if (x.initiatorFaceAnimation != y.initiatorFaceAnimation) return false;
        if (x.initiatorFaceState != y.initiatorFaceState) return false;
        if (x.responderBodyAnimation != y.responderBodyAnimation) return false;
        if (x.responderFaceAnimation != y.responderFaceAnimation) return false;
        if (x.responderFaceState != y.responderFaceState) return false;
        if (x.otherBodyAnimation != y.otherBodyAnimation) return false;
        if (x.otherFaceAnimation != y.otherFaceAnimation) return false;
        if (x.otherFaceState != y.otherFaceState) return false;
        if (x.time != y.time) return false;
        if (x.initiatorIsThought != y.initiatorIsThought) return false;
        if (x.responderIsThought != y.responderIsThought) return false;
        if (x.otherIsThought != y.otherIsThought) return false;

        if (x.initiatorIsDelayed != y.initiatorIsDelayed) return false;
        if (x.responderIsDelayed != y.responderIsDelayed) return false;
        if (x.otherIsDelayed != y.otherIsDelayed) return false;

        if (x.initiatorIsPicture != y.initiatorIsPicture) return false;
        if (x.responderIsPicture != y.responderIsPicture) return false;
        if (x.otherIsPicture != y.otherIsPicture) return false;
        if (x.initiatorAddressing != y.initiatorAddressing) return false;
        if (x.responderAddressing != y.responderAddressing) return false;
        if (x.otherAddressing != y.otherAddressing) return false;
        if (x.isOtherChorus != y.isOtherChorus) return false;
        if (x.otherApproach!= y.otherApproach) return false;
        if (x.otherExit != y.otherExit) return false;
        if (!Rule.equals(x.chorusRule, y.chorusRule)) return false;
        return true;
    }

    /**
     * This function will capitalize character names, and the first letts of sentences
     * @return
     */
    LineOfDialogue.preprocessLine = function(theLine) {
        var arrayOfWords = theLine.split(" ");
        var withRightNames = "";
        var str;
        for (var i = 0; i < arrayOfWords.length; i++ ) {
            str = arrayOfWords[i];
            var isCharNameType = LineOfDialogue.isCharName(str);
            if (isCharNameType == "first")
            {
                withRightNames += toInitialCap(str);
            }
            else if (isCharNameType == "second")
            {
                withRightNames += str.charAt(0) + str.charAt(1).toUpperCase() + str.substr(2);
            }
            else if (str == "i") {
                withRightNames += "I";
            }
            else
            {
                withRightNames += str;
            }
            if (i != arrayOfWords.length - 1)
            {
                withRightNames += " ";
            }
        }

        return capFirstAfterPunctuationAndSpace(withRightNames);
    }

    LineOfDialogue.isCharName = function(str) {
        CiFSingleton.getInstance().cast.characters.forEach(function(char) {
            if (str == char.characterName.toLowerCase()) {
                return "first";
            }
            else if (str == (char.characterName.toLowerCase() + "'s")) {
                return "first";
            }
            else if (str == "(" + (char.characterName.toLowerCase())) {
                return "second";
            }
            else if (str == (char.characterName.toLowerCase() + ")")) {
                return "first";
            }
            else if (str == (char.characterName.toLowerCase() + ",")) {
                return "first";
            }
            else if (str == (char.characterName.toLowerCase() + ".")) {
                return "first";
            }
        });
        return "";
    }
    LineOfDialogue.capFirstAfterPunctuationAndSpace = function(original) {
        var words = original.split( ". " );
        for (var i = 0; i < words.length; i++) {
            words[i] = toInitialCap(words[i]);
        }
        original = words.join(". ");

        words = original.split( "! " );
        for (i = 0; i < words.length; i++) {
            words[i] = toInitialCap(words[i]);
        }
        original = words.join("! ");

        words = original.split( "? " );
        for (i = 0; i < words.length; i++) {
            words[i] = toInitialCap(words[i]);
        }
        original = words.join("? ");
        return toInitialCap(original);
    }

    LineOfDialogue.toInitialCap = function(original) {
        return original.charAt(0).toUpperCase() + original.substr(1);
    }

    LineOfDialogue.toInitialLower = function(original) {
        return original.charAt(0).toLowerCase() + original.substr(1);
    }


    return LineOfDialogue;
});
