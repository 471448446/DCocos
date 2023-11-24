import { _decorator, Component, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;
import { TileType } from "../type/Enum";

/**
 * 此脚本用来存放游戏中用到的方块图片资源，方便运行中快速读取（简版只有固定的5种方块类型，所以我选择直接将图片资源挂载到该组件上）：
 */
@ccclass("ResManager")
export default class ResManager extends Component {

    @property(SpriteFrame)
    private a: SpriteFrame = null;

    @property(SpriteFrame)
    private b: SpriteFrame = null;

    @property(SpriteFrame)
    private c: SpriteFrame = null;

    @property(SpriteFrame)
    private d: SpriteFrame = null;

    @property(SpriteFrame)
    private e: SpriteFrame = null;

    private static instance: ResManager = null;

    protected onLoad() {
        ResManager.instance = this;
    }

    /**
     * 获取方块图片资源
     * @param tileType 方块类型
     */
    public static getTileSpriteFrame(tileType: TileType): SpriteFrame {
        switch (tileType) {
            case TileType.A:
                return this.instance.a;
            case TileType.B:
                return this.instance.b;
            case TileType.C:
                return this.instance.c;
            case TileType.D:
                return this.instance.d;
            case TileType.E:
                return this.instance.e;
        }
    }
}