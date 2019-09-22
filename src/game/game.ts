import { TYPES } from './types';
import { SceneService } from './services/scene.service';
import { MainScene } from './scenes/main.scene';
import { injector } from './di-config';

export class Game {
    private sceneSrv: SceneService;

    constructor() {}

    public run(): void {
        this.sceneSrv = injector.get(TYPES.SceneService);
        this.sceneSrv.createAndRunScene(MainScene);
    }
}
