import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UiManager')
export class UiManager extends Component {
    @property(Node)
    uiFail: Node;
    @property(Node)
    uiNext: Node;
    @property(Node)
    uiEnd: Node;
    start() {
        director.getScene().on("game-fail", this.onEvent_GameFail, this);
        director.getScene().on("game-next", this.onEvent_GameNext, this);
    }

    // protected onDestroy(): void {
    //     director.getScene().off("game-fail", this.onEvent_GameFail, this);
    //     director.getScene().off("game-next", this.onEvent_GameNext, this);
    // }

    update(deltaTime: number) {

    }

    onReplay() {
        this.uiFail.active = false;
        director.loadScene(director.getScene().name);
    }

    onMainMenu() {
        this.uiFail.active = false;
        director.loadScene("main");
    }

    onNextLevel() {
        if (director.getScene().name == "Level01") {
            director.loadScene("Level02");
        }
        if (director.getScene().name == "Level02") {
            director.loadScene("Level03");
        }
    }

    onEvent_GameFail() {
        this.uiFail.active = true;
    }

    onEvent_GameNext() {

        if (director.getScene().name == "Level03") {
            this.uiEnd.active = true;
        } else {
            this.uiNext.active = true;
        }
    }
}


