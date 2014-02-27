define([], function() {

    var CKBPath = function() {
        this.characterName = "";
        this.connectionType = "";
        this.itemName = "";
        this.truthLabel = "";
        this.toString = function() {
            return this.characterName + " " + this.connectionType + " " + this.itemName + " - " + this.truthLabel;
        }
    }

    return CKBPath;
});

