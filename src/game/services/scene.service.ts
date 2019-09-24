import { injectable, inject } from 'inversify';
import { EngineService } from './engine.service';
import { TYPES } from '../types';
import { IGameScene } from '../scenes/scene.interface';
import { injector } from '../di-config';

@injectable()
export class SceneService {
    private curScene: BABYLON.Scene;
    @inject(TYPES.EngineService) private engineSrv: EngineService;

    get scene(): BABYLON.Scene {
        return this.curScene;
    }

    public createAndRunScene(sceneConstructor: new () => IGameScene): void {
        this.curScene = this.engineSrv.createScene();
        const sceneInst: IGameScene = new sceneConstructor();
        sceneInst.modelsFactory = injector.get(TYPES.GameModelsFactory);
        sceneInst.scene = this.curScene;
        sceneInst.buildScene();
        this.engineSrv.render(this.curScene);
    }
}
