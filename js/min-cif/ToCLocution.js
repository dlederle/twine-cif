define([], function() {
    var ToCLocution = function() {
        this.locutions = [];
        this.realizedString;

        this.tocID = -1;
        this.rawString = "";

        this.speaker = "";
        /* INTERFACE CiF.Locution */
        this.renderText = function(initiator, responder, other, line) {
            this.realizedString = "";

            this.locutions.forEach(function(locution) {
                if (locution.getType() == "MixInLocution") {
                    initiator.isSpeakerForMixInLocution = true;
                    this.realizedString += locution.renderText(initiator, responder, other, line) + " ";
                    initiator.isSpeakerForMixInLocution = false;
                }
                else {
                    if (locution.getType() == "SFDBLabelLocution") {
                        locution.speaker = this.speaker;
                    }
                    this.realizedString += locution.renderText(initiator, responder, other, line);
                }
            });

            return this.realizedString;
        }

        this.getType = function() {
            return "ToCLocution";
        }
    }
    return ToCLocution;
});
