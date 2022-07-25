import gsap from 'gsap';
import * as PIXI from 'pixi.js';
import {AssetsManager} from '../managers/AssetsManager';

export class Tutorial extends PIXI.Container {
    private arrow: PIXI.Sprite;
    private pos1: PIXI.Point = new PIXI.Point(700, 1000);
    private pos2: PIXI.Point = new PIXI.Point(480, 830);

    constructor() {
        super();
        this.visible = false;

        this.arrow = AssetsManager.instance.getSprite('cursor');
        this.addChild(this.arrow).position.set(this.pos1.x, this.pos1.y);
    }

    public show = () => {
        this.visible = true;
        this.move_to_2();
    }

    private move_to_2 = () => {
        gsap.to(this.arrow.position, {duration: 2, x: this.pos2.x, y: this.pos2.y, onComplete: this.move_to_1});
    }

    private move_to_1 = () => {
        gsap.to(this.arrow.position, {duration: 0.25, x: this.pos1.x, y: this.pos1.y, onComplete: this.move_to_2});
    }

    public hide = () => {
        gsap.killTweensOf(this.position);
        this.visible = false;
    }
}