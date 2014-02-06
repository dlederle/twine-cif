define([], function() {
    var DEFAULT_INITIAL_DURATION = 3;

    var Status = function(opts) {
        opts = opts || {};
        this.type = opts.type || Status.DESPERATE;
        // The name of the character the status is directed toward.
        this.directedToward = opts.directedToward || "";

        //The how long the status will be in effect after it is placed
        this.initialDuration = opts.initialDuration || DEFAULT_INITIAL_DURATION;
        //How long the status has before it is removed.
        this.remainingDuration = opts.remainingDuration || this.initialDuration;

    }
        Status.isStatusInCategory = function(statusID, catID) {
           Status.CATEGORIES[catID].forEach(function(sID) {
                if (sID === statusID) {
                    return true;
                }
            });
            return false;
        }

        /**
         * Returns a status name when called with a status constant.
         *
         * @param	n	A status numeric representation.
         * @return The String representation of the status denoted by the first
         * parameter or an empty string if the number did not match a status.
         */
        Status.getStatusNameByNumber = function (n) {
            switch(n) {
                case Status.CAT_FEELING_BAD:
                    return "cat: feeling bad";
                case Status.CAT_FEELING_GOOD:
                    return "cat: feeling good";
                case Status.CAT_FEELING_BAD_ABOUT_SOMEONE:
                    return "cat: feeling bad about someone";
                case Status.CAT_FEELING_GOOD_ABOUT_SOMEONE:
                    return "cat: feeling good about someone";
                case Status.CAT_REPUTATION_BAD:
                    return "cat: reputation bad";
                case Status.CAT_REPUTATION_GOOD:
                    return "cat: reputation good";
                case Status.EMBARRASSED:
                    return "embarrassed";
                case Status.CHEATER:
                    return "cheater";
                case Status.SHAKEN:
                    return "shaken";
                case Status.DESPERATE:
                    return "desperate";
                case Status.CLASS_CLOWN:
                    return "class clown";
                case Status.BULLY:
                    return "bully";
                case Status.LOVE_STRUCK:
                    return "love struck";
                case Status.GROSSED_OUT:
                    return "grossed out";
                case Status.EXCITED:
                    return "excited";
                case Status.POPULAR:
                    return "popular";
                case Status.SAD:
                    return "sad";
                case Status.ANXIOUS:
                    return "anxious";
                case Status.HONOR_ROLL:
                    return "honor roll";
                case Status.LOOKING_FOR_TROUBLE:
                    return "looking for trouble";
                case Status.GUILTY:
                    return "guilty";
                case Status.FEELS_OUT_OF_PLACE:
                    return "feels out of place";
                case Status.HEARTBROKEN:
                    return "heartbroken";
                case Status.CHEERFUL:
                    return "cheerful";
                case Status.CONFUSED:
                    return "confused";
                case Status.LONELY:
                    return "lonely";
                case Status.HOMEWRECKER:
                    return "homewrecker";
                case Status.HAS_A_CRUSH_ON:
                    return "has a crush on";
                case Status.ANGRY_AT:
                    return "angry at";
                case Status.WANTS_TO_PICK_ON:
                    return "wants to pick on";
                case Status.ANNOYED_WITH:
                    return "annoyed with";
                case Status.SCARED_OF:
                    return "scared of";
                case Status.PITIES:
                    return "pities";
                case Status.ENVIES:
                    return "envies";
                case Status.GRATEFUL_TOWARD:
                    return "grateful toward";
                case Status.TRUSTS:
                    return "trusts";
                case Status.FEELS_SUPERIOR_TO:
                    return "feels superior to";
                case Status.CHEATING_ON:
                    return "cheating on";
                case Status.CHEATED_ON_BY:
                    return "cheated on by";
                case Status.HOMEWRECKED:
                    return "homewrecked";
                case Status.RESIDUAL_POPULAR:
                    return "residual popular";
                default:
                    return "";
            }
        }

        Status.getShortStatusNameByNumber = function(n) {
            switch(n) {
                case Status.CAT_FEELING_BAD:
                    return "feels bad";
                case Status.CAT_FEELING_GOOD:
                    return "feels good";
                case Status.CAT_FEELING_BAD_ABOUT_SOMEONE:
                    return "negative";
                case Status.CAT_FEELING_GOOD_ABOUT_SOMEONE:
                    return "positive";
                case Status.CAT_REPUTATION_BAD:
                    return "bad rep";
                case Status.CAT_REPUTATION_GOOD:
                    return "good rep";
                case Status.EMBARRASSED:
                    return "embarrass";
                case Status.CHEATER:
                    return "cheater";
                case Status.SHAKEN:
                    return "shaken";
                case Status.DESPERATE:
                    return "desperate";
                case Status.CLASS_CLOWN:
                    return "class clown";
                case Status.BULLY:
                    return "bully";
                case Status.LOVE_STRUCK:
                    return "love struck";
                case Status.GROSSED_OUT:
                    return "gross";
                case Status.EXCITED:
                    return "excited";
                case Status.POPULAR:
                    return "popular";
                case Status.SAD:
                    return "sad";
                case Status.ANXIOUS:
                    return "anxious";
                case Status.HONOR_ROLL:
                    return "honors";
                case Status.LOOKING_FOR_TROUBLE:
                    return "trouble";
                case Status.GUILTY:
                    return "guilty";
                case Status.FEELS_OUT_OF_PLACE:
                    return "out of place";
                case Status.HEARTBROKEN:
                    return "heartbroke";
                case Status.CHEERFUL:
                    return "cheerful";
                case Status.CONFUSED:
                    return "confused";
                case Status.LONELY:
                    return "lonely";
                case Status.HOMEWRECKER:
                    return "homewrecker";
                case Status.HAS_A_CRUSH_ON:
                    return "crush on";
                case Status.ANGRY_AT:
                    return "angry at";
                case Status.WANTS_TO_PICK_ON:
                    return "pick on";
                case Status.ANNOYED_WITH:
                    return "annoyed with";
                case Status.SCARED_OF:
                    return "scared of";
                case Status.PITIES:
                    return "pities";
                case Status.ENVIES:
                    return "envies";
                case Status.GRATEFUL_TOWARD:
                    return "grateful";
                case Status.TRUSTS:
                    return "trusts";
                case Status.FEELS_SUPERIOR_TO:
                    return "superior to";
                case Status.CHEATING_ON:
                    return "cheat on";
                case Status.CHEATED_ON_BY:
                    return "cheat on by";
                case Status.HOMEWRECKED:
                    return "homewrecked";
                case Status.RESIDUAL_POPULAR:
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
        Status.getStatusNumberByName = function(name) {
            switch(name.toLowerCase()) {
                case "cat: feeling bad":
                           return Status.CAT_FEELING_BAD;
                case "cat: feeling good":
                           return Status.CAT_FEELING_GOOD;
                case "cat: feeling bad about someone":
                           return Status.CAT_FEELING_BAD_ABOUT_SOMEONE;
                case "cat: feeling good about someone":
                           return Status.CAT_FEELING_GOOD_ABOUT_SOMEONE;
                case "cat: reputation bad":
                           return Status.CAT_REPUTATION_BAD;
                case "cat: reputation good":
                           return Status.CAT_REPUTATION_GOOD;
                case "embarrassed":
                           return Status.EMBARRASSED;
                case "cheater":
                           return Status.CHEATER;
                case "shaken":
                           return Status.SHAKEN;
                case "desperate":
                           return Status.DESPERATE;
                case "class clown":
                           return Status.CLASS_CLOWN;
                case "bully":
                           return Status.BULLY;
                case "love struck":
                           return Status.LOVE_STRUCK;
                case "grossed out":
                           return Status.GROSSED_OUT;
                case "excited":
                           return Status.EXCITED;
                case "popular":
                           return Status.POPULAR;
                case "sad":
                           return Status.SAD;
                case "anxious":
                           return Status.ANXIOUS;
                case "honor roll":
                           return Status.HONOR_ROLL;
                case "looking for trouble":
                           return Status.LOOKING_FOR_TROUBLE;
                case "guilty":
                           return Status.GUILTY;
                case "feels out of place":
                           return Status.FEELS_OUT_OF_PLACE;
                case "heartbroken":
                           return Status.HEARTBROKEN;
                case "cheerful":
                           return Status.CHEERFUL;
                case "confused":
                           return Status.CONFUSED;
                case "lonely":
                           return Status.LONELY;
                case "homewrecker":
                           return Status.HOMEWRECKER;
                case "has a crush on":
                           return Status.HAS_A_CRUSH_ON;
                case "angry at":
                           return Status.ANGRY_AT;
                case "wants to pick on":
                           return Status.WANTS_TO_PICK_ON;
                case "annoyed with":
                           return Status.ANNOYED_WITH;
                case "scared of":
                           return Status.SCARED_OF;
                case "pities":
                           return Status.PITIES;
                case "envies":
                           return Status.ENVIES;
                case "grateful toward":
                           return Status.GRATEFUL_TOWARD;
                case "trusts":
                           return Status.TRUSTS;
                case "feels superior to":
                           return Status.FEELS_SUPERIOR_TO;
                case "cheating on":
                           return Status.CHEATING_ON;
                case "cheated on by":
                           return Status.CHEATED_ON_BY;
                case "homewrecked":
                           return Status.HOMEWRECKED;
                case "residual popular":
                           return Status.RESIDUAL_POPULAR;
                default:
                           return -1;
            }
        }
    //The first ones (through FIRST_NOT_DIRECTED_STATUS are status categories)
    Status.CAT_FEELING_BAD = 0;
    Status.CAT_FEELING_GOOD = 1;
    Status.CAT_FEELING_BAD_ABOUT_SOMEONE = 2;
    Status.CAT_FEELING_GOOD_ABOUT_SOMEONE = 3;
    Status.CAT_REPUTATION_BAD = 4;
    Status.CAT_REPUTATION_GOOD = 5;
    Status.LAST_CATEGORY_COUNT = 5;

    Status.FIRST_NOT_DIRECTED_STATUS = 6;
    Status.EMBARRASSED = 6;
    Status.CHEATER = 7;
    Status.SHAKEN = 8;
    Status.DESPERATE = 9;
    Status.CLASS_CLOWN = 10;
    Status.BULLY = 11;
    Status.LOVE_STRUCK = 12;
    Status.GROSSED_OUT = 13;
    Status.EXCITED = 14;
    Status.POPULAR = 15;
    Status.SAD = 16;
    Status.ANXIOUS = 17;
    Status.HONOR_ROLL = 18;
    Status.LOOKING_FOR_TROUBLE = 19;
    Status.GUILTY = 20;
    Status.FEELS_OUT_OF_PLACE = 21;
    Status.HEARTBROKEN = 22;
    Status.CHEERFUL = 23;
    Status.CONFUSED = 24;
    Status.LONELY = 25;
    Status.HOMEWRECKER = 26;

    Status.FIRST_TO_IGNORE_NON_DIRECTED = 27;
    Status.RESIDUAL_POPULAR = 27;
    Status.FIRST_DIRECTED_STATUS = 28;
    Status.HAS_A_CRUSH_ON = 28; //pink
    Status.ANGRY_AT = 29; //dark red
    Status.WANTS_TO_PICK_ON = 30; //dark orange
    Status.ANNOYED_WITH = 31; //
    Status.SCARED_OF = 32; //dark purple
    Status.PITIES = 33; //light blue
    Status.ENVIES = 34; //green
    Status.GRATEFUL_TOWARD = 35; //bright green
    Status.TRUSTS = 36; //solid blue
    Status.FEELS_SUPERIOR_TO = 37; //brown
    Status.CHEATING_ON = 38; //
    Status.CHEATED_ON_BY = 39; //
    Status.HOMEWRECKED = 40; //

    Status.STATUS_COUNT = 41;
    Status.CATEGORIES = {};

    Status.CATEGORIES[Status.CAT_FEELING_BAD] = [Status.EMBARRASSED, Status.SHAKEN, Status.DESPERATE, Status.GROSSED_OUT, Status.SAD, Status.ANXIOUS, Status.GUILTY, Status.FEELS_OUT_OF_PLACE, Status.HEARTBROKEN, Status.CONFUSED, Status.LONELY];

    Status.CATEGORIES[Status.CAT_FEELING_GOOD] = [Status.LOVE_STRUCK, Status.EXCITED, Status.CHEERFUL];

    Status.CATEGORIES[Status.CAT_FEELING_BAD_ABOUT_SOMEONE] = [Status.ANGRY_AT, Status.ENVIES,Status.WANTS_TO_PICK_ON, Status.ANNOYED_WITH, Status.SCARED_OF, Status.FEELS_SUPERIOR_TO, Status.CHEATED_ON_BY];

    Status.CATEGORIES[Status.CAT_FEELING_GOOD_ABOUT_SOMEONE] = [Status.HAS_A_CRUSH_ON, Status.PITIES, Status.GRATEFUL_TOWARD, Status.TRUSTS];

    Status.CATEGORIES[Status.CAT_REPUTATION_BAD] = [Status.CHEATER, Status.BULLY, Status.HOMEWRECKER];

    Status.CATEGORIES[Status.CAT_REPUTATION_GOOD] = [Status.CLASS_CLOWN, Status.POPULAR, Status.HONOR_ROLL];


    return Status;
});
