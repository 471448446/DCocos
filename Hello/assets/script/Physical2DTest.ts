import { _decorator, Component, Node, RigidBody, RigidBody2D, UITransform, v2, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 使一个物体运动：施加力、施加冲量。默认是受力点是质心，如果不在质心，会发生旋转。
 * https://docs.cocos.com/creator/manual/zh/physics-2d/physics-2d-rigid-body.html
 */
@ccclass('Physical2DTest')
export class Physical2DTest extends Component {


    start() {

    }

    update(deltaTime: number) {

    }

    /**
     * 通过施加一个力，使物体发生运动
     */
    onClickMoveUseForce() {
        let rigidBody = this.node.getComponent(RigidBody2D);
        rigidBody.applyForceToCenter(v2(-500, -500), true)
    }
    /**
     * 用过速度改变物体，使物体发生运动
     */
    onClickMoveUseSpeed() {
        let rigidBody = this.node.getComponent(RigidBody2D);
        rigidBody.linearVelocity = v2(-500, -500);
    }
    /**
     * 用冲量物体，使物体发生运动
     */
    onClickMoveUseImpulse() {
        let rigidBody = this.node.getComponent(RigidBody2D);
        rigidBody.applyLinearImpulseToCenter(v2(-500, -500), true);
    }

    /**
     * 通过施加一个力，使物体发生旋转，如果不施加在质心，就会发生旋转
     */
    onClickAngularUseForce() {
        let rigidBody = this.node.getComponent(RigidBody2D);
        let sizeTransform = this.node.getComponent(UITransform);
        let p = this.node.getWorldPosition()
        console.log(
            "节点的世界坐标：" + this.node.getWorldPosition() +
            "质心：" + rigidBody.getLocalCenter(v2(0, 0)) +
            "质心的世界：" + rigidBody.getWorldCenter(v2(0, 0))
        );
        // 等同于作用于质心
        // rigidBody.applyForce(v2(500, 500), v2(p.x, p.y), true)
        // 力不在质心会发生旋转
        // let point = v2(p.x -sizeTransform.width, p.y - sizeTransform.height);
        // console.log("力作用点：" + point);
        let localPoint = v2(sizeTransform.width, sizeTransform.height);
        // let localPoint = v2(0, 0);
        let worldPoint = new Vec2();

        // 测试
        rigidBody.getWorldPoint(v2(0, 0), worldPoint)
        console.log(v2(0, 0) + ",世界：" + worldPoint);

        rigidBody.getWorldPoint(localPoint, worldPoint)
        console.log(localPoint + "," + worldPoint);
        rigidBody.applyForce(v2(500, 500), worldPoint, true)
    }
    /**
     * 旋转速度
     */
    onClickAngularUseSpeed() {
        let rigidBody = this.node.getComponent(RigidBody2D);
        rigidBody.angularVelocity = 50
    }
}


