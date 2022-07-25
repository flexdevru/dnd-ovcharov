import * as PIXI from 'pixi.js';
import {Rectangle} from "../utils/Utils";
import {Item} from './Item';

export class Place extends Rectangle {

	public item!: Item | null;
	private position: number;
	public fixed: boolean = false;
	private data: Object;

	constructor(position: number, data: Object) {

		super();
		this.data = data;
		this.position = position;
	}

	public add = (item: Item) => {

		if (this.item != null) {
			this.item.return();
		}
		this.item = item;
		this.item.place = this;
		this.item.dropTo(new PIXI.Point(this.x, this.y));
	}

	public get empty(): boolean {

		if (this.item == null) return true;
		return false;
	}

	public clear = () => {

		if (this.item != null) this.item.return();
		this.item = null;
	}

	public free = () => {

		this.item = null;
	}

	public get correct(): boolean {

		if (this.item == null) return true;
		if (this.item.type == this.data['type']) return true;

		return false;
	}

	public fix = () => {

		if (this.item == null) return;
		this.fixed = true;
		this.item.right();
	}

	public wrong = () => {

		if (this.item == null) return;
		this.item.wrong();
	}
}