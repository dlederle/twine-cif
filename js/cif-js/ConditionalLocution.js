define([], function() {
    var ConditionalLocution = function() {
        this.ifRuleID = -1;
        this.ifRuleString = "";
        this.elseIfRuleIDs = [];
        this.elseIfStrings = [];
        this.elseString = "";
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
        this.renderText = function(initiator, responder, other, line) {
            var resultStr = "";
            return resultStr;
        }

        this.getType = function() {
            return "ConditionalLocution";
        }
    }

    return ConditionalLocution

});
