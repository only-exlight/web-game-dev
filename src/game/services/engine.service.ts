import { injectable } from 'inversify';

@injectable()
export class EngineService {
    private canvas: HTMLCanvasElement;
    private engine: BABYLON.Engine;
    private scene: BABYLON.Scene;
    private uiScene: BABYLON.Scene;

    constructor() {
        this.canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
        this.engine = new BABYLON.Engine(this.canvas, true);
    }

    public render(scene: BABYLON.Scene): void {
        this.scene = scene;
        this.renderScenes();
    }

    public renderUI(scene: BABYLON.Scene): void {
        // this.uiScene = scene;
        // this.renderScenes();
    }

    private renderScenes(): void {
        this.engine.stopRenderLoop();
        this.engine.runRenderLoop(() => {
            if (this.scene) {
                this.scene.render();
            }
        });

        addEventListener('resize', () => {
            this.engine.resize();
        });
    }

    public createScene(sceneOptions: BABYLON.SceneOptions = {}): BABYLON.Scene {
        return new BABYLON.Scene(this.engine, sceneOptions);
    }
}
