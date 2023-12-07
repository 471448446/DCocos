import { _decorator, CCFloat, Component, director, EventKeyboard, Input, input, KeyCode, Node, RigidBody, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerMovement')
export class PlayerMovement extends Component {
    /**
     * 移动速度
     */
    // @property(Number)
    // speed: number;
    @property(RigidBody)
    rigidBody: RigidBody;
    @property(CCFloat)
    forward: number = 0;
    @property(CCFloat)
    leftWard: number = 0;
    @property(CCFloat)
    rigthtWard: number = 0;

    isPressLeft = false;
    isPressRigtht = false;

    start() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    protected onDestroy(): void {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_DOWN, this.onKeyUp, this);
    }

    update(deltaTime: number) {
        // this.rigidBody.applyForce(new Vec3(0, 0, -500/60));
        // 和时间相关的增量都和deltaTime关联。每秒500。这样不管帧率是多少，效果是一样的。
        this.rigidBody.applyForce(new Vec3(0, 0, this.forward * deltaTime));
        if (this.isPressLeft) {
            this.rigidBody.applyForce(new Vec3(this.leftWard * deltaTime, 0, 0));
        }
        if (this.isPressRigtht) {
            this.rigidBody.applyForce(new Vec3(this.rigthtWard * -1 * deltaTime, 0, 0));
        }
        if (this.node.position.y < 0) {
            this.enabled = false;
            console.log("失败！！");
            // 重玩
            // director.loadScene(director.getScene().name);
            director.getScene().emit("game-fail");
        }
    }

    onKeyDown(ev: EventKeyboard) {
        switch (ev.keyCode) {
            case KeyCode.KEY_A:
                this.isPressLeft = true;
                console.log("down A");
                break;
            case KeyCode.KEY_D:
                this.isPressRigtht = true;
                console.log("down D");
                break;
            default:
                break;
        }
    }

    onKeyUp(ev: EventKeyboard) {
        switch (ev.keyCode) {
            case KeyCode.KEY_A:
                this.isPressLeft = false;
                console.log("up A");
                break;
            case KeyCode.KEY_D:
                this.isPressRigtht = false;
                console.log("up A");
                break;
            default:
                break;
        }
    }
}


