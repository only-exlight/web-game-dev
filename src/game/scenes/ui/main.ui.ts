import { IUIScene } from '../../interfaces/core/scene.interface';

export class MainUIScene implements IUIScene {
    public scene: BABYLON.Scene;

    private advanseTexture: BABYLON.GUI.AdvancedDynamicTexture;

    public buildScene(): void {
        this.advanseTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI', true, this.scene);
        this.advanseTexture.layer.layerMask = 13;

        const panel = new BABYLON.GUI.StackPanel();
        panel.width = '220px';
        panel.fontSize = '14px';
        panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        this.advanseTexture.addControl(panel);

        const button1 = new BABYLON.GUI.Button('button1');

        button1.width = '100px';
        button1.height = '30px';
        button1.color = '#fefefe';
        button1.addControl(new BABYLON.GUI.TextBlock('button1-text', 'My first button'));
        button1.onPointerClickObservable.add(evt => console.warn(evt));
        panel.addControl(button1);
    }

    public destroyScene(): void {
        this.advanseTexture.dispose();
    }
}
