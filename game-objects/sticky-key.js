class StickyKey {
	constructor(cursorKey) {
		this.key = cursorKey;
		this.switch = false;
	}

	idle() {
		return this.key.isUp;	
	}

	pressed() {
		return this.key.isDown;
	}

	justPressed() {
		if (this.pressed()) {
			const temp = !this.switch;
			this.alreadyPressed();
			return temp;
		}
		return false;
	}

	alreadyPressed() {
		this.switch = true;
	}

	reset() {
		if (this.idle()) {
			this.switch = false;
		}
	}
}