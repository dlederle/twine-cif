var CiFState;//GLOBAL FOR DEBUGGING
//Tool for Authoring CiF data
define(['jquery', 'CiFSingleton'], function($, CiFSingleton) {

    var currentNetworkID = 0;
    var CiFAuthoring = function() {
        var CiF = CiF || CiFSingleton.getInstance();
        CiFState = {};
        CiFState.Cast = [];
        CiFState.SocialGamesLibrary = [];

        //Holds functions to build CiF classes
        var build = {};

        var traitSelector = function() {
            var $traitSelector = $('<select id="traits">');
            CiF.traits.forEach(function(trait) {
                $traitSelector.append('<option>' + trait + '</option>');
            });
            return $traitSelector;
        }

        var display = function($list, data, msg) {
            msg = msg || "";
            console.log("displaying", data);
            $list.children().remove();
            $list.append("<h2>" + msg + "</h2>");
            data.forEach(function(el, i, arr) {
                var li = $('<li>');
                switch(typeof el) {
                    case "object":
                        for(var key in el) {
                            li.append("<br>");
                            li.append(key + ": " + el[key]);
                        }
                        break;
                    default:
                        li.append(el.toString());
                }
                //TODO: add button instead of click on li
                li.click(function(e) {
                    $(this).remove();
                    arr = arr.splice(i, 1);
               });

                $list.append(li);
            });
        }

        var clearMain = function(klass) {
            $('#main').children().remove();
            if(klass) {
                $('#main').append(build[klass]());
            }
        }
        var buildClass = function(eventObj) {
            var klass = eventObj.currentTarget.value;
            clearMain(klass);
        }

        var classList = function() {
            var list = $('<select id="classList">');
            list.append('<option>SocialGame</option>');
            list.append('<option>Character</option>');
            list.append('<option>SocialFactsDB</option>');
            list.append('<option>SocialNetworks</option>');
            list.append('<option>CulturalKB</option>');
            return list;
        }

        var buildUI = function() {
            $('body').append('<div id="container" class="row"/>');
            $('#container').append('<div id="sidebar" class="span3"/>');
            $('#container').append('<div id="main" class="row"/>');

            //Sidebar
            $('#sidebar').append('<h2>CiF Authoring</h2>');
            $('#sidebar').append(classList());
            $('#sidebar').append($('<ul id="cast">'));
            $('#classList').change(buildClass).change();

            //Main
        }


        build.Character = function(cast, character) {
            console.log("and now we build our Character");

            cast = cast || CiFState.Cast;
            character = character || {};
            character.characterName = character.characterName || "Character Name";
            character.traits = character.traits || [];
            character.networkID = character.networkID || currentNetworkID++;

            var $cast = $('#cast');
            display($cast, cast, "Current Cast");

            var $charMaker = $('<div id="charMaker" class="span8">');
            $charMaker.append('<h1>Make a new Character</h1>');
            $charMaker.append('<label>Character Name</label>');
            $charMaker.append('<input id="charName" placeholder="Character Name">');

            $charMaker.append(build.Traits(character.traits));

            var $save = $('<button class="btn" id="makeChar">Save Character</button>').click(function(e) {
                e.preventDefault();

                character.characterName = $('#charName')[0].value;
                var duped = false;
                cast.forEach(function(ch) {
                    if(ch.networkID === character.networkID ||
                       ch.characterName === character.characterName) {
                        duped = true;
                    }
                });
                if(!duped) {
                    cast.push(character);
                }
                duped = false;
                display($cast, cast, "Current Cast");
            });

            var $newChar = $('<button class="btn" id="newChar">New Character</button>').click(function(e) {
                e.preventDefault();
                clearMain("Character");
            });

            $charMaker.append($save);
            $charMaker.append($newChar);
            return $charMaker;
        }

        build.SocialGame = function(sgl, sg) {
            console.log("and now we build our SocialGame!");
            sg = sg || {};
            sg.name = sg.name || "Name Here";
            sg.preconditions = sg.preconditions || [];
            sg.initiatorIRS = sg.initiatorIRS || [];
            sg.responderIRS = sg.responderIRS || [];
            sg.effects = sg.effects || [];

            sgl = sgl || CiFState.SocialGamesLibrary;

            //Two column main div

            var $sgMain =$('<div class="span8">');
            var $sgRow = $('<div id="sg-container" class="row">');
            var $sgLeft = $('<div id="sgMaker" class="pull-left span4">');
            var $sgRight = $('<div class="span4">');

            $sgLeft.append('<h1>Make a new Social Game</h1>');

            //Name
            $sgLeft.append('<label>Name of Social Game</label>');
            $sgLeft.append('<input id="sgName" placeholder=' + sg.name + '>');

            var $preconditionsMaker = $('<div class="well">');
            $preconditionsMaker.append('<h4>Add Preconditions</h4>');
            $preconditionsMaker.append('<p>Preconditions is a list of Rules</p>');
            $preconditionsMaker.append(build.Rule(sg.preconditions));
            $sgLeft.append($preconditionsMaker);


            var $initiatorIRS = $('<div class="well">');
            $initiatorIRS.append("<h4>Build the Initiator\'s IRS</h4>");
            $sgLeft.append($initiatorIRS);


            var $responderIRS= $('<div class="well">');
            $responderIRS.append("<label>Build the Responders\'s IRS</label>");
            $sgLeft.append($responderIRS);

            var $effects= $('<div class="well">');
            $effects.append("<label>Build the list of Effects</label>");
            $sgLeft.append($effects);

            //Lists
            var $preList = $('<ul>');
            $sgRight.append($preList);
            display($preList, sg.preconditions, "Saved Preconditions");

            var $iIRS = $('<ul>');
            $sgRight.append($iIRS);
            display($iIRS, sg.initiatorIRS, "Saved i-IRS");

            var $rIRS = $('<ul>');
            $sgRight.append($rIRS);
            display($rIRS, sg.responderIRS, "Saved r-IRS");

            var $effects = $('<ul>');
            $sgRight.append($effects);
            display($effects, sg.effects, "Saved effects");

            $sgRow.append($sgLeft);
            $sgRow.append($sgRight);
            $sgMain.append($sgRow);
            return $sgMain;
        }
        build.CulturalKB = function() {
            console.log("and now we build our CulturalKB!");
        }
        build.SocialNetworks = function() {
            console.log("and now we build our SocialNetworks!");
        }
        build.SocialFactsDB = function() {
            console.log("and now we build our SocialFactsDB!");
        }
        build.Rule = function(rulesList, rule) {
            console.log("and now we build our Rule!");

            rulesList = rulesList || new Error("Provide a Rules List");
            rule = rule || {};
            rule.name = rule.name || "Name of Rule";
            rule.predicates = rule.predicates || [];

            var $ruleForm = $('<form id="ruleForm">');

            $ruleForm.append('<label>Name of Rule</label>');
            $ruleForm.append('<input id="ruleName" placeholder=' + rule.name + '>');

            $ruleForm.append(build.Predicate(rule.predicates));

            return $ruleForm
        }

        build.Traits = function(currTraits) {
            console.log("and now we build our Traits!");

            var $currTraits = $('<ul id="currTraits">');
            var $traitForm = $('<form id="traitAdder">');

            $traitForm.append('<label>Add Traits</label>');
            $traitForm.append(traitSelector());
            $traitForm.append('<button class="btn"id="addTrait">Add Trait</button>').submit(function(e) {
                e.preventDefault();
                var val = e.originalEvent.currentTarget[0].value;
                if(currTraits.indexOf(val) === -1) {
                    currTraits.push(val);
                    display($currTraits, currTraits);
                }
            });
            $traitForm.append($currTraits);
            return $traitForm;
        }

        build.Predicate = function(currPreds, pred) {
            var predMaker = function(attrs, p) {
                var $maker = $('#predMaker');
                $maker.children().remove();
                attrs.forEach(function(attr) {
                    $maker.append($('<label>Enter ' + attr + '</label>'));
                    var $input;
                    switch(attr) {
                        case "primary":
                        case "secondary":
                        case "tertiary":
                              $input = $('<select>');
                              $input.append('<option></option>');
                              $input.append('<option>initiator</option>');
                              $input.append('<option>responder</option>');
                              break;
                        case "trait":
                              $input = traitSelector();
                              break;
                        case "negated":
                              $input = $('<select>');
                              $input.append('<option>false</option>');
                              $input.append('<option>true</option>');
                              break;
                        case "networkType":
                              $input = $('<select>');
                              $input.append('<option></option>');
                              $input.append('<option>cool</option>');
                              $input.append('<option>buddy</option>');
                              $input.append('<option>romance</option>');
                              break;
                        case "comparator":
                              $input = $('<select>');
                              $input.append('<option>lessthan</option>');
                              $input.append('<option>greaterthan</option>');
                              $input.append('<option>averageopinion</option>');
                              $input.append('<option>friendsopinion</option>');
                              $input.append('<option>datingopinion</option>');
                              $input.append('<option>enemiesopinion</option>');
                              break;

                              break;
                        default:
                            $input = $('<input id="' + attr + '"></input>')
                    }
                    $input.attr = attr;
                    $input.change(function() {
                        p[$input.attr] = this.value;
                    });
                    $maker.append($input)
                });

                return $maker;
            }

            console.log("and now we build our Predicate!");
            currPreds = currPreds || new Error("Pred list please");
            pred = pred || {};
            pred.type = pred.type || "";
            var typeList = ["SFDB label", "trait", "network", "status", "relationship"];
            pred.primary = pred.primary || "";

            var $currPreds = $('<ul id="currPreds">');
            var $predForm = $('<form id="predAdder">');
            $predForm.append($currPreds);
            display($currPreds, currPreds, "Predicates:");

            $predForm.append('<label>Predicate type:</label>');
            var $types = $('<select id="predTypes">');
            $types.append('<option></option>');
            typeList.forEach(function(type) {
                $types.append('<option>' + type + '</option>');
            });
            $predForm.append($types);

            var $maker = $('<div id="predMaker">');
            $predForm.append($maker);
            $types.click(function() {
                switch(this.value) {
                    case "SFDB label":
                        //console.log("SFDB label");
                        $maker.replaceWith(predMaker(["primary", "secondary", "label", "negated"], pred));
                        pred.isSFDB = true;
                        pred.window = 0;
                        break;
                    case "trait":
                        //console.log("trait");
                        $maker.replaceWith(predMaker(["trait", "primary", "secondary", "negated"], pred));
                        pred.isSFDB = false;
                        pred.window = 0;
                        break;
                    case "network":
                        //console.log("network");
                        $maker.replaceWith(predMaker(["networkType", "primary", "secondary", "value", "comparator", "negated"], pred));
                        pred.isSFDB = false;
                        pred.window = 0;
                        break;
                    case "status":
                        //console.log("status");
                        $maker.replaceWith(predMaker(["status", "primary", "secondary", "negated"], pred));
                        pred.isSFDB = false;
                        pred.window = 0;
                        break;
                    case "relationship":
                        //console.log("relationship");
                        $maker.replaceWith(predMaker(["relationship", "primary", "secondary", "negated"], pred));
                        pred.isSFDB = false;
                        pred.window = 0;
                        break;
                }
                pred.type = this.value;
            });

            $predForm.append('<button class="btn" id="addPred">Add Predicate</button>').submit(function(e) {
                e.preventDefault();
                //Collect data
                console.log("adding!");

                if(currPreds.indexOf(pred) === -1) {
                    currPreds.push(pred);
                    display($currPreds, currPreds, "Predicates:");
                    pred = {};
                }
            });

            return $predForm;
        }

        buildUI();
    }
    return CiFAuthoring;
});
