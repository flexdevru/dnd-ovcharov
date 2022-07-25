import gsap from 'gsap';
import * as PIXI from 'pixi.js';
import {AssetsManager} from '../managers/AssetsManager';
import {FontStyle} from '../utils/FontStyle';
import {Rectangle} from '../utils/Utils';
import {Place} from './Place';
import {DropShadowFilter} from '@pixi/filter-drop-shadow';

export class Item extends PIXI.Sprite {

	public static ITEM_WIDTH: number = 643;
	public static ITEM_HEIGHT: number = 85;

	public data: Object;

	private text: PIXI.Text;
	private moved: boolean = false;
	private delta: PIXI.Point = new PIXI.Point();

	public orig_pos: PIXI.Point;


	private over_texture: PIXI.Texture;
	private normal_texture: PIXI.Texture;
	private right_texture: PIXI.Texture;
	private wrong_texture: PIXI.Texture;

	public fixed: boolean = false;
	public place: Place | null = null;

	constructor(data: Object, pos: PIXI.Point) {
		super();
		this.data = data;
		this.position.copyFrom(pos);
		this.orig_pos = new PIXI.Point();
		this.orig_pos.copyFrom(pos);
		/*
				let shadow: PIXI.Sprite = AssetsManager.instance.getSprite('item_shadow');
				this.addChild(shadow);
				shadow.position.set(-28, -9);
		*/

		let title: string = data['text'];

		this.text = new PIXI.Text(title, new FontStyle('Regular', 28).black().wordWrap().center().style);
		this.addChild(this.text);
		this.text.position.set(Item.ITEM_WIDTH / 2, Item.ITEM_HEIGHT / 2);
		this.text.anchor.set(0.5, 0.5);

		this.over_texture = AssetsManager.instance.getTexture('item_over');
		this.normal_texture = AssetsManager.instance.getTexture('item_normal');
		this.right_texture = AssetsManager.instance.getTexture('item_right');
		this.wrong_texture = AssetsManager.instance.getTexture('item_wrong');


		this.texture = this.normal_texture;

		this.interactive = true;
		this.buttonMode = true;

		this.addListener('pointerover', this.onPointerEvent);
		this.addListener('pointerout', this.onPointerEvent);

		this.addListener('pointerdown', this.onPointerEvent);
		this.addListener('pointerup', this.onPointerEvent);
		this.addListener('pointermove', this.onPointerEvent);
		this.addListener('pointerupoutside', this.onPointerEvent);

		let distance_data: PIXI.Point = new PIXI.Point(-10, 9);
		let distance: number = Math.sqrt(distance_data.x * distance_data.x + distance_data.y * distance_data.y);
		let angle: number = Math.atan(distance_data.x / distance_data.y);
		angle = 180 * angle / Math.PI - 180;

		this.filters = [new DropShadowFilter({blur: 9, color: 0x000000, alpha: 0.1, distance: distance, rotation: angle})];
	}

	private onPointerEvent = (event: PIXI.InteractionEvent) => {

		switch (event.type) {

			case 'pointerdown':
				this.emit('click', this);
				if (this.fixed == true) return;
				this.moved = true;

				this.delta.set(event.data.global.x - this.x, event.data.global.y - this.y);
				this.parent.setChildIndex(this, this.parent.children.length - 1);

				if (this.place != null) {

					this.place.free();
					this.place = null;
				}

				break;

			case 'pointerupoutside':
			case 'pointerup':
				if (this.moved == false) return;
				this.moved = false;

				this.emit('drop', this);
				break;

			case 'pointermove':

				if (this.moved == false) return;
				this.x = Math.round(event.data.global.x - this.delta.x);
				this.y = Math.round(event.data.global.y - this.delta.y);
				this.emit('move', this);

				break;

			case 'pointerover':

				this.texture = this.over_texture;
				break;

			case 'pointerout':

				this.texture = this.normal_texture;
				break;
		}
	}

	public get rect(): Rectangle {
		return new Rectangle(this.position.x, this.position.y, Item.ITEM_WIDTH, Item.ITEM_HEIGHT);
	}

	public dropTo = (position: PIXI.Point) => {
		gsap.to(this.position, {duration: 0.25, x: position.x, y: position.y});

	}

	public right = () => {
		this.texture = this.right_texture;
		//this.text.style.fill = 0xffffff;
		this.interactive = false;
	}

	public wrong = () => {
		this.texture = this.wrong_texture;
		//this.text.style.fill = 0xffffff;
		this.interactive = false;
	}

	private onFixComplete = () => {

	}

	public return = () => {
		this.texture = this.normal_texture;
		//this.text.style.fill = 0x000000;
		if (this.place != null) this.place.free();
		this.place = null;
		gsap.to(this.position, {duration: 0.25, x: this.orig_pos.x, y: this.orig_pos.y, onComplete: this.onReturnComplete});
		this.enable();
	}

	private onReturnComplete = () => {
		this.emit('return');
	}

	public enable = () => {
		this.interactive = true;
	}

	public disable = () => {
		this.interactive = false;
	}

	public get correct(): boolean {
		return false;
	}

	public get type(): number {
		return this.data['type'];
	}
}