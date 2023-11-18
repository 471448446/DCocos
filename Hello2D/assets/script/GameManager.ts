import { _decorator, CCInteger, Component, instantiate, Label, Node, Prefab, Vec3 } from 'cc';
import { BLOCK_SIZE, PlayerController } from './PlayerController';
const { ccclass, property } = _decorator;

enum BlockType {
    BT_NONE, // 空格
    BT_STONE, // 非空格
};
// 游戏状态
enum GameState {
    GS_INIT,
    GS_PLAYING,
    GS_END,
};
@ccclass('GameManager')
export class GameManager extends Component {
    @property({ type: Prefab })
    public boxPrefab: Prefab | null = null;
    // 地图长度
    @property({ type: CCInteger })
    public roadLength: number = 50;
    //用数组来存储这些地图数据是很好的主意，因为数组可以进行快速的访问，我们可以通过索引很快查询到某个位置是方块还是坑。
    private _road: BlockType[] = [];

    @property({ type: Node })
    public startMenu: Node | null = null; // 开始的 UI
    @property({ type: PlayerController })
    public playerCtrl: PlayerController | null = null; // 角色控制器
    @property({ type: Label })
    public stepsLabel: Label | null = null; // 计步器

    start() {
        // this.generateRoad()
        this.setCurState(GameState.GS_INIT); // 第一初始化要在 start 里面调用
        // 箭头player的事件
        this.playerCtrl?.node.on('JumpEnd', this.onPlayerJumpEnd, this);
        //可以看到这里我们使用的 this.playerCtrl?.node 也就是 PlayerController 的节点来接收事件，在 Cocos Creator 中，某个节点派发的事件，只能用这个节点的引用去监听。
        console.log("generateRoad start");
    }

    update(deltaTime: number) {

    }

    init() {
        console.log("---init");
        if (this.startMenu) {
            this.startMenu.active = true;
        }

        this.generateRoad();

        if (this.playerCtrl) {
            this.playerCtrl.setInputActive(false);
            this.playerCtrl.node.setPosition(Vec3.ZERO);
            this.playerCtrl.reset();
        }
    }

    generateRoad() {

        this.node.removeAllChildren();

        this._road = [];
        // startPos
        this._road.push(BlockType.BT_STONE);

        for (let i = 1; i < this.roadLength; i++) {
            if (this._road[i - 1] === BlockType.BT_NONE) {
                this._road.push(BlockType.BT_STONE);
            } else {
                this._road.push(Math.floor(Math.random() * 2));
            }
        }

        for (let j = 0; j < this._road.length; j++) {
            let block: Node | null = this.spawnBlockByType(this._road[j]);
            if (block) {
                this.node.addChild(block);
                block.setPosition(j * BLOCK_SIZE, 0, 0);
            }
        }
    }
    /**
     * 
     * @param type 根据 BlockType 生成方块
     * @returns 
     */
    spawnBlockByType(type: BlockType) {
        if (!this.boxPrefab) {
            return null;
        }

        let block: Node | null = null;
        switch (type) {
            case BlockType.BT_STONE:
                block = instantiate(this.boxPrefab);
                break;
        }

        return block;
    }
    setCurState(value: GameState) {
        switch (value) {
            case GameState.GS_INIT:
                //init 时我们先显示 StartMenu、创建地图以及重设角色的为和状态并禁用角色输入。
                this.init();
                break;
            case GameState.GS_PLAYING:
                //在状态下隐藏 StartMenu、重设计步器的数值以及启用用户输入：
                if (this.startMenu) {
                    this.startMenu.active = false;
                }

                if (this.stepsLabel) {
                    this.stepsLabel.string = '0';   // 将步数重置为0
                }

                setTimeout(() => {      //直接设置active会直接开始监听鼠标事件，做了一下延迟处理
                    if (this.playerCtrl) {
                        this.playerCtrl.setInputActive(true);
                    }
                }, 0.1);
                break;
            case GameState.GS_END:
                //暂时没有什么好添加的，当然您可以根据喜好添加一些结算用的逻辑让游戏看起来更完善
                break;
        }
    }
    onStartButtonClicked() {
        this.setCurState(GameState.GS_PLAYING);
    }
    onPlayerJumpEnd(moveIndex: number) {
        if (this.stepsLabel) {
            this.stepsLabel.string = '' + (moveIndex >= this.roadLength ? this.roadLength : moveIndex);
        }
        this.checkResult(moveIndex);
    }
    /**
     * 增加一个用于判定角色是否跳跃到坑或者跳完所有地块的方法：
     * @param moveIndex 
     */
    checkResult(moveIndex: number) {
        if (moveIndex < this.roadLength) {
            if (this._road[moveIndex] == BlockType.BT_NONE) {   //跳到了空方块上

                this.setCurState(GameState.GS_INIT)
            }
        } else {    // 跳过了最大长度            
            this.setCurState(GameState.GS_INIT);
        }
    }
}


