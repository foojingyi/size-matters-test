var config = {
    width: window.innerWidth,
    height: window.innerHeight,
    type: Phaser.AUTO,
    parent: 'game',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var gameOver = false;
var puzzleCount = 0;
var puzzleSolved = true;
var puzzleAns = 0;
const PUZZLE_MAX_COUNT = 10;
const MIN_SIZE = 3;
const MAX_SIZE = 7;

var timer, timerSign, timerText;
const PENALTY_TIME = 3000;

var leftObj, midObj, rightObj;
var leftButton, midButton, rightButton;
var left, middle, right;
var objButPairs = [];

const LANDSCAPE = 1;
const PORTRAIT = 2;
var orient = window.innerWidth > innerHeight ? LANDSCAPE : PORTRAIT;

const OBJ_X = window.innerWidth * 0.5;
const OBJ_X_INT = window.innerWidth * (orient == PORTRAIT ? 0.3 : 0.15);
const OBJ_Y = window.innerHeight * 0.5;
const OBJ_WIDTH = window.innerWidth * 0.3;
const OBJ_HEIGHT = window.innerHeight * 0.5;
var objScale;

const BUTTON_Y = window.innerHeight * (orient == PORTRAIT ? 0.8 : 0.9);
const BUTTON_WIDTH = window.innerWidth * 0.2;
const BUTTON_HEIGHT = window.innerHeight * 0.15;

var game = new Phaser.Game(config);

function preload() {
    this.load.image('background', 'assets/bg.jpg');
    this.load.image('sign', 'assets/sign.png');
    this.load.image('banner', 'assets/banner.jpg');
    this.load.audio('nice', 'assets/sound/nice-audio.m4a');
    this.load.audio('oopsy', 'assets/sound/oopsy-audio.m4a');
    this.load.image('pop-red', 'assets/pops/pop-red.png');
    this.load.image('pop-yellow', 'assets/pops/pop-yellow.png');
    this.load.image('pop-blue', 'assets/pops/pop-blue.png');
    this.load.spritesheet('button-red', 'assets/buttons/button-red.png', { frameWidth: 1044, frameHeight: 940 });
    this.load.spritesheet('button-yellow', 'assets/buttons/button-yellow.png', { frameWidth: 1044, frameHeight: 940 });
    this.load.spritesheet('button-blue', 'assets/buttons/button-blue.png', { frameWidth: 1044, frameHeight: 940 });
}

function create() {
    // Resize background to fit screen
    const background = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background');
    const scaleX = window.innerWidth / background.width;
    const scaleY = window.innerHeight / background.height;
    background.setScale(scaleX, scaleY);

    niceFx = this.sound.add('nice', { volume: 0.2 });
    oopsyFx = this.sound.add('oopsy', { volume: 0.2 });

    cursors = new StickyKeys(this.input.keyboard.createCursorKeys());

    leftObj = this.add.image(OBJ_X - OBJ_X_INT, OBJ_Y, 'pop-red');
    midObj = this.add.image(OBJ_X, OBJ_Y, 'pop-yellow');
    rightObj = this.add.image(OBJ_X + OBJ_X_INT, OBJ_Y, 'pop-blue');
    objScale = orient == PORTRAIT ? OBJ_WIDTH / leftObj.width : OBJ_HEIGHT / leftObj.height;

    leftButton = new Button(this, OBJ_X - OBJ_X_INT, BUTTON_Y, 'button-red', cursors.left);
    midButton = new Button(this, OBJ_X, BUTTON_Y, 'button-yellow', cursors.down);
    rightButton = new Button(this, OBJ_X + OBJ_X_INT, BUTTON_Y, 'button-blue', cursors.right);
    const buttonScale = orient == PORTRAIT ? BUTTON_WIDTH / leftButton.width : BUTTON_HEIGHT / leftButton.height;
    leftButton.setScale(buttonScale);
    midButton.setScale(buttonScale);
    rightButton.setScale(buttonScale);

    left = new ObjectButtonPair(leftObj, leftButton);
    middle = new ObjectButtonPair(midObj, midButton);
    right = new ObjectButtonPair(rightObj, rightButton);
    objButPairs = [left, middle, right];

    this.add.image(window.innerWidth / 2, window.innerHeight / 7, 'sign').setScale(0.9)
    this.add.image(window.innerWidth / 2, window.innerHeight / 7, 'banner').setScale(10, 0.62)
    timerText = this.add.text(window.innerWidth / 2, window.innerHeight / 7, '0.000s', { fontFamily: 'VT323', fontSize: '240px', color: 'rgb(116, 92, 135)' });
    timerText.originX = 0.5;
    timerText.originY = 0.5;
    if (orient == PORTRAIT) {
        timerText.displayWidth = window.innerWidth * 0.5;
    } else {
        timerText.displayHeight = window.innerHeight * 0.15;
    }
    timer = new Timer(timerText, PENALTY_TIME);
}

function update() {
    leftButton.updateAnim();
    midButton.updateAnim();
    rightButton.updateAnim();

    if (!gameOver) {
        cursors.resetAll();
        objButPairs.forEach(pair => pair.button.resetTap());

        if (timer.checkOverTime()) {
            timer.stop();
            setGameOver();
        } else if (puzzleCount >= PUZZLE_MAX_COUNT && puzzleSolved) {
            setGameOver();
        } else if (puzzleSolved) {
            setPuzzle();
            timer.start();
        } else if (ansGiven()) {
            timer.stop();
            if (ansCorrect()) {
                niceFx.play();
            } else {
                oopsyFx.play();
                timer.addPenalty();
                timer.updateTimer();
            }
            puzzleSolved = true;
        }
    }
}

function setPuzzle() {
    var sizes = new Set();
    while (sizes.size < 3) {
        sizes.add(Phaser.Math.Between(MIN_SIZE, MAX_SIZE));
    }
    sizes = Array.from(sizes);
    puzzleAns = Math.max(...sizes) / MAX_SIZE * objScale;
    for (i = 0; i < sizes.length; i++) {
        objButPairs[i].setSize(sizes[i] / MAX_SIZE * objScale);
    }
    puzzleCount++;
    puzzleSolved = false;
}

function ansGiven() {
    return leftButton.justPressed() || midButton.justPressed() || rightButton.justPressed();
}

function ansCorrect() {
    return this.left.isCorrect(puzzleAns) && this.middle.isCorrect(puzzleAns) &&
            this.right.isCorrect(puzzleAns);
}

function setGameOver() {
    gameOver = true;
    // var uid = parse("uid");
    // var msgid = parse("msgid");
    // var chatid = parse("chatid");
    // var iid = parse("iid");
    
    // if (uid && msgid && chatid) {
    //     $.get("/setscore/uid/" + uid + "/chat/" + chatid + "/msg/" + msgid + "/score/" + score);
    // }
    // else if (uid && iid) {
    //     $.get("/setscore/uid/" + uid + "/iid/" + iid + "/score/" + score);
    // }
}

// Borrowed function to retrieve GET parameters
function parse(val) {
    // var result = undefined;
    // var tmp = [];
    // console.log(location)
    // location.search
    //     .substr(1)
    //     .split("&")
    //     .forEach(function (item) {
    //         tmp = item.split("=");
    //         if (tmp[0] === val) result = decodeURIComponent(tmp[1]);
    // });
    // return result;
}