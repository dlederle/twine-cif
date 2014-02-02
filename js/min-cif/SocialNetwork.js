define([], function() {
    /**
     * @class SocialNetwork
     * A bi-directonal graph.
     * Intended to represent degrees of a given relationship between all
     * the characters in the game space, with each node representing
     * a character and each edge representing the strength of the relationship.
     */
    var SocialNetwork = function(numChars) {
        numChars = numChars || 0;

        this._DEFAULT_NETWORK_VALUE = 40;

        var minRange = 0;
        var maxRange = 100;
        var constrain = function(value) {
            if(value > maxRange) {
                return maxRange;
            }
            if(value < minRange) {
                return minRange;
            }
            return value;
        }

        var network = new Array(numChars);
        for(var i=0; i<numChars; i++) {
            network[i] = new Array(numChars);
            for(var j=0; j<numChars; j++) {
                network[i][j] = this._DEFAULT_NETWORK_VALUE;
            }
        }

        this.setRange = function(min, max) {
            minRange = min;
            maxRange = max;
        }

        this.setWeight = function(char1, char2, weight) {
            network[char1][char2] = constrain(weight);
        }

        this.multiplyWeight = function(char1, char2, factor) {
            network[char1][char2] = constrain(network[char1][char2] *= factor);
        }

        this.addWeight = function(char1, char2, weight, isStatusNet) {
            isStatusNet = isStatusNet || false;
            if(!isStatusNet) {
                network[char1][char2] = constrain(network[char1][char2] += weight);
            }
        }

        this.getNetwork = function() {
            return network;
        }

        this.getWeight = function(char1, char2) {
            return network[char1][char2];
        }

        /**
         * Returns the average weight of every character in the space towards
         * the specified character
         */
        this.getAverageOpinion = function(charID) {
            var opinionTotal = 0;
            network.forEach(function(el, i, arr) {
                if(i != charID) {
                    opinionTotal += network[i][charID];
                }
            });
            return (opinionTotal / (network.length - 1));
        }

        /**
         * Returns an array of character IDS of the characters with
         * a weight above the threshold
         */
        this.getRelationshipsAboveThreshold = function(charID, threshold) {
            var ids = [];
            network.forEach(function(el, i, arr) {
                if(i != charID && arr[charID][i] > threshold) {
                    ids.push(i);
                }
            });
            return ids;
        }

        this.toString = function() {
            return network;
        }
    }
    return SocialNetwork
});
