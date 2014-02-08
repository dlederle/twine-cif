define([], function() {
    var ListLocution = function() {
        this.realizedString = "";
        this.rawString = "";

        this.type = "";
        this.who1 = "";
        this.who2 = "";

        this.subject = "";
        this.object = "";

        this.speaker = "";
        this.speakee = "";

        /* INTERFACE CiF.Locution */
        this.renderText = function(initiator, responder, other, line) {
            this.realizedString = "";
            var list1Name = "";
            var list2Name = "";
            if (this.who1 == "i")
            {
                list1Name = initiator.characterName;
            }
            else if (this.who1 == "r")
            {
                list1Name = responder.characterName;
            }
            else if (this.who1 == "o")
            {
                list1Name = other.characterName;
            }
            if (this.who2 == "i")
            {
                list2Name = initiator.characterName;
            }
            else if (this.who2 == "r")
            {
                list2Name = responder.characterName;
            }
            else if (this.who2 == "o")
            {
                list2Name = other.characterName;
            }
            if (this.type.toLowerCase() == "we/they")
            {
                this.realizedString = "they";
            }
            else if (this.type.toLowerCase() == "us/them")
            {
                this.realizedString = "them";
            }
            else if (this.type.toLowerCase() == "our/their")
            {
                this.realizedString = "their";
            }
            else if (this.type.toLowerCase() == "and")
            {
                this.realizedString = list1Name + " and " + list2Name;
            }
            else if (this.type.toLowerCase() == "andp")
            {
                this.realizedString = list1Name + " and " + list2Name + "'s";
            }
            return this.realizedString;
        }

        this.getType = function() {
            return "ListLocution";
        }
    }
    return ListLocution;
});
