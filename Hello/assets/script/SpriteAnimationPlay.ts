import { _decorator, Animation, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 测试的图片来源：git@github.com:ansen360/FrameAnimation.git
 * 使用TexturePacker打包，然后使用TinyPng压缩了图片
 */
@ccclass('SpriteAnimationPlay')
export class SpriteAnimationPlay extends Component {
    start() {
        let animation = this.getComponent(Animation);
        animation.play();
    }
    protected onDestroy(): void {
        // 不用手动stop
        // let animation = this.getComponent(Animation);
        // animation.stop();
    }

    update(deltaTime: number) {

    }

    onSpriteFrameStart() {
        console.log("onSpriteFrameStart=----------->");
    }
}


