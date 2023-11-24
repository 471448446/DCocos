import { _decorator, Component, EventTouch, Input, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TestCom')
export class TestCom extends Component {
    protected start(): void {
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }
    // protected onLoad(): void {
    //     this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    // }
    protected onDestroy(): void {
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);

    }
    update(deltaTime: number) {

    }
    /**
     * touchstart 回调
     * @param e 参数
     */
    private onTouchStart(e: EventTouch) {
        // GameEvent.emit(TileEvent.TouchStart, this._coord.copy(), e.getLocation());
        console.log("send onTouchStart()" + e.getLocation());
    }

}


