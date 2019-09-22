import { Container } from 'inversify';
import { TYPES } from './types';
import { EngineService } from './services/engine.service';
import { SceneService } from './services/scene.service';

const injector = new Container();

injector.bind<EngineService>(TYPES.EngineService).to(EngineService).inSingletonScope();
injector.bind<SceneService>(TYPES.SceneService).to(SceneService).inSingletonScope();

export { injector };
