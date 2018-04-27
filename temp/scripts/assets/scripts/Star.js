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