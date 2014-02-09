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

    /**
     * Returns a random number between the minNum and maxNum
     * 
     * @param	minNum
     * @param	maxNum
     * @return
     */
    Util.randRange = function(minNum, maxNum) {
        return (Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
    }


    return Util;
});
