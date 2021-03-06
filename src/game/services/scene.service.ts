import { injectable, inject } from 'inversify';
import { EngineService } from './engine.service';
import { TYPES } from '../types';
import { IGameScene } from '../interfaces/core/scene.interface';
import { injector } from '../di-config';
import { GameScene } from '../core/fasads/game-scene';
import { ISceneService } from '../interfaces/core/i-scene.service';

@injectable()
export class SceneService implements ISceneService<IGameScene> {
    private curScene: IGameScene;
    @inject(TYPES.EngineService) private engineSrv: EngineService;

    get scene(): BABYLON.Scene {
        return this.curScene.scene.scene;
    }

    public createAndRunScene(sceneConstructor: new () => IGameScene): void {
        this.destroyOldScene();
        const scene = this.engineSrv.createScene();
        this.curScene = new sceneConstructor();
        this.curScene.modelsFactory = injector.get(TYPES.GameModelsFactory);
        this.curScene.uiSceneSrv = injector.get(TYPES.UISceneService);
        this.curScene.scene = new GameScene(scene);
        this.curScene.buildScene();
        this.engineSrv.render(scene);
    }

    private destroyOldScene(): void {
        if (this.curScene) {
            this.curScene.destroyScene();
        }
    }
}
