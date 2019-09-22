
import 'reflect-metadata';
import 'babylonjs';
import 'babylonjs-gui';
import './styles.scss';
import { Game } from './game/game';

addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.run();
});
