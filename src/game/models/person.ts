import { AbstractPerson } from './abstract-person';

export class TestPerson extends AbstractPerson {
    public health = 500;
    public speed = 400;
    public viewModel: BABYLON.AbstractMesh;
}
