define(['min-cif/Character'], function(Character) {
    /**
     * @class Cast
     */
    var cast = function() {
        var characters = [];
        var charactersByName = {};
        var instance;
        function Cast() {
            if (instance) {
                return instance;
            }
            instance = this;

            this.length = function() {
                return characters.length;
            }

            this.getCharByName = function(name) {
                return charactersByName[name];
            }

            this.getCharByID = function(id) {
                for (var char in characters) {
                    if(char.networkID === id) {
                        return char;
                    }
                }
            }

            this.addCharacter = function(char) {
                characters.push(char);
                charactersByName[char.characterName] = char;
                charactersByName[char.characterName.toLowerCase()] = char;
            }


        }
        Cast.getInstance = function() {
            return instance || new Cast();
        }
        return Cast;
    }
    return cast();
}
