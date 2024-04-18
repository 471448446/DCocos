import { _decorator, Component, director, game, Input, Label, Node } from 'cc';
import { Demo, listDemons } from './MainCtl';
import eventSource from './EventUtils';
const { ccclass, property } = _decorator;

/**
 * 注意：
 * 这里在设计常驻节点的时候，没有将主页面的第一个demo放进来。
 * 所以点击第一个demo的时候，是无法看到常驻节点的。并不是bug，是设计上的bug。
 * 同时天空盒几个demo因为设置了拖拽事件，所以无法响应点击
 * 
 * 常驻节点使用注意事项
1、目标节点必须为位于层级的根节点，否则设置无效
2、常驻节点是全局存在的，因此在使用时要注意避免滥用，合理规划和管理节点的数量和功能
3、常驻节点中的资源和数据需要谨慎管理，避免内存泄漏和数据冗余
4、常驻节点的生命周期与游戏运行的整个生命周期一致，当游戏退出时才会被销毁，因此需要确保在适当的时机进行资源释放和清理。
总之，常驻节点是Cocos Creator中一种特殊的节点，它在游戏运行期间始终存在，并可以用于保存全局数据、管理全局功能以及在场景切换时保持节点状态。合理使用常驻节点可以提高开发效率和管理灵活性。
 */
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
        // this.node.zOrder = 100;
        // 导航节点常驻
        director.addPersistRootNode(this.node);
        this.titleLable = this.titleNode.getComponent(Label);
        this.updateSceneInfo(-1, "");
        // 这里不同节点间通信使用了事件，demo中是直接通过静态变量来访问。
        eventSource.on("clickEnterScene", this.onWatchClickEnterScene, this);
    }

    protected onEnable(): void {
        console.log("导航栏 onEnable() isPersistRootNode:" + director.isPersistRootNode(this.node));
        console.log(director.getScene());
        this.updateSceneInfo(this.sceneIndex, this.sceneName);
        this.preNode.on(Input.EventType.TOUCH_START, this.onClickPre, this);
        this.nextNode.on(Input.EventType.TOUCH_START, this.onClickNext, this);
    }

    protected onDisable(): void {
        console.log("导航栏 onDisable() isPersistRootNode:" + director.isPersistRootNode(this.node));
        this.preNode.off(Input.EventType.TOUCH_START, this.onClickPre, this);
        this.nextNode.off(Input.EventType.TOUCH_START, this.onClickNext, this);
    }

    update(deltaTime: number) {

    }

    onClickBack() {
        this.updateSceneInfo(-1, "");
        director.loadScene("Main");
    }

    onClickPre(ev: MouseEvent) {
        console.log("当前:" + this.sceneIndex + "上一个场景");
        const pre = this.sceneIndex - 1;
        if (pre <= 0) {
            return;
        }
        const demo = listDemons[pre];
        this.updateSceneInfo(pre, demo.name);
        director.loadScene(demo.scene);
    }

    onClickNext(ev: MouseEvent) {
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
        /**
         * Label是在start()中初始化的。onEnable()早于start()
         */
        if (this.titleLable) {
            this.titleLable.string = name;
        }

        const notHomeScene = this.sceneIndex >= 0;
        this.preNode.active = notHomeScene;
        this.nextNode.active = notHomeScene;
        this.exitNode.active = notHomeScene;
    }
}


