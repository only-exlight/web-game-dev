import { injectable, inject } from 'inversify';
import { EngineService } from './engine.service';
import { TYPES } from '../types';

@injectable()
export class SceneService {
    @inject(TYPES.EngineService) private engineSrv: EngineService;

    public createAndRunScene(sceneConstructor: any): any {
        const scene = this.engineSrv.createScene();
        const sceneObj = new sceneConstructor(scene);
        this.engineSrv.render(scene);
    }
}
