import { _decorator, BoxCollider2D, Collider2D, Component, Contact2DType, director, IPhysics2DContact, log, Node, RigidBody2D, UITransform, v2 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 这里没有用预制体！！！
 */
@ccclass('Physical2DRigeBodyTest_Ball')
export class Physical2DRigeBodyTest_Ball extends Component {

    collider: BoxCollider2D;

    start() {
        this.collider = this.getComponent(BoxCollider2D);
        const sizeForm = this.node.getComponent(UITransform);
        this.collider.size.width = sizeForm.width;
        this.collider.size.height = sizeForm.height;
        console.log(this.node.name + "墙壁大小:" + sizeForm.width + "," + sizeForm.height + ",碰撞体：" + this.collider.size.width + "," + this.collider.size.height);

    }

    protected onDestroy(): void {
    }

    update(deltaTime: number) {

    }

}


