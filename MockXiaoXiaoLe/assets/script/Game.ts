import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

import TileManager from './manager/TileManager';
import MapManager from './manager/MapManager';
import { TestCreatePrefabs } from './TestCreatePrefabs';

@ccclass('Game')
export class Game extends Component {
    start() {
        MapManager.init();
        TileManager.init();
        TestCreatePrefabs.init();
    }

    update(deltaTime: number) {

    }
}


