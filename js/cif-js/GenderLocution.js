define([], function() {
    var GenderLocution = function() {
        this.realizedString = "";
        this.rawString = "";
        this.who = "";

        this.maleString = "";
        this.femaleString = "";

        /* INTERFACE CiF.Locution */
        this.renderText = function(initiator, responder, other, line) {
            this.realizedString = "";

            if (who == "i")
    if (initiator.hasTrait(Trait.MALE)) this.realizedString = this.maleString
    else this.realizedString = this.femaleString;
            else if (who == "r")
    if (responder.hasTrait(Trait.MALE)) this.realizedString = this.maleString
    else this.realizedString = this.femaleString;
            else if (who == "o")
    if (other.hasTrait(Trait.MALE)) this.realizedString = this.maleString
    else this.realizedString = this.femaleString;

            return this.realizedString;
        }

        this.getType = function() {
            return "GenderLocution";
        }
    }

    return GenderLocution;
});
