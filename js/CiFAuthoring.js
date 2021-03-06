var _CiFState;//GLOBAL FOR DEBUGGING
//Tool for Authoring CiF data
define(['jquery', 'CiFSingleton'], function($, CiFSingleton) {

    var currentNetworkID;
    var CiFAuthoring = function() {
        var CiF = CiF || CiFSingleton.getInstance();
        _CiFState = _CiFState || {};
        _CiFState.Cast = _CiFState.Cast || [];
        currentNetworkID = _CiFState.Cast.length;
        _CiFState.SocialGamesLib = _CiFState.SocialGamesLib|| [];
        _CiFState.SocialNetworks = _CiFState.SocialNetworks;
        if(_CiFState.SocialNetworks === undefined) {
            _CiFState.SocialNetwork = [];
            ["cool", "romance", "buddy"].forEach(function(type) {
                var network = {};
                network.numChars = currentNetworkID;
                network.type = type;
                network.edges = [];
                _CiFState.SocialNetworks.push(network);
            });
        }
        _CiFState.CulturalKB = _CiFState.CulturalKB || [];
        _CiFState.SocialFactsDB = _CiFState.SocialFactsDB;
        if(_CiFState.SocialFactsDB === undefined) {
            _CiFState.SocialFactsDB = {"contexts":[]};
        }


        var capitalize = function(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }

        var traitSelector = function() {
            var $traitSelector = $('<select id="traits">');
            CiF.traits.forEach(function(trait) {
                $traitSelector.append('<option>' + trait + '</option>');
            });
            return $traitSelector;
        }

        var selectRange = function(range) {
            var $select = $('<select>');
            $select.append('<option>');
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
                        li.append("<br>");
                        li.append(JSON.stringify(el));
                        break;
                    default:
                        li.append(el.toString());
                }
                li.append($('<p>Remove</p>').click(function(e) {
                    li.remove();
                    arr = arr.splice(i, 1);
                }));
                /*
                 * TODO: Gonna require some refactoring to work
                if(typeof el === "object") {
                    li.append($('<p>Edit</p>').click(function(e) {
                        var klass = Object.keys(el)[0];
                        console.log(build[klass](data, $list, el));
                    }));
                }
                */

                $list.append(li);
            });
        }

        //Holds functions to build CiF classes
        var build = {};

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
            list.append('<option>Cast</option>');
            list.append('<option>SocialGamesLib</option>');
            list.append('<option>SocialFactsDB</option>');
            list.append('<option>CulturalKB</option>');
            list.append('<option>SocialNetworks</option>');
            return list;
        }

        var buildUI = function(pane) {
            $('body').children('div').remove();
            $('body').append('<div id="container" class="row"/>');
            $('#container').append('<div id="sidebar" class="span3"/>');
            $('#container').append('<div id="main" class="row"/>');
            var $log = $('<div id="errorLog">');
            $('#sidebar').append($log);
            pane();
        }

        var buildAuthoringUI = function() {
            //Sidebar
            $('#sidebar').append('<h2>CiF Authoring</h2>');
            $('#sidebar').append(classList());
            $('#classList').change(buildClass).change();
            $('#sidebar').append($('<button type="button">Switch to Testing</button>').click(function(e) {
                buildUI(buildTestUI);
            }));
        }

        var buildTestUI = function() {
            $('#sidebar').append('<h2>CiF Testing</h2>');
            var $holder = $('<div class="span8">').append('<h1>Load and test your data</h1>');
            $('#main').append($holder);
            $('#sidebar').append($('<button type="button">Switch to Authoring</button>').click(function(e) {
                buildUI(buildAuthoringUI);
            }));
            $('#sidebar').append($('<button>Load Current State into CiF</button>').click(function(e) {
                CiF.loadJSON(_CiFState);
                $holder.append(testSG());
            }));

        }

        var testSG = function() {
            var $tester = $('<div>');
            $tester.append('<h3>Test a Social Game</h3>');

            var $sgSelect = $('<select>');
            CiF.socialGamesLib.games.forEach(function(game) {
                $sgSelect.append('<option>' + game.name + '</option>');
            });
            $tester.append($sgSelect);

            $tester.append("<label>Choose initiator</label>");
            var $initiatorSelect = $('<select>');
            $initiatorSelect.append('<option>');
            CiF.cast.characters.forEach(function(chara) {
                $initiatorSelect.append('<option>' + chara.characterName+ '</option>');
            });
            $tester.append($initiatorSelect);


            $tester.append("<label>Choose responder</label>");
            var $responderSelect = $('<select>');
            $responderSelect.append('<option>');
            CiF.cast.characters.forEach(function(chara) {
                $responderSelect.append('<option>' + chara.characterName + '</option>');
            });
            $tester.append($responderSelect);

            $tester.append($('<button>Test Game</button>').click(function(e) {
                var name = $sgSelect[0].value;
                var initiatorName = $initiatorSelect[0].value;
                var responderName = $responderSelect[0].value;
                var initiator = CiF.cast.getCharByName(initiatorName);
                var responder = CiF.cast.getCharByName(responderName);

                $tester.append($('<h4>Average Opinions about characters before game</h4>'));
                $tester.append(getOpinions(initiator, responder));
                playSG(name, initiator, responder);
                $tester.append($('<h4>Average Opinions about characters after game</h4>'));
                $tester.append(getOpinions(initiator, responder));
            }));
            return $tester;
        }

        var getOpinions = function(initiator, responder) {
            var $table = $('<table>');
            var networks = [
                {name: "Buddy", network: CiF.buddyNetwork},
                {name: "Cool", network: CiF.coolNetwork},
                {name: "Romance", network: CiF.romanceNetwork}
            ];
            networks.forEach(function(network) {
                $table.append($('<th>' + network.name + '</th>'));
                var $body = $('<tbody>');
                $body.append('<tr><td>Initiator: ' + network.network.getAverageOpinion(initiator.networkID) + '</td></tr>');
                $body.append('<tr><td>Responder: ' + network.network.getAverageOpinion(responder.networkID) + '</td></tr>');
                $table.append($body);
            });
            return $table;
        }

        var playSG = function(game, initiator, responder) {
            try {
                CiF.playGameByName(game, initiator, responder);
            } catch(e) {
                console.log(e.stack);
                $('#errorLog').append(e.stack);
            }
        }

        build.SocialGamesLib= function(sgl) {
            sgl = sgl || _CiFState.SocialGamesLib;
            var $sgl= $('<div class="row">');
            var $right = $('<div class="span4">').append($('<h1>Create the Social Games Library</h1>'));
            var $left = $('<div class="span4">');
            var $list = $('<ul>');
            $left.append($list);

            display($list, sgl, "Current Social Games");
            $right.append(build.SocialGame(sgl, $list));

            $sgl.append($right).append($left);
            return $('<div class="span8">').append($sgl);
        }

        build.SocialNetworks = function() {
            console.log("and now we build our SocialNetworks!");
            var numChars = _CiFState.Cast.length;
            if(numChars < 2) {
                var tmp = $('<h1>Social Networks</h1>');
                tmp.append($("<h2>Please add some Characters to the Cast</h2>"));
                return tmp;
            }
            var buildNetwork = function(network, $list) {
                display($list, network.edges, capitalize(network.type), "h4");
                var $builder = $('<form>');
                //Make edge with from: to: value:
                var edge = {};
                $builder.append($('<label>' + capitalize(network.type) + ' Network</label>'));
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

                var $button = $('<button type="button">Add Edge</button>').click(function(e) {
                    //So brittle
                    edge.from = parseInt($builder[0][0].value);
                    edge.to = parseInt($builder[0][1].value);
                    edge.value = parseInt($builder[0][2].value);
                    if(edge.from == NaN || edge.to == NaN || edge.value == NaN) {}
                    if(network.edges.indexOf(edge) === -1) {
                        network.edges.push(edge);
                        display($list, network.edges, capitalize(network.type), "h4");
                        edge = {};
                        $builder.replaceWith(buildNetwork(network, $list));
                    }
                });
                $builder.append($button);
                return $builder;
            }
            var $sns = $('<div class="row">');
            var $right = $('<div class="span4">').append($('<h1>Construct connections in the Social Networks</h1>'));
            var $lists = $('<div class="span4">');
            _CiFState.SocialNetworks.forEach(function(type) {
                type.numChars = numChars;
                var $list = $('<ul>');
                $lists.append($list);
                $right.append(buildNetwork(type, $list));
            });

            $sns.append($right);
            $sns.append($lists);
            return $('<div class="span8">').append($sns)
        }

        build.CulturalKB = function(ckb) {
            console.log("and now we build our CulturalKB!");
            ckb = ckb || _CiFState.CulturalKB;
            var $ckb = $('<div class="row">');
            var $right = $('<div class="span4">').append($('<h1>Construct the Cultural Knowledge Base</h1>'));
            var $left = $('<div class="span4">');
            var $list = $('<ul>');
            $left.append($list);

            $right.append(build.Proposition(ckb, $list));

            $ckb.append($right).append($left);
            return $('<div class="span8">').append($ckb);
        }

        build.SocialFactsDB = function(sfdb) {
            console.log("and now we build our SocialFactsDB!");
            sfdb = sfdb || _CiFState.SocialFactsDB;
            var $sfdb = $('<div class="row">');
            var $right = $('<div class="span4">').append($('<h1>Construct the Social Facts Data Base</h1>'));
            var $left = $('<div class="span4">');
            var $list = $('<ul>');
            $left.append($list);

            $right.append(build.Context(sfdb.contexts, $list));

            $sfdb.append($right).append($left);
            return $('<div class="span8">').append($sfdb);
        }

        build.Cast = function() {
          var $castContainer = $('<div class="row">');
          var $charMaker = $('<div class="span4">');
          $charMaker.append($("<h1>Construct the Cast</h1>"));
          var $charList = $('<div class="span4">').append('<ul id="list">');

          $charMaker.append(build.Character($('<div id="charMaker">'), $charList, _CiFState.Cast));
          $castContainer.append($charMaker);
          $castContainer.append($charList);
          return $('<div class="span8">').append($castContainer);
        }

        build.Character = function($left, $right, cast, character) {
            console.log("and now we build our Character");
            cast = cast || _CiFState.Cast;
            character = character || {};
            character.characterName = character.characterName || "Character Name";
            character.traits = character.traits || [];
            character.networkID = character.networkID || currentNetworkID++;
            var $list = $right.children('#list');
            display($list, cast, "Current Cast");

            $left.append('<h3>Make a new Character</h3>');
            $left.append('<label>Character Name</label>');
            $left.append('<input id="charName" placeholder="Character Name">');

            $left.append(build.Traits(character.traits));

            var $save = $('<button type="button" class="btn" id="makeChar">Save Character</button>').click(function(e) {
                //e.preventDefault();

                character.characterName = $('#charName')[0].value;
                if(cast.indexOf(character) === -1) {
                    cast.push({"Character": character});
                }
                display($list, cast, "Current Cast");
            });

            var $newChar = $('<button type="butotn" class="btn" id="newChar">New Character</button>').click(function(e) {
                e.preventDefault();
                $left.children().remove();
                $left.append(build.Character($left, $right));
            });

            $left.append($save);
            $left.append($newChar);
            return $left;
        }

        build.SocialGame = function(sgl, $list, sg) {
            var $tmp = $('<div>').append($('<h1>Under construction...</h1>'));
            return $tmp;
            console.log("and now we build our SocialGame!");
            sg = sg || {};
            sg.name = sg.name || "Name Here";
            sg.preconditions = sg.preconditions || [];
            sg.initiatorIRS = sg.initiatorIRS || [];
            sg.responderIRS = sg.responderIRS || [];
            sg.effects = sg.effects || [];
            sgl = sgl || _CiFState.SocialGamesLib;

            var $form = $('<form>');
            $form.append('<label>Make a new Social Game</label>');

            $form.append('<label>Name of Social Game</label>');
            $form.append('<input id="sgName" placeholder=' + sg.name + '>');

            var $preconditionsMaker = $('<div class="well">');
            $preconditionsMaker.append('<label>Add Preconditions</label>');
            $preconditionsMaker.append('<p>Preconditions is a list of Rules</p>');
            $preconditionsMaker.append(build.Rule(sg.preconditions));
            var $preconditions = $('<ul>');
            $preconditionsMaker.append($preconditions);
            display($preconditions, sg.preconditions, "Saved Preconditions", "p");
            $form.append($preconditionsMaker);

            var $initiatorIRS = $('<div class="well">');
            $initiatorIRS.append("<label>Build the Initiator\'s IRS</label>");
            $initiatorIRS.append(build.IRS(sg.initiatorIRS));
            var $iIRS = $('<ul>');
            $initiatorIRS.append($iIRS);
            display($iIRS, sg.initiatorIRS, "Saved i-IRS", "p");
            $form.append($initiatorIRS);

            var $responderIRS= $('<div class="well">');
            $responderIRS.append("<label>Build the Responders\'s IRS</label>");
            $responderIRS.append(build.IRS(sg.responderIRS));
            var $rIRS = $('<ul>');
            $responderIRS.append($rIRS);
            display($rIRS, sg.responderIRS, "Saved r-IRS", "p");
            $form.append($responderIRS);


            var $effects= $('<div class="well">');
            $effects.append("<label>Build the list of Effects</label>");
            $effects.append(build.Effect(sg.effects));
            var $eList = $('<ul>');
            $effects.append($eList);
            display($eList, sg.effects, "Saved effects", "p");
            $form.append($effects);

            var $button = $('<button type="button">').click(function() {
                console.log("NOTHING IS HAPPENING");
                console.log(sg);
            });

            $form.append($button);
            return $form;
        }

        build.Effect = function(list) {

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
                    irs.push({"InfluenceRule": ir});
                    ir = {};
                    display($irsList, irs, "Current IRs in Set", "p");
                }
            });

            $irs.append(build.Rule(irs, ir, $button));
            return $irs;
        }

        build.Locution = function(list, l) {

        }

        build.LineOfDialogue = function(list, l) {

        }

        build.Rule = function(rulesList, rule, $button) {
            //console.log("and now we build our Rule!");

            rulesList = rulesList || new Error("Provide a Rules List");
            rule = rule || {};
            rule.name = rule.name || "Name of Rule";
            rule.predicates = rule.predicates || [];

            var makeForm = function() {
                var $ruleForm = $('<form id="ruleForm">');
                $ruleForm.append('<label>Name of Rule</label>');
                $ruleForm.append('<input id="ruleName" placeholder=' + rule.name + '>');
                $ruleForm.append(build.Predicate(rule.predicates));

                //Passing in the button allows IRS to overwrite
                $button = $button || $('<button type="button" class="btn" id="addRule">Save Rule</button>').click(function(e) {
                    e.preventDefault();

                    if(rulesList.indexOf(rule) === -1) {
                        rulesList.push({"Rule": rule});
                        rule = {};
                        $ruleForm.children().remove();
                        $ruleForm = makeForm();
                    }
                });
                $ruleForm.append($button);

                return $ruleForm;
            }

            return makeForm();
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
                    display($currTraits, currTraits, "Traits:", "p");
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
            var newForm = function() {
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

                $button = $button || $('<button type="button" class="btn" id="addPred">Save Predicate</button>').click(function(e) {
                    //Collect data
                    if(currPreds.indexOf(pred) === -1) {
                        currPreds.push({"Predicate": pred});
                        display($currPreds, currPreds, "Predicates:", "p");
                        pred = {};
                        $predForm = newForm();
                    }
                });
                $predForm.append($button);

                return $predForm;
            }
            return newForm();
        }

        build.Context = function(list, $list) {
            list = list || new Error("Context list please");
            display($list, list, "Contexts");
            var ctx = {};
            var $form = $('<form>');
            var types = ["status"];
            var ctxTypeSelector = function() {
                var sel = $('<select>');
                sel.append($('<option>'));
                types.forEach(function(type) {
                    sel.append($('<option>' + capitalize(type) + '</option>'))
                });
                return sel
            }

            var newCtx = function() {
                $form.append($('<label>Select Context type</label>'));
                $form.append(ctxTypeSelector().change(function(){
                    var data = {};
                    switch(this.value) {
                        case "Status":
                            $form.append($('<label>Time:</label>'));
                            $form.append($('<input>').change(function() {
                                data.time = parseInt(this.value);
                            }));
                            data.Predicate = {};
                            $form.append(build.Predicate([], data.Predicate));
                            ctx["StatusContext"] = data;
                            button();
                            break;
                        default:
                    }
                }));
                var button = function() {
                    $form.append($('<button type="button">New Context</button>').click(function(e) {
                        if(list.indexOf(ctx) === -1) {
                            list.push({"StatusContext": ctx});
                            ctx = {};
                            display($list, list, "Contexts");

                            $form.children().remove();
                            $form = newCtx();
                        }
                    }));
                }
                return $form;
            }

            return newCtx();
        }

        build.Proposition = function(list, $list) {
            list = list || new Error("Need a list");
            display($list, list, "Propositions:", "h4");
            var prop = {};
            var $form = $('<form>');

            var newProp = function() {
                $form.append($('<label>type</label>'));
                var $sel = $('<select>');
                $sel.append('<option>');
                $sel.append('<option>subjective</option>');
                $sel.append('<option>truth</option>');
                $form.append($sel.change(function(e) {
                    prop.type = this.value;
                }));
                $form.append($('<label>Head</label>'));
                $form.append($('<input>').change(function(e) {
                    prop.head = this.value;
                }));
                $form.append($('<label>Connection</label>'));
                $form.append($('<input>').change(function(e) {
                    prop.connection = this.value;
                }));
                $form.append($('<label>Tail</label>'));
                $form.append($('<input>').change(function(e) {
                    prop.tail = this.value;
                }));

                var $button = $('<button type="button">Add Proposition</button>').click(function(e) {
                    if(list.indexOf(prop) === -1) {
                        list.push({"Proposition": prop});
                        display($list, list, "Propositions:", "h4");
                        $form.replaceWith(newProp());
                        prop = {};
                    }
                });
                $form.append($button);
                return $form;
            }

            return newProp();
        }

        buildUI(buildAuthoringUI);
    }
    return CiFAuthoring;
});
