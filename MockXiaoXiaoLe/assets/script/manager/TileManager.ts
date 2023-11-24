//管理所有方块逻辑和操作实现，也是游戏最重要的模块之一

import Tile from "../component/Tile";
import { SlidDirection, TileEvent, TileType } from "../type/Enum";
import GameConfig from "../config/GameConfig";
import GameUtil from "../util/GameUtil";
import PoolManager from "./PoolManager";
import MapManager from "./MapManager";

import { _decorator, Component, Node, tween, Vec2 } from 'cc';
import { Coordinate } from "../type/DataStructure";
import { GameEvent } from "../util/GameEvent";
const { ccclass, property } = _decorator;

/**
 * 管理所有方块逻辑和操作实现
 */
@ccclass('TileManager')
export default class TileManager extends Component {

    @property(Node)
    private container: Node = null; // 所有方块的容器

    @property(Node)
    private selectFrame: Node = null; // 选中框

    private typeMap: TileType[][] = null; // 类型表：二维数组，保存所有方块的类型，方便计算

    private tileMap: Tile[][] = null; // 组件表：二维数组，保存所有方块 Tile 组件，方便读取

    private selectedCoord: Coordinate = null; // 当前已经选中的方块坐标

    private tileTouchStartPos: Vec2 = null; // 滑动开始位置

    private static instance: TileManager = null

    protected onLoad() {
        TileManager.instance = this;
        GameEvent.on(TileEvent.TouchStart, this.onTileTouchStart, this);
        GameEvent.on(TileEvent.TouchEnd, this.onTileTouchEnd, this);
        GameEvent.on(TileEvent.TouchCancel, this.onTileTouchCancel, this);
    }

    protected onDestroy() {
        GameEvent.off(TileEvent.TouchStart, this.onTileTouchStart, this);
        GameEvent.off(TileEvent.TouchEnd, this.onTileTouchEnd, this);
        GameEvent.off(TileEvent.TouchCancel, this.onTileTouchCancel, this);
    }

    public static init() {
        this.instance.generateInitTypeMap();
        this.instance.generateTiles();
    }

    /**
     * 生成初始的类型表
     */
    private generateInitTypeMap() {
        this.typeMap = [];
        for (let c = 0; c < GameConfig.col; c++) {
            let colSet: TileType[] = [];
            for (let r = 0; r < GameConfig.row; r++) {
                colSet.push(GameUtil.getRandomType());
            }
            this.typeMap.push(colSet);
        }
    }

    /**
     * 根据类型表生成方块
     */
    private generateTiles() {
        this.tileMap = [];
        for (let c = 0; c < GameConfig.col; c++) {
            let colTileSet: Tile[] = [];
            for (let r = 0; r < GameConfig.row; r++) {
                colTileSet.push(this.getTile(c, r, this.typeMap[c][r]));
            }
            this.tileMap.push(colTileSet);
        }
    }

    /**
     * 生成并初始化方块
     * @param x 横坐标
     * @param y 纵坐标
     * @param type 类型
     */
    private getTile(x: number, y: number, type: TileType): Tile {
        let node = PoolManager.get();
        let pos = MapManager.getPos(x, y);
        node.setPosition(pos);
        // node.setParent(this.container);
        let tile = node.getComponent(Tile);
        tile.init();
        tile.setCoord(x, y);
        tile.setType(type);
        tile.appear();
        this.container.addChild(node);
        // console.log(this.container.getPosition());
        return tile;
    }

    /**
     * 方块的 touchstart 回调
     * @param coord 坐标
     * @param pos 点击位置
     */
    private onTileTouchStart(coord: Coordinate, pos: Vec2) {
        console.log('点击 | coord: ' + coord.toString() + ' | type: ' + this.getTypeMap(coord));
        // 是否已经选中了方块
        if (this.selectedCoord) {
            // 是否同一个方块
            if (!this.selectedCoord.compare(coord)) {
                // 判断两个方块是否相邻
                if (this.selectedCoord.isAdjacent(coord)) {
                    this.tryExchangeByTouch(this.selectedCoord, coord);
                    this.setSelectedTile(null); // 交换后重置
                } else {
                    this.tileTouchStartPos = pos;
                    this.setSelectedTile(coord); // 更新选中的方块坐标
                }
            } else {
                this.tileTouchStartPos = pos;
            }
        } else {
            this.tileTouchStartPos = pos;
            this.setSelectedTile(coord);
        }
    }

