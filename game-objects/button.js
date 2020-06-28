class Button extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, texture, stickyKey) {
		super(scene, x, y, texture);
		scene.add.existing(this);
		scene.anims.create({
	        key: 'idle-' + texture,
	        frames: scene.anims.generateFrameNumbers(texture, { start: 0, end: 0 })
	    });
	    scene.anims.create({
	        key: 'pressed-' + texture,
	        frames: scene.anims.generateFrameNumbers(texture, { start: 1, end: 1 })
	    });

	    this.name = texture;
		this.stickyKey = stickyKey;
		this.isTapped = false;
		this.setInteractive()
			.on('pointerdown', () => this.isTapped = true)
			.on('pointerup', () => this.isTapped = false);
		this.tapSwitch = false;
	}

	idle() {
		return this.stickyKey.idle() && !this.isTapped;
	}

	pressed() {
		return this.stickyKey.pressed() || this.isTapped;
	}

	justTapped() {
		if (this.isTapped) {
			const temp = !this.tapSwitch;
			this.alreadyTapped();
			return temp;
		}
		return false;
	}

	alreadyTapped() {
		this.tapSwitch = true;
	}

	resetTap() {
		if (!this.isTapped) {
			this.tapSwitch = false;
		}
	}

	justPressed() {
		return this.stickyKey.justPressed() || this.justTapped();
	}

	updateAnim() {
		if (this.pressed()) {
			this.anims.play('pressed-' + this.name);
		} else {
			this.anims.play('idle-' + this.name);
		}
	}
}