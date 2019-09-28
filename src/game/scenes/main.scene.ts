import { Key } from 'ts-keycode-enum';
import { GameModelsFactory } from '../core/factories/game-models.factory';
import { IGameScene } from '../interfaces/core/scene.interface';
import { GameScene } from '../core/fasads/game-scene';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UISceneService } from '../services/ui.service';
import { MainUIScene } from './ui/main.ui';

export class MainScene implements IGameScene {
    public modelsFactory: GameModelsFactory;
    public scene: GameScene;
    public uiSceneSrv: UISceneService;
    private camera: BABYLON.ArcRotateCamera;
    private subsciber = new Subject();

    public buildScene(): void {
        this.scene.$sceneKeyDown.pipe(takeUntil(this.subsciber)).subscribe(evt => this.handleEvent(evt));
        this.scene.createSkyBox(5000, 'assets/skybox');
        this.scene.scene.gravity = new BABYLON.Vector3(0, -0.9, 0);
        this.initCamera();

        const light = new BABYLON.DirectionalLight('dir01', new BABYLON.Vector3(-1, -2, -1), this.scene.scene);
        light.position = new BABYLON.Vector3(100, 100, 100);
        light.intensity = 0.8;

        const lightSphere = BABYLON.Mesh.CreateSphere('sphere', 10, 30, this.scene.scene);
        lightSphere.position = light.position;
        const material = new BABYLON.StandardMaterial('light', this.scene.scene);
        material.emissiveColor = new BABYLON.Color3(1, 1, 0);
        material.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        lightSphere.material = material;

        const ground = BABYLON.Mesh.CreateGroundFromHeightMap('ground', 'assets/hightmap.jpg',
            500, 500, 100, 0, 60, this.scene.scene);
        const grass = new BABYLON.StandardMaterial('grass', this.scene.scene);
        grass.diffuseTexture = new BABYLON.Texture('assets/grass-texture.jpg', this.scene.scene, false, false, 20);
        ground.material = grass;
        ground.actionManager = new BABYLON.ActionManager(this.scene.scene);
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, 2);

        const person = this.modelsFactory.createPerson();
        person.viewModel.position.y = 20;
        const shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
        shadowGenerator.addShadowCaster(person.viewModel);
        shadowGenerator.useExponentialShadowMap = true;

        ground.receiveShadows = true;


        ground.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (evt) => {
                const pickResult = this.scene.scene.pick(evt.pointerX, evt.pointerY);
                console.warn(pickResult.pickedPoint);
                const timer = setInterval(() => {
                    const radyX = Math.round(person.viewModel.position.x) === pickResult.pickedPoint.x;
                    const radyY = Math.round(person.viewModel.position.z) === pickResult.pickedPoint.z;
                    if (radyX && radyY) {
                        clearTimeout(timer);
                        this.scene.scene.beforeRender = null;
                    } else {
                        this.scene.scene.beforeRender = () => {
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
                    // console.warn(person.viewModel.position);
                }, person.speed);
            })
        );
        this.uiSceneSrv.createAndRunScene(MainUIScene);
    }

    public initCamera(): void {
        this.camera = new BABYLON.ArcRotateCamera('Camera', 0, 0.8, 90, BABYLON.Vector3.Zero(), this.scene.scene);
        this.camera.setTarget(new BABYLON.Vector3(2, 3, 50));
        this.camera.attachControl(document.getElementById('renderCanvas'), false);
        this.camera.rotation = new BABYLON.Vector3(0.8, 0.8, 0);
        this.camera.layerMask = 1;
        this.camera.lowerBetaLimit = 0.1;
        this.camera.upperBetaLimit = (Math.PI / 2) * 0.9;
        this.camera.lowerRadiusLimit = 30;
        this.camera.upperRadiusLimit = 300;
        this.camera.position = new BABYLON.Vector3(0, 0, 100);
    }

    public handleEvent(evt: BABYLON.ActionEvent): void {
        // console.warn(evt);
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

    public destroyScene(): void {
        this.subsciber.next(null);
        this.subsciber.complete();
    }
}
