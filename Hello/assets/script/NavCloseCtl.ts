import { _decorator, Component, director, Input, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NavCloseCom')
export class NavCloseCom extends Component {
    start() {
        // this.node.on(Input.EventType.TOUCH_END, () => {

        // }, this);
    }

    update(deltaTime: number) {

    }
    
    onBackPress() {
        // director.getScene().destroy();
        // https://github.com/cocos/cocos-engine/issues/2629
        // 尼玛，居然没有回退场景。
        // director.popScene();
        director.loadScene("scene/Main");
    }
}


