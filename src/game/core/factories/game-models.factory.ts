import { injectable, inject } from 'inversify';
import { TYPES } from '../../types';
import { SceneService } from '../../services/scene.service';
import { TestPerson } from '../../models/person';

@injectable()
export class GameModelsFactory {
    @inject(TYPES.SceneService) private sceneSrv: SceneService;

    public createPerson(): TestPerson {
        const person = new TestPerson();
        const viewModel = BABYLON.Mesh.CreateBox('person', 20, this.sceneSrv.scene);
        const impostor = new BABYLON.PhysicsImpostor(viewModel, 1, {
            mass: 100
        });
        viewModel.physicsImpostor = impostor;
        viewModel.checkCollisions = true;
        person.viewModel = viewModel;
        return person;
    }
}
