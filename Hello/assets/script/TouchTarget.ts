import { _decorator, Component, director, EventTouch, Input, Node } from 'cc';
const { ccclass, property } = _decorator;
/**
 * 演示节点重合时，事件的归属问题
 * B2(黄色)和B（绿色）都是A（大背景）的子节点，他们是同级节点，如果重合，事件会先从或绘制的节点上开始分发，先从最上层的分发。
 */
@ccclass('TouchBubble')
export class TouchBubble extends Component {
    @property(Node)
    nodeA: Node;

    @property(Node)
    nodeB: Node;

    @property(Node)
    nodeC: Node;

    @property(Node)
    nodeB2: Node;

    @property(Node)
    nodeC2: Node;

    start() {
    }

    protected onEnable(): void {
        this.nodeA.on(Input.EventType.TOUCH_START, this.touchA, this)
        this.nodeB.on(Input.EventType.TOUCH_START, this.touchB, this)
        this.nodeC.on(Input.EventType.TOUCH_START, this.touchC, this)
        this.nodeB2.on(Input.EventType.TOUCH_START, this.touchB2, this)
        this.nodeC2.on(Input.EventType.TOUCH_START, this.touchC2, this)
    }
    protected onDisable(): void {
        this.nodeA.off(Input.EventType.TOUCH_START, this.touchA, this)
        this.nodeB.off(Input.EventType.TOUCH_START, this.touchB, this)
        this.nodeC.off(Input.EventType.TOUCH_START, this.touchC, this)
        this.nodeB2.off(Input.EventType.TOUCH_START, this.touchB2, this)
        this.nodeC2.off(Input.EventType.TOUCH_START, this.touchC2, this)
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
    private touchB2(ev: EventTouch) {
        console.log("B2 touch" + ev.getLocation());
    }
    private touchC2(ev: EventTouch) {
        console.log("C2 touch" + ev.getLocation());
    }
}


