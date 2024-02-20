import { _decorator, CCBoolean, Component, Node, tween, v3 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * https://docs.cocos.com/creator/manual/zh/physics/physics-rigidbody.html
 * 刚体类型
 */
@ccclass('Phy3DRigideType')
export class Phy3DRigideType extends Component {
    @property(CCBoolean)
    moveLeft: boolean;
    start() {
        const moveStep = 1.5;
        this.node.position = v3(0, 0, this.moveLeft ? -1 : 1)
        tween(this.node)

            .repeatForever(
                tween()
                    .by(2, {
                        position: v3(0, 0, this.moveLeft ? -moveStep : moveStep)
                    })
                    .by(2, {
                        position: v3(0, 0, this.moveLeft ? moveStep : -moveStep)
                    })
            )
            .start()
    }

    update(deltaTime: number) {

    }
}


