import { _decorator, BoxCollider2D, Collider2D, Component, Contact2DType, director, IPhysics2DContact, log, Node, RigidBody2D, v2 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 这里没有用预制体！！！
 * 参与碰撞的物体，需要设置成刚体，设置重力为0。同时用Collider约束碰撞范围。
 * 2D刚体：https://docs.cocos.com/creator/manual/zh/physics-2d/physics-2d-rigid-body.html
 */
@ccclass('Physical2DRigeBodyTest_Ball')
export class Physical2DRigeBodyTest_Ball extends Component {

    ballRididBody: RigidBody2D;
    ballCollider: BoxCollider2D;
    // 
    isHit: boolean;
    // 是否开始移动
    isStart: Boolean;

    tmp = 0;
    start() {
        this.ballRididBody = this.node.getComponent(RigidBody2D);
        this.ballCollider = this.node.getComponent(BoxCollider2D);
        log("球体质量：" + this.ballRididBody.getMass());

        this.ballCollider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContract, this);

    }
    protected onDestroy(): void {
        this.ballCollider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContract, this);
    }

    update(deltaTime: number) {
    }

    /**
     * 点击球体
     */
    onClickShootBool() {
        this.ballRididBody.applyForceToCenter(v2(0, 20000), true);
    }

    onBeginContract(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // console.log(selfCollider.name + "," + otherCollider.name);
    }
}


