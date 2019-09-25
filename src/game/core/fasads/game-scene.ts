import { Subject, Observable } from 'rxjs';

export class GameScene {
    private babylonScene: BABYLON.Scene;
    private sceneKeyDown$ = new Subject<BABYLON.ActionEvent>();
    private sceneKyUp$ = new Subject<BABYLON.ActionEvent>();

    constructor(scene: BABYLON.Scene) {
        this.init(scene);
    }

    get scene(): BABYLON.Scene {
        return this.babylonScene;
    }

    get $sceneKeyDown(): Observable<BABYLON.ActionEvent> {
        return this.sceneKeyDown$.asObservable();
    }

    get $sceneKeyUp(): Observable<BABYLON.ActionEvent> {
        return this.sceneKyUp$.asObservable();
    }

    private init(scene: BABYLON.Scene): void {
        this.babylonScene = scene;
        this.scene.actionManager = new BABYLON.ActionManager(this.scene);
        const exActions: BABYLON.ExecuteCodeAction[] = [];
        exActions.push(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, evt => this.sceneKeyDown$.next(evt)));
        exActions.push(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, evt => this.sceneKyUp$.next(evt)));
        exActions.forEach(exA => this.scene.actionManager.registerAction(exA));
    }

    public createSkyBox(size: number, texturePath: string): void {
        const skyBox = BABYLON.Mesh.CreateBox('skyBox', size, this.scene);
        const material = new BABYLON.StandardMaterial('skyMaterial', this.scene);
        material.reflectionTexture = new BABYLON.CubeTexture(texturePath, this.scene);
        material.diffuseColor = new BABYLON.Color3(0, 0, 0);
        material.specularColor = new BABYLON.Color3(0, 0, 0);
        material.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        material.backFaceCulling = false;
        material.disableLighting = true;
        skyBox.material = material;
    }

}
