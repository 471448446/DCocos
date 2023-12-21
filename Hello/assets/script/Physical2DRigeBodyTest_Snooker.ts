import { _decorator, CircleCollider2D, Collider2D, Component, Contact2DType, EventTarget, IPhysics2DContact } from 'cc';
import eventSource from './EventUtils';
const { ccclass, property } = _decorator;

@ccclass('Physical2DRigeBodyTest_Ball')
export class Physical2DRigeBodyTest_Ball extends Component {

    collider: CircleCollider2D;
    eventTarget: EventTarget = new EventTarget();

    start() {
        this.collider = this.node.getComponent(CircleCollider2D);
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContract, this);
    }

    protected onDestroy(): void {
        this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContract, this);
    }

    update(deltaTime: number) {

    }
    onBeginContract(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        console.log(selfCollider.name + "," + otherCollider.name);
        if (otherCollider.name.startsWith("Hole")) {
            eventSource.emit("hole");
        }
    }
}


