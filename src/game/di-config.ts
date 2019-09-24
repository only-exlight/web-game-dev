import { Container } from 'inversify';
import { TYPES } from './types';
import { EngineService } from './services/engine.service';
import { SceneService } from './services/scene.service';
import { GameModelsFactory } from './core/factories/game-models.factory';

const injector = new Container();
// Services
injector.bind<EngineService>(TYPES.EngineService).to(EngineService).inSingletonScope();
injector.bind<SceneService>(TYPES.SceneService).to(SceneService).inSingletonScope();
// Factories
injector.bind<GameModelsFactory>(TYPES.GameModelsFactory).to(GameModelsFactory).inSingletonScope();

export { injector };
