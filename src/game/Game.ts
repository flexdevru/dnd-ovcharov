import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import {Application} from '../Application';
import {ImageMarginButton} from '../buttons/ImageMarginButton';
import {AssetsManager} from '../managers/AssetsManager';
import {FontStyle} from '../utils/FontStyle';
import {ArrayEx, parse_point} from '../utils/Utils';
import {Item} from './Item';
import {Place} from './Place';
import {DropShadowFilter} from '@pixi/filter-drop-shadow';

export class Game extends PIXI.Container {

	private data: Object;
	private items: Array<Item>;
	private btn_check: ImageMarginButton;
	private places: Array<Place>;

	//private positions: Array<PIXI.Point> = [new PIXI.Point(76, 210), new PIXI.Point(76, 321), new PIXI.Point(76, 434), new PIXI.Point(76, 545), new PIXI.Point(76, 656)];

	constructor() {

		super();

		this.data = AssetsManager.instance.getObject('data');

		this.addChild(AssetsManager.instance.getSprite(this.data['background']));


		let title: PIXI.Text = new PIXI.Text(this.data['title'], new FontStyle('SemiBold', 50).black().left().wordWrap().style);
		this.addChild(title).position.set(53, 85);

		let subtitle: PIXI.Text = new PIXI.Text(this.data['subtitle'], new FontStyle('Regular', 28).black().left().wordWrap().style);
		this.addChild(subtitle).position.set(55, 202);
		//subtitle.alpha = 0.8;

		let places: Array<Object> = this.data['places'];
		this.places = new Array<Place>();

		for (let i: number = 0; i < places.length; i++) {

			let place: Place = new Place(i, places[i]);
			place.x = parse_point(places[i]['position'] as string).x;
			place.y = parse_point(places[i]['position'] as string).y;
			place.width = Item.ITEM_WIDTH;
			place.height = Item.ITEM_HEIGHT;
			this.places.push(place);
		}

		let items: ArrayEx<string> = new ArrayEx(this.data['items']);
		items.randomize();

		this.items = new Array<Item>();

		for (let i: number = 0; i < items.length; i++) {

			let item: Item = new Item(items[i], new PIXI.Point(638, 928));
			item.addListener('drop', this.onItemDrop);
			item.addListener('return', this.onItemReturn);
			item.addListener('click', this.onItemClick);
			this.items.push(item);
			this.addChild(item);
		}

		this.items.sort(this.sortStackByPos);
		this.sortStack();

		this.btn_check = new ImageMarginButton('btn_check');
		this.addChild(this.btn_check).position.set(835, 914);
		this.btn_check.addListener('press', this.onCheckClick);
		this.btn_check.visible = false;

	}

	private onItemClick = () => {

		this.emit('action');
	}

	private onItemReturn = () => {

		this.items.sort(this.sortStackByPos);
		this.sortStack();
	}

	private sortStack = () => {

		let top_item: Item = this.items[0];
		let top_index: number = top_item.parent.children.length - 1;
		top_item.parent.setChildIndex(top_item, top_item.parent.children.length - 1);

		for (let i: number = 1; i < this.items.length; i++) {

			let item: Item = this.items[i];
			item.parent.setChildIndex(item, top_index - 1);
			top_index = top_index - 1;
		}
	}

	private sortStackByPos = (item1: Item, item2: Item) => {

		if (item1.position.x < item2.position.x) return -1;
		return 1;
	}

	private onItemDrop = (item: Item) => {

		let areas: Array<Object> = new Array<Object>();

		for (let i: number = 0; i < this.places.length; i++) {

			if (this.places[i].fixed == true) continue;
			if (this.places[i].intersects(item.rect) == false) continue;
			areas.push({'place': this.places[i], 'area': this.places[i].intersection(item.rect).area});
		}

		areas.sort(this.sort_areas);

		if (areas.length == 0) {

			item.return();
			return;
		}

		let place: Place = areas[0]['place'];
		place.add(item);
		this.check_filled();
	}

	private check_filled = () => {

		this.btn_check.visible = false;

		for (let i: number = 0; i < this.items.length; i++) {

			if (this.items[i].place == null) return;
		}

		this.btn_check.visible = true;
	}

	private sort_areas = (val1: Object, val2: Object): number => {

		if (val1['area'] < val2['area']) return 1;
		return -1;
	}

	public resetFilter = () => {

		this.filters = [];
		for (let i: number = 0; i < this.items.length; i++) this.items[i].visible = true;
	}

	public show = () => {

		this.visible = true;
		gsap.to(this, {duration: 0.5, alpha: 1});
	}

	public hide = () => {

		gsap.to(this, {duration: 0.5, alpha: 0, onComplete: this.onHideComplete});
	}

	private onHideComplete = () => {

		this.visible = false;
	}

	public get correct(): boolean {

		let res: boolean = true;
		for (let i: number = 0; i < this.places.length; i++) {

			let place: Place = this.places[i];
			if (place.correct == true) place.fix();
			else {
				place.wrong();
				res = false;
			}
		}

		return res;
	}

	public retry = () => {

		for (let i: number = 0; i < this.places.length; i++) {

			let place: Place = this.places[i];
			if (place.correct == true) place.fix();
			else setTimeout(place.clear, 1000);
		}

		//this.btn_check.visible = true;
	}

	private onCheckClick = () => {

		this.btn_check.visible = false;
		for (let i: number = 0; i < this.items.length; i++) this.items[i].disable();
		this.emit('complete');
	}
}