import { GameModelsFactory } from '../../core/factories/game-models.factory';
import { GameScene } from '../../core/fasads/game-scene';
import { UISceneService } from '../../services/ui.service';

export interface IGameScene {
    scene: GameScene;
    modelsFactory: GameModelsFactory;
    uiSceneSrv: UISceneService;
    buildScene(): void;
    destroyScene(): void;
}

export interface IUIScene {
    scene: BABYLON.Scene;
    buildScene(): void;
    destroyScene(): void;
}
