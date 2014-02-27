define([], function() {
    /**
     * A record of influence rules that fire when forming intent. For use for displaying rules that were true;
     */

    //This class is kinda useless in JS, but whatever.
    var RuleRecord = function(opts) {
        opts = opts || {};
        this.influenceRule = opts.influenceRule;
        this.type = opts.type;
        this.name = opts.name;
        this.initiator = opts.initiator;
        this.responder = opts.responder;
        this.other = opts.other;

        this.clone = function() {
            var ruleRecord = new RuleRecord();
            ruleRecord.name = this.name;
            ruleRecord.influenceRule = this.influenceRule.clone();
            ruleRecord.type = this.type;
            ruleRecord.initiator = this.initiator;
            ruleRecord.responder = this.responder;
            ruleRecord.other = this.other;

            return ruleRecord;
        }
    }

    RuleRecord.equals = function(x, y) {
        if (x.type != y.type) return false;
        if (x.name != y.name) return false;
        if (x.initiator != y.initiator) return false;
        if (x.responder != y.responder) return false;
        if (x.other != y.other) return false;
        return true;
    }

    RuleRecord.MICROTHEORY_TYPE = 0;
    RuleRecord.SOCIAL_GAME_TYPE = 1;

    return RuleRecord;
});
