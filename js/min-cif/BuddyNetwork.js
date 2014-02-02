function NotImplemented() {
    this.message = "Function not Implemented";
}
NotImplemented.prototype = new Error();


/**
 * @class Cif_Singleton
 */
var BuddyNetwork = (function() {
    var instance;
    function Singleton() {
        if (instance) {
            return instance;
        }
        instance = this;
    }

    Singleton.getInstance = function() {
        return instance || new Singleton();
    }


    return Singleton;
}());

