import { _decorator, Component, Label, Layout, Node, UITransform } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 首先为按钮添加了Layout组件，这样可以控制文字的到按钮边缘的边距
 * 然后让按钮的width跟随文字的多少变化
 */
@ccclass('DemoButton')
export class DemoButton extends Component {
    @property(Node)
    buttonNode: Node;
    @property(Node)
    labelNode: Node;

    start() {
        let buttonLayout = this.buttonNode.getComponent(Layout);

        //https://blog.csdn.net/LANGZI7758521/article/details/101057333
        let labelUiTransform = this.labelNode.getComponent(UITransform);
        let label = this.labelNode.getComponent(Label);
        let buttonUiTransform = this.buttonNode.getComponent(UITransform);
        // 强制label渲染一次，获取宽高
        label.updateRenderData(true);
        buttonUiTransform.width = labelUiTransform.width + buttonLayout.paddingLeft + buttonLayout.paddingRight;
        buttonUiTransform.height = labelUiTransform.height + buttonLayout.paddingTop + buttonLayout.paddingBottom;        
    }

    update(deltaTime: number) {

    }
}


