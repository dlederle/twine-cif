var _CiFState = _CiFState || {};
_CiFState.Cast = [
{
    "Character": {
        "characterName": "Robert",
        "networkID": 0,
        "traits": [
            "clumsy",
        "sex magnet",
        "confidence"
            ]
    }
},
{
    "Character": {
        "characterName": "Debbie",
        "networkID": 1,
        "traits": [
            "forgiving",
        "confidence"
            ]
    }
},
{
    "Character": {
        "characterName": "Edward",
        "networkID": 2,
        "traits": [
            "domineering",
        "afraid of commitment"
            ]
    }
}
];

_CiFState.CulturalKB = [
{
    "Proposition": {
        "type": "subjective",
            "head": "robert",
            "connection": "likes",
            "tail": "pirates"
    }
},
{
    "Proposition": {
        "type": "subjective",
        "head": "Debbie",
        "connection": "dislikes",
        "tail": "flowers"
    }
},
{
    "Proposition": {
        "type": "truth",
        "head": "pirates",
        "connection": "are",
        "tail": "mean"
    }
},
{
    "Proposition": {
        "type": "subjective",
        "head": "robert",
        "connection": "likes",
        "tail": "flowers"
    }
},
{
    "Proposition": {
        "type": "truth",
        "head": "flowers",
        "connection": "are",
        "tail": "lame"
    }
}
];

_CiFState.SocialFactsDB = {
    "contexts" : [
    {
        "StatusContext": {
            "time": "20",
            "Predicate": {
                "type"    : "status",
                "status"  : "has a crush on",
                "primary"   : "Debbie",
                "secondary"  : "Robert",
                "negated" : false,
                "isSFDB"  : true
            }
        }
    }
    ]
};

