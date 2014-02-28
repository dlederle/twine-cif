var CiFState;//GLOBAL FOR DEBUGGING
//Tool for Authoring CiF data
define(['jquery', 'CiFSingleton'], function($, CiFSingleton) {

    var currentNetworkID = 0;
    var CiFAuthoring = function() {
        var CiF = CiF || CiFSingleton.getInstance();
        CiFState = {};
        CiFState.Cast = [];
        CiFState.SocialGamesLibrary = [];
        CiFState.SocialNetworks = [];
        CiFState.CulturalKB = [];
        CiFState.SocialFactsDB = {};
        CiFState.SocialFactsDB.contexts = [];


        //Holds functions to build CiF classes
        var build = {};

        var traitSelector = function() {
            var $traitSelector = $('<select id="traits">');
            CiF.traits.forEach(function(trait) {
                $traitSelector.append('<option>' + trait + '</option>');
            });
            return $traitSelector;
        }

        var selectRange = function(range) {
            var $select = $('<select>');
            for(var i=0; i<range; i++) {
                $select.append('<option>' + i + '</option>');
            }
            return $select;
        }

        var display = function($list, data, msg, tag) {
            tag = tag || "h4";
            msg = msg || "";
            $list.children().remove();
            $list.append("<" + tag + ">" + msg + "</" + tag + ">");
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
            list.append('<option>SocialNetworks</option>');
            list.append('<option>SocialGame</option>');
            list.append('<option>Character</option>');
            list.append('<option>SocialFactsDB</option>');
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

            var $save = $('<button type="button" class="btn" id="makeChar">Save Character</button>').click(function(e) {
                //e.preventDefault();

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

            var $newChar = $('<button type="butotn" class="btn" id="newChar">New Character</button>').click(function(e) {
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
            $initiatorIRS.append(build.IRS(sg.initiatorIRS));
            $sgLeft.append($initiatorIRS);


            var $responderIRS= $('<div class="well">');
            $responderIRS.append(build.IRS(sg.responderIRS));
            $responderIRS.append("<h4>Build the Responders\'s IRS</h4>");
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

        build.IRS = function(irs) {
            irs = irs || new Error("Provide an IRS to build please");
            var ir = {};
            var $irs = $('<div>');
            var $irsList = $('<ul>');
            $irs.append($irsList);
            display($irsList, irs, "Current IRs in Set", "p");
            $irs.append("<p>An Influence Rule is a Rule with a weight attached</p>");

            $irs.append('<label>Weight</label>');
            var $input = $('<input id="irWeight"></input>').change(function() {
                ir.weight = parseInt(this.value);
            });
            $irs.append($input);
            var $button = $('<button type="button" class="btn" id="addIRS">Save IR</button>').click(function() {
                //Collect data

                if(irs.indexOf(ir) === -1) {
                    irs.push(ir);
                    ir = {};
                    display($irsList, irs, "Current IRs in Set", "p");
                }
            });

            $irs.append(build.Rule(irs, ir, $button));
            return $irs;
        }

        //Loading doesn't actually work
        build.SocialNetworks = function(sns) {
            console.log("and now we build our SocialNetworks!");
            var numChars = CiFState.Cast.length;
            var buildNetwork = function(network) {
                var $builder = $('<form>');
                //Make edge with from: to: value:
                var edge = {};
                $builder.append($('<label>' + network.type + '</label>'));
                $builder.append($('<label>From</label>'));
                $builder.append(selectRange(network.numChars).change(function(e) {
                    edge.from = parseInt(this.value);
                }));
                $builder.append($('<label>To</label>'));
                $builder.append(selectRange(network.numChars).change(function(e) {
                    edge.to = parseInt(this.value);
                }));
                $builder.append($('<label>Numeric Value</label>'));
                $builder.append($('<input>').change(function(e) {
                    edge.value = parseInt(this.value);
                }));

                var $button = $('<button type="button">').click(function(e) {
                    console.log(edge);
                });
                $builder.append($button);
                return $builder;
            }
            sns = sns || CiFState.SocialNetworks;

            var $sns = $('<div class="span8">');
            ["cool", "romance", "buddy"].forEach(function(type) {
                var network = {};
                network.type = type;
                network.numChars = numChars;
                network.edges = [];
                sns.push(sns);
                $sns.append(buildNetwork(network));
            });

            return $sns;
        }

        build.CulturalKB = function(ckb) {
            console.log("and now we build our CulturalKB!");
            ckb = ckb || Cast.CulturalKB;
        }

        build.SocialFactsDB = function(sfdb) {
            console.log("and now we build our SocialFactsDB!");
            sfdb = sfdb || Cast.sfdb;
        }

        build.Context = function(ctxList, ctx) {
            ctxList = ctxList || throw new Error("Context list please");
            ctx = ctx || {};

        }

        build.Locution = function(list, l) {

        }

        build.LineOfDialogue = function() {

        }

        build.Rule = function(rulesList, rule, $button) {
            //console.log("and now we build our Rule!");

            rulesList = rulesList || new Error("Provide a Rules List");
            rule = rule || {};
            rule.name = rule.name || "Name of Rule";
            rule.predicates = rule.predicates || [];

            var $ruleForm = $('<form id="ruleForm">');

            $ruleForm.append('<label>Name of Rule</label>');
            $ruleForm.append('<input id="ruleName" placeholder=' + rule.name + '>');

            $ruleForm.append(build.Predicate(rule.predicates));

            //Passing in the button allows IRS to overwrite
            $button = $button || $('<button type="button" class="btn" id="addRule">Save Rule</button>').click(function(e) {
                e.preventDefault();
                //Collect data

                if(rulesList.indexOf(rule) === -1) {
                    rulesList.push(rule);
                    rule = {};
                }
            });
            $ruleForm.append($button);

            return $ruleForm
        }

        build.Traits = function(currTraits) {
            console.log("and now we build our Traits!");

            var $currTraits = $('<ul id="currTraits">');
            var $traitForm = $('<form id="traitAdder">');

            $traitForm.append('<label>Add Traits</label>');
            $traitForm.append(traitSelector());
            $traitForm.append('<button type="button" class="btn"id="addTrait">Add Trait</button>').click(function(e) {
                var val = e.originalEvent.currentTarget[0].value;
                if(currTraits.indexOf(val) === -1) {
                    currTraits.push(val);
                    display($currTraits, currTraits, "p");
                }
            });
            $traitForm.append($currTraits);
            return $traitForm;
        }

        build.Predicate = function(currPreds, pred, $button) {
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
            display($currPreds, currPreds, "Predicates:", "p");

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

            $button = $button || $('<button type="button" class="btn" id="addPred">SavePredicate</button>').click(function(e) {
                //Collect data
                if(currPreds.indexOf(pred) === -1) {
                    currPreds.push(pred);
                    display($currPreds, currPreds, "Predicates:", "p");
                    pred = {};
                }
            });
            $predForm.append($button);

            return $predForm;
        }

        build.Proposition = function(pList, p) {
            pList = pList || throw new Error("Need a list");
            p = p || {};
        }

        buildUI();
    }
    return CiFAuthoring;
});
