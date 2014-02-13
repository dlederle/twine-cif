define([], function() {
	/**
	 * The SkeinNode class represents a node in the tree graph comprising the
	 * explored social game progression space explored thus far in CiF (in
	 * either a game or a simulation). It a vector of SFDBContexts and a Vector
	 * of SkeinNode references that lead to the next explored social game choices
	 * after the current node.
	 */
	var SkeinNode = function() {

		/**
		 * The one and only social game context that stores the information
		 * associated with the specific social game played at this node.
		 */
		this.gameContext;

		/**
		 * The contexts associated with statuses lost via timeout and state
		 * change brought about by triggers as a result of the social game
		 * played in the current node.
		 */
		this.otherContexts = [];

		/**
		 * The references to the the next SkeinNodes in the Skein.
		 */
		this.nextNodes = [];

		/**
		 * A reference to the parent SkeinNode.
		 */
		this.parent;

		/**
		 * Determines the index of this SkeinNode in its parent's nextNodes
		 * vector.
		 * @return	Index of this node in its parent's nextNodes vector.
		 */
		this.getParentIndex = function() {
			return this.parent.nextNodes.indexOf(this);
		}

	} //End SkeinNode

    return SkeinNode;
});
