define([], function() {
    var POVLocution = function() {
		this.realizedString = "";
		this.rawString = "";
		this.initiatorString = "";
		this.responderString = "";
		this.defaultString = "";
		this.subject = ""
		this.object = "";
		this.speaker = ""
		this.speakee = "";

		/* INTERFACE CiF.Locution */
		this.renderText = function(initiator, responder, other, line) {
			this.realizedString += defaultString;
			return this.realizedString;
		}

		this.getType = function() {
			return "POVLocution";
		}
	}

    return POVLocution;
});
