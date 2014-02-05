define(["min-cif/CiFSingleton", "min-cif/ProspectiveMemory", "min-cif/Trait"], function(CiFSingleton, ProspectiveMemory, Trait) {
    /**
     * @class Character
     */
    //Const
    var LABELS = {
        "BEST_FRIEND" : 0,
        "DATING" : 1,
        "TRUE LOVE" : 2,
        "IDOL": 3,
        "BIGGEST_LOSER": 4,
        "WORST_ENEMY": 5
    };

    var Character = function(opts) {

        opts = opts || {};
        this.characterName = opts.characterName || "";
        this.traits = opts.traits || [];
        this.gender = opts.gender || "";
        this.statuses = opts.statuses || [];
        //Unique ID wrt to social networks
        this.networkID = opts.networkID || -1;
        this.prospectiveMemory = opts.prospectiveMemory || new ProspectiveMemory();
        this.locutions = opts.locutions || {};
        this.characterLabels = [];
        this.CiF = CiFSingleton.getInstance();
        this.defaultLocutions = {};

        /**
         * Updates who this character thinks is their best friend, etc
         */
        this.updateCharacterLabels = function() {
            var labels = [];
            Object.keys(LABELS).forEach(function(label, num) {
                labels[num] = getRelationship(label);
            });
            this.characterLabels = labels;
        }

        this.setTrait = function(t) {
            if (t <= Trait._LAST_CATEGORY_COUNT) {
                for(var i in CiF.Trait.CATEGORIES) {
                    this.traits.push(i);
                }
            } else {
                this.traits.push(t);
            }
        }

        this.hasTrait = function(t) {
            if (t <= Trait.LAST_CATEGORY_COUNT) {
                for(var cat_trait in CiF.Trait.CATEGORIES[t]) {
                    for(var trait in this.traits) {
                        if (trait == cat_trait) return true;
                    }
                }
            } else {
                for(var trait in this.traits) {
                    if (trait == t) return true;
                }
            }
            return false;
        }

        this.setNetworkID = function(nid) {
            this.networkID = nid;
        }

        this.setName = function(newName) {
            this.characterName = newName;
        }

        this.hasStatus = function(statusID, towardChar) {
            //TODO
        }

        this.addStatus = function(statusType, towardCharacter) {
            //TODO
        }

        this.removeStatus = function(statusType, towardCharacter) {
            //TODO
        }

        this.getStatus = function(statusID, towardChar) {
            //TODO
        }

        this.getTrait = function(traitID) {
            for(var trait in this.traits) {
                if(traitID == trait) return trait;
            }
            return -1;
        }

        this.updateStatusDurations = function(timeElapsed) {
            //TODO
        }

        var getRelationshipName = function(condition) {
            var target = "";
            var highestNetwork = 0;
            var forChar = cif.cast.getCharByName(this.characterName);
            //Iterate through cast of characters
            //for(var character in cif.cast.characters) {
                //if(character.characterName != forChar.characterName) {
                //target = condition(forChar, character);
                //}
                //
            //}
        }

        var getBestFriend = function() {
        }
        var getDating = function() {
        }
        var getIdol = function() {
        }
        var getTrueLove = function() {
        }
        var getWorstEnemy = function() {
        }
        var getBiggestLoser = function() {
        }

        var getRelationship = function(label) {
            switch (label) {
                case "BEST_FRIEND":
                    return getBestFriend();
                    break;
                case "DATING":
                    return getDating();
                    break;
                case "IDOL":
                    return getIdol();
                    break;
                case "TRUE_LOVE":
                    return getTrueLove();
                    break;
                case "WORST_ENEMY":
                    return getWorstEnemy();
                    break;
                case "BIGGEST_LOSER":
                    return getBiggestLoser();
                    break;
            }
            return label;
        }
    };

    return Character;
});
