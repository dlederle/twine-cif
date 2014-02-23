define(['./Util'], function(Util) {
    var RandomLocution = function() {
        this.realizedString = "";

        this.candidateStrings = [];

        /* INTERFACE CiF.Locution */
        this.renderText = function(initiator, responder, other, line) {
            this.realizedString = "";
            if (this.candidateStrings.length > 0) {
                this.realizedString = this.candidateStrings[Util.randRange(0, this.candidateStrings.length - 1)];
            }

            return this.realizedString;
        }

        this.getType = function() {
            return "RandomLocution";
        }
    }

    return RandomLocution;
});

