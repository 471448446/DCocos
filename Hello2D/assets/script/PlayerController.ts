import { _decorator, AnimationComponent, Component, EventMouse, EventTouch, input, Input, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

export const BLOCK_SIZE = 40; // 添加一个放大比

@ccclass('PlayerController')
export class PlayerController extends Component {
    // 当前移动步数
    private _curMoveIndex: number = 0;

    //https://forum.cocos.org/t/topic/110157/10
    @property({ type: AnimationComponent })
    public BodyAnim: AnimationComponent = null;

    @property(Node)
    leftTouch: Node = null;

    @property(Node)
    rightTouch: Node = null;

    /**
     * 匀速移动角色
     * P_1 = P_0 + v*t
     * 也就是 最终位置 = 当前位置 + 平均速度 * 时间间隔
     */

    /**
     * 用于判断角色是否在跳跃状态
     */
    private _startJump: boolean = false;
    /**
     * 用于记录鼠标的输入，并将其转化为数值。因为我们规定角色最多只能跳两步，那么他可能是 1 或者 2。
     */
    private _jumpStep: number = 0;
    /**
     * 当前的跳跃时间：_curJumpTime，每次跳跃前，将这个值置为 0，在更新时进行累计并和 _jumpTime 进行对比，
     * 如果超过了 _jumpTime，那么我们认为角色完成了一次完整的跳跃
     */
    private _curJumpTime: number = 0;
    /**
     * 跳跃时间：_jumpTime，这个数值类型的变量用于记录整个跳跃的时长
     */
    private _jumpTime: number = 0.1;
    /**
     * 移动速度：_curJumpSpeed，用于记录跳跃时的移动速度
     * 
     */
    private _curJumpSpeed: number = 0;
    /**
     * 当前的位置：_curPos，记录和计算角色的当前位置
     */
    private _curPos: Vec3 = new Vec3();
    /**
     * 位移： _deltaPos，每一帧我们都需要记录下位置和时间间隔的乘积，我们将用他来存储计算结果
     */
    private _deltaPos: Vec3 = new Vec3(0, 0, 0);
    /**
     * 目标位置：_targetPos，最终的落点，我们将在跳跃结束时将角色移动这个位置以确保最终的位置正确，这样可以处理掉某些误差的情况
     */
    private _targetPos: Vec3 = new Vec3();

    start() {
        // Cocos Creator 支持鼠标、键盘、触摸以及游戏手柄等硬件，并将其封装在了 input 这个类里面，我们可以通过如下的代码来监听输入
        // input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    }
    reset() {
        this._curMoveIndex = 0;
    }

    /**
     * 监听鼠标输入
     * @param event 
     */
    onMouseUp(event: EventMouse) {
        //getButton 方法会在鼠标左键被按下时返回 0，而右键则是 2。
        if (event.getButton() === 0) {
            this.jumpByStep(1);
        } else if (event.getButton() === 2) {
            this.jumpByStep(2);
        }
    }
    /**
     * 
     * @param active 是否箭头鼠标
     */
    setInputActive(active: boolean) {
        //监听键盘
        // if (active) {
        //     input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        // } else {
        //     input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        // }
        // 方式二，按区域划分
        if (active) {
            this.leftTouch.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
            this.rightTouch.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        } else {
            this.leftTouch.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
            this.rightTouch.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        }
    }
    onTouchStart(event: EventTouch) {
        const target = event.target as Node;
        if (target?.name == 'LeftNode') {
            this.jumpByStep(1);
        } else {
            this.jumpByStep(2);
        }
    }
    /**
     * 
     * @param step 根据步数跳跃
     */
    jumpByStep(step: number) {
        if (this._startJump) {
            return;
        }
        this._startJump = true;  // 标记开始跳跃
        this._jumpStep = step; // 跳跃的步数 1 或者 2
        this._curJumpTime = 0; // 重置开始跳跃的时间

        //以动画得时间作为跳跃的时间
        const clipName = step == 1 ? 'oneStep' : 'twoStep';
        const state = this.BodyAnim.getState(clipName);
        this._jumpTime = state.duration;

        this._curJumpSpeed = this._jumpStep * BLOCK_SIZE / this._jumpTime; // 根据时间计算出速度
        this.node.getPosition(this._curPos); // 获取角色当前的位置
        console.log("1当前位置：" + this._curPos + ",目标" + this._targetPos);
        Vec3.add(this._targetPos, this._curPos, new Vec3(this._jumpStep * BLOCK_SIZE, 0, 0));    // 计算出目标位置
        console.log("2当前位置：" + this._curPos + ",目标" + this._targetPos);

        if (this.BodyAnim) {
            if (step === 1) {
                this.BodyAnim.play('oneStep');
            } else if (step === 2) {
                this.BodyAnim.play('twoStep');
            }
        }
        // 增加步数
        this._curMoveIndex += step;
    }

    update(deltaTime: number) {
        if (this._startJump) {
            this._curJumpTime += deltaTime; // 累计总的跳跃时间
            if (this._curJumpTime > this._jumpTime) { // 当跳跃时间是否结束
                // end 
                this.node.setPosition(this._targetPos); // 强制位置到终点
                this._startJump = false;               // 清理跳跃标记
                // 发送条约完成结束
                this.onOnceJumpEnd();
            } else {
                // tween
                this.node.getPosition(this._curPos);
                this._deltaPos.x = this._curJumpSpeed * deltaTime; //每一帧根据速度和时间计算位移
                Vec3.add(this._curPos, this._curPos, this._deltaPos); // 应用这个位移
                this.node.setPosition(this._curPos); // 将位移设置给角色
            }
        }
    }
    /**
     * 监听跳跃结束的方法：
     */
    onOnceJumpEnd() {
        this.node.emit('JumpEnd', this._curMoveIndex);
    }
}


