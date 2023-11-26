import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

import TileManager from './manager/TileManager';
import MapManager from './manager/MapManager';

@ccclass('Game')
export class Game extends Component {
    start() {
        MapManager.init();
        TileManager.init();
    }

    update(deltaTime: number) {

    }
}


