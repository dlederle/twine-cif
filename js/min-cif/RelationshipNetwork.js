define(['./SocialNetwork'], function(SocialNetwork) {

    /**
     * This class holds a separate instance of the SocialNetwork class for each
     * of our social relationshipes. If the entry in that network is non-zero, we
     * that relationship is considered true between the two characters. If the number
     * is zero, the relationship is not true.
     * Relationshipes are not consider exclusive in this implementations (edward and
     * lily can be friends and enemies simultaneously). When a relationship is set
     * or removed, entries are removed transitively.
     * @usage var sn:RelationshipNetwork = new RelationshipNetwork(characterCount);
     * sn.setRelationship(RelationshipNetwork.DATING, lily, edward);
     * sn.removeRelationship(RelationshipNetwork.DATING, edward, lily);
     *
     * @usage var sn = RelationshipNetwork.getInstance();
     * sn.initialize(3);
     * sn.setRelationship(RelationshipNetwork.DATING, a, b);
     * trace(sn.getRelationship(RelationshipNetwork.DATING, a, b));
     * trace(sn);
     *
     * @see CiF.SocialNetwork
     *
     */
    var rn = function() {
        var instance;
        function RelationshipNetwork() {
            if (instance) {
                return instance;
            }
            instance = this;

            /**
             * Returns a relationship name when called with a relationship constant.
             * @param	n	A relationship numeric representation.
             * @return The String representation of the relationship denoted by the first
             * parameter or an empty string of the number did not match a relationship.
             */
            this.getRelationshipNameByNumber = function(n) {
                switch(n) {
                    case RelationshipNetwork.FRIENDS:
                        return "friends";
                    case RelationshipNetwork.DATING:
                        return "dating";
                    case RelationshipNetwork.ENEMIES:
                        return "enemies";
                    default:
                        return "";
                }
            }

            /**
             * Overridden as the default value of relationships should be 0 as
             * the RelationshipNetwork values are interpreted differently than
             * the other SocialNetworks.
             * Initializes the RelationNetwork's properties given the number of
             * characters in the social network.
             *
             * @param	numChars The number of characters to be included in the
             * RelationshipNetwork.
             */
            this.initialize = function(numChars) {
                numChars = numChars || 0;
                network = [];
                var i;
                var j;
                for (i = 0; i < numChars; i++) {
                    network[i] = [];
                    for (j = 0; j < numChars; j++) {
                        network[i][j] = 0;
                    }
                }
            }

            /**
             * Returns the string name of a relationship given the number representation
             * of that relationship.
             * @param	name	The name of the relationship.
             * @return The number that corresponds to the name of the relationship
             * or -1 if the name did not match a relationship.
             */
            this.getRelationshipNumberByName = function(name) {
                switch(name.toLowerCase()) {
                    case "friends":
                        return RelationshipNetwork.FRIENDS;
                    case "dating":
                        return RelationshipNetwork.DATING;
                    case "enemies":
                        return RelationshipNetwork.ENEMIES;
                    default:
                        return -1;
                }
            }

            /**
             * Sets a relationship from the character playing role A to the
             * character playing role B. If the relationship a reciprocal one (i.e
             * dating, friends or enemies), the network values are set
             * bidirectionally. If the relationship is a directed one, it is set in the
             * direction of A to B.
             * @param	Relationship The Relationship value for the Relationship to be added.
             * @param	a The Character for which the Relationship is true.
             * @param	b The Character that is the object of the Relationship.
             */
            this.setRelationship = function(relationship, a, b) {
                //console.debug(this, "setRelationship() " + RelationshipNetwork.getRelationshipNameByNumber(relationship) + " " + a.characterName + " " + b.characterName);
                if(!this.getRelationship(relationship, b, a)) {
                    this.addWeight(1 << int(relationship), b.networkID, a.networkID, true);
                }

                if(!this.getRelationship(relationship, a, b)) {
                    this.addWeight(1 << relationship, a.networkID, b.networkID, true);
                }
            }

            /**
             * Removes a relationship from the character playing role A to the
             * character playing role B. If the relationship a reciprocal one (i.e
             * dating, friends or enemies), the network values are set
             * bidirectionally. If the relationship is a directed one, it is set in the
             * direction of A to B.
             *
             * @param	relationship The relationship value for the relationship to be removed.
             * @param	a The Character for which the relationship is modified.
             * @param	b The Character that is the object of the relationship change.
             */
            this.removeRelationship = function(relationship, a, b) {
                if (relationship == RelationshipNetwork.FRIENDS ||
                        relationship == RelationshipNetwork.DATING ||
                        relationship == RelationshipNetwork.ENEMIES) {
                            //add the b->a reciprocal relationship link
                            if(this.getRelationship(relationship, b, a)) {
                                this.addWeight(-(1 << relationship), b.networkID, a.networkID, true);
                            }
                        }
                if(this.getRelationship(relationship, a, b)) {
                    this.addWeight( -(1 << relationship), a.networkID, b.networkID, true);
                }
            }

            /**
             * Checks for a relationship between two characters. It always checks if
             * the character of the second parameter has the relationship denoted by
             * the first paramater with the character represented by the third
             * parameter. Reciprocal and directional relationshipes are treated
             * identically.
             *
             * @usage relationshipNet.getRelationship(RelationshipNetwork.Dating, Lily, Edward);
             * //relationshipNet is an instance of the RelationshipNetwork class.
             * @param	relationship The relationship value for the relationship to be checked.
             * @param	a The Character for which the relationship is checked.
             * @param	b The Character that is the object of the relationship check.
             * @return True if the relationship is present from a to b. False if it is
             * not.
             */
            this.getRelationship = function(relationship, a, b) {
                if (a == undefined)
                {
                    //TODO: this is a temporary fix to a much bigger problem
                    return false;
                    //console.debug(this, "getRelationship() A is undefined");
                }
                if (b == undefined)
                {
                    //TODO: this is a temporary fix to a much bigger problem
                    return false;
                    //console.debug(this, "getRelationship() B is undefined");
                }
                //console.debug(this, "getRelationship() " + RelationshipNetwork.getRelationshipNameByNumber(relationship) + " " + a.networkID + ", " + b.networkID);
                //console.debug(this, "getRelationship() network size: " + this.network.length);
                return 0 < ( (1 << relationship) & this.getWeight(a.networkID, b.networkID));
            }

        }
        RelationshipNetwork.FRIENDS = 0;
        RelationshipNetwork.DATING = 1;
        RelationshipNetwork.ENEMIES = 2;
        RelationshipNetwork.RELATIONSHIP_COUNT = 3;

        RelationshipNetwork.prototype = new SocialNetwork();
        RelationshipNetwork.getInstance = function() {
            return instance || new RelationshipNetwork();
        }
        RelationshipNetwork.equals = function(x, y) {
            if (x.network.length != y.network.length) return false;
            for (var i = 0; i < x.network.length; ++i) {
                for (var j = 0; j < x.network.length; ++j) {
                    if (x.network[i][j] != y.network[i][j]) return false;
                }
            }
            if (x.type != y.type) return false;
            return true;
        }

        return RelationshipNetwork;
    };

    //This feels slightly weird, but it returns the Singleton correctly
    return rn();
});

