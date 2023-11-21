import { _decorator, CCInteger, Component, instantiate, Label, Node, Prefab } from 'cc';
import { PlayerController } from './PlayerController';
const { ccclass, property } = _decorator;

enum BlockType {
    NONE,
    STONE
}
enum GameState {
    GS_INIT,
    GS_PLAYING,
    GS_END,
};
@ccclass('GameManager')
export class GameManager extends Component {

    @property({ type: CCInteger })
    public stepCount: number = 50;
    @property({ type: Prefab })
    public boxPrefab: Prefab;
    @property({ type: Label })
    public stepNode: Label;

    @property({ type: Node })
    public startMenu: Node;
    @property(PlayerController)
    public player: PlayerController;

    private blockList: BlockType[] = [];

    start() {

        this.gameState(GameState.GS_INIT);
        this.player.node.on("StepNumber", this.onReceiveStepNumber, this);
    }

    update(deltaTime: number) {

    }

    onClickStart() {
        this.gameState(GameState.GS_PLAYING);
    }

    gameState(state: GameState) {
        switch (state) {
            case GameState.GS_INIT:
                this.generalBlock();
                this.player.onGameStart(false);
                this.startMenu.active = true;
                this.stepNode.string = "0";
                break;
            case GameState.GS_PLAYING:
                setTimeout(() => {
                    this.player.onGameStart(true);
                    this.startMenu.active = false;
                }, 100);
                break;
            case GameState.GS_END:
                this.gameState(GameState.GS_INIT);
                break;
        }
    }

    generalBlock() {
        this.node.removeAllChildren();
        this.blockList = [];
        for (let index = 0; index < this.stepCount; index++) {
            if (index == 0) {
                this.blockList[index] = BlockType.STONE;
                continue;
            }
            if (this.blockList[index - 1] == BlockType.NONE) {
                this.blockList[index] = BlockType.STONE;
                continue;
            }
            this.blockList[index] =
                Math.floor(Math.random() * 2) == 1 ? BlockType.NONE : BlockType.STONE;
        }
        if (!this.boxPrefab) {
            return;
        }
        for (let index = 0; index < this.blockList.length; index++) {
            if (this.blockList[index] == BlockType.STONE) {
                const block: Node = instantiate(this.boxPrefab);
                block.setPosition(index, -1.5, 0);
                this.node.addChild(block);
            }
        }
    }

    private onReceiveStepNumber(index: number) {
        this.stepNode.string = '' + (index >= this.stepCount ? this.stepCount : index);
        // 检查是否安全
        if (index >= this.stepCount) {
            this.gameState(GameState.GS_END);
        } else if (this.blockList[index] == BlockType.NONE) {
            this.gameState(GameState.GS_END);
        }
        console.log("step:" + index);
    }
}


