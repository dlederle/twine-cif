define([], function() {
    function NotImplemented() {
        this.message = "Function not Implemented";
    }
    NotImplemented.prototype = new Error();

    return NotImplemented;
});
