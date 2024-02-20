import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
/**
 * 修改刚体质心：https://docs.cocos.com/creator/manual/zh/physics/physics-rigidbody.html
 * 但是修改后，指是碰撞体的位置变化了，并不是质心修改了，类似问题：https://forum.cocos.org/t/topic/154816
 */
@ccclass('Phy3DRigideMass')
export class Phy3DRigideMass extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }
}


