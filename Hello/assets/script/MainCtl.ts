import { _decorator, Component, director, Input, instantiate, Label, Layout, Node, Prefab } from 'cc';
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
const listDemons: Demo[] = [
    { name: "天空盒jpg", scene: "SkyBox" },
    { name: "天空盒hdr", scene: "SkyBox2" },
    { name: "天空盒cubemap", scene: "SkyBox3" },
    { name: "天空盒代码加载", scene: "SkyBox4" },
    { name: "立方体贴图", scene: "CubeMap" },
]

interface Demo {
    name: string;
    scene: string;
}


