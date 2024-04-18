import { _decorator, Camera, CCBoolean, CCFloat, Component, director, EventTouch, input, Input, Node, Quat, UITransform, v2, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 尝试摄像机的位置，以观看天空盒
 */
@ccclass('SkyBoxRotation')
export class SkyBoxRotation extends Component {
    // 3D摄像机
    @property(Camera)
    main3DCamera: Camera;
    // 灵敏度
    @property(CCFloat)
    sensitivity = 0.001;
    // 旋转摄像机时，视野是否固定。
    @property(CCBoolean)
    focusSceneCenter: boolean = true;

    cameraPos: Vec3 = new Vec3();
    cameraRotation: Quat = new Quat();
    // 当前相机的旋转角度信息
    rotationQuatCamera = new Quat();


    cameraParentNode: Node = null;

    start() {
        /**
         * 这里之前是当前节点监听事件，然后和常驻节点的点击有点冲突
         */
        input.on(Input.EventType.TOUCH_MOVE, this.onMove, this);
        // 先获取当前相机的旋转角度
        this.main3DCamera.node.getRotation(this.rotationQuatCamera);
        // 将场景中所有物体的anchor属性设置为（0.5，0.5）
        // for (var i = 0; i < director.getScene().children.length; i++) {
        //     director.getScene().children[i].anchor = { x: 0.5, y: 0.5 };
        // }
        if (this.focusSceneCenter) {
            // 创建一个用于计算旋转中心点的节点
            this.cameraParentNode = new Node();
            // 添加到场景中
            director.getScene().addChild(this.cameraParentNode);

            // 或者
            // this.main3DCamera.node.parent.addChild(this.cameraParent);

            // 设置摄像机的父节点
            this.main3DCamera.node.setParent(this.cameraParentNode);

            this.cameraParentNode.addComponent(UITransform);
            let transform = this.cameraParentNode.getComponent(UITransform)
            transform.anchorX = 0;
            transform.anchorY = 0;

        }
    }
    protected onDestroy(): void {
        input.off(Input.EventType.TOUCH_MOVE, this.onMove, this);
    }

    update(deltaTime: number) {

    }

    onMove(ev: EventTouch) {
        // 移动位置，不需要
        // const deltaX = ev.movementX;
        // const deltaY = ev.movementY;
        // this.cameraPos.add3f(deltaX, deltaY, 0);
        // this.main3DCamera.node.setPosition(this.cameraPos);
        // this.main3DCamera.node.setRotation(30)
        if (this.focusSceneCenter) {
            this.rotatCameraAndFocuseCenter(ev);
        } else {
            this.justRotatCamera(ev);
        }
    }

    rotatCameraAndFocuseCenter(ev: EventTouch) {

        const deltaX: number = ev.getDeltaX();
        const deltaY: number = ev.getDeltaY();

        if (deltaX == 0 && deltaY == 0) {
            // 不需要旋转
            return;
        }
        // 计算摄像机绕场景中心点的旋转角度
        var rotationAngle = 30;
        // 创建一个Quat对象，表示旋转角度
        var rotationQuatY: Quat = new Quat();
        var rotationQuatX = new Quat();
        // 设置旋转角度
        if (deltaY != 0) {
            Quat.fromAxisAngle(rotationQuatY, v3(1, 0, 0), deltaY * this.sensitivity);
        }
        if (deltaX != 0) {
            Quat.fromAxisAngle(rotationQuatX, v3(0, 1, 0), -deltaX * this.sensitivity);
        }
        // 累计变化
        Quat.multiply(this.rotationQuatCamera, this.rotationQuatCamera, rotationQuatY);
        Quat.multiply(this.rotationQuatCamera, this.rotationQuatCamera, rotationQuatX);


        // 设置摄像机的rotation属性，旋转camera的父节点
        this.cameraParentNode.rotation = this.rotationQuatCamera;
    }

    justRotatCamera(ev: EventTouch) {

        const deltaX: number = ev.getDeltaX();
        const deltaY: number = ev.getDeltaY();

        if (deltaX == 0 && deltaY == 0) {
            // 不需要旋转
            return;
        }

        // 计算摄像机绕场景中心点的旋转角度
        var rotationAngle = 30;
        // 创建一个Quat对象，表示旋转角度
        var rotationQuatY: Quat = new Quat();
        var rotationQuatX = new Quat();
        // 设置旋转角度
        if (deltaY != 0) {
            Quat.fromAxisAngle(rotationQuatY, v3(1, 0, 0), deltaY * this.sensitivity);
        }
        if (deltaX != 0) {
            Quat.fromAxisAngle(rotationQuatX, v3(0, 1, 0), -deltaX * this.sensitivity);
        }
        // 累计变化
        Quat.multiply(this.rotationQuatCamera, this.rotationQuatCamera, rotationQuatY);
        Quat.multiply(this.rotationQuatCamera, this.rotationQuatCamera, rotationQuatX);
        // 设置摄像机的rotation属性
        this.main3DCamera.node.rotation = this.rotationQuatCamera;
    }
    /**
     * 修改摄像机的rotation属性实现场景的旋转，但是，这种方法会导致摄像机的视野发生变化，可能会影响到游戏的体验。
     * 直接绕y轴旋转。
     * 
     * cc.v3(0, 1, 0)表示一个单位向量，其方向为y轴。如果将y轴的值改为2，那么得到的向量将不再是单位向量，其方向仍然为y轴。
     * 在三维空间中，绕y轴旋转意味着将物体沿着y轴进行旋转。如果旋转轴为单位向量，那么旋转角度的变化将与旋转轴的长度无关。因此，无论y轴的值是1还是2，旋转的效果都是相同的。
     * 因此，传1或2都是可以的，没有特殊意义。
     * 如果要绕其他轴旋转，可以使用其他向量来表示旋转轴。例如，绕x轴旋转可以使用cc.v3(1, 0, 0)，绕z轴旋转可以使用cc.v3(0, 0, 1)。
     */
    howRotationCamera() {
        // 计算摄像机绕场景中心点的旋转角度
        var rotationAngle = 30;
        // 创建一个Quat对象，表示旋转角度
        var rotationQuat = new Quat();
        // 设置旋转角度
        Quat.fromAxisAngle(rotationQuat, v3(0, 1, 0), rotationAngle);
        // 设置摄像机的rotation属性
        this.main3DCamera.node.rotation = rotationQuat;
    }
}


