var CiFState;//GLOBAL FOR DEBUGGING
//Tool for Authoring CiF data
define(['jquery', 'CiFSingleton'], function($, CiFSingleton) {

    var currentNetworkID = 0;
    var CiFAuthoring = function() {
        var CiF = CiF || CiFSingleton.getInstance();
        CiFState = {};
        CiFState.Cast = [];

        var build = {};

        var updateList = function($list, data) {
            $list.children().remove();
            data.forEach(function(item, i, arr) {
                var $li = $('<li>' + item.toString() + '</li>').click(function(e) {
                    $(this).remove();
                    arr = arr.splice(i, 1);
                });
                $list.append($li);
            });
        }

        build.Character = function(character) {
            console.log("and now we build our Character");
            var character = character || {};
            var $charMaker = $('<div id="charMaker">');
            $charMaker.append('<h1>Make a new Character</h1>');
            $charMaker.append('<label>Character Name</label>');
            $charMaker.append('<input id="charName" placeholder="Character Name">');

            character.networkID = currentNetworkID++;
            var currTraits = [];
            $charMaker.append(build.Traits(currTraits));

            var $save = $('<button class="btn" id="makeChar">Save Character</button>').click(function(e) {
                e.preventDefault();

                character.characterName = $('#charName')[0].value;
                character.traits = currTraits;
                var duped = false;
                CiFState.Cast.forEach(function(ch) {
                    if(ch.name === character.name) {
                        duped = true;
                    }
                });
                if(!duped) {
                    CiFState.Cast.push(character);
                    console.log(character);
                }
            });

            var $newChar = $('<button class="btn" id="newChar">New Character</button>').click(function(e) {
                e.preventDefault();
                $('#main').children().remove()
                $('#main').append(build["Character"]());
            });

            $charMaker.append($save);
            $charMaker.append($newChar);
            return $charMaker;
        }

        build.SocialGame = function() {
            console.log("and now we build our SocialGame!");
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
        build.Rule = function() {
            console.log("and now we build our Rule!");
        }
        build.Traits = function(currTraits) {
            console.log("and now we build our Traits!");

            var $currTraits = $('<ul id="currTraits">');
            var $traitForm = $('<form id="traitAdder">');

            $traitForm.append('<label>Add Traits</label>');
            var $traitSelector = $('<select id="traits">');

            CiF.traits.forEach(function(trait) {
                $traitSelector.append('<option>' + trait + '</option>');
            });
            $traitForm.append($traitSelector);
            $traitForm.append('<button class="btn"id="addTrait">Add Trait</button>').submit(function(e) {
                e.preventDefault();
                var val = e.originalEvent.currentTarget[0].value;
                if(currTraits.indexOf(val) === -1) {
                    currTraits.push(val);
                    updateList($currTraits, currTraits);
                }
            });
            $traitForm.append($currTraits);
            return $traitForm;
        }
        build.Predicate = function() {
            console.log("and now we build our Predicate!");
        }

        var buildClass = function(eventObj) {
            var klass = eventObj.currentTarget.value;
            $('#main').children().remove()
            $('#main').append(build[klass]());
        }

        var classList = function() {
            var list = $('<select id="classList">');
            list.append('<option>Character</option>');
            list.append('<option>SocialGame</option>');
            list.append('<option>SocialFactsDB</option>');
            list.append('<option>SocialNetworks</option>');
            list.append('<option>CulturalKB</option>');
            return list;
        }


        var buildUI = function() {
            $('body').append('<div id="container" class="row"/>');
            $('#container').append('<div id="sidebar" class="span3"/>');
            $('#container').append('<div id="main" class="span8"/>');

            //Sidebar
            $('#sidebar').append('<h2>CiF Authoring</h2>');
            $('#sidebar').append(classList());
            $('#classList').change(buildClass).change();

            //Main
        }

        buildUI();
    }
    return CiFAuthoring;
});
