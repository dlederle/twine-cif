define(['min-cif/Predicate', 'min-cif/SocialFactsDB'], function(Predicate, SocialFactsDB) {

	var SFDBLabelLocution = function() {
        this.speaker;

	    this.pred = new Predicate();
		this.pred.setByTypeDefault(Predicate.SFDBLABEL);
		this.sfdb = SocialFactsDB.getInstance();

		/**********************************************************************
		 * Locution Interface implementation
		 *********************************************************************/

		/**
		 * Creates the dialogue to be presented to the player. Of all of the
		 * social game contexts that match the locutions parameters, one is
		 * chosen randomly to be the subject of this locution.
		 * @param	initiator	The initator of the social game.
		 * @param	responder	The responder of the social game.
		 * @param	other		A third party in the social game.
		 * @return	The dialogue to present to the player.
		 */
		this.renderText = function(initiator, responder, other, line) {
			var potentialSFDBEntries = [];
			var socialGameName = "";
			var effectID;
			var chosenContext;

			//console.debug(this, "renderText() pred: " + this.pred.toString());
			if (pred.getPrimaryValue() == "initiator") {
				//console.debug(this, "initiator is primary");
				if (pred.getSecondaryValue() == "") { // if there is no second person.
					//console.debug(this, "there is no secondary");
					potentialSFDBEntries = sfdb.findLabelFromValues(pred.sfdbLabel,initiator, undefined, undefined, 0,pred);
				}
				else if (pred.getSecondaryValue() == "initiator") {
					//console.debug(this, "responder is secondary");
					potentialSFDBEntries = sfdb.findLabelFromValues(pred.sfdbLabel, initiator, initiator, undefined, 0, pred);
				}
				else if (pred.getSecondaryValue() == "responder") {
					//console.debug(this, "responder is secondary");
					potentialSFDBEntries = sfdb.findLabelFromValues(pred.sfdbLabel, initiator, responder, undefined, 0, pred);
				}
				else if (pred.getSecondaryValue() == "other") {
					//console.debug(this, "other is secondary");
					potentialSFDBEntries = sfdb.findLabelFromValues(pred.sfdbLabel, initiator, other, undefined, 0, pred);
				}
			}
			if (pred.getPrimaryValue() == "responder") {
				//console.debug(this, "responder is primary");
				if (pred.getSecondaryValue() == "") // if there is no second person.
					potentialSFDBEntries = sfdb.findLabelFromValues(pred.sfdbLabel, responder, undefined, undefined, 0, pred);
				else if(pred.getSecondaryValue() == "initiator")
					potentialSFDBEntries = sfdb.findLabelFromValues(pred.sfdbLabel, responder, initiator, undefined, 0, pred); // Do we need to be smarter about the order we pass them in?
				else if(pred.getSecondaryValue() == "responder")
					potentialSFDBEntries = sfdb.findLabelFromValues(pred.sfdbLabel, responder, responder, undefined, 0, pred); // Do we need to be smarter about the order we pass them in?
				else if(pred.getSecondaryValue() == "other")
					potentialSFDBEntries = sfdb.findLabelFromValues(pred.sfdbLabel, responder, other, undefined, 0, pred); // Do we need to be smarter about the order we pass them in?
			}
			if (pred.getPrimaryValue() == "other") {
				//console.debug(this, "other is primary");
				if (pred.getSecondaryValue() == "") // if there is no second person.
					potentialSFDBEntries = sfdb.findLabelFromValues(pred.sfdbLabel, other, undefined, undefined, 0, pred);
				else if (pred.getSecondaryValue() == "initiator")
					potentialSFDBEntries = sfdb.findLabelFromValues(pred.sfdbLabel, other, initiator, undefined, 0, pred);
				else if (pred.getSecondaryValue() == "responder")
					potentialSFDBEntries = sfdb.findLabelFromValues(pred.sfdbLabel, other, responder, undefined, 0,  pred);
				else if (pred.getSecondaryValue() == "other")
					potentialSFDBEntries = sfdb.findLabelFromValues(pred.sfdbLabel, other, other, undefined, 0,  pred);
			}
			if (potentialSFDBEntries && potentialSFDBEntries.length > 0) {
				var contextPick = Math.floor(Math.random() * potentialSFDBEntries.length);
				//get the name of the social game of the latest context
				//get the effect ID taken in the latest context
				//return the performance realization string of the taken effect
				//chosenContext = sfdb.contexts[potentialSFDBEntries[contextPick]] as SocialGameContext;
				chosenContext = sfdb.getSocialGameContextAtTime(potentialSFDBEntries[contextPick]);
				//console.debug(this, "renderText() chosenContext: " + chosenContext.toXMLString());
				//console.debug(this, "renderText() effectInfo: " + CiFSingleton.getInstance().socialGamesLib.getByName(chosenContext.gameName).getEffectByID(chosenContext.effectID).toString());
				//console.debug(this, "renderText() PerformanceString: "+ CiFSingleton.getInstance().socialGamesLib.getByName(chosenContext.gameName).getEffectByID(chosenContext.effectID).referenceAsNaturalLanguage);

				return chosenContext.getEffectPerformanceRealizationString(initiator, responder, other, speaker);

				return "We found a big list of entires! Here is the index of the first one: " + potentialSFDBEntries[0];
			}
			return "*whisper whisper*";
		}

		this.toString = function() {
			return "";
		}

		this.getType = function() {
			return "SFDBLabelLocution";
		}
	}

    return SFDBLabelLocution;
});
