import { injectable } from 'inversify';

@injectable()
export class EngineService {
    private canvas: HTMLCanvasElement;
    private engine: BABYLON.Engine;

    constructor() {
        this.canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
        this.engine = new BABYLON.Engine(this.canvas, true);
    }

    public render(scene: BABYLON.Scene): void {
        this.engine.stopRenderLoop();
        this.engine.runRenderLoop(() => {
            scene.render();
        });

        addEventListener('resize', () => {
            this.engine.resize();
        });
    }

    public createScene(sceneOptions: BABYLON.SceneOptions = {}): BABYLON.Scene {
        return new BABYLON.Scene(this.engine, sceneOptions);
    }
}
