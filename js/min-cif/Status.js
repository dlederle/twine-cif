define([], function() {
    var DEFAULT_INITIAL_DURATION = 3;

    var statuses = {};
    //The first ones (through FIRST_NOT_DIRECTED_STATUS are status categories)
    statuses.CAT_FEELING_BAD = 0;
    statuses.CAT_FEELING_GOOD = 1;
    statuses.CAT_FEELING_BAD_ABOUT_SOMEONE = 2;
    statuses.CAT_FEELING_GOOD_ABOUT_SOMEONE = 3;
    statuses.CAT_REPUTATION_BAD = 4;
    statuses.CAT_REPUTATION_GOOD = 5;
    statuses.LAST_CATEGORY_COUNT = 5;

    statuses.FIRST_NOT_DIRECTED_STATUS = 6;
    statuses.EMBARRASSED = 6;
    statuses.CHEATER = 7;
    statuses.SHAKEN = 8;
    statuses.DESPERATE = 9;
    statuses.CLASS_CLOWN = 10;
    statuses.BULLY = 11;
    statuses.LOVE_STRUCK = 12;
    statuses.GROSSED_OUT = 13;
    statuses.EXCITED = 14;
    statuses.POPULAR = 15;
    statuses.SAD = 16;
    statuses.ANXIOUS = 17;
    statuses.HONOR_ROLL = 18;
    statuses.LOOKING_FOR_TROUBLE = 19;
    statuses.GUILTY = 20;
    statuses.FEELS_OUT_OF_PLACE = 21;
    statuses.HEARTBROKEN = 22;
    statuses.CHEERFUL = 23;
    statuses.CONFUSED = 24;
    statuses.LONELY = 25;
    statuses.HOMEWRECKER = 26;

    statuses.FIRST_TO_IGNORE_NON_DIRECTED = 27;
    statuses.RESIDUAL_POPULAR = 27;
    statuses.FIRST_DIRECTED_STATUS = 28;
    statuses.HAS_A_CRUSH_ON = 28; //pink
    statuses.ANGRY_AT = 29; //dark red
    statuses.WANTS_TO_PICK_ON = 30; //dark orange
    statuses.ANNOYED_WITH = 31; //
    statuses.SCARED_OF = 32; //dark purple
    statuses.PITIES = 33; //light blue
    statuses.ENVIES = 34; //green
    statuses.GRATEFUL_TOWARD = 35; //bright green
    statuses.TRUSTS = 36; //solid blue
    statuses.FEELS_SUPERIOR_TO = 37; //brown
    statuses.CHEATING_ON = 38; //
    statuses.CHEATED_ON_BY = 39; //
    statuses.HOMEWRECKED = 40; //

    statuses.STATUS_COUNT = 41;
    statuses.CATEGORIES = {};

    statuses.CATEGORIES[statuses.CAT_FEELING_BAD] = [statuses.EMBARRASSED, statuses.SHAKEN, statuses.DESPERATE, statuses.GROSSED_OUT, statuses.SAD, statuses.ANXIOUS, statuses.GUILTY, statuses.FEELS_OUT_OF_PLACE, statuses.HEARTBROKEN, statuses.CONFUSED, statuses.LONELY];

    statuses.CATEGORIES[statuses.CAT_FEELING_GOOD] = [statuses.LOVE_STRUCK, statuses.EXCITED, statuses.CHEERFUL];

    statuses.CATEGORIES[statuses.CAT_FEELING_BAD_ABOUT_SOMEONE] = [statuses.ANGRY_AT, statuses.ENVIES,statuses.WANTS_TO_PICK_ON, statuses.ANNOYED_WITH, statuses.SCARED_OF, statuses.FEELS_SUPERIOR_TO, statuses.CHEATED_ON_BY];

    statuses.CATEGORIES[statuses.CAT_FEELING_GOOD_ABOUT_SOMEONE] = [statuses.HAS_A_CRUSH_ON, statuses.PITIES, statuses.GRATEFUL_TOWARD, statuses.TRUSTS];

    statuses.CATEGORIES[statuses.CAT_REPUTATION_BAD] = [statuses.CHEATER, statuses.BULLY, statuses.HOMEWRECKER];

    statuses.CATEGORIES[statuses.CAT_REPUTATION_GOOD] = [statuses.CLASS_CLOWN, statuses.POPULAR, statuses.HONOR_ROLL];

    var Status = function(opts) {
        opts = opts || {};
        this.type = opts.type || statuses.DESPERATE;
        // The name of the character the status is directed toward.
        this.directedToward = opts.directedToward || "";

        //The how long the status will be in effect after it is placed
        this.initialDuration = opts.initialDuration || DEFAULT_INITIAL_DURATION;
        //How long the status has before it is removed.
        this.remainingDuration = opts.remainingDuration || this.initialDuration;


        this.isStatusInCategory = function(statusID, catID) {
            for (var sID in statuses.CATEGORIES[catID]) {
                if (sID === statusID) {
                    return true;
                }
            }
            return false;
        }

        /**
         * Returns a status name when called with a status constant.
         *
         * @param	n	A status numeric representation.
         * @return The String representation of the status denoted by the first
         * parameter or an empty string if the number did not match a status.
         */
        this.getStatusNameByNumber = function (n) {
            switch(n) {
                case statuses.CAT_FEELING_BAD:
                    return "cat: feeling bad";
                case statuses.CAT_FEELING_GOOD:
                    return "cat: feeling good";
                case statuses.CAT_FEELING_BAD_ABOUT_SOMEONE:
                    return "cat: feeling bad about someone";
                case statuses.CAT_FEELING_GOOD_ABOUT_SOMEONE:
                    return "cat: feeling good about someone";
                case statuses.CAT_REPUTATION_BAD:
                    return "cat: reputation bad";
                case statuses.CAT_REPUTATION_GOOD:
                    return "cat: reputation good";
                case statuses.EMBARRASSED:
                    return "embarrassed";
                case statuses.CHEATER:
                    return "cheater";
                case statuses.SHAKEN:
                    return "shaken";
                case statuses.DESPERATE:
                    return "desperate";
                case statuses.CLASS_CLOWN:
                    return "class clown";
                case statuses.BULLY:
                    return "bully";
                case statuses.LOVE_STRUCK:
                    return "love struck";
                case statuses.GROSSED_OUT:
                    return "grossed out";
                case statuses.EXCITED:
                    return "excited";
                case statuses.POPULAR:
                    return "popular";
                case statuses.SAD:
                    return "sad";
                case statuses.ANXIOUS:
                    return "anxious";
                case statuses.HONOR_ROLL:
                    return "honor roll";
                case statuses.LOOKING_FOR_TROUBLE:
                    return "looking for trouble";
                case statuses.GUILTY:
                    return "guilty";
                case statuses.FEELS_OUT_OF_PLACE:
                    return "feels out of place";
                case statuses.HEARTBROKEN:
                    return "heartbroken";
                case statuses.CHEERFUL:
                    return "cheerful";
                case statuses.CONFUSED:
                    return "confused";
                case statuses.LONELY:
                    return "lonely";
                case statuses.HOMEWRECKER:
                    return "homewrecker";
                case statuses.HAS_A_CRUSH_ON:
                    return "has a crush on";
                case statuses.ANGRY_AT:
                    return "angry at";
                case statuses.WANTS_TO_PICK_ON:
                    return "wants to pick on";
                case statuses.ANNOYED_WITH:
                    return "annoyed with";
                case statuses.SCARED_OF:
                    return "scared of";
                case statuses.PITIES:
                    return "pities";
                case statuses.ENVIES:
                    return "envies";
                case statuses.GRATEFUL_TOWARD:
                    return "grateful toward";
                case statuses.TRUSTS:
                    return "trusts";
                case statuses.FEELS_SUPERIOR_TO:
                    return "feels superior to";
                case statuses.CHEATING_ON:
                    return "cheating on";
                case statuses.CHEATED_ON_BY:
                    return "cheated on by";
                case statuses.HOMEWRECKED:
                    return "homewrecked";
                case statuses.RESIDUAL_POPULAR:
                    return "residual popular";
                default:
                    return "";
            }
        }

        this.getShortStatusNameByNumber = function(n) {
            switch(n) {
                case statuses.CAT_FEELING_BAD:
                    return "feels bad";
                case statuses.CAT_FEELING_GOOD:
                    return "feels good";
                case statuses.CAT_FEELING_BAD_ABOUT_SOMEONE:
                    return "negative";
                case statuses.CAT_FEELING_GOOD_ABOUT_SOMEONE:
                    return "positive";
                case statuses.CAT_REPUTATION_BAD:
                    return "bad rep";
                case statuses.CAT_REPUTATION_GOOD:
                    return "good rep";
                case statuses.EMBARRASSED:
                    return "embarrass";
                case statuses.CHEATER:
                    return "cheater";
                case statuses.SHAKEN:
                    return "shaken";
                case statuses.DESPERATE:
                    return "desperate";
                case statuses.CLASS_CLOWN:
                    return "class clown";
                case statuses.BULLY:
                    return "bully";
                case statuses.LOVE_STRUCK:
                    return "love struck";
                case statuses.GROSSED_OUT:
                    return "gross";
                case statuses.EXCITED:
                    return "excited";
                case statuses.POPULAR:
                    return "popular";
                case statuses.SAD:
                    return "sad";
                case statuses.ANXIOUS:
                    return "anxious";
                case statuses.HONOR_ROLL:
                    return "honors";
                case statuses.LOOKING_FOR_TROUBLE:
                    return "trouble";
                case statuses.GUILTY:
                    return "guilty";
                case statuses.FEELS_OUT_OF_PLACE:
                    return "out of place";
                case statuses.HEARTBROKEN:
                    return "heartbroke";
                case statuses.CHEERFUL:
                    return "cheerful";
                case statuses.CONFUSED:
                    return "confused";
                case statuses.LONELY:
                    return "lonely";
                case statuses.HOMEWRECKER:
                    return "homewrecker";
                case statuses.HAS_A_CRUSH_ON:
                    return "crush on";
                case statuses.ANGRY_AT:
                    return "angry at";
                case statuses.WANTS_TO_PICK_ON:
                    return "pick on";
                case statuses.ANNOYED_WITH:
                    return "annoyed with";
                case statuses.SCARED_OF:
                    return "scared of";
                case statuses.PITIES:
                    return "pities";
                case statuses.ENVIES:
                    return "envies";
                case statuses.GRATEFUL_TOWARD:
                    return "grateful";
                case statuses.TRUSTS:
                    return "trusts";
                case statuses.FEELS_SUPERIOR_TO:
                    return "superior to";
                case statuses.CHEATING_ON:
                    return "cheat on";
                case statuses.CHEATED_ON_BY:
                    return "cheat on by";
                case statuses.HOMEWRECKED:
                    return "homewrecked";
                case statuses.RESIDUAL_POPULAR:
                    return "residual popular";
                default:
                    return "";
            }
        }

        /**
         * Returns the string name of a status given the number representation
         * of that status.
         * @param	name	The name of the status.
         * @return The number that corresponds to the name of the status or -1
         * if the name did not correspond to a status.
         */
        this.getStatusNumberByName = function(name) {
            switch(name.toLowerCase()) {
                case "cat: feeling bad":
                           return statuses.CAT_FEELING_BAD;
                case "cat: feeling good":
                           return statuses.CAT_FEELING_GOOD;
                case "cat: feeling bad about someone":
                           return statuses.CAT_FEELING_BAD_ABOUT_SOMEONE;
                case "cat: feeling good about someone":
                           return statuses.CAT_FEELING_GOOD_ABOUT_SOMEONE;
                case "cat: reputation bad":
                           return statuses.CAT_REPUTATION_BAD;
                case "cat: reputation good":
                           return statuses.CAT_REPUTATION_GOOD;
                case "embarrassed":
                           return statuses.EMBARRASSED;
                case "cheater":
                           return statuses.CHEATER;
                case "shaken":
                           return statuses.SHAKEN;
                case "desperate":
                           return statuses.DESPERATE;
                case "class clown":
                           return statuses.CLASS_CLOWN;
                case "bully":
                           return statuses.BULLY;
                case "love struck":
                           return statuses.LOVE_STRUCK;
                case "grossed out":
                           return statuses.GROSSED_OUT;
                case "excited":
                           return statuses.EXCITED;
                case "popular":
                           return statuses.POPULAR;
                case "sad":
                           return statuses.SAD;
                case "anxious":
                           return statuses.ANXIOUS;
                case "honor roll":
                           return statuses.HONOR_ROLL;
                case "looking for trouble":
                           return statuses.LOOKING_FOR_TROUBLE;
                case "guilty":
                           return statuses.GUILTY;
                case "feels out of place":
                           return statuses.FEELS_OUT_OF_PLACE;
                case "heartbroken":
                           return statuses.HEARTBROKEN;
                case "cheerful":
                           return statuses.CHEERFUL;
                case "confused":
                           return statuses.CONFUSED;
                case "lonely":
                           return statuses.LONELY;
                case "homewrecker":
                           return statuses.HOMEWRECKER;
                case "has a crush on":
                           return statuses.HAS_A_CRUSH_ON;
                case "angry at":
                           return statuses.ANGRY_AT;
                case "wants to pick on":
                           return statuses.WANTS_TO_PICK_ON;
                case "annoyed with":
                           return statuses.ANNOYED_WITH;
                case "scared of":
                           return statuses.SCARED_OF;
                case "pities":
                           return statuses.PITIES;
                case "envies":
                           return statuses.ENVIES;
                case "grateful toward":
                           return statuses.GRATEFUL_TOWARD;
                case "trusts":
                           return statuses.TRUSTS;
                case "feels superior to":
                           return statuses.FEELS_SUPERIOR_TO;
                case "cheating on":
                           return statuses.CHEATING_ON;
                case "cheated on by":
                           return statuses.CHEATED_ON_BY;
                case "homewrecked":
                           return statuses.HOMEWRECKED;
                case "residual popular":
                           return statuses.RESIDUAL_POPULAR;
                default:
                           return -1;
            }
        }
    }

    return Status;
});
