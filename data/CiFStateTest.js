_CiFData = {
    "CiFState": {
        "Cast": [
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
        ],

            "SocialFactsDB" : {
                "StatusContext": {
                    "time": "20",
                    "Predicate": {
                        "type"    : "status",
                        "status"  : "has a crush on",
                        "primary"   : "Debbie",
                        "secondary"  : "Robert",
                        "negated" : "false",
                        "isSFDB"  : "true"
                    }
                }
            },

            "SocialNetwork" : {
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

            "SocialNetwork" : {
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

            "SocialNetwork" : {
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
            },

            /*
             * TODO
             "Status" : [
             {"type": "desperate", "from": "Edward", "to":"" },
             {"type": "has crush", "from": "Debbie", "to":"Edward" },
             {"type": "jealous", "from": "Edward", "to":"Robert" }
             ],

             "Relationships": [
             {"type": "friends", "from": "Robert", "to":"Edward"},
             {"type": "dating", "from": "Robert", "to": "Debbie"},
             {"type": "enemies", "from": "Debbie", "to": "Edward"}
             ],
             */

            "SocialGamesLib" : [
            {
                "SocialGame": {
                    "name": "Brag",
                    "Preconditions": [
                    {
                        "Rule": {
                            "Predicate": {
                                "type":"trait",
                                "trait":"confidence",
                                "primary":"initiator",
                                "negated":"false",
                                "isSFDB":"false"
                            }
                        }
                    },
                    {
                        "Rule": {
                            "Predicate": {
                                "type":"trait",
                                "trait":"attention hog",
                                "primary":"initiator",
                                "negated":"false",
                                "isSFDB":"false"
                            }
                        }
                    },
                    {
                        "Rule": {
                            "Predicate": {
                                "type":"network",
                                "networkType":"buddy",
                                "primary":"initiator",
                                "secondary":"responder",
                                "comparator":"greaterthan",
                                "value":"39",
                                "negated":"false",
                                "isSFDB":"false"
                            }
                        }
                    },
                    {
                        "Rule": {
                            "Predicate": {
                                "type":"network",
                                "networkType":"buddy",
                                "primary":"initiator",
                                "secondary":"responder",
                                "comparator":"lessthan",
                                "value":"40",
                                "negated":"false",
                                "isSFDB":"false"
                            }
                        }
                    },
                    {
                        "Rule": {
                            "Predicate": {
                                "type":"trait",
                                "trait":"confidence",
                                "primary":"initiator",
                                "negated":"false",
                                "isSFDB":"false"
                            }
                        }
                    }
                    ], //End of Preconditions
                        "InitiatorInfluenceRuleSet" : [
                        {
                            "InfluenceRule": {
                                "weight":"20",
                                "Predicate": {
                                    "type":"trait",
                                    "trait":"witty",
                                    "primary":"initiator",
                                    "negated":"false",
                                    "isSFDB":"false"
                                }
                            }
                        }
                    ],
                        "ResponderInfluenceRuleSet" : [
                        {
                            "InfluenceRule": {
                                "weight": "10",
                                "Predicate": {
                                    "type": "network",
                                    "networkType": "buddy",
                                    "primary": "responder",
                                    "second": "initiator",
                                    "comparator": "greaterthan",
                                    "value":"39",
                                    "negated": "false",
                                    "isSFDB": "false"
                                }
                            }
                        },
                        {
                            "InfluenceRule": {
                                "weight":"-30",
                                "Predicate": {
                                    "type":"trait",
                                    "trait":"humble",
                                    "primary":"responder",
                                    "negated":"true",
                                    "isSFDB":"false"
                                }
                            }
                        },
                        {
                            "InfluenceRule": {
                                "weight":"-20",
                                "Predicate": {
                                    "type":"trait",
                                    "trait":"jealous",
                                    "primary":"responder",
                                    "secondary": "initiator",
                                    "negated":"false",
                                    "isSFDB":"false"
                                }
                            }
                        }
                    ],

                        "Effects" : [
                        {
                            "Effect" : {
                                "id": "1",
                                "isAccept": "true",
                                "change" : {
                                    "Predicate" : {
                                        "type": "network",
                                        "networkType": "cool",
                                        "primary": "responder",
                                        "secondary": "initiator",
                                        "comparator": "+",
                                        "value": "20",
                                        "negated": "false",
                                        "isSFDB": "false"
                                    }
                                }
                            }
                        },
                        {
                            "Effect" : {
                                "id": "3",
                                "isAccept": "false",
                                "change": {
                                    "Predicate" : {
                                        "type": "network",
                                        "networkType": "cool",
                                        "primary": "responder",
                                        "secondary": "initiator",
                                        "comparator": "-",
                                        "value": "20",
                                        "negated": "false",
                                        "isSFDB": "false"
                                    }
                                }
                            }
                        },
                        {
                            "Effect" : {
                                "id": "4",
                                "isAccept": "false",
                                "condition": {
                                    "Predicate" : {
                                        "type": "status",
                                        "status": "envies",
                                        "primary": "responder",
                                        "secondary": "initiator",
                                        "negated": "false",
                                        "isSFDB": "false"
                                    }
                                }
                            }
                        },
                        ], //End of Effects
                        "Instantiations": [
                        {
                            "Instantiation" : {
                                "id" : "1",
                                "LineOfDialogue": {
                                    "lineNumber": "1",
                                    "initiatorLine": "initiator's line",
                                    "responderLine": "responder's line",
                                    "otherLine": "other's line",
                                    "primarySpeaker": "initiator",
                                    "time": "5"
                                }
                            }
                        }
                    ]
                }
            }
        ], //End of SocialGameLibrary
            "CulturalKB" : [
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
        ]
    }
}
