import { GameModelsFactory } from '../core/factories/game-models.factory';
import { GameScene } from '../core/fasads/game-scene';

export interface IGameScene {
    scene: GameScene;
    modelsFactory: GameModelsFactory;
    buildScene(): void;
    destroyScene(): void;
}
