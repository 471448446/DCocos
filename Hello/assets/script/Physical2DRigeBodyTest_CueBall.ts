import { _decorator, CCFloat, CCInteger, Collider2D, Component, EventTouch, Input, Label, Mask, math, Node, Prefab, RigidBody, RigidBody2D, UITransform, v2, v3, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Physical2DRigeBodyTest_CueBall')
export class Physical2DRigeBodyTest_CueBall extends Component {
    // 白球
    @property(Node)
    whiteBallNode: Node;
    // 球杆提示
    @property(Node)
    cueHandleNode: Node;
    // 球杆
    @property(Node)
    cueNode: Node;
    // 力量提示
    @property(Label)
    tileNumberNode: Label;
    // 力度
    @property(CCInteger)
    scaleForce: number = 100;
    // 提示文案偏移量
    @property(Vec2)
    // 尼玛，这种需要初始化
    offsetTileNumber: Vec2 = new Vec2(0, 0);
    // 球杆偏移量
    @property(Vec2)
    offsetCueNumber: Vec2 = v2(0, 0);


    private touchStartPoint: Vec2;
    /**
     * 是否在拉杆的模式
     */
    private enableDrag: boolean;

    start() {
        this.whiteBallNode.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.whiteBallNode.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.whiteBallNode.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        //https://forum.cocos.org/t/topic/139987/2
        this.whiteBallNode.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        // 不展示
        this.cueHandleNode.active = false;
        // console.log("节点大小"+this.node.getComponent(UITransform).contentSize);
    }

    protected onDestroy(): void {
        this.whiteBallNode.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.whiteBallNode.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.whiteBallNode.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.whiteBallNode.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    update(deltaTime: number) {

    }

    onTouchStartParent(ev: EventTouch) {
        console.log("父节点按下位置：" + this.touchStartPoint);
    }

    onTouchStart(ev: EventTouch) {
        // ev.propagationStopped = true;
        this.enableDrag = true;
        this.touchStartPoint = ev.getUILocation();
        // 设置提示UI的位置，因为他们在一个节点下，并且偏移量是0
        this.cueHandleNode.position = this.whiteBallNode.position;
        console.log("按下位置：" + this.touchStartPoint);
    }

    onTouchMove(ev: EventTouch) {
        if (!this.enableDrag) {
            return;
        }
        this.refreshTile(ev.getUILocation());
    }

    onTouchEnd(ev: EventTouch) {
        const isDrag = this.enableDrag;
        this.enableDrag = false;
        if (!isDrag) {
            return;
        }
        /**
         * 这里一定要注意，触摸事件的分发规则，如果节点的大小太小，如果触摸到节点的外面了，是无法收到触摸结束事件的！！
         * 这里跟Android不一样，在Android中，只要知道了事件接受者了，我滑到哪，都可以接受到结束事件。
         * 
         * cocos Creator中的触摸事件是基于事件派发机制实现的。当触摸事件发生时，
         * 会先派发给触摸事件发生的节点，然后再派发给该节点的父节点，一直到根节点。
         * 如果触摸事件在节点外部发生，那么该节点将不会收到触摸事件。
         * 
         * 但是，手指抬起的时候，这里可以收到CANCEL事件用来提代结束事件
         * 
         */

        console.log("抬起位置：" + ev.getUILocation());
        this.refreshTile(ev.getUILocation(), true);

    }

    private refreshTile(p2: Vec2, shoot: boolean = false) {
        const distance = Math.round(this.getDistance(this.touchStartPoint, p2));
        const force = Math.round(distance * this.scaleForce);
        const angle = Math.round(this.getAngle(this.touchStartPoint, p2) * 100) / 100;

        if (!this.cueHandleNode.active) {
            this.cueHandleNode.active = true;
        }

        this.tileNumberNode.string = "力度：" + force;
        const curPosition = v3(0, -distance, 0).add(
            v3(this.offsetCueNumber.x, this.offsetCueNumber.y, 0)
        )
        this.cueNode.position = curPosition;
        this.cueHandleNode.angle = angle + 180;

        if (!shoot) {
            return;
        }

        this.cueHandleNode.active = false;
        this.cueHandleNode.angle = 0;
        // 先将角度，转换成绕Y轴正方先顺时针旋转的角度
        let useAngel = 0;
        if (angle < 0) {
            useAngel = -angle;
        } else if (angle > 0) {
            useAngel = 360 - angle;
        }
        console.log("dis:" + distance + ",force:" + force + ",夹角：" + angle + "," + useAngel);

        const rigidBody = this.whiteBallNode.getComponent(RigidBody2D);
        const forceX = Math.sin(useAngel) * force;
        const forceY = Math.cos(useAngel) * force;
        console.log("dis:" + distance + ",force:" + force +
            ",angle：" + angle +
            ",xForce:" + Math.round(forceX) + ",forceY:" + Math.round(forceY));

        rigidBody.applyForceToCenter(v2(forceX, forceY), true);
    }

    private getDistance(p1: Vec2, p2: Vec2): number {
        const deltaPoint = v2(p1.x - p2.x, p1.y - p2.y);
        return Math.sqrt(Math.pow(deltaPoint.x, 2) + Math.pow(deltaPoint.y, 2));
    }
    // 角度
    private getAngle(p1: Vec2, p2: Vec2): number {
        //向量p1->p2
        let dir = v2(p2.x - p1.x, p2.y - p1.y);

        //根据朝向计算出夹角弧度
        let angle = dir.signAngle(v2(0, 1));

        //将弧度转换为欧拉角
        let degree = angle / Math.PI * 180;

        return -degree
    }

}


