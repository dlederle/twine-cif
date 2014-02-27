define([], function() {
    /**
     * @class Cast
     */
    var cast = function() {
        var instance;
        function Cast() {
            if (instance) {
                return instance;
            }
            instance = this;
            this.characters = [];
            this.charactersByName = {};

            this.length = function() {
                return this.characters.length;
            }

            this.getCharByName = function(name) {
                return this.charactersByName[name];
            }

            this.getCharByID = function(id) {
                this.characters.forEach(function(char) {
                    if(char.networkID === id) {
                        return char;
                    }
                });
            }

            this.addCharacter = function(char) {
                this.characters.push(char);
                this.charactersByName[char.characterName] = char;
                this.charactersByName[char.characterName.toLowerCase()] = char;
            }


        }
        Cast.getInstance = function() {
            return instance || new Cast();
        }
        return Cast;
    }
    return cast();
});
