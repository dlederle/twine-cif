define([], function() {
    var PronounLocution = function() {
        this.realizedString = "";
        this.rawString = "";
        this.type = "";
        this.who = "";
        this.isSubject = false;
        this.subject = "";
        this.object = "";
        this.speaker = "";
        this.speakee = "";

        /* INTERFACE CiF.Locution */
        this.renderText = function(initiator, responder, other, line) {
            this.realizedString = "";
            if (this.type.toLowerCase() == "he/she")
    if (this.who == "i")
    if (initiator.hasTrait(Trait.MALE)) this.realizedString = "he"
    else this.realizedString = "she";
    else if (this.who == "r")
    if (responder.hasTrait(Trait.MALE)) this.realizedString = "he"
    else this.realizedString = "she";
    else if (this.who == "o")
        if (other.hasTrait(Trait.MALE)) this.realizedString = "he"
        else this.realizedString = "she";
    else if (this.type.toLowerCase() == "his/her")
    {
        if (this.who == "i")
            if (initiator.hasTrait(Trait.MALE)) this.realizedString = "his" 
            else this.realizedString = "her";
        else if (this.who == "r") 
            if (responder.hasTrait(Trait.MALE)) this.realizedString = "his" 
            else this.realizedString = "her";
        else if (this.who == "o") 
            if (other.hasTrait(Trait.MALE)) this.realizedString = "his" 
            else this.realizedString = "her";
    }
    else if (this.type.toLowerCase() == "his/hers")
    {
        if (this.who == "i") 
            if (initiator.hasTrait(Trait.MALE)) this.realizedString = "his" 
            else this.realizedString = "hers";
        else if (this.who == "r") 
            if (responder.hasTrait(Trait.MALE)) this.realizedString = "his" 
            else this.realizedString = "hers";
        else if (this.who == "o") 
            if (other.hasTrait(Trait.MALE)) this.realizedString = "his" 
            else this.realizedString = "hers";
    }
    else if (this.type.toLowerCase() == "him/her")
    {
        if (this.who == "i") 
            if (initiator.hasTrait(Trait.MALE)) this.realizedString = "him" 
            else this.realizedString = "her";
        else if (this.who == "r") 
            if (responder.hasTrait(Trait.MALE)) this.realizedString = "him" 
            else this.realizedString = "her";
        else if (this.who == "o") 
            if (other.hasTrait(Trait.MALE)) this.realizedString = "him" 
            else this.realizedString = "her";
    }
    else if (this.type.toLowerCase() == "he's/she's")
    {
        if (this.who == "i") 
            if (initiator.hasTrait(Trait.MALE)) this.realizedString = "he's" 
            else this.realizedString = "she's";
        else if (this.who == "r")
            if (responder.hasTrait(Trait.MALE)) this.realizedString = "he's" 
            else this.realizedString = "she's";
        else if (this.who == "o") 
            if (other.hasTrait(Trait.MALE)) this.realizedString = "he's" 
            else this.realizedString = "she's";				
    }
    else if (this.type.toLowerCase() == "was/were")
    {
        this.realizedString = "was";
    }
return this.realizedString;
        }
        this.getType = function() {
            return "PronounLocution";
        }
    }
    return PronounLocution;
});
