define(['min-cif/CKBPath'], function(CKBPath) {
	/**
	 * The CulturalKB class contains/creates vectors of propositions, a singleton instance, toString function, and loading of XML
	 * Currently working on findItem function to compare Char subjectivity items with Truth items
	 */


	var instance;
    var ckb = function() {
        function CulturalKB() {
            if (instance) {
                return instance;
            }
            instance = this;
            this.propsSubjective = [];
            this.propsTruth = [];

            this.clone = function() {
                var ckb = new CulturalKB();
                ckb.propsSubjective = this.propsSubject.slice(0);
                ckb.propsTruth = this.propsTruth.slice(0);
                return ckb;
            }

            /**
             * toString gathers all proposition information
             * @see CiF.Proposition
             * @return a CulturalKB as a string
             */
            this.toString = function() {
                var returnstr = "";
                var i = 0;
                returnstr += "Cultural Knowledge Base";
                for (i = 0; i < this.propsSubjective.length; ++i) {
                    returnstr += "\n   " + this.propsSubjective[i];
                }
                for (i = 0; i < this.propsTruth.length; ++i) {
                    returnstr += "\n   " + this.propsTruth[i];
                }
                returnstr += "\nCultural Knowledge Base End";
                return returnstr;
            }

        }

    CulturalKB.TRUTH_LABEL_COUNT = 11;
    //labels
    CulturalKB.COOL = 0;
    CulturalKB.LAME = 1;
    CulturalKB.ROMANTIC = 2;
    CulturalKB.GROSS = 3;
    CulturalKB.FUNNY = 4;
    CulturalKB.BAD_ASS = 5;
    CulturalKB.MEAN = 6;
    CulturalKB.NICE = 7;
    CulturalKB.TABOO = 8;
    CulturalKB.RUDE = 9;
    CulturalKB.CHEATING = 10;
    CulturalKB.SUBJECTIVE_LABEL_COUNT = 4;

    CulturalKB.LIKES = 0;
    CulturalKB.DISLIKES = 1;
    CulturalKB.WANTS = 2;
    CulturalKB.HAS = 3;
    /**
     * getInstance returns the singleton instance of our CulturalKB
     */

    CulturalKB.getInstance = function() {
        return instance || new CulturalKB();
    }

		/**
		 * findItem returns the character's match for liking/disliking all items that match the label
		 * @param	character
		 * @param	connectionType
		 * @param	label
		 * @return  returnItemNames
		 */
		CulturalKB.findItem = function(character, connectionType, label) {
			var returnItemNames= [];
            this.findFullCKBPaths(character, connectionType, undefined, label).forEach(function(path) {
				returnItemNames.push(path.itemName);
			});
			return returnItemNames;
		}

		/**
		 * Returns all full path matches in the CKB given the constraints on
		 * the CKB in the parameterization of the function.
		 * @param	character
		 * @param	connectionType
		 * @param	item
		 * @param	label
		 * @return	The paths matching the constraints.
		 */
		CulturalKB.findFullCKBPaths = function(character, connectionType, item, label) {
			var charAndTypeMatches = [];
			var labelMatches = [];
			var returnCKBPaths = [];
			var i, j;
			var p;

			//console.debug(this, "findItem() character: " + character + " connectionType: " + connectionType + " label: " + label);

			for (i = 0; i < this.propsSubjective.length; ++i) {
				p = this.propsSubjective[i];
				//console.debug(this, "current subjective: " + p.toString() + "  character: " + character + " connectionType: " + connectionType);
				//if the connection type is not undefined, match to it.
				//if the connection type is undefined, treat it as a wild card; return all as matches.
				if(connectionType) {
					if (p.head.toLowerCase() == character.toLowerCase() && p.connection.toLowerCase() == connectionType.toLowerCase()) {
						charAndTypeMatches.push(p);
						//console.debug(this, "current subjective is char and type match: " + p.toString());
					}
				} else {
					if (p.head.toLowerCase() == character.toLowerCase()){
						charAndTypeMatches.push(p);
						//console.debug(this, "current subjective is char (type ignored): " + p.toString());
					}
				}
			}

			//if the label is not undefined, match to it.
			//if the label type is undefined, treat it as a wild card; return all as matches.
			if(label) {
				for (i = 0; i < this.propsTruth.length; ++i) {
					p = this.propsTruth[i];
					//console.debug(this, "current truth: " + p.toString());
					if (p.tail == label) {
						labelMatches.push(p);
						//console.debug(this, "current truth is label match: " + p.toString());
					}
				}
			} else {
				//console.debug(this, "findItem() all labels accepted.");
				labelMatches = this.propsTruth;
			}

			for (i = 0; i < charAndTypeMatches.length; ++i) {
				for (j = 0; j < labelMatches.length; ++j) {
					var s = charAndTypeMatches[i];
					var t = labelMatches[j];
					if (s.tail == t.head) {
						//returnItemNames.push(s.tail);
						var path = new CKBPath();
						path.characterName = s.head;
						path.connectionType = s.connection;
						path.itemName = s.tail;
						path.truthLabel = t.tail;
						returnCKBPaths.push(path);
					}
				}
			}
			return returnCKBPaths;

		}

		/**
		 * Given the Number representation of a Label, this function
		 * returns the String representation of that type. This is intended to
		 * be used in UI elements of the design tool.
		 * @example <listing version="3.0">
		 * CulturalKB.getNameByNumber(CulturalKB.COOL); //returns "cool"
		 * </listing>
		 * @param	type The Label type as a Number.
		 * @return The String representation of the Label type or empty string
		 * if the number did not match a label.
		 */
		CulturalKB.getTruthNameByNumber = function(type) {
			switch (type) {
				case CulturalKB.COOL:
					return "cool";
				case CulturalKB.LAME:
					return "lame";
				case CulturalKB.ROMANTIC:
					return "romantic";
				case CulturalKB.GROSS:
					return "gross";
				case CulturalKB.FUNNY:
					return "funny";
				case CulturalKB.BAD_ASS:
					return "bad ass";
				case CulturalKB.MEAN:
					return "mean";
				case CulturalKB.NICE:
					return "nice";
				case CulturalKB.TABOO:
					return "taboo";
				case CulturalKB.RUDE:
					return "rude";
				case CulturalKB.CHEATING:
					return "cheating";
				default:
					return "";
			}
		}

		/**
		 * Given the String representation of a Label, this function
		 * returns the Number representation of that type. This is intended to
		 * be used in UI elements of the design tool.
		 * @example <listing version="3.0">
		 * CulturalKB.getNumberByName("cool"); //returns CulturalKB.COOL
		 * </listing>
		 * @param	type The Label type as a String.
		 * @return The Number representation of the Label type or -1 if the
		 * number did not match a label.
		 */
		CulturalKB.getTruthNumberByName = function(type) {
			switch (type.toLowerCase()) {
				case "cool":
					return CulturalKB.COOL;
				case "lame":
					return CulturalKB.LAME;
				case "romantic":
					return CulturalKB.ROMANTIC;
				case "gross":
					return CulturalKB.GROSS;
				case "gross":
					return CulturalKB.FUNNY;
				case "bad ass":
					return CulturalKB.BAD_ASS;
				case "mean":
					return CulturalKB.MEAN;
				case "nice":
					return CulturalKB.NICE;
				case "taboo":
					return CulturalKB.TABOO;
				case "rude":
					return CulturalKB.RUDE;
				case "cheating":
					return CulturalKB.CHEATING;
				default:
					return -1;
			}
		}

		CulturalKB.getSubjectiveNameByNumber = function(num) {
			switch (num) {
				case CulturalKB.LIKES:
					return "likes";
				case CulturalKB.DISLIKES:
					return "dislikes";
				case CulturalKB.WANTS:
					return "wants";
				case CulturalKB.HAS:
					return "has";
				default:
					return "";
			}
		}

		CulturalKB.getSubjectiveNumberByName = function(name) {
			switch (name.toLowerCase()) {
				case "likes":
					return CulturalKB.LIKES;
				case "dislikes":
					return CulturalKB.DISLIKES;
				case "wants":
					return CulturalKB.WANTS;
				case "has":
					return CulturalKB.HAS;
				default:
					return -1;
			}
		}


		CulturalKB.equals = function(x, y) {
			if (x.propsSubjective.length != y.propsSubjective.length) return false;

			for (var i = 0; i < x.propsSubjective.length; ++i) {
				if (!Proposition.equals(x.propsSubjective[i], y.propsSubjective[i])) return false;
			}
			if (x.propsTruth.length != y.propsTruth.length) return false;

			for (i = 0; i < x.propsTruth.length; ++i) {
				if (!Proposition.equals(x.propsTruth[i], y.propsTruth[i])) return false;
			}
			return true;
		}

        return CulturalKB;
	}

    return ckb();
});
