import { _decorator, Component, EventTarget, Label, Node } from 'cc';
const { ccclass, property } = _decorator;
import eventSource from './EventUtils';

@ccclass('Physical2DRigeBodyTest_Tile')
export class Physical2DRigeBodyTest_Tile extends Component {
    // eventTarget: EventTarget = new EventTarget();
    private score: number = 0;
    private label: Label;
    start() {
        eventSource.on("hole", this.onEnterHole, this);
        this.label = this.node.getComponent(Label);
    }
    protected onDestroy(): void {
        eventSource.off("hole", this.onEnterHole);
    }

    update(deltaTime: number) {

    }

    onEnterHole() {
        this.score++;
        this.label.string = "得分：" + this.score;
    }
}


