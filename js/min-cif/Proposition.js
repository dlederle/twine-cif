define([], function() {
    /**
     *This class contains proposition information and construction to be used for truth and subjective type propositions.
     *@see CiF.CulturalKB
     */
    var Proposition = function(opts) {
        opts = opts || {};
        this.type = opts.type || "";
        this.head = opts.type || "";
        this.connection = opts.type || "";
        this.tail = opts.type || "";

        this.toString = function() {
            var returnstr = "";
            returnstr = "type = " + this.type + " --- head = " + this.head + " --- connection = " + this.connection + " --- tail = " + this.tail;
            return returnstr;
        }

        this.clone = function() {
            var p= new Proposition();
            p.type = this.type;
            p.head = this.head;
            p.connection = this.connection;
            p.tail = this.tail;
            return p;
        }
    }
    Proposition.equals = function(x, y) {
        if (x.type != y.type) return false;
        if (x.head != y.head) return false;
        if (x.connection != y.connection) return false;
        if (x.tail != y.tail) return false;
        return true;
    }

    return Proposition;
});
