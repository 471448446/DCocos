import { _decorator, Component, Sprite, EventTouch, tween, Vec3, NodeEventType, Input, UITransform } from 'cc';
const { ccclass, property } = _decorator;

import { TileType, TileEvent } from "../type/Enum";
import { Coordinate, Coord } from "../type/DataStructure";
import ResManager from "../manager/ResManager";
import PoolManager from "../manager/PoolManager";
import { GameEvent } from "../util/GameEvent";

@ccclass("Tile")
export default class Tile extends Component {

    @property(Sprite)
    private sprite: Sprite | null = null; // 显示图片的组件

    private _type: TileType | null = null; // 类型
    /**
     * 获取该方块的类型
     */
    public get type() { return this._type; }

    private _coord: Coordinate = null; // 坐标
    /**
     * 获取该方块的坐标
     */
    public get coord() { return this._coord; }

    onLoad() {
        this.bindTouchEvents();
    }

    onDestroy() {
        this.unbindTouchEvents();
    }

    /**
     * 节点池复用回调
     */
    public reuse() {
        this.bindTouchEvents();
    }
    /**
     * 节点池回收回调
     */
    public unuse() {
        this.unbindTouchEvents();
    }

    /**
     * touchstart 回调
     * @param e 参数
     */
    private onTouchStart(e: EventTouch) {
        GameEvent.emit(TileEvent.TouchStart, this._coord.copy(), e.getLocation());
        console.log("send onTouchStart()" + this._coord + "," + e.getLocation());
    }

    /**
     * touchend 回调
     */
    private onTouchEnd() {
        GameEvent.emit(TileEvent.TouchEnd);
    }

    /**
     * touchcancel 回调
     * @param e 参数
     */
    private onTouchCancel(e: EventTouch) {
        GameEvent.emit(TileEvent.TouchCancel, this._coord.copy(), e.getLocation());
    }

    /**
     * 绑定点击事件
     */
    private bindTouchEvents() {
        // if (this.coord.x == 0 && this.coord.y == 0) {
        //     console.log("bindTouchEvents-->");
        //     console.log(this.node.getPosition());
        //     console.log(this.node.getChildByName("Sprite"));
        //     console.log(this.node.getParent().name);
        //     // this.node.getChildByName("Sprite").setScale(new Vec3(0.5, 0.5, 1));
        //     let cps = this.node.getComponents;
        //     console.log("getComponents size: " + cps.length)
        //     for (const key in cps) {
        //         console.log(key);
        //     };
        //     console.log(
        //         this.node.getComponent(UITransform).width +
        //         "," +
        //         this.node.getComponent(UITransform).height +
        //         "," +
        //         this.node.position
        //     );
        // }
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        // console.log("bindTouchEvents-->");
        // console.log(this.node.getPosition());
        // console.log(this.node.getChildByName("Sprite"));
        // console.log(this.node.getParent().name);
    }

    /**
     * 解绑点击事件
     */
    private unbindTouchEvents() {
        this.node.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        this.node.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    /**
     * 初始化
     */
    public init() {
        this._type = null;
        this.sprite.spriteFrame = null;
        this.setCoord(-1, -1);
        // this.node.setScale(0);
        this.node.setScale(new Vec3(0, 0, 0));
    }

    /**
     * 设置类型
     * @param type 类型
     */
    public setType(type: TileType) {
        this._type = type;
        this.updateDisplay();
    }

    /**
     * 更新方块图片
     */
    private updateDisplay() {
        this.sprite.spriteFrame = ResManager.getTileSpriteFrame(this._type);
    }

    /**
     * 设置坐标
     * @param x 横坐标
     * @param y 纵坐标
     */
    public setCoord(x: number | Coordinate, y?: number) {
        if (!this._coord) this._coord = Coord();
        if (typeof x === 'number') this._coord.set(x, y);
        else this._coord.set(x);
    }

    /**
     * 显示方块
     */
    public appear() {
        tween(this.node)
            // .to(0.075, { scale: 1.1 })
            // .to(0.025, { scale: 1 })
            // 注意这里z轴不要缩放，是1。shit
            .to(0.075, { scale: new Vec3(1.1, 1.1, 1) })
            .to(0.025, { scale: new Vec3(1, 1, 1) })
            .start();
    }

    /**
     * 消失并回收
     */
    public disappear() {
        tween(this.node)
            // .to(0.1, { scale: 0 })
            .to(0.1, { scale: new Vec3(0, 0, 1) })
            .call(() => PoolManager.put(this.node))
            .start();
    }

}