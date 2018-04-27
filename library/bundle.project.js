require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"Game":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'ca6ecn9PNJHqbx2fgR622un', 'Game');
// scripts/Game.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        starPrefab: {
            default: null,
            type: cc.Prefab
        },
        maxStarDuration: 0,
        minStarDuration: 0,
        ground: {
            default: null,
            type: cc.Node
        },
        player: {
            default: null,
            type: cc.Node
        },
        scoreDisplay: {
            default: null,
            type: cc.Label
        },
        scoreAudio: {
            default: null,
            url: cc.AudioClip
        }
    },

    onLoad: function onLoad() {

        this.groundY = this.ground.y + this.ground.height / 2;
        this.timer = 0;
        this.starDuration = 0;
        this.spawnNewStar();
        this.score = 0;
    },

    spawnNewStar: function spawnNewStar() {
        var newStar = cc.instantiate(this.starPrefab);
        this.node.addChild(newStar);
        newStar.setPosition(this.getNewStarPosition());
        newStar.getComponent('Star').game = this;

        this.starDuration = this.minStarDuration + cc.random0To1() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    },

    getNewStarPosition: function getNewStarPosition() {
        var randX = 0;
        var randY = this.groundY + cc.random0To1() * this.player.getComponent('Player').jumpHeight + 50;
        var maxX = this.node.width / 2;
        randX = cc.randomMinus1To1() * maxX;
        return cc.p(randX, randY);
    },

    update: function update(dt) {
        if (this.timer > this.starDuration) {
            this.gameOver();
            return;
        }
        this.timer += dt;
    },

    gainScore: function gainScore() {
        this.score += 1;
        this.scoreDisplay.string = 'Score: ' + this.score.toString();
        cc.audioEngine.playEffect(this.scoreAudio, false);
    },

    gameOver: function gameOver() {
        this.player.stopAllActions();
        cc.director.loadScene('game');
    }
});

cc._RF.pop();
},{}],"Player":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'f3d48M3ChNOdLC7szx6dJ0o', 'Player');
// scripts/Player.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        jumpHeight: 0,
        jumpDuration: 0,
        maxMoveSpeed: 0,
        accel: 0,
        jumpAudio: {
            default: null,
            url: cc.AudioClip
        }
    },

    setJumpAction: function setJumpAction() {
        var jumpUp = cc.moveBy(this.jumpDuration, cc.p(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        var jumpDown = cc.moveBy(this.jumpDuration, cc.p(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        var callback = cc.callFunc(this.playJumpSound, this);
        return cc.repeatForever(cc.sequence(jumpUp, jumpDown, callback));
    },

    playJumpSound: function playJumpSound() {
        cc.audioEngine.playEffect(this.jumpAudio, false);
    },

    setInputControl: function setInputControl() {
        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function onKeyPressed(keyCode, event) {
                switch (keyCode) {
                    case cc.KEY.a:
                        self.accLeft = true;
                        self.accRight = false;
                        break;
                    case cc.KEY.d:
                        self.accLeft = false;
                        self.accRight = true;
                        break;
                }
            },
            onKeyReleased: function onKeyReleased(keyCode, event) {
                switch (keyCode) {
                    case cc.KEY.a:
                        self.accLeft = false;
                        break;
                    case cc.KEY.d:
                        self.accRight = false;
                        break;
                }
            }
        }, self.node);
    },

    onLoad: function onLoad() {
        this.jumpAction = this.setJumpAction();
        this.node.runAction(this.jumpAction);

        this.accLeft = false;
        this.accRight = false;
        this.xSpeed = 0;

        this.setInputControl();
    },

    update: function update(dt) {
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;
        } else if (this.accRight) {
            this.xSpeed += this.accel * dt;
        }
        if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }

        this.node.x += this.xSpeed * dt;
    }
});

cc._RF.pop();
},{}],"Star":[function(require,module,exports){
"use strict";
cc._RF.push(module, 'f27a5P/9GVEO7CIo/zHCENm', 'Star');
// scripts/Star.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        pickRadius: 0,
        game: {
            default: null,
            serializable: false
        }
    },

    onLoad: function onLoad() {},
    getPlayerDistance: function getPlayerDistance() {
        var playerPos = this.game.player.getPosition();
        var dist = cc.pDistance(this.node.position, playerPos);
        return dist;
    },
    onPicked: function onPicked() {
        this.game.spawnNewStar();
        this.game.gainScore();
        this.node.destroy();
    },
    update: function update(dt) {
        if (this.getPlayerDistance() < this.pickRadius) {
            this.onPicked();
            return;
        }
        var opacityRatio = 1 - this.game.timer / this.game.starDuration;
        var minOpacity = 50;
        this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity));
    }
});

