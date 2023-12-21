import { _decorator, Component, EventTarget, Node } from 'cc';
const { ccclass, property } = _decorator;

// 这里在不同的脚本之间，传递事件，需要用一个实列。
// 如果都在一个场景，可以用director来传递事件
const eventSource: EventTarget = new EventTarget();

export default eventSource;