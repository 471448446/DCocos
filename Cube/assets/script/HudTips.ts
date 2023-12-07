import { _decorator, Component, Node } from 'cc';
import { PlayerMovement } from './PlayerMovement';
const { ccclass, property } = _decorator;

@ccclass('HudTips')
export class HudTips extends Component {
    @property(PlayerMovement)
    playerMove: PlayerMovement;

    start() {
    }

    update(deltaTime: number) {

    }

    onClickButton() {
        this.playerMove.enabled = true;
        this.node.active = false;

    }
}


