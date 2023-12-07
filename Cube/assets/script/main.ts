import { _decorator, Component, director, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('main')
export class main extends Component {
    start() {

    }

    update(deltaTime: number) {

    }
    onStartGame() {
        director.loadScene("Level01");
    }
}


