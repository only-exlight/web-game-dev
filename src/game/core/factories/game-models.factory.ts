import { injectable, inject } from 'inversify';
import { TYPES } from '../../types';
import { SceneService } from '../../services/scene.service';
import { TestPerson } from '../../models/person';

@injectable()
export class GameModelsFactory {
    @inject(TYPES.SceneService) private sceneSrv: SceneService;

    public createPerson(): TestPerson {
        const person = new TestPerson();
        person.viewModel = BABYLON.MeshBuilder.CreateBox('person', { size: 20 }, this.sceneSrv.scene);
        return person;
    }
}
