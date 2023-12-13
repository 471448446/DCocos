import { _decorator, Component, Material, MeshRenderer, Node, resources, Texture2D, TextureCube } from 'cc';
const { ccclass, property } = _decorator;
/**
 * 居然无法直接给立方体的每个面贴图：
 * 如何给一个 cube的6个面设置不同的贴图?：https://forum.cocos.org/t/topic/145909/2
 * https://forum.cocos.org/t/topic/93837/2
 * 上文中提到，可以给立方体的每个面贴一个四方形Qurd，然后分别贴图。解决是可以解决，就丝滑不起来。
 * 然后这个demo中是贴不同的颜色：https://blog.csdn.net/hucailai/article/details/120094560
 */
@ccclass('Cube')
export class Cube extends Component {
    @property(Node)
    cubeFront: Node;
    @property(Node)
    cubeBack: Node;
    @property(Node)
    cubeTop: Node;
    @property(Node)
    cubeBottom: Node;
    @property(Node)
    cubeLeft: Node;
    @property(Node)
    cubeRight: Node;

    @property(Texture2D)
    front: Texture2D;
    @property(Texture2D)
    back: Texture2D;
    @property(Texture2D)
    top: Texture2D;
    @property(Texture2D)
    bottom: Texture2D;
    @property(Texture2D)
    left: Texture2D;
    @property(Texture2D)
    right: Texture2D;

    start() {
        this.setMatralMainTexture(this.cubeFront, this.front);
        this.setMatralMainTexture(this.cubeBack, this.back);
        this.setMatralMainTexture(this.cubeTop, this.top);
        this.setMatralMainTexture(this.cubeBottom, this.bottom);
        this.setMatralMainTexture(this.cubeLeft, this.left);
        this.setMatralMainTexture(this.cubeRight, this.right);
    }

    update(deltaTime: number) {

    }
    /**
     *https://forum.cocos.org/t/topic/104255
     *
     * @param cubePlane 
     * @param texture 
     */
    private setMatralMainTexture(cubePlane: Node, texture: Texture2D) {
        let meshRender = cubePlane.getComponent(MeshRenderer);
        let material: Material = meshRender.materials[0];

        console.log("before:" + material.getProperty("mainTexture"));
        material.setProperty("mainTexture", texture);
        console.log("after:" + material.getProperty("mainTexture"));
        // 前后对比，mainTexture是修改了。但是没有绘制出来。
        // 刷新？
        //再次初始化无效： https://forum.cocos.org/t/creator-3d-technique/90581
        // material.initialize({

        // });
        //重新设置无效：https://forum.cocos.org/t/topic/104574/2
        // meshRender.setMaterial(material, 0);

        // https://docs.cocos.com/creator3d/api/zh/classes/material.material-1.html
        // material.update(); // 这是一个私有方法
        // material.onLoaded();// onLoaded内部会调用update().还是无效
    
        //其实贴图已经修改了，只是效果看起来差不多。！！！！
    
    }
}


