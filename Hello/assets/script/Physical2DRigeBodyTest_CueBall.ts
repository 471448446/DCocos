import { _decorator, CCFloat, CCInteger, Collider2D, Component, EventTouch, Input, Label, Mask, math, Node, Prefab, RigidBody, RigidBody2D, tween, UITransform, v2, v3, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Physical2DRigeBodyTest_CueBall')
export class Physical2DRigeBodyTest_CueBall extends Component {
    // 白球
    @property(Node)
    whiteBallNode: Node;
    // 球杆提示
    @property(Node)
    cueRootNode: Node;
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

    // 人家触摸类里面记录了
    // private touchStartPoint: Vec2;

    start() {
        this.whiteBallNode.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.whiteBallNode.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.whiteBallNode.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        //https://forum.cocos.org/t/topic/139987/2
        this.whiteBallNode.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        // 不展示
        this.cueRootNode.active = false;
        // console.log("节点大小"+this.node.getComponent(UITransform).contentSize);
    }

    protected onDestroy(): void {
        // 此时whiteBallNode已经获取不到了
        // this.whiteBallNode.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        // this.whiteBallNode.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        // this.whiteBallNode.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        // this.whiteBallNode.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    update(deltaTime: number) {

    }

    onTouchStart(ev: EventTouch) {
        // 设置提示UI的位置，因为他们在一个节点下，并且偏移量是0
        this.cueRootNode.position = this.whiteBallNode.position;
        console.log("按下位置：" + ev.getLocation());
    }

    onTouchMove(ev: EventTouch) {
        this.refreshTile(ev);
    }

    onTouchEnd(ev: EventTouch) {
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

        console.log("抬起位置：" + ev.getLocation());
        this.refreshTile(ev, true);

    }

    private refreshTile(ev: EventTouch, shoot: boolean = false) {
        if (!this.cueRootNode.active) {
            this.cueRootNode.active = true;
        }

        const p1 = ev.getStartLocation();
        const p2 = ev.getLocation();
        // 
        const p2p1 = v2(p1.x - p2.x, p1.y - p2.y);
        const angle = this.getAngleWithY(p2p1);

        // console.log(
        //     "v:" + p2p1 +
        //     ",angle:" + angle
        // );
        // 保留小数点2位
        const distance = Math.round(Math.sqrt(Math.pow(p2p1.x, 2) + Math.pow(p2p1.y, 2)) * 100) / 100;
        const force = Math.round(distance * this.scaleForce * 100) / 100;
        console.log(distance + "," + force);

        this.tileNumberNode.string = "力度：" + force;
        // 这里只移动y轴，是因为，节点的坐标是y轴正方向是屏幕朝上
        const cueDefaultPosition = v3(this.offsetCueNumber.x, this.offsetCueNumber.y, 0);
        const curPosition = v3(0, -distance, 0).add(
            v3(this.offsetCueNumber.x, this.offsetCueNumber.y, 0)
        )
        this.cueNode.position = curPosition;
        /**  
         * 节点的旋转是从y轴的正方向，正数，逆时针旋转。负数，顺时针旋转。
         * 想想一下，如果力的方向是x轴正方向，此时angle为90，但是节点要旋转270。
         */
        this.cueRootNode.angle = 360 - angle;
        if (!shoot) {
            return;
        }
        const moveBackY = cueDefaultPosition.y - curPosition.y;
        // tween这个叫缓动，不是动画：https://docs.cocos.com/creator/manual/zh/tween/
        tween(this.cueNode)
            .by(0.8, { position: v3(0, moveBackY, 0) }, { easing: 'sineIn' })
            .call(() => {
                // 撞击声音
                const forceX = Math.round(p2p1.x * this.scaleForce * 100) / 100;
                const forceY = Math.round(p2p1.y * this.scaleForce * 100) / 100;
                const rigidBody = this.whiteBallNode.getComponent(RigidBody2D);
                //这里力的作用点是直接作用于质心。可以根据，起点和终点，的偏移量，对应的修改力的作用点。
                rigidBody.applyForceToCenter(v2(forceX, forceY), true);
                // rigidBody.linearVelocity =  v2(forceX, forceY) ;

                this.cueRootNode.active = false;
                this.cueRootNode.angle = 0;
            })
            .start();
    }

    /**
     * 逆时针为正
     * @param vect 计算向量与y轴正方向的夹角
     * @returns 
     */
    private getAngleWithY(vect: Vec2): number {
        //根据朝向计算出夹角弧度。文档上说逆时针为正，顺时针为负。取值范围： (-PI, PI]
        // 比如向量朝x正方向，值为正数90度。朝x轴负方向，值为负数-90度。
        let angle = vect.signAngle(v2(0, 1));

        //将弧度转换为欧拉角
        let degree = angle / Math.PI * 180;
        let result = 0;
        // 统一成旋转一圈的角度，逆时针为正数。
        if (degree > 0) {
            result = degree;
        } else if (degree < 0) {
            result = 360 + degree;
        }
        // console.log("k:" + vect + "//" + degree + "/3/" + result);

        return Math.round(result * 100) / 100
    }

}


