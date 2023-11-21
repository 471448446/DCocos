import { _decorator, AnimationComponent, Component, EventMouse, Input, input, Node, SkeletalAnimation, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {

    // @property({ type: AnimationComponent })
    // public BodyAnim: AnimationComponent | null = null;
    /**
     * 官方给的另外一种动画。
     */
    @property({ type: SkeletalAnimation })
    public CocosAnim: SkeletalAnimation | null = null;

    //跳跃是一个完整的步骤，当这个步骤没有完成时，我们不接受任何输入，因此我们也通过 _startJump 来跳过跳跃过程中的用户输入。
    // 是否接收到跳跃指令
    private _startJump: boolean = false;
    // 跳跃步长
    private _jumpStep: number = 0;
    // 当前跳跃时间
    private _curJumpTime: number = 0;
    // 每次跳跃时长
    private _jumpTime: number = 0.1;
    // 当前跳跃速度
    private _curJumpSpeed: number = 0;
    // 当前角色位置
    private _curPos: Vec3 = new Vec3();
    // 每次跳跃过程中，当前帧移动位置差
    private _deltaPos: Vec3 = new Vec3(0, 0, 0);
    // 角色目标位置
    private _targetPos: Vec3 = new Vec3();
    private _curMoveIndex: number = 0;

    start() {
    }

    reset() {
        this._curMoveIndex = 0;
        this.node.setPosition(Vec3.ZERO);
    }

    update(deltaTime: number) {
        if (this._startJump) {
            this._curJumpTime += deltaTime;
            if (this._curJumpTime > this._jumpTime) { // 跳跃结束
                // end
                this.node.setPosition(this._targetPos);  // 强制位移到目标位置
                this._startJump = false; // 标记跳跃结束
                this.notifyStepChange();
            } else { // 跳跃中
                // tween
                this.node.getPosition(this._curPos);  // 获取当前的位置 
                this._deltaPos.x = this._curJumpSpeed * deltaTime; // 计算本帧应该位移的长度
                Vec3.add(this._curPos, this._curPos, this._deltaPos); // 将当前位置加上位移的长度
                this.node.setPosition(this._curPos); // 设置位移后的位置
            }
        }
    }
    onGameStart(enable: boolean) {
        if (enable) {
            input.on(Input.EventType.MOUSE_UP, this.mouseUp, this);
        } else {
            input.off(Input.EventType.MOUSE_UP, this.mouseUp, this);
            this.reset();
        }
    }
    mouseUp(event: EventMouse) {
        if (event.getButton() === 0) {
            this.jumpByStep(1);
        } else if (event.getButton() === 2) {
            this.jumpByStep(2);
        }
    }
    jumpByStep(step: number) {
        if (this._startJump) {
            return;
        }
        // 牛顿匀速运动
        this._startJump = true; // 表示开始跳跃
        this._jumpStep = step; // 本次跳跃的步数
        this._curJumpTime = 0; // 重置下跳跃的时间

        //以动画得时间作为跳跃的时间
        // const clipName = step == 1 ? 'OneStep' : 'TwoStep';
        // const state = this.BodyAnim.getState(clipName);
        // this._jumpTime = state.duration;

        if (this.CocosAnim) {
            const state = this.CocosAnim.getState('cocos_anim_jump');
            this._jumpTime = 0.3;
        }


        this._curJumpSpeed = this._jumpStep / this._jumpTime; // 计算跳跃的速度
        this.node.getPosition(this._curPos); // 获取角色当前的位置
        // 目标位置 = 当前位置 + 步长
        Vec3.add(this._targetPos, this._curPos, new Vec3(this._jumpStep, 0, 0));
        // 默认的动画
        // if (this.BodyAnim) {
        //     if (step === 1) {
        //         this.BodyAnim.play('OneStep');
        //     } else if (step === 2) {
        //         this.BodyAnim.play('TwoStep');
        //     }
        // }
        // 新的动画
        if (this.CocosAnim) {
            this.CocosAnim.getState('cocos_anim_jump').speed = 3.5; // 跳跃动画时间比较长，这里加速播放
            this.CocosAnim.play('cocos_anim_jump'); // 播放跳跃动画
        }

        // 增加步数
        this._curMoveIndex += step;
    }

    private notifyStepChange() {
        this.node.emit("StepNumber", this._curMoveIndex);
        if (this.CocosAnim) {
            this.CocosAnim.play('cocos_anim_idle');
        }
    }

}


