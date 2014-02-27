define(['SocialFactsDB', 'TriggerContext', 'Effect', 'Predicate'], function(SocialFactsDB, TriggerContext, Effect, Predicate) {

	/**
	 * The Trigger class consists of conditional rules that look over the recent
	 * social state and perform social change based on evaluation of the conditions.
	 * This allows for social state transformations that are difficult to capture
	 * in SocialGame effect changes. For example, the detection of a the cheating
	 * status, or where a character is dating more than one other character
	 * simultaneously, is a very conditional and difficult statement in the
	 * context of social game effect changes. Furthermore, it would have to be
	 * present in every effect that has dating in it's change rule. Triggers
	 * centralize this logic and allow for more "third party" reasoning. An
	 * example would be the emnity rule:
	 * <pre>friends(x,y)^negativeAct(z,y)->emnity(x,z)</pre>
	 * <p>Affected triggers are placed into the social facts database as a
	 * TriggerContext.</p>
     *
	 * <p>As triggers behave generally like SocialGame Effects in that they
	 * have a condition rule, a change rule, and a performance realization
	 * description, they extend Effect as to not duplicate functionality.</p>
     *
	 * </p>Unlike the logical structures in social games, the logical rules
	 * in triggers are not associated with roles; they are standard logical
	 * variables -- x, y, and z. The condition and change rules of triggers
	 * should use x,y, and z instead of responder, initiator, and other.</p>
	 *
	 * @see CiF.Rule
	 * @see CiF.Predicate
	 * @see CiF.SocialGame
	 * @see CiF.Effect
	 * @see CiF.SocialFactsDB
	 * @see CiF.TriggerContext
	 */
    var Trigger = function() {
        this.prototype = new Effect();
		/**
		 * This is used to help know when we are dealing with an actual authored trigger, or a trigger context which has
		 * no condition, and is the result of the tatus timing out.
		 */
		this.STATUS_TIMEOUT_TRIGGER_ID = -1;

		this.useAllChars;

		this.evaluateCondition = function(initiator, responder, other) {
			//console.debug(this, "evaluateCondition() about to evaluate trigger " + this.toXML());
			return this.protoype.evaluateCondition(initiator, responder, other);
		}

		/**
		 * Returns a SFDBContext interface compatable SFDB entry for this
		 * trigger. No time is set as this function is meant to be called
		 * in either CiFSingleton or SocialFactsDB when placing a trigger
		 * that has fired into the SFDB context.
		 * @param	time The SFDB time with which to tag the SFDB entry.
		 * @return	The SFDB entry for the Trigger.
		 */
		this.makeTriggerContext = function(timeNumber, x, y, z) {
			var tc= new TriggerContext();

			//var cifCiFSingleton = CiFSingleton.getInstance();

			if (this.id == 10) {
				//trace("23432432432");
			}

			tc.time = time;
			tc.id = this.id;
			tc.initiator = x.characterName;
			tc.responder = y ? y.characterName : "";
			tc.other = z ? z.characterName : "";

            this.change.predicates.forEach(function(p) {
				if (Predicate.SFDBLABEL == p.type) {
					var labelSFDBLabel = new SFDBLabel();
					label.to = p.primaryCharacterNameFromVariables(x, y, z);
					label.from = p.secondaryCharacterNameFromVariables(x, y, z);
					label.type = SocialFactsDB.getLabelByNumber(p.type);
					tc.SFDBLabels.push(label);
				}
			});
			return tc;
		}
	} //End of Trigger

    return Trigger;
});