    /**
     * 方块的 touchend 回调
     */
    private onTileTouchEnd() {
        this.tileTouchStartPos = null;
    }

    /**
     * 方块的 touchcancel 回调
     * @param coord 坐标
     * @param cancelPos 位置
     */
    private onTileTouchCancel(coord: Coordinate, cancelPos: Vec2) {
        if (!this.tileTouchStartPos) return;
        this.tryExchangeBySlid(coord, GameUtil.getSlidDirection(this.tileTouchStartPos, cancelPos));
        this.tileTouchStartPos = null;
    }

    /**
     * 设置选中的方块
     * @param coord 坐标
     */
    private setSelectedTile(coord: Coordinate) {
        this.selectedCoord = coord;
        if (coord) {
            this.selectFrame.active = true;
            this.selectFrame.setPosition(MapManager.getPos(coord));
        } else {
            this.selectFrame.active = false;
        }
    }
    /**
     * 尝试点击交换方块
     * @param coord1 1
     * @param coord2 2
     */
    private tryExchangeByTouch(coord1: Coordinate, coord2: Coordinate) {
        console.log('尝试点击交换方块 | coord1: ' + coord1.toString() + ' | coord2: ' + coord2.toString());
        this.tryExchange(coord1, coord2);
    }

    /**
     * 尝试滑动交换方块
     * @param coord 坐标
     * @param direction 方向
     */
    private tryExchangeBySlid(coord: Coordinate, direction: SlidDirection) {
        console.log('点击交换方块 | coord1: ' + coord.toString() + ' | direction: ' + direction);
        let targetCoord = GameUtil.getCoordByDirection(coord, direction);
        if (targetCoord) {
            this.tryExchange(coord, targetCoord);
            this.setSelectedTile(null);
        }
    }

    /**
     * 尝试交换方块
     * @param coord1 1
     * @param coord2 2
     */
    private async tryExchange(coord1: Coordinate, coord2: Coordinate) {
        await this.exchangeTiles(coord1, coord2);
    }

    /**
     * 交换方块
     * @param coord1 1
     * @param coord2 2
     */
    private async exchangeTiles(coord1: Coordinate, coord2: Coordinate) {
        // 保存变量
        let tile1 = this.getTileMap(coord1);
        let tile2 = this.getTileMap(coord2);
        let tile1Type = this.getTypeMap(coord1);
        let tile2Type = this.getTypeMap(coord2);
        // 交换数据
        tile1.setCoord(coord2);
        tile2.setCoord(coord1);
        this.setTypeMap(coord1, tile2Type);
        this.setTypeMap(coord2, tile1Type);
        this.setTileMap(coord1, tile2);
        this.setTileMap(coord2, tile1);
        // 交换方块
        tween(tile1.node).to(0.1, { position: MapManager.getPos(coord2) }).start();
        tween(tile2.node).to(0.1, { position: MapManager.getPos(coord1) }).start();
        await new Promise(res => setTimeout(res, 100));
    }

    /**
     * 设置类型表
     * @param x 横坐标
     * @param y 纵坐标
     */
    private getTypeMap(x: number | Coordinate, y?: number): TileType {
        return typeof x === 'number' ? this.typeMap[x][y] : this.typeMap[x.x][x.y];
    }

    /**
     * 获取类型
     * @param x 横坐标
     * @param y 纵坐标
     * @param type 类型
     */
    private setTypeMap(x: number | Coordinate, y: number | TileType, type?: TileType) {
        if (typeof x === 'number') this.typeMap[x][y] = type;
        else this.typeMap[x.x][x.y] = <TileType>y;
    }

    /**
     * 获取组件
     * @param x 横坐标
     * @param y 纵坐标
     */
    private getTileMap(x: number | Coordinate, y?: number): Tile {
        return typeof x === 'number' ? this.tileMap[x][y] : this.tileMap[x.x][x.y];
    }

    /**
     * 设置组件表
     * @param x 横坐标
     * @param y 纵坐标
     * @param type 组件
     */
    private setTileMap(x: number | Coordinate, y: number | Tile, tile?: Tile) {
        if (typeof x === 'number') this.tileMap[x][<number>y] = tile;
        else this.tileMap[x.x][x.y] = <Tile>y;
    }

}