import { _decorator, Component, Node, RigidBody, tween, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Phy3DHingeConstrant')
export class Phy3DHingeConstrant extends Component {
    start() {

    }

    update(deltaTime: number) {

    }

    onClickOpenDoor() {
        let rigidbody = this.node.getComponent(RigidBody);
        rigidbody.applyForce(v3(0, 0, 10000));
    }
}


