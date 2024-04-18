import { _decorator, Component, director, Input, instantiate, Label, Layout, log, Node, Prefab } from 'cc';
import eventSource from './EventUtils';
const { ccclass, property } = _decorator;

@ccclass('MainCtl')
export class MainCtl extends Component {
    @property(Node)
    listLayout: Node;

    @property(Prefab)
    buttonEntrance: Prefab;

    start() {
        for (const demo of listDemons) {
            // 实例化预制体
            const buttonUi = instantiate(this.buttonEntrance);
            // 获取预制体的node 。这里只有一个child，所以可以使用 buttonUi.children[0]
            const labelNoe: Node = buttonUi.getChildByName("Label");
            // 通过node获取组件
            const label = labelNoe.getComponent(Label);
            // 设置组件的信息
            label.string = demo.name;
            // 添加node
            this.listLayout.addChild(buttonUi);
            buttonUi.on(Input.EventType.TOUCH_END, () => {
                // 获取当前node在父节点中的位置。因为这个按钮是添加在列表中，所以按钮在父节点中位置就是这里的index。
                const indexInParent = buttonUi.getSiblingIndex();
                eventSource.emit("clickEnterScene", indexInParent, demo.name);
                director.loadScene(demo.scene);
            }, this);
            /** 
            * 为实例化后的预制体添加脚本组件
            * newPrefab.addComponent(PrefabClickHandler);
            */
        }
    }

    update(deltaTime: number) {

    }

    goToCoordScence() {
        director.loadScene("scene/CoordAnchor");
    }
}
export const listDemons: Demo[] = [
    { name: "天空盒jpg", scene: "SkyBox" },
    { name: "天空盒hdr", scene: "SkyBox2" },
    { name: "天空盒cubemap", scene: "SkyBox3" },
    { name: "天空盒代码加载", scene: "SkyBox4" },
    { name: "立方体贴图", scene: "CubeMap" },
    { name: "精灵帧动画", scene: "SpriteAnimation" },
    { name: "事件-冒泡", scene: "TouchBubble" },
    { name: "事件-归属", scene: "TouchTarget" },
    //https://docs.cocos.com/creator/manual/zh/ui-system/components/engine/widget-align.html
    { name: "UI-Widget", scene: "UiWidget" },
    //https://docs.cocos.com/creator/manual/zh/ui-system/components/engine/sliced-sprite.html
    { name: "UI-图片缩放", scene: "UiSpriteScale" },
    { name: "物理2D-运动", scene: "Physical2DTest" },
    { name: "物理2D-击打小球", scene: "Physical2DRigeBodyTest" },
    // 3d刚体类型效果演示 https://docs.cocos.com/creator/manual/zh/physics/physics-rigidbody.html
    { name: "物理3d-刚体类型", scene: "Phy3DRigideType" },
    { name: "物理3d-质心位置", scene: "Phy3DRigideMass" },
    { name: "物理3d-铰链约束", scene: "Phy3DHingeConstrant" },
]

export interface Demo {
    name: string;
    scene: string;
}


