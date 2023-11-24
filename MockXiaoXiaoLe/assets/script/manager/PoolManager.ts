import { _decorator, Component, Prefab, NodePool, instantiate, Tween, Node } from 'cc';
const { ccclass, property } = _decorator;
import Tile from "../component/Tile";

/**
 * 管理游戏中频繁用到的预制体
 */
@ccclass('PoolManager')
export default class PoolManager extends Component {

    @property(Prefab)
    private tilePrefab: Prefab = null;

    private tilePool: NodePool = new NodePool(Tile);

    private static instance: PoolManager = null;

    protected onLoad() {
        PoolManager.instance = this;
    }

    /**
     * 获取节点
     */
    public static get() {
        if (this.instance.tilePool.size() > 0) {
            return this.instance.tilePool.get();
        }
        else {
            return instantiate(this.instance.tilePrefab);
        }
    }

    /**
     * 存入节点
     * @param node
     */
    public static put(node: Node) {
        Tween.stopAllByTarget(node);
        if (this.instance.tilePool.size() < 30) this.instance.tilePool.put(node);
        else node.destroy();
    }
}


