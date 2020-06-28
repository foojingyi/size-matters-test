class Timer {
	constructor(timerText, PENALTY_TIME) {
		this.timerText = timerText;
		this.PENALTY_TIME = PENALTY_TIME;
		this.startTime;
		this.updateInterval;
		this.timeSoFar = 0;
	}

	addPenalty() {
		this.timeSoFar += this.PENALTY_TIME;
	}

	start() {
		this.startTime = new Date().getTime();
		this.updateInterval = setInterval(this.updateTimer.bind(this), 50);
	}

	stop() {
	    clearInterval(this.updateInterval);
	    this.isRunning = false;
	}

	updateTimer() {
		const currTime = new Date().getTime();
		this.timeSoFar += currTime - this.startTime;
		this.startTime = currTime;
		if (this.timeSoFar >= 60000) {
			this.timeSoFar = 60000;
		}
		const seconds = Math.floor(this.timeSoFar / 1000);
	    var milliseconds = Math.floor(this.timeSoFar % 1000);
	    if (milliseconds < 10) {
	        milliseconds = '00'  + milliseconds;
	    } else if (milliseconds < 100) {
	        milliseconds = '0' + milliseconds;
	    }
	    this.timerText.setText(seconds + '.' + milliseconds + 's');
	}

	checkOverTime() {
		return this.timeSoFar >= 60000;
	}
}