class ObjectButtonPair {
	constructor(object, button) {
		this.object = object;
		this.button = button;
		this.size = 0;
	}

	setSize(size) {
		this.size = size;
		this.object.setScale(this.size);
	}

	isBiggest(biggest) {
		return this.size == biggest;
	}

	isCorrect(biggest) {
		return this.isBiggest(biggest) ? this.button.pressed() : this.button.idle();
	}
}