_CiFState.SocialGamesLib = [
{
    "SocialGame": {
        "name": "Brag",
            "preconditions": [
            {
                "Rule": {
                    "name": "Initiator must have done some cool action in the past",
                    "predicates" : [
                    {
                        "Predicate": {
                            "type":"SFDB label",
                            "primary":"initiator",
                            "secondary": "initiator",
                            "label": "cool",
                            "window": 0,
                            "negated":false,
                            "isSFDB":true
                        }
                    }
                    ]
                }
            }
        ],
            "initiatorIRS" : [
            {
                "InfluenceRule": {
                    "weight":"15",
                    "name": "Initiator is Confident",
                    "predicates": [
                    {
                        "Predicate": {
                            "type":"trait",
                            "trait":"confidence",
                            "primary":"initiator",
                            "negated":false,
                            "isSFDB":false,
                            "window" : 0
                        }
                    }
                    ]
                }
            },
            {
                "InfluenceRule": {
                    "weight":"20",
                    "name": "Initiator is an Attention Hog",
                    "predicates": [
                    {
                        "Predicate": {
                            "type":"trait",
                            "trait":"attention hog",
                            "primary":"initiator",
                            "negated":false,
                            "isSFDB":false,
                            "window" : 0
                        }
                    }
                    ]
                }
            },
            {
                "InfluenceRule": {
                    "weight":"10",
                    "name": "Initiator and Responder are decently buddies",
                    "predicates": [
                    {
                        "Predicate": {
                            "type":"network",
                            "networkType": "buddy",
                            "primary":"initiator",
                            "secondary": "responder",
                            "comparator": "greaterthan",
                            "value": "39",
                            "negated":false,
                            "isSFDB":false,
                            "window" : 0
                        }
                    }
                    ]
                }
            },
            {
                "InfluenceRule": {
                    "weight":"-20",
                    "name": "Initiator and Responder are not very good buddies",
                    "predicates": [
                    {
                        "Predicate": {
                            "type":"network",
                            "networkType": "buddy",
                            "primary":"initiator",
                            "secondary": "responder",
                            "comparator": "lessthan",
                            "value": 41,
                            "negated":false,
                            "isSFDB":false,
                            "window" : 0
                        }
                    }
                    ]
                }
            },
            {
                "InfluenceRule": {
                    "weight":"-30",
                    "name": "Initiator is Humble",
                    "predicates": [
                    {
                        "Predicate": {
                            "type":"trait",
                            "primary":"initiator",
                            "negated":false,
                            "isSFDB":false,
                            "window" : 0
                        }
                    }
                    ]
                }
            }
        ],
            "responderIRS" : [
            {
                "InfluenceRule": {
                    "weight": "10",
                    "predicates": [
                    {
                        "Predicate": {
                            "type": "network",
                            "networkType": "buddy",
                            "primary": "responder",
                            "secondary": "initiator",
                            "comparator": "greaterthan",
                            "value":"39",
                            "negated": false,
                            "isSFDB": false,
                            "window": 0
                        }
                    }
                    ]
                }
            },
            {
                "InfluenceRule": {
                    "weight":"-30",
                    "predicates": [
                    {
                        "Predicate": {
                            "type":"trait",
                            "trait":"humble",
                            "primary":"responder",
                            "negated":true,
                            "isSFDB":false,
                            "window": 0
                        }
                    }
                    ]
                }
            },
            {
                "InfluenceRule": {
                    "weight":"-20",
                    "predicates": [
                    {
                        "Predicate": {
                            "type":"trait",
                            "trait":"jealous",
                            "primary":"responder",
                            "secondary": "initiator",
                            "negated":false,
                            "isSFDB":false,
                            "window": 0
                        }
                    }
                    ]
                }
            },
            {
                "InfluenceRule": {
                    "weight":"20",
                    "predicates": [
                    {
                        "Predicate": {
                            "type":"trait",
                            "trait":"witty",
                            "primary":"intiator",
                            "negated":false,
                            "isSFDB":false,
                            "window": 0
                        }
                    }
                    ]
                }
            }
        ],
            "effects" : [
            {
                "Effect": {
                    "id": -1,
                    "isAccept": true,
                    "locutions": "%i% bragged about SOMETHING_COOL to %r%, reinforcing %ip% coolness in %rp% mind",
                    "condition": {
                        "Rule": {
                            "predicates": [
                                {
                                    "Predicate": {
                                        "type": "SFDB label",
                                        "primary": "initiator",
                                        "secondary": "responder",
                                        "label": "cool",
                                        "negated": false,
                                        "isSFDB": true,
                                        "window": 0
                                    }
                                }
                            ]
                        }
                    },
                    "change": {
                        "Rule": {
                            "predicates": [
                                {
                                    "Predicate": {
                                        "type": "network",
                                        "networkType": "cool",
                                        "primary": "responder",
                                        "secondary": "initiator",
                                        "comparator": "+",
                                        "value": 20,
                                        "negated": false,
                                        "isSFDB": false,
                                        "window": 0
                                    }
                                },
                                {
                                    "Predicate": {
                                        "type": "network",
                                        "networkType": "buddy",
                                        "primary": "responder",
                                        "secondary": "initiator",
                                        "comparator": "+",
                                        "value": 20,
                                        "negated": false,
                                        "isSFDB": false,
                                        "window": 0
                                    }
                                }
                            ]
                        }
                    }
                }
            },
            {
                "Effect": {
                    "id": -1,
                    "isAccept": true,
                    "locutions": "%i% bragged about the time SOMETHING_COOL, and %r% was impressed",
                    "change": {
                        "Rule": {
                            "predicates": [
                                {
                                    "Predicate": {
                                        "type": "network",
                                        "networkType": "cool",
                                        "primary": "responder",
                                        "secondary": "initiator",
                                        "comparator": "+",
                                        "value": 20,
                                        "negated": false,
                                        "isSFDB": false,
                                        "window": 0
                                    }
                                }
                            ]
                        }
                    }
                }
            },
            {
                "Effect": {
                    "id": -1,
                    "isAccept": false,
                    "locutions": "%i% tried to brag about when SOMETHING_COOL, but %r% was not impressed",
                    "change": {
                        "Rule": {
                            "predicates": [
                                {
                                    "Predicate": {
                                        "type": "network",
                                        "networkType": "cool",
                                        "primary": "responder",
                                        "secondary": "initiator",
                                        "comparator": "-",
                                        "value": 20,
                                        "negated": false,
                                        "isSFDB": false,
                                        "window": 0
                                    }
                                }
                            ]
                        }
                    }
                }
            },
            {
                "Effect": {
                    "id": -1,
                    "isAccept": false,
                    "locutions": "%i% wanted to brag about when SOMETHING_COOL to %r%, but since %r% values humility %r% was put off.",
                    "condition": {
                        "Rule": {
                            "predicates": [
                            {
                                "Predicate" : {
                                "type": "trait",
                                "trait": "humble",
                                "primary": "responder",
                                "negated": false,
                                "isSFDB": false,
                                "window": 0
                                }
                            }
                            ]
                        }
                    },
                    "change": {
                        "Rule": {
                            "predicates": [
                                {
                                    "Predicate": {
                                        "type": "network",
                                        "networkType": "cool",
                                        "primary": "responder",
                                        "secondary": "initiator",
                                        "comparator": "-",
                                        "value": 20,
                                        "negated": false,
                                        "isSFDB": false,
                                        "window": 0
                                    }
                                }
                            ]
                        }
                    }
                }
            },
            {
                "Effect": {
                    "id": -1,
                    "isAccept": false,
                    "locutions": "%i% wanted to brag about SOMETHING_COOL to %r%, but it only poured salt on the wound of %rp% jealousy towards %i%",
                    "condition": {
                        "Rule": {
                            "predicates": [
                            {
                                "Predicate" : {
                                "type": "status",
                                "status": "jealous",
                                "primary": "responder",
                                "secondary": "initiator",
                                "negated": false,
                                "isSFDB": false,
                                "window": 0
                                }
                            }
                            ]
                        }
                    },
                    "change": {
                        "Rule": {
                            "predicates": [
                                {
                                    "Predicate": {
                                        "type": "network",
                                        "networkType": "cool",
                                        "primary": "responder",
                                        "secondary": "initiator",
                                        "comparator": "-",
                                        "value": 20,
                                        "negated": false,
                                        "isSFDB": false,
                                        "window": 0
                                    }
                                },
                                {
                                    "Predicate": {
                                        "type": "status",
                                        "status": "emnity",
                                        "primary": "responder",
                                        "secondary": "initiator",
                                        "negated": false,
                                        "isSFDB": false,
                                        "window": 0
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        ] //End of Effects
    }
},//End of Brag
{
    "SocialGame": {
        "name": "Rough Up",
        "preconditions" : [
            {
                "Rule": {
                    "predicates": [
                    {
                        "Predicate" : {
                            "type": "relationship",
                            "primary": "initiator",
                            "secondary": "responder",
                            "relationship": "fighting",
                            "negated":true,
                            "isSFDB":false,
                            "window": 0
                        }
                    }
                    ]
                }
            }
        ], //end of Preconditions
        "initiatorIRS": [
            {
                "InfluenceRule": {
                    "weight": 10,
                    "predicates": {
                        "type": "trait",
                        "trait": "aggressive",
                        "first": "responder",
                        "negated": false,
                        "isSFDB": false,
                        "window": 0
                    }
                }
            }
        ]
    }
}//End of Rough Up
] //End of SocialGameLibrary


_CiFState.SocialNetworks = [
{
    "type": "buddy",
        "numChars" : "3",
        "edges" : [
        {"from": "0", "to": "1", "value": "10"},
        {"from": "0", "to": "2", "value": "20"},
        {"from": "1", "to": "0", "value": "30"},
        {"from": "1", "to": "2", "value": "100"},
        {"from": "2", "to": "0", "value": "50"},
        {"from": "2", "to": "1", "value": "60"}
    ]
},
{
    "type": "cool",
    "numChars" : "3",
    "edges" : [
    {"from": "0", "to": "1", "value": "10"},
    {"from": "0", "to": "2", "value": "20"},
    {"from": "1", "to": "0", "value": "30"},
    {"from": "1", "to": "2", "value": "100"},
    {"from": "2", "to": "0", "value": "50"},
    {"from": "2", "to": "1", "value": "60"}
    ]
},
{
    "type": "romance",
    "numChars" : "3",
    "edges" : [
    {"from": "0", "to": "1", "value": "10"},
    {"from": "0", "to": "2", "value": "20"},
    {"from": "1", "to": "0", "value": "30"},
    {"from": "1", "to": "2", "value": "40"},
    {"from": "2", "to": "0", "value": "50"},
    {"from": "2", "to": "1", "value": "60"}
    ]
}
]
