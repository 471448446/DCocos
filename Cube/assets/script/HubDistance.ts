import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HubDistance')
export class HubDistance extends Component {
    @property(Node)
    player: Node;
    @property(Label)
    distanceLabel: Label;

    start() {

    }

    update(deltaTime: number) {
        this.distanceLabel.string = this.player.position.z.toFixed(1);
    }
}


