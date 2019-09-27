export interface ISceneService<T> {
    createAndRunScene(sceneConstructor: new () => T): void;
}
