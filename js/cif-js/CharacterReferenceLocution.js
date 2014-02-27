define([], function() {
    var CharacterReferenceLocution = function() {
        this.type = "";

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
            //Lazy
            var type = this.type;

            var tempString = "";

            if (type == "I" || type == "IS") {
                tempString = initiator.characterName;
            }
            if (type == "IP") {
                tempString = initiator.characterName;
                tempString += "'s";
            }
            if (type == "R" || type == "RS") {
                tempString = responder.characterName;
            }
            if (type == "RP") {
                tempString = responder.characterName;
                tempString += "'s";
            }
            if (type == "O" || type == "OS")
            {
                tempString = other.characterName;
            }
            if (type == "OP")
            {
                tempString = other.characterName;
                tempString += "'s";
            }
            return tempString;

        }

        this.toString = function() {
            return this.type;
        }

        this.getType = function() {
            return "CharacterReferenceLocution";
        }
    }

    return CharacterReferenceLocution;
});
