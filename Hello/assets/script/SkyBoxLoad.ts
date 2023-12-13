import { _decorator, Component, director, Node, resources, TextureCube } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 尝试在代码中切换天空盒
 * 需要注意，天空盒的资源是放在Bundle中，这里根目录resources的数据默认就是Bundle。
 * 如何将文件夹设置为Bundle：https://docs.cocos.com/creator/manual/zh/asset/bundle.html。
 * 加载的资源不在Bundle会报错：https://forum.cocos.org/t/topic/126826
 * 另外需要注意天空盒的图片是2的N次方，不然天空盒是黑色的。
 * cocos 3d 3.8版本 设置cubemap 天空盒一片黑 不显示：https://forum.cocos.org/t/topic/154119
 * 代码更改天空盒后，天是黑色的，是缺啥步骤么？：https://forum.cocos.org/t/topic/115839/4
 */
@ccclass('SkyBoxLoad')
export class SkyBoxLoad extends Component {

    skyBoxIndex = 0;
    skyBoxRes: string[] = [
        "skybox/skybox-cubemap",
        "skybox/skybox2048/textureCube",
        "skybox/skybox_meadow_2_1k/textureCube",
    ];

    start() {
        this.onChangeSkyBox();
    }

    update(deltaTime: number) {

    }

    onChangeSkyBox() {
        const resPath = this.skyBoxRes[this.skyBoxIndex++];
        console.log("加载天空盒：" + resPath);
        resources.load(resPath, TextureCube, (err, textureCube) => {
            if (!err) {
                // 没有错误时为null
                director.getScene().globals.skybox.envmap = textureCube;
            } else {
                console.log("加载结果：" + err);
            }
        });
        if (this.skyBoxIndex >= this.skyBoxRes.length) {
            this.skyBoxIndex = 0;
        }
    }
}


