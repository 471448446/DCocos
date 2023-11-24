import { _decorator, Component, EventTouch, Input, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Test')
export class Test extends Component {
    start() {
        this.node.on(Input.EventType.TOUCH_START, this.touchStart, this);
    }

    update(deltaTime: number) {

    }
    touchStart(e: EventTouch) {
        console.log(this.node.name + "-->touchStart() " + e.target.name);
    }
}


