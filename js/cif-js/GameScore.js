define([], function() {

	/**
	 * The GameScore class holds the results of a social game score by a
	 * potential initiator for a potentional responder. This class is meant to
	 * be used by a character's prospective memory to store that character's
	 * intent to play varios social games.
	 * <p>This class consists of the name of the game scored, the name of the
	 * initiator, the name of the responder and the score assigned to the
	 * characters/game combination.</p>
	 * @see CiF.ProspectiveMemory
	 */
	var GameScore = function() {
			this.name = "";
			this.initiator = "";
			this.responder = ""
			this.other = "";
			this.score = 0;
		/**********************************************************************
		 * Utility Functions
		 *********************************************************************/
		this.toString = function() {
			return "CiF::GameScore: " + this.name + " " + this.initiator + " " + this.responder + " " + this.other + " " + this.score;
		}

		this.clone= function(){
			var g = new GameScore();
			g.name = this.name;
			g.initiator = this.initiator;
			g.responder = this.responder;
			g.other = this.other;
			g.score = this.score;
			return g;
		}
	}

    GameScore.equals = function(x, y) {
        if (x.name != y.name) return false;
        if (x.initiator != y.initiator) return false;
        if (x.responder != y.responder) return false;
        if (x.other != y.other) return false;
        if (x.score != y.score) return false;
        return true;
    }

    return GameScore;
});
