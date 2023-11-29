import { _decorator, Component, director, Director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('main')
export class Main extends Component {
    start() {
        console.log("main start()");
    }
    protected onLoad(): void {
        console.log("main onLoad()");
    }
    protected onDestroy(): void {
        console.log("main onDestroy()");
    }
    protected onDisable(): void {
        console.log("main onDisable()");
    }
    protected onEnable(): void {
        console.log("main onEnable()");
    }
    protected onRestore(): void {
        console.log("main onRestore()");
    }
    onFocusInEditor(): void {
        console.log("main onFocusInEditor()");
    }
    onLostFocusInEditor(): void {
        console.log("main onLostFocusInEditor()");
    }

    update(deltaTime: number) {

    }

    goToCoordScence() {
        director.loadScene("scene/CoordAnchor");
    }
}