cc._RF.pop();
},{}]},{},["Game","Player","Star"])

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL0dhbWUuanMiLCJhc3NldHMvc2NyaXB0cy9QbGF5ZXIuanMiLCJhc3NldHMvc2NyaXB0cy9TdGFyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTtBQUNJOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRlk7QUFJWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRlE7QUFJUjtBQUNBO0FBQ0E7QUFGUTtBQUlSO0FBQ0E7QUFDQTtBQUZjO0FBSWQ7QUFDQTtBQUNBO0FBRlk7QUFuQkE7O0FBeUJaOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNDO0FBQ0Q7QUFDQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNDOztBQUVEO0FBQ0E7QUFDQTtBQUNDO0FBeEVJOzs7Ozs7Ozs7O0FDQVQ7QUFDSTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRlc7QUFMQzs7QUFXWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0M7O0FBRUQ7QUFDQTtBQUNDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFSQTtBQVVDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU5BO0FBUUM7QUF2QjJCO0FBeUIzQjs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0M7O0FBRUQ7QUFDQTtBQUNBO0FBQ0M7QUFDRDtBQUNDO0FBQ0Q7QUFDQTtBQUNDOztBQUVEO0FBQ0M7QUE1RUk7Ozs7Ozs7Ozs7QUNBVDtBQUNJOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGTTtBQUZNOztBQVFaO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0M7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0M7QUFoQ0kiLCJzb3VyY2VzQ29udGVudCI6WyJjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcbiAgICBcclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgIHN0YXJQcmVmYWI6IHtcclxuICAgIGRlZmF1bHQ6IG51bGwsXHJcbiAgICB0eXBlOiBjYy5QcmVmYWJcclxuICAgIH0sXHJcbiAgICBtYXhTdGFyRHVyYXRpb246IDAsXHJcbiAgICBtaW5TdGFyRHVyYXRpb246IDAsXHJcbiAgICBncm91bmQ6IHtcclxuICAgIGRlZmF1bHQ6IG51bGwsXHJcbiAgICB0eXBlOiBjYy5Ob2RlXHJcbiAgICB9LFxyXG4gICAgcGxheWVyOiB7XHJcbiAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgdHlwZTogY2MuTm9kZVxyXG4gICAgfSxcclxuICAgIHNjb3JlRGlzcGxheToge1xyXG4gICAgZGVmYXVsdDogbnVsbCxcclxuICAgIHR5cGU6IGNjLkxhYmVsXHJcbiAgICB9LFxyXG4gICAgc2NvcmVBdWRpbzoge1xyXG4gICAgZGVmYXVsdDogbnVsbCxcclxuICAgIHVybDogY2MuQXVkaW9DbGlwXHJcbiAgICB9XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIFxyXG4gICAgdGhpcy5ncm91bmRZID0gdGhpcy5ncm91bmQueSArIHRoaXMuZ3JvdW5kLmhlaWdodC8yO1xyXG4gICAgdGhpcy50aW1lciA9IDA7XHJcbiAgICB0aGlzLnN0YXJEdXJhdGlvbiA9IDA7XHJcbiAgICB0aGlzLnNwYXduTmV3U3RhcigpO1xyXG4gICAgdGhpcy5zY29yZSA9IDA7XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBzcGF3bk5ld1N0YXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIG5ld1N0YXIgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnN0YXJQcmVmYWIpO1xyXG4gICAgdGhpcy5ub2RlLmFkZENoaWxkKG5ld1N0YXIpO1xyXG4gICAgbmV3U3Rhci5zZXRQb3NpdGlvbih0aGlzLmdldE5ld1N0YXJQb3NpdGlvbigpKTtcclxuICAgIG5ld1N0YXIuZ2V0Q29tcG9uZW50KCdTdGFyJykuZ2FtZSA9IHRoaXM7XHJcbiAgICBcclxuICAgIHRoaXMuc3RhckR1cmF0aW9uID0gdGhpcy5taW5TdGFyRHVyYXRpb24gKyBjYy5yYW5kb20wVG8xKCkgKiAodGhpcy5tYXhTdGFyRHVyYXRpb24gLSB0aGlzLm1pblN0YXJEdXJhdGlvbik7XHJcbiAgICB0aGlzLnRpbWVyID0gMDtcclxuICAgIH0sXHJcbiAgICBcclxuICAgIGdldE5ld1N0YXJQb3NpdGlvbjogZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHJhbmRYID0gMDtcclxuICAgIHZhciByYW5kWSA9IHRoaXMuZ3JvdW5kWSArIGNjLnJhbmRvbTBUbzEoKSAqIHRoaXMucGxheWVyLmdldENvbXBvbmVudCgnUGxheWVyJykuanVtcEhlaWdodCArIDUwO1xyXG4gICAgdmFyIG1heFggPSB0aGlzLm5vZGUud2lkdGgvMjtcclxuICAgIHJhbmRYID0gY2MucmFuZG9tTWludXMxVG8xKCkgKiBtYXhYO1xyXG4gICAgcmV0dXJuIGNjLnAocmFuZFgsIHJhbmRZKTtcclxuICAgIH0sXHJcbiAgICBcclxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcbiAgICBpZiAodGhpcy50aW1lciA+IHRoaXMuc3RhckR1cmF0aW9uKSB7XHJcbiAgICB0aGlzLmdhbWVPdmVyKCk7XHJcbiAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLnRpbWVyICs9IGR0O1xyXG4gICAgfSxcclxuICAgIFxyXG4gICAgZ2FpblNjb3JlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLnNjb3JlICs9IDE7XHJcbiAgICB0aGlzLnNjb3JlRGlzcGxheS5zdHJpbmcgPSAnU2NvcmU6ICcgKyB0aGlzLnNjb3JlLnRvU3RyaW5nKCk7XHJcbiAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoaXMuc2NvcmVBdWRpbywgZmFsc2UpO1xyXG4gICAgfSxcclxuICAgIFxyXG4gICAgZ2FtZU92ZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMucGxheWVyLnN0b3BBbGxBY3Rpb25zKCk7IFxyXG4gICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKCdnYW1lJyk7XHJcbiAgICB9XHJcbiAgICB9KTtcclxuICAgICIsImNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuICAgIFxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAganVtcEhlaWdodDogMCxcclxuICAgIGp1bXBEdXJhdGlvbjogMCxcclxuICAgIG1heE1vdmVTcGVlZDogMCxcclxuICAgIGFjY2VsOiAwLFxyXG4gICAganVtcEF1ZGlvOiB7XHJcbiAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgdXJsOiBjYy5BdWRpb0NsaXBcclxuICAgIH0sXHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBzZXRKdW1wQWN0aW9uOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIganVtcFVwID0gY2MubW92ZUJ5KHRoaXMuanVtcER1cmF0aW9uLCBjYy5wKDAsIHRoaXMuanVtcEhlaWdodCkpLmVhc2luZyhjYy5lYXNlQ3ViaWNBY3Rpb25PdXQoKSk7XHJcbiAgICB2YXIganVtcERvd24gPSBjYy5tb3ZlQnkodGhpcy5qdW1wRHVyYXRpb24sIGNjLnAoMCwgLXRoaXMuanVtcEhlaWdodCkpLmVhc2luZyhjYy5lYXNlQ3ViaWNBY3Rpb25JbigpKTtcclxuICAgIHZhciBjYWxsYmFjayA9IGNjLmNhbGxGdW5jKHRoaXMucGxheUp1bXBTb3VuZCwgdGhpcyk7XHJcbiAgICByZXR1cm4gY2MucmVwZWF0Rm9yZXZlcihjYy5zZXF1ZW5jZShqdW1wVXAsIGp1bXBEb3duLCBjYWxsYmFjaykpO1xyXG4gICAgfSxcclxuICAgIFxyXG4gICAgcGxheUp1bXBTb3VuZDogZnVuY3Rpb24gKCkge1xyXG4gICAgY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCh0aGlzLmp1bXBBdWRpbywgZmFsc2UpO1xyXG4gICAgfSxcclxuICAgIFxyXG4gICAgc2V0SW5wdXRDb250cm9sOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICBjYy5ldmVudE1hbmFnZXIuYWRkTGlzdGVuZXIoe1xyXG4gICAgZXZlbnQ6IGNjLkV2ZW50TGlzdGVuZXIuS0VZQk9BUkQsXHJcbiAgICBvbktleVByZXNzZWQ6IGZ1bmN0aW9uKGtleUNvZGUsIGV2ZW50KSB7XHJcbiAgICBzd2l0Y2goa2V5Q29kZSkge1xyXG4gICAgY2FzZSBjYy5LRVkuYTpcclxuICAgIHNlbGYuYWNjTGVmdCA9IHRydWU7XHJcbiAgICBzZWxmLmFjY1JpZ2h0ID0gZmFsc2U7XHJcbiAgICBicmVhaztcclxuICAgIGNhc2UgY2MuS0VZLmQ6XHJcbiAgICBzZWxmLmFjY0xlZnQgPSBmYWxzZTtcclxuICAgIHNlbGYuYWNjUmlnaHQgPSB0cnVlO1xyXG4gICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgICB9LFxyXG4gICAgb25LZXlSZWxlYXNlZDogZnVuY3Rpb24oa2V5Q29kZSwgZXZlbnQpIHtcclxuICAgIHN3aXRjaChrZXlDb2RlKSB7XHJcbiAgICBjYXNlIGNjLktFWS5hOlxyXG4gICAgc2VsZi5hY2NMZWZ0ID0gZmFsc2U7XHJcbiAgICBicmVhaztcclxuICAgIGNhc2UgY2MuS0VZLmQ6XHJcbiAgICBzZWxmLmFjY1JpZ2h0ID0gZmFsc2U7XHJcbiAgICBicmVhaztcclxuICAgIH1cclxuICAgIH1cclxuICAgIH0sIHNlbGYubm9kZSk7XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuanVtcEFjdGlvbiA9IHRoaXMuc2V0SnVtcEFjdGlvbigpO1xyXG4gICAgdGhpcy5ub2RlLnJ1bkFjdGlvbih0aGlzLmp1bXBBY3Rpb24pO1xyXG4gICAgXHJcbiAgICB0aGlzLmFjY0xlZnQgPSBmYWxzZTtcclxuICAgIHRoaXMuYWNjUmlnaHQgPSBmYWxzZTtcclxuICAgIHRoaXMueFNwZWVkID0gMDtcclxuICAgIFxyXG4gICAgdGhpcy5zZXRJbnB1dENvbnRyb2woKTtcclxuICAgIH0sXHJcbiAgICBcclxuICAgIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XHJcbiAgICBpZiAodGhpcy5hY2NMZWZ0KSB7XHJcbiAgICB0aGlzLnhTcGVlZCAtPSB0aGlzLmFjY2VsICogZHQ7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuYWNjUmlnaHQpIHtcclxuICAgIHRoaXMueFNwZWVkICs9IHRoaXMuYWNjZWwgKiBkdDtcclxuICAgIH1cclxuICAgIGlmICggTWF0aC5hYnModGhpcy54U3BlZWQpID4gdGhpcy5tYXhNb3ZlU3BlZWQgKSB7XHJcbiAgICB0aGlzLnhTcGVlZCA9IHRoaXMubWF4TW92ZVNwZWVkICogdGhpcy54U3BlZWQgLyBNYXRoLmFicyh0aGlzLnhTcGVlZCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHRoaXMubm9kZS54ICs9IHRoaXMueFNwZWVkICogZHQ7XHJcbiAgICB9LFxyXG4gICAgfSk7XHJcbiAgICAiLCJjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcbiAgICBcclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgIHBpY2tSYWRpdXM6IDAsXHJcbiAgICBnYW1lOiB7XHJcbiAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgc2VyaWFsaXphYmxlOiBmYWxzZVxyXG4gICAgfVxyXG4gICAgfSxcclxuICAgIFxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICBcclxuICAgIH0sXHJcbiAgICBnZXRQbGF5ZXJEaXN0YW5jZTogZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHBsYXllclBvcyA9IHRoaXMuZ2FtZS5wbGF5ZXIuZ2V0UG9zaXRpb24oKTtcclxuICAgIHZhciBkaXN0ID0gY2MucERpc3RhbmNlKHRoaXMubm9kZS5wb3NpdGlvbiwgcGxheWVyUG9zKTtcclxuICAgIHJldHVybiBkaXN0O1xyXG4gICAgfSxcclxuICAgIG9uUGlja2VkOiBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuZ2FtZS5zcGF3bk5ld1N0YXIoKTtcclxuICAgIHRoaXMuZ2FtZS5nYWluU2NvcmUoKTtcclxuICAgIHRoaXMubm9kZS5kZXN0cm95KCk7XHJcbiAgICB9LFxyXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcclxuICAgIGlmICh0aGlzLmdldFBsYXllckRpc3RhbmNlKCkgPCB0aGlzLnBpY2tSYWRpdXMpIHtcclxuICAgIHRoaXMub25QaWNrZWQoKTtcclxuICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHZhciBvcGFjaXR5UmF0aW8gPSAxIC0gdGhpcy5nYW1lLnRpbWVyL3RoaXMuZ2FtZS5zdGFyRHVyYXRpb247XHJcbiAgICB2YXIgbWluT3BhY2l0eSA9IDUwO1xyXG4gICAgdGhpcy5ub2RlLm9wYWNpdHkgPSBtaW5PcGFjaXR5ICsgTWF0aC5mbG9vcihvcGFjaXR5UmF0aW8gKiAoMjU1IC0gbWluT3BhY2l0eSkpO1xyXG4gICAgfSxcclxuICAgIH0pO1xyXG4gICAgIl0sInNvdXJjZVJvb3QiOiIifQ==