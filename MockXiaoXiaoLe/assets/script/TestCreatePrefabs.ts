import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
import PoolManager from './manager/PoolManager';
import MapManager from './manager/MapManager';
import Tile from './component/Tile';
import { TileType } from './type/Enum';
const { ccclass, property } = _decorator;

@ccclass('TestCreatePrefabs')
export class TestCreatePrefabs extends Component {
    @property(Prefab)
    prefabs: Prefab;

    private static instance: TestCreatePrefabs;

    protected onLoad(): void {
        TestCreatePrefabs.instance = this
    }

    static init() {
        this.instance.addNode();
    }

    start() {
        // this.addCode();
    }

    update(deltaTime: number) {

    }
    private addNode() {
        let node1 = instantiate(this.prefabs);
        node1.setPosition(new Vec3(0, 0, 0));
        this.node.addChild(node1);

        // let nodeP = PoolManager.get();
        // nodeP.setPosition(new Vec3(-100, 0, 0));
        // this.node.addChild(nodeP);

        let x = 1;
        let y = 1;
        let node = PoolManager.get();
        let pos = MapManager.getPos(x, y);
        node.setPosition(pos);
        let tile = node.getComponent(Tile);
        tile.init();
        tile.setCoord(x, y);
        tile.setType(TileType.A);
        tile.appear();
        this.node.addChild(node);
    }

}


