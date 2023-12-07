import { _decorator, BoxCollider, Component, director, ICollisionEvent, ITriggerEvent, Node } from 'cc';
import { PlayerMovement } from './PlayerMovement';
const { ccclass, property } = _decorator;

@ccclass('PlayerCollsion')
export class PlayerCollsion extends Component {

    start() {
        let collider = this.node.getComponent(BoxCollider);
        collider.on('onCollisionEnter', this.onCollisionEnter, this);
        collider.on('onTriggerEnter', this.onTriggerEnter, this);
    }
    protected onDestroy(): void {
        let collider = this.node.getComponent(BoxCollider);
        collider.off('onCollisionEnter', this.onCollisionEnter, this);
        collider.off('onTriggerEnter', this.onTriggerEnter, this);
    }

    update(deltaTime: number) {

    }

    onCollisionEnter(even: ICollisionEvent) {
        // 检查碰撞的名称
        if (even.otherCollider.node.name == "Obstacle") {
            let movment = this.node.getComponent(PlayerMovement);
            movment.enabled = false;
            console.log("失败！！");
            // 重玩
            // director.loadScene(director.getScene().name);
            // 这里显示失败界面，可以直接引用UIManager组件，但是这样就造成了3D组件和UI组件相互引用的情况。增加了复杂度。
            director.getScene().emit("game-fail");
        }
    }

    onTriggerEnter(even: ITriggerEvent) {
        // 检查碰撞的名称
        console.log("done" + even.otherCollider.node.name);
        let movment = this.node.getComponent(PlayerMovement);
        movment.enabled = false;
        director.getScene().emit("game-next");
        // if (director.getScene().name == "Level01") {
        //     director.loadScene("Level02");
        // }
        // if (director.getScene().name == "Level02") {
        //     director.loadScene("Level03");
        // }
    }

}


