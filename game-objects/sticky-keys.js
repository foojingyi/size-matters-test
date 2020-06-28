class StickyKeys {
	constructor(cursorKeys) {
		this.left = new StickyKey(cursorKeys.left);
		this.down = new StickyKey(cursorKeys.down);
		this.right = new StickyKey(cursorKeys.right);
	}

	resetAll() {
		this.left.reset();
		this.down.reset();
		this.right.reset();
	}
}