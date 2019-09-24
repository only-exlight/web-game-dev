import { Key } from 'ts-keycode-enum';
import { GameModelsFactory } from '../core/factories/game-models.factory';
import { IGameScene } from './scene.interface';
import { PositionGizmo } from 'babylonjs';

export class MainScene implements IGameScene {
    public modelsFactory: GameModelsFactory;
    public scene: BABYLON.Scene;
    private camera: BABYLON.FreeCamera;
    private light: BABYLON.Light;

    private initSkyBox(): void {
        const skybox = BABYLON.Mesh.CreateBox('skyBox', 5000.0, this.scene);
        const skyboxMaterial = new BABYLON.StandardMaterial('skyBox', this.scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('assets/skybox', this.scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;
    }

    public initCamera(): void {
        this.camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(-100, 129, -100), this.scene);
        this.camera.setTarget(new BABYLON.Vector3(2, 3, 50));
        // this.camera.attachControl(this.canvas, false);
        this.camera.rotation = new BABYLON.Vector3(0.8, 0.8, 0);
    }

    public renderUI(): void {
        const ui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');
        ui.layer.layerMask = 2;

        const panel = new BABYLON.GUI.StackPanel();
        panel.width = '220px';
        panel.fontSize = '14px';
        panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        ui.addControl(panel);

        const button1 = new BABYLON.GUI.Button('button1');

        button1.width = '100px';
        button1.height = '30px';
        button1.color = '#fefefe';
        button1.addControl(new BABYLON.GUI.TextBlock('button1-text', 'My first button'));
        button1.onPointerClickObservable.add(evt => console.warn(evt));
        panel.addControl(button1);
    }

    public handleEvent(evt: BABYLON.ActionEvent): void {
        console.warn(evt);
        console.warn(this);
        const $e: KeyboardEvent = evt.sourceEvent;
        switch ($e.keyCode) {
            case Key.UpArrow: {
                this.camera.position.z++;
                this.camera.position.x++;
                break;
            }
            case Key.DownArrow: {
                this.camera.position.z--;
                this.camera.position.x--;
                break;
            }
            case Key.LeftArrow: {
                this.camera.position.z++;
                this.camera.position.x--;
                break;
            }
            case Key.RightArrow: {
                this.camera.position.z--;
                this.camera.position.x++;
                break;
            }
        }
    }

    public buildScene(): void {
        this.scene.gravity = new BABYLON.Vector3(0, -0.9, 0);
        this.initCamera();
        this.initSkyBox();
        this.light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this.scene);
        this.scene.actionManager = new BABYLON.ActionManager(this.scene);
        this.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger,
            this.handleEvent.bind(this)));
        this.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickDownTrigger, (evt) => {
            console.warn(evt);
        }));
        this.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnRightPickTrigger, (evt) => {
            console.warn(evt);
        }));

        const ground = BABYLON.MeshBuilder.CreateGround('ground',
            { width: 150, height: 150, subdivisions: 2 }, this.scene);
        const grass = new BABYLON.StandardMaterial('grass', this.scene);
        grass.diffuseTexture = new BABYLON.Texture('assets/grass-texture.jpg', this.scene, false, false, 20);
        ground.material = grass;
        ground.actionManager = new BABYLON.ActionManager(this.scene);

        const person = this.modelsFactory.createPerson();
        person.viewModel.position.y = 20;
        ground.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (evt) => {
                const pickResult = this.scene.pick(evt.pointerX, evt.pointerY);
                console.warn(pickResult.pickedPoint, person.viewModel.position);
                const timer = setInterval(() => {
                    const radyX = Math.round(person.viewModel.position.x) === pickResult.pickedPoint.x;
                    const radyY = Math.round(person.viewModel.position.z) === pickResult.pickedPoint.z;
                    if (radyX && radyY) {
                        clearTimeout(timer);
                        this.scene.beforeRender = null;
                    } else {
                        this.scene.beforeRender = () => {
                            if (pickResult.pickedPoint.x > person.viewModel.position.x) {
                                person.viewModel.position.x++;
                            } else {
                                person.viewModel.position.x--;
                            }
                            if (pickResult.pickedPoint.z > person.viewModel.position.z) {
                                person.viewModel.position.z++;
                            } else {
                                person.viewModel.position.z--;
                            }
                        };
                    }
                    console.warn(person.viewModel.position);
                }, person.speed);
            })
        );

    }
}
