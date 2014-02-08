define(['min-cif/Character', 'min-cif/Trait', 'min-cif/Status'], function(Character, Trait, Status) {
    /* INTERFACE CiF.Locution */
    var CategoryLocution = function() {
        this.realizedString;
        this.type;
        this.who;

        this.candidates = [];
        this.towardWho = "";

        /**
         * param {Character} initiator
         * param {Character} responder
         * param {Character} other
         * param {LineOfDialogue} line
         */
        this.renderText = function(initiator, responder, other, line) {
            realizedString = "";
            var char;
            if (this.who == "i") {
                char = initiator;
            }
            else if (this.who == "r") {
                char = responder;
            }
            else if (this.who == "o") {
                char = other;
            }
            //if a status it is directed, get the char it is directed to
            var towardChar;
            if (this.towardWho == "i") {
                towardChar = initiator;
            }
            else if (this.towardWho == "r") {
                towardChar = responder;
            }
            else if (this.towardWho == "o") {
                towardChar = other;
            }
            //make it the format of the toString
            if (type.substr(0, 5) != "cat: ") {
                this.type = "cat: " + this.type;
            }

            if (Trait.getNumberByName(type) != -1) {
                Trait.CATEGORIES[Trait.getNumberByName(type)].forEach(function(trait) {
                    if (char.hasTrait(trait)) {
                        candidates.push(trait);
                    }
                });
                //now return a random one from the candidates
                if (candidates.length > 0)
                {
                    return Trait.getNameByNumber(candidates[Util.randRange(0, candidates.length - 1)]);
                }
            }
            else if (Status.getStatusNumberByName(type) != -1) {
                Status.CATEGORIES[Status.getStatusNumberByName(type)].forEach(function(status) {
                    {
                        if (towardWho != "") {
                            if (char.hasStatus(status, towardChar)) {
                                candidates.push(status);
                            }
                        }
                        else {
                            if (char.hasStatus(status)) {
                                candidates.push(status);
                            }
                        }
                    }

                    //now return a random one from the candidates
                    if (candidates.length > 0) {
                        if (towardWho != "")
                {
                    return Status.getStatusNameByNumber(candidates[Util.randRange(0, candidates.length - 1)]) + " " + towardChar.characterName;
                }
                        else
                        {
                            return Status.getStatusNameByNumber(candidates[Util.randRange(0, candidates.length - 1)]);
                        }
                    }
                });

                //if we get here, we havewn't found any reason to have been in this category, which means it is an error
                //but let's just return the name of the category then sans "cat: "
                return type.replace("cat: ", "");
            }

            this.getType = function() {
                return "CategoryLocution";
            }
        }
    }
    return CategoryLocution;
});
