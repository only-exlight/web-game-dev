import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import { EngineService } from './engine.service';
import { ISceneService } from '../interfaces/core/i-scene.service';
import { IUIScene } from '../interfaces/core/scene.interface';
import { SceneService } from './scene.service';

@injectable()
export class UISceneService implements ISceneService<IUIScene> {
    @inject(TYPES.EngineService) private engineSrv: EngineService;
    @inject(TYPES.SceneService) private sceneSrv: SceneService;

    public createAndRunScene(sceneCunstructor: new () => IUIScene): void {
        const scene = this.engineSrv.createScene();
        const uiScene = new sceneCunstructor();
        uiScene.scene = this.sceneSrv.scene;
        uiScene.buildScene();
        this.engineSrv.renderUI(scene);
    }
}
