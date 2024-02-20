import { _decorator, Component, director, game, Label, Node } from 'cc';
import { Demo, listDemons } from './MainCtl';
import eventSource from './EventUtils';
const { ccclass, property } = _decorator;

@ccclass('NavRoot')
export class NavRoot extends Component {
    /**
     * 回退主页
     */
    @property(Node)
    exitNode: Node;
    /**
     * 上一个demo
     */
    @property(Node)
    preNode: Node;
    /**
     * 下一个demo
     */
    @property(Node)
    nextNode: Node;
    /**
     * 标题
     */
    @property(Node)
    titleNode: Node;
    private titleLable: Label;

    /**
     * demo列表中的数据 小于0表示主页
     */
    private sceneIndex: number = -1;
    /**
     * 场景名称
     */
    private sceneName: string = "";

    start() {
        // 导航节点常驻
        director.addPersistRootNode(this.node);
        this.titleLable = this.titleNode.getComponent(Label);
        this.updateSceneInfo(-1, "");
        // 这里不同节点间通信使用了事件，demo中是直接通过静态变量来访问。
        eventSource.on("clickEnterScene", this.onWatchClickEnterScene, this);
    }

    update(deltaTime: number) {

    }

    onClickBack() {
        this.updateSceneInfo(-1, "");
        director.loadScene("Main");
    }

    onClickPre() {
        console.log("当前:" + this.sceneIndex + "上一个场景");
        const pre = this.sceneIndex - 1;
        if (pre <= 0) {
            return;
        }
        const demo = listDemons[pre];
        this.updateSceneInfo(pre, demo.name);
        director.loadScene(demo.scene);
    }

    onClickNext() {
        console.log("当前:" + this.sceneIndex + "下一个场景");
        const next = this.sceneIndex + 1;
        if (next >= listDemons.length) {
            return;
        }
        const demo = listDemons[next];
        this.updateSceneInfo(next, demo.name);
        director.loadScene(demo.scene);
    }

    private onWatchClickEnterScene(index: number, name: string) {
        console.log("场景改变" + index + "，" + name);
        this.updateSceneInfo(index, name);
    }

    private updateSceneInfo(index: number, name: string) {
        this.sceneName = name;
        this.sceneIndex = index;

        this.titleLable.string = name;

        const notHomeScene = this.sceneIndex >= 0;
        this.preNode.active = notHomeScene;
        this.nextNode.active = notHomeScene;
        this.exitNode.active = notHomeScene;
    }
}


