define(['Rule'], function(Rule) {

    /**
     * @class InfluenceRule
     */
    var InfluenceRule = function(opts) {
        opts = opts || {};
        this.weight = opts.weight || 0.0;
        this.evaluatedWeight = opts.evaluatedWeight || 0.0;
        this.predicates = opts.predicates || [];

        this.toString = function() {
            return this.weight + ": " + InfluenceRule.prototype.toString();
        }

        this.clone = function() {
            var ir = new InfluenceRule();
            ir.predicates = [];
            this.predicates.forEach(function(pred) {
                ir.predicates.push(pred.clone());
            });
            ir.name = this.name;
            ir.id = this.id;
            ir.weight = this.weight;
            return ir;
        }

    };
    InfluenceRule.prototype = new Rule();
    InfluenceRule.equals = function(x, y) {
        if(x.weight != y.weight) { return false; }
        return Rule.equals(x, y);
    }

    return InfluenceRule;
});
