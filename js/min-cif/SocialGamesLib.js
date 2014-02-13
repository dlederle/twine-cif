define([], function() {

    /**
     * @class SocialGamesLib
     */
    var sgl = function() {
        var instance;
        function SocialGamesLib() {
            if (instance) {
                return instance;
            }
            instance = this;
            this.games = [];
            this.gamesByName = {};
            this.interrupts = [];

            this.addGame = function(sg) {
                this.games.push(sg);
                this.gamesByName[sg.name] = sg;
                this.gamesByName[sg.name.toLowerCase()] = sg;
            }

            this.removeGame = function(sg) {
                this.games.splice(this.games.lastIndexOf(sg, 0), 1);
                delete gamesByName[sg.name];
                delete gamesByName[sg.name.toLowerCase()];
            }

            this.getByName = function(name) {
                return this.gamesByName[name];
            }

            this.getIndexByName = function(name) {
                this.games.forEach(function(game, i) {
                    if(game.name.toLowerCase() === name.toLowerCase()) {
                        return i;
                    }
                });
                return -1;
            }

            this.getInterruptByName = function(name) {
                this.interrupts.forEach(function(interrupt) {
                    if(interrupt.name.toLowerCase() === name.toLowerCase()) {
                        return interrupt;
                    }
                });
            }

            this.getInterruptIndexByName = function(name) {
                this.interrupts.forEach(function(interrupt, i) {
                    if(interrupt.name.toLowerCase() === name.toLowerCase()) {
                        return i;
                    }
                });
            }
        }
        SocialGamesLib.getInstance = function() {
            return instance || new SocialGamesLib();
        }
        return SocialGamesLib;
    };

    //This feels slightly weird, but it returns the Singleton correctly
    return sgl();
});

