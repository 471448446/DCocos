import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FollowPlayer')
export class FollowPlayer extends Component {
    @property(Node)
    player: Node;

    /**
     * 摄像机和游戏人物的偏移量
     */
    @property(Vec3)
    offset: Vec3 = new Vec3();

    tmpPos = new Vec3();

    start() {

    }

    update(deltaTime: number) {
        // 直接跟随player视角，效果不好
        // this.node.position = this.player.position;
        // 加一个偏移量。注意摄像机沿Y轴翻转了。
        this.player.getPosition(this.tmpPos);
        this.tmpPos.add(this.offset);
        this.node.position = this.tmpPos;
    }
}


