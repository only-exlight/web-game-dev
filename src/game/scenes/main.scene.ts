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
    private camera: BABYLON.FreeCamera;
    private subsciber = new Subject();

    public buildScene(): void {
        this.scene.$sceneKeyDown.pipe(takeUntil(this.subsciber)).subscribe(evt => this.handleEvent(evt));
        this.scene.createSkyBox(5000, 'assets/skybox');
        this.scene.scene.gravity = new BABYLON.Vector3(0, -0.9, 0);
        this.initCamera();

        const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this.scene.scene);

        const ground = BABYLON.MeshBuilder.CreateGround('ground',
            { width: 150, height: 150, subdivisions: 2 }, this.scene.scene);
        const grass = new BABYLON.StandardMaterial('grass', this.scene.scene);
        grass.diffuseTexture = new BABYLON.Texture('assets/grass-texture.jpg', this.scene.scene, false, false, 20);
        ground.material = grass;
        ground.actionManager = new BABYLON.ActionManager(this.scene.scene);

        const person = this.modelsFactory.createPerson();
        person.viewModel.position.y = 20;
        ground.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (evt) => {
                const pickResult = this.scene.scene.pick(evt.pointerX, evt.pointerY);
                // console.warn(pickResult.pickedPoint, person.viewModel.position);
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
        this.camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(-100, 129, -100), this.scene.scene);
        this.camera.setTarget(new BABYLON.Vector3(2, 3, 50));
        // this.camera.attachControl(this.canvas, false);
        this.camera.rotation = new BABYLON.Vector3(0.8, 0.8, 0);
        this.camera.layerMask = 1;
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
