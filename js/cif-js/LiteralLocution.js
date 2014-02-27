define([], function() {
    var LiteralLocution = function() {
        this.content = "";
        /**********************************************************************
         * Locution Interface implementation
         *********************************************************************/
        /**
         * Creates the dialogue to be presented to the player.
         * @param	initiator	The initator of the social game.
         * @param	responder	The responder of the social game.
         * @param	other		A third party in the social game.
         * @return	The dialogue to present to the player.
         */
        this.renderText = function(initiator, responder, other, lineLineOfDialogue) {
            return content;
        }

        this.getType = function() {
            return "LiteralLocution";
        }
    }

    return LiteralLocution;
});
