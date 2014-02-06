define([], function() {
    var Util = function() {
    }

    /**
     * @method xor
     * @param {Boolean} lhs
     * @param {Boolean} rhs
     */
    Util.xor = function(lhs, rhs) {
        return lhs != rhs;
    }

    return Util;
});
