import { _decorator, Component, director, game, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('splash')
export class Splash extends Component {

    @property(Label)
    loadingLabel: Label;

    timer = 0
    start() {
        // 模拟加载
        const startTime = game.frameStartTime;
        let count = 0;
        this.timer = setInterval(() => {
            count++;
            if (count > 100) {
                clearInterval(this.timer);
                console.log("Splash load cast:" + Math.round(game.frameStartTime - startTime) + "ms");
                director.loadScene('scene/Main');
                return;
            }
            this.loadingLabel.string = "正在加载：" + count + "/100"
        }, 20);
    }

    update(deltaTime: number) {

    }
}


