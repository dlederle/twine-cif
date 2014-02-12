define(['min-cif/Rule', 'min-cif/Predicate', 'min-cif/Status'], function(Rule, Predicate, Status) {
    /**
     * Consists of a predicate and a time.
     */
    var StatusContext = function() {
        //public var predicate:Predicate;
        this.time = -1;
        this.statusType;
        this.negated;
        this.from;
        this.to;

        /**********************************************************************
         * SFDBContext Interface implementation.
         *********************************************************************/
        this.getTime = function() { return this.time; }

        this.isSocialGame = function() { return false; }

        this.isTrigger = function() { return false; }

        this.isJuice = function() { return false; }

        this.isStatus = function() { return true; }

        this.getChange = function() {
            var r = new Rule();
            var p = new Predicate();
            p.setStatusPredicate(this.from.characterName, (this.to)?this.to.characterName:"", this.statusType, this.negated);
            r.predicates.push(p);
            return r;
        }

        /**
         * Determines if the StatusContext represents a status change consistent
         * with the passed-in Predicate.
         * @param	p	Predicate to check for.
         * @param	x	Primary character.
         * @param	y	Secondary character.
         * @param	z	Tertiary character.
         * @return	True if the StatusContext's change is the same as the valuation
         * of p. False if not.
         */
        this.isPredicateInChange = function(p, x, y, z) {
            if (p.type != Predicate.STATUS) return false;
            if (p.status != this.statusType) return false;
            if (p.negated != this.negated) return false;
            if (x.characterName != this.from.characterName) return false;
            if (y) {
                if (y.characterName != this.to.characterName) return false;
                if (Status.FIRST_DIRECTED_STATUS > p.status) return false;
            }
            return true;
        }

        this.clone = function() {
            var sc = new StatusContext();
            sc.time = this.time;
            sc.to = this.to;
            sc.from = this.from;
            sc.statusType = this.statusType;
            sc.negated = this.negated;
            return sc;
        }
    }

    /**********************************************************************
     * Utility Functions
     * *******************************************************************/
    StatusContext.equals = function(x, y) {
        if (x.time != y.time) return false;
        if (x.negated != y.negated) return false;
        if (x.to != y.to) return false;
        if (x.from != y.from) return false;
        if (x.statusType != y.statusType) return false;
        return true;
    }

    return StatusContext;

});
