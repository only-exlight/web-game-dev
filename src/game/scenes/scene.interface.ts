import { GameModelsFactory } from '../core/factories/game-models.factory';

export interface IGameScene {
    scene: BABYLON.Scene;
    modelsFactory: GameModelsFactory;
    buildScene(): void;
}
