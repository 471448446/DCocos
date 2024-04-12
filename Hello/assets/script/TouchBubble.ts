import { _decorator, Component, director, EventTouch, Input, Node } from 'cc';
const { ccclass, property } = _decorator;
/**
 * 演示父子几点之间的事件冒泡
 */
@ccclass('TouchBubble')
export class TouchBubble extends Component {
    @property(Node)
    nodeA: Node;

    @property(Node)
    nodeB: Node;

    @property(Node)
    nodeC: Node;

    start() {
    }
    
    protected onEnable(): void {
        this.nodeA.on(Input.EventType.TOUCH_START, this.touchA, this)
        this.nodeB.on(Input.EventType.TOUCH_START, this.touchB, this)
        this.nodeC.on(Input.EventType.TOUCH_START, this.touchC, this)
    }
    protected onDisable(): void {
        this.nodeA.off(Input.EventType.TOUCH_START, this.touchA, this)
        this.nodeB.off(Input.EventType.TOUCH_START, this.touchB, this)
        this.nodeC.off(Input.EventType.TOUCH_START, this.touchC, this)
    }

    update(deltaTime: number) {

    }

    private touchA(ev: EventTouch) {
        console.log("A touch " + ev.getLocation());
    }
    private touchB(ev: EventTouch) {
        console.log("B touch" + ev.getLocation());
    }
    private touchC(ev: EventTouch) {
        console.log("C touch" + ev.getLocation());
    }
}


