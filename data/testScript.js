var _CiFState = _CiFState || {};

_CiFState.Cast = [
{
    "Character": {
        "characterName": "Big Bad Wolf",
            "networkID": 0,
            "traits": [
                "confident",
            "dishonest"
                ]
    }
},
{
    "Character": {
        "characterName": "Red Riding Hood",
        "networkID": 1,
        "traits": [
            "forgiving",
        "kind",
        "loving"
            ]
    }
},

    ];

    _CiFState.CulturalKB = [
{
    "Proposition": {
        "type": "truth",
            "head": "Big Bad Wolf",
            "connection": "is",
            "tail": "a wolf"
    }
},
{
    "Proposition": {
        "type": "truth",
        "head": "a wolf",
        "connection": "likes",
        "tail": "eating people"
    }
},
{
    "Proposition": {
        "type": "subjective",
        "head": "a wolf",
        "connection": "is",
        "tail": "mean"
    }
}
];

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
                            "type":"sfdblabel",
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
                            "trait":"confident",
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
                            "trait": "humble",
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
                            "type": "trait",
                            "trait":"witty",
                            "primary":"initiator",
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
                                    "type": "sfdblabel",
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
                                    "status": "envies",
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
                                    "status": "angry at",
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
        ], //End of Effects
            "intents": [
            {
                "Rule": {
                    "name": "Initiator must have done some cool action in the past",
                    "predicates" : [
                    {
                        "Predicate": {
                            "type":"sfdblabel",
                            "primary":"initiator",
                            "secondary": "initiator",
                            "label": "cool",
                            "window": 0,
                            "negated":false,
                            "isSFDB": true,
                            "intent": true
                        }
                    }
                    ]
                }
            }

        ],

            "instantiations": [

                ]
    }
},//End of Brag

    ];

    _CiFState.SocialNetworks = [
{
    "type": "buddy",
        "numChars" : "2",
        "edges" : [
        {"from": "0", "to": "1", "value": "-15" },
        {"from": "1", "to": "0", "value": "15"},
        ]
},
{
    "type": "cool",
    "numChars" : "2",
    "edges" : [
    {"from": "0", "to": "1", "value": "20"},
    {"from": "1", "to": "0", "value": "30"},
    ]
},
{
    "type": "romance",
    "numChars" : "2",
    "edges" : [
    {"from": "0", "to": "1", "value": "0"},
    {"from": "1", "to": "0", "value": "20"},
    ]
}
];

_CiFState.SocialFactsDB = {
    "contexts" : [
    {
        "StatusContext": {
            "time": "20",
            "Predicate": {
                "type"    : "status",
                "status"  : "anxious",
                "primary"   : "initiator",
                "secondary"  : "responder",
                "negated" : false,
                "isSFDB"  : true
            }
        }
    }
    ]
};
