define([], function() {
    var Trait = function() {

    }
    Trait.getTraitList = function() {
        var list = [];
        for(var i = Trait.LAST_CATEGORY_COUNT + 1; i < Trait.FIRST_TO_IGNORE; i++) {
            list.push(Trait.getNameByNumber(i));
        }
        return list;
    }

    Trait.CAT_SEXY = 0;
    Trait.CAT_JERK = 1;
    Trait.CAT_NICE = 2;
    Trait.CAT_SHARP = 3;
    Trait.CAT_SLOW = 4;
    Trait.CAT_INTROVERTED = 5;
    Trait.CAT_EXTROVERTED = 6;
    Trait.CAT_CHARACTER_FLAW = 7;
    Trait.CAT_CHARACTER_VIRTUE = 8;
    Trait.CAT_NAMES = 9;
    Trait.CAT_REPUTATION = 10;
    Trait.LAST_CATEGORY_COUNT = 10;
    Trait.ATTENTION_HOG = 11;
    Trait.IMPULSIVE = 12;
    Trait.COLD = 13;
    Trait.KIND = 14;
    Trait.IRRITABLE = 15;
    Trait.LOYAL = 16;
    Trait.LOVING = 17;
    Trait.SYMPATHETIC = 18;
    Trait.MEAN = 19;
    Trait.CLUMSY = 20;
    Trait.CONFIDENT = 21;
    Trait.INSECURE = 22;
    Trait.MOPEY = 23;
    Trait.BRAINY = 24;
    Trait.DUMB = 25;
    Trait.DEEP = 26;
    Trait.SHALLOW = 27;
    Trait.SMOOTH_TALKER = 28;
    Trait.INARTICULATE = 29;
    Trait.SEX_MAGNET = 30;
    Trait.AFRAID_OF_COMMITMENT = 31;
    Trait.TAKES_THINGS_SLOWLY = 32;
    Trait.DOMINEERING = 33;
    Trait.HUMBLE = 34;
    Trait.ARROGANT = 35;
    Trait.DEFENSIVE = 36;
    Trait.HOTHEAD = 37;
    Trait.PACIFIST = 38;
    Trait.RIPPED = 39;
    Trait.WEAKLING = 40;
    Trait.FORGIVING = 41;
    Trait.EMOTIONAL = 42;
    Trait.SWINGER = 43;
    Trait.JEALOUS = 44;
    Trait.WITTY = 45;
    Trait.SELF_DESTRUCTIVE = 46;
    Trait.OBLIVIOUS = 47;
    Trait.VENGEFUL = 48;
    Trait.COMPETITIVE = 49;
    Trait.STUBBORN = 50;
    Trait.DISHONEST = 51;
    Trait.HONEST = 52;
    Trait.OUTGOING = 53;
    Trait.SHY = 54;

    Trait.FIRST_TO_IGNORE = 55;

    Trait.FEMALE = 55;
    Trait.MALE = 56;

    Trait.FIRST_NAME_NUMBER = 57;
    Trait.SIMON = 57;
    Trait.MONICA = 58;
    Trait.OSWALD = 59;
    Trait.NICHOLAS = 60;
    Trait.LIL = 61;
    Trait.NAOMI = 62;
    Trait.BUZZ = 63;
    Trait.JORDAN = 64;
    Trait.CHLOE = 65;
    Trait.CASSANDRA = 66;
    Trait.LUCAS = 67;
    Trait.EDWARD = 68;
    Trait.MAVE = 69;
    Trait.GUNTHER = 70;
    Trait.PHOEBE = 71;
    Trait.KATE = 72;
    Trait.DOUG = 73;
    Trait.ZACK = 74;
    Trait.GRACE = 75;
    Trait.TRIP = 76;
    Trait.LAST_NAME_NUMBER = 76;

    /**
     * Everyone has this trait!
     */
    Trait.ANYONE = 77;

    Trait.FIRST_INVISIBLE = 78;

    Trait.WEARS_A_HAT = 79;
    Trait.MUSCULAR = 80;
    Trait.CARES_ABOUT_FASHION = 81;

    Trait.TRAIT_COUNT = 82;


    Trait.CATEGORIES = {};
    // This block is run once when the class is first accessed
    Trait.CATEGORIES[Trait.CAT_SEXY] = new Array(Trait.SMOOTH_TALKER, Trait.SEX_MAGNET, Trait.RIPPED, Trait.SWINGER);
    Trait.CATEGORIES[Trait.CAT_REPUTATION] = new Array(Trait.RIPPED, Trait.SEX_MAGNET, Trait.WEAKLING);
    Trait.CATEGORIES[Trait.CAT_JERK] = new Array(Trait.MEAN, Trait.COLD, Trait.DOMINEERING, Trait.ARROGANT, Trait.HOTHEAD, Trait.JEALOUS, Trait.VENGEFUL, Trait.COMPETITIVE, Trait.DISHONEST);
    Trait.CATEGORIES[Trait.CAT_NICE] = new Array(Trait.KIND, Trait.LOYAL, Trait.SYMPATHETIC, Trait.HUMBLE, Trait.FORGIVING, Trait.HONEST);
    Trait.CATEGORIES[Trait.CAT_SHARP] = new Array(Trait.CONFIDENT, Trait.BRAINY, Trait.DEEP, Trait.WITTY);
    Trait.CATEGORIES[Trait.CAT_INTROVERTED] = new Array(Trait.SHY, Trait.MOPEY, Trait.INARTICULATE, Trait.AFRAID_OF_COMMITMENT, Trait.TAKES_THINGS_SLOWLY, Trait.HUMBLE, Trait.WEAKLING, Trait.FORGIVING);
    Trait.CATEGORIES[Trait.CAT_EXTROVERTED] = new Array(Trait.WITTY, Trait.IMPULSIVE, Trait.IRRITABLE, Trait.LOVING, Trait.CONFIDENT, Trait.SMOOTH_TALKER, Trait.SEX_MAGNET, Trait.DOMINEERING, Trait.ARROGANT, Trait.HOTHEAD, Trait.COMPETITIVE);
    Trait.CATEGORIES[Trait.CAT_CHARACTER_FLAW] = new Array(Trait.SHY, Trait.ATTENTION_HOG, Trait.IRRITABLE, Trait.CLUMSY, Trait.INSECURE, Trait.DUMB, Trait.SHALLOW, Trait.INARTICULATE, Trait.AFRAID_OF_COMMITMENT, Trait.ARROGANT, Trait.DEFENSIVE, Trait.EMOTIONAL, Trait.JEALOUS, Trait.SELF_DESTRUCTIVE, Trait.OBLIVIOUS, Trait.VENGEFUL, Trait.STUBBORN, Trait.DISHONEST);
    Trait.CATEGORIES[Trait.CAT_CHARACTER_VIRTUE] = new Array(Trait.KIND, Trait.LOYAL, Trait.LOVING, Trait.SYMPATHETIC, Trait.WITTY, Trait.CONFIDENT, Trait.HUMBLE, Trait.HONEST);
    Trait.CATEGORIES[Trait.CAT_NAMES] = new Array(Trait.DOUG, Trait.SIMON, Trait.MONICA, Trait.OSWALD, Trait.ZACK, Trait.NICHOLAS, Trait.LIL, Trait.NAOMI, Trait.BUZZ, Trait.JORDAN, Trait.CHLOE, Trait.CASSANDRA, Trait.LUCAS, Trait.EDWARD, Trait.MAVE, Trait.GUNTHER, Trait.PHOEBE, Trait.KATE);
    Trait.CATEGORIES[Trait.CAT_SLOW] = new Array(Trait.DUMB, Trait.CLUMSY, Trait.OBLIVIOUS);

    Trait.isTraitInCategory = function(traitID, catID) {
        Trait.CATEGORIES[catID].forEach(function(tID) {
            if (tID == traitID) {
                return true;
            }
        });
        return false;
    }

    /**
     * Given the Number representation of a Label, this function
     * returns the String representation of that type. This is intended to
     * be used in UI elements of the design tool.
     * @example <listing version="3.0">
     * Trait.getNameByNumber(Trait.CONFIDENCE); //returns "confidence"
     * </listing>
     * @param	type The Label type as a Number.
     * @return The String representation of the Label type.
     */
    Trait.getNameByNumber = function(type) {
        switch (type) {
            case Trait.CAT_SEXY:
                return "cat: sexy";
            case Trait.CAT_JERK:
                return "cat: jerk";
            case Trait.CAT_NICE:
                return "cat: nice";
            case Trait.CAT_REPUTATION:
                return "cat: reputation";
            case Trait.CAT_SHARP:
                return "cat: sharp";
            case Trait.CAT_INTROVERTED:
                return "cat: introverted";
            case Trait.CAT_EXTROVERTED:
                return "cat: extroverted";
            case Trait.CAT_CHARACTER_FLAW:
                return "cat: character flaw";
            case Trait.CAT_CHARACTER_VIRTUE:
                return "cat: character virtue";
            case Trait.CAT_SLOW:
                return "cat: slow";
            case Trait.CAT_NAMES:
                return "cat: names";

            case Trait.OUTGOING:
                return "outgoing";
            case Trait.SHY:
                return "shy";
            case Trait.ATTENTION_HOG:
                return "attention hog";
            case Trait.IMPULSIVE:
                return "impulsive";
            case Trait.COLD:
                return "cold";
            case Trait.KIND:
                return "kind";
            case Trait.IRRITABLE:
                return "irritable";
            case Trait.LOYAL:
                return "loyal";
            case Trait.LOVING:
                return "loving";
            case Trait.SYMPATHETIC:
                return "sympathetic";
            case Trait.MEAN:
                return "mean";
            case Trait.CLUMSY:
                return "clumsy";
            case Trait.CONFIDENT:
                return "confident";
            case Trait.INSECURE:
                return "insecure";
            case Trait.MOPEY:
                return "mopey";
            case Trait.BRAINY:
                return "brainy";
            case Trait.DUMB:
                return "dumb";
            case Trait.DEEP:
                return "deep";
            case Trait.SHALLOW:
                return "shallow";
            case Trait.SMOOTH_TALKER:
                return "smooth talker";
            case Trait.INARTICULATE:
                return "inarticulate";
            case Trait.SEX_MAGNET:
                return "sex magnet";
            case Trait.AFRAID_OF_COMMITMENT:
                return "afraid of commitment";
            case Trait.TAKES_THINGS_SLOWLY:
                return "takes things slowly";
            case Trait.DOMINEERING:
                return "domineering";
            case Trait.HUMBLE:
                return "humble";
            case Trait.ARROGANT:
                return "arrogant";
            case Trait.DEFENSIVE:
                return "defensive";
            case Trait.HOTHEAD:
                return "hothead";
            case Trait.PACIFIST:
                return "pacifist";
            case Trait.RIPPED:
                return "ripped";
            case Trait.WEAKLING:
                return "weakling";
            case Trait.FORGIVING:
                return "forgiving";
            case Trait.EMOTIONAL:
                return "emotional";
            case Trait.SWINGER:
                return "swinger";
            case Trait.JEALOUS:
                return "jealous";
            case Trait.WITTY:
                return "witty";
            case Trait.SELF_DESTRUCTIVE:
                return "self destructive";
            case Trait.OBLIVIOUS:
                return "oblivious";
            case Trait.VENGEFUL:
                return "vengeful";
            case Trait.COMPETITIVE:
                return "competitive";
            case Trait.STUBBORN:
                return "stubborn";
            case Trait.DISHONEST:
                return "dishonest";
            case Trait.HONEST:
                return "honest";

            case Trait.MALE:
                return "male";
            case Trait.FEMALE:
                return "female";

            case Trait.SIMON:
                return "simon";
            case Trait.MONICA:
                return "monica";
            case Trait.OSWALD:
                return "oswald";
            case Trait.ZACK:
                return "zack";
            case Trait.NICHOLAS:
                return "nicholas";
            case Trait.LIL:
                return "lil";
            case Trait.NAOMI:
                return "naomi";
            case Trait.BUZZ:
                return "buzz";
            case Trait.JORDAN:
                return "jordan";
            case Trait.CHLOE:
                return "chloe";
            case Trait.CASSANDRA:
                return "cassandra";
            case Trait.LUCAS:
                return "lucas";
            case Trait.EDWARD:
                return "edward";
            case Trait.MAVE:
                return "mave";
            case Trait.GUNTHER:
                return "gunter";
            case Trait.PHOEBE:
                return "phoebe";
            case Trait.KATE:
                return "kate";
            case Trait.DOUG:
                return "doug";
            case Trait.GRACE:
                return "grace";
            case Trait.TRIP:
                return "trip";


            case Trait.ANYONE:
                return "anyone";

            case Trait.WEARS_A_HAT:
                return "wears a hat";
            case Trait.MUSCULAR:
                return "muscular";
            case Trait.CARES_ABOUT_FASHION:
                return "cares about fashion";
            default:
                return "trait not declared";
        }
    }

    /**
     * Given the String representation of a Label, this function
     * returns the Number representation of that type. This is intended to
     * be used in UI elements of the design tool.
     * 
     * @example <listing version="3.0">
     * Trait.getNumberByName("cool"); //returns Trait.COOL
     * </listing>
     * 
     * @param	type The Label type as a String.
     * @return The Number representation of the Label type.
     */
    Trait.getNumberByName = function(name) {
        if(name === undefined) { return -1; }
        switch (name.toLowerCase()) {
            case "cat: sexy":
                       return Trait.CAT_SEXY;
            case "cat: jerk":
                       return Trait.CAT_JERK;
            case "cat: nice":
                       return Trait.CAT_NICE;
            case "cat: sharp":
                       return Trait.CAT_SHARP;
            case "cat: reputation":
                       return Trait.CAT_REPUTATION;		
            case "cat: introverted":
                       return Trait.CAT_INTROVERTED;		
            case "cat: extroverted":
                       return Trait.CAT_EXTROVERTED;		
            case "cat: character flaw":
                       return Trait.CAT_CHARACTER_FLAW;		
            case "cat: character virtue":
                       return Trait.CAT_CHARACTER_VIRTUE;	
            case "cat: slow":
                       return Trait.CAT_SLOW;
            case "cat: names":
                       return Trait.CAT_NAMES;

            case "outgoing":
                       return Trait.OUTGOING;
            case "shy":
                       return Trait.SHY;
            case "attention hog":
                       return Trait.ATTENTION_HOG;
            case "impulsive":
                       return Trait.IMPULSIVE;
            case "cold":
                       return Trait.COLD;
            case "kind":
                       return Trait.KIND;
            case "irritable":
                       return Trait.IRRITABLE;
            case "loyal":
                       return Trait.LOYAL;
            case "loving":
                       return Trait.LOVING;
            case "sympathetic":
                       return Trait.SYMPATHETIC;
            case "mean":
                       return Trait.MEAN;
            case "clumsy":
                       return Trait.CLUMSY;
            case "confident":
                       return Trait.CONFIDENT;
            case "insecure":
                       return Trait.INSECURE;
            case "mopey":
                       return Trait.MOPEY;
            case "brainy":
                       return Trait.BRAINY;
            case "dumb":
                       return Trait.DUMB;
            case "deep":
                       return Trait.DEEP;
            case "shallow":
                       return Trait.SHALLOW;
            case "smooth talker":
                       return Trait.SMOOTH_TALKER;
            case "inarticulate":
                       return Trait.INARTICULATE;
            case "sex magnet":
                       return Trait.SEX_MAGNET;
            case "afraid of commitment":
                       return Trait.AFRAID_OF_COMMITMENT;
            case "takes things slowly":
                       return Trait.TAKES_THINGS_SLOWLY;
            case "domineering":
                       return Trait.DOMINEERING;
            case "humble":
                       return Trait.HUMBLE;
            case "arrogant":
                       return Trait.ARROGANT;
            case "defensive":
                       return Trait.DEFENSIVE;
            case "hothead":
                       return Trait.HOTHEAD;
            case "pacifist":
                       return Trait.PACIFIST;
            case "ripped":
                       return Trait.RIPPED;
            case "weakling":
                       return Trait.WEAKLING;
            case "forgiving":
                       return Trait.FORGIVING;
            case "emotional":
                       return Trait.EMOTIONAL;
            case "swinger":
                       return Trait.SWINGER;
            case "jealous":
                       return Trait.JEALOUS;
            case "witty":
                       return Trait.WITTY;
            case "self destructive":
                       return Trait.SELF_DESTRUCTIVE;
            case "oblivious":
                       return Trait.OBLIVIOUS;
            case "vengeful":
                       return Trait.VENGEFUL;
            case "competitive":
                       return Trait.COMPETITIVE;
            case "stubborn":
                       return Trait.STUBBORN;
            case "dishonest":
                       return Trait.DISHONEST;
            case "honest":
                       return Trait.HONEST;
            case "male":
                       return Trait.MALE;
            case "female":
                       return Trait.FEMALE;



            case "simon":
                       return Trait.SIMON;
            case "monica":
                       return Trait.MONICA;
            case "oswald":
                       return Trait.OSWALD;
            case "zack":
                       return Trait.ZACK;
            case "nicholas":
                       return Trait.NICHOLAS;
            case "lil":
                       return Trait.LIL;
            case "naomi":
                       return Trait.NAOMI;
            case "buzz":
                       return Trait.BUZZ;
            case "jordan":
                       return Trait.JORDAN;
            case "chloe":
                       return Trait.CHLOE;
            case "cassandra":
                       return Trait.CASSANDRA
            case "lucas":
                           return Trait.LUCAS;
            case "edward":
                           return Trait.EDWARD;
            case "mave":
                           return Trait.MAVE;
            case "gunter":
                           return Trait.GUNTHER;
            case "phoebe":
                           return Trait.PHOEBE;
            case "kate":	
                           return Trait.KATE;
            case "doug":
                           return Trait.DOUG;
            case "grace":
                           return Trait.GRACE;
            case "trip":
                           return Trait.TRIP;

            case "anyone":
                           return Trait.ANYONE;

            case "wears a hat":
                           return Trait.WEARS_A_HAT;
            case "muscular":
                           return Trait.MUSCULAR;
            case "cares about fashion":
                           return Trait.CARES_ABOUT_FASHION;
            default:
                           return -1;
        }
    }
    return Trait;
});
