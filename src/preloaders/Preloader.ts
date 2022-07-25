import * as PIXI from 'pixi.js';
import {Application} from '../Application';
import * as Utils from "../utils/Utils";

export class Preloader extends PIXI.Sprite {

	private preloader: PIXI.Sprite;
	private timer: number;
	private image: string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAQAAADa613fAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF0WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTAyLTA3VDEzOjU4OjQxKzAzOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTAyLTA3VDEzOjU4OjQxKzAzOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOS0wMi0wN1QxMzo1ODo0MSswMzowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDphMDM0MTUwMy1lOTUxLTM3NDktYTQ3Mi0yMzRkNThjNTZkM2IiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo0ZmYxYWM3Yi1lODVkLTVlNGEtYTdh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';
	constructor() {
		super();

		this.addChild(Utils.GraphicsHelper.createRect(Application.WIDTH, Application.HEIGHT, 0xffffff));

		this.addChild(this.preloader = new PIXI.Sprite());
		this.preloader.position.set(Application.WIDTH / 2, Application.HEIGHT / 2);
		this.preloader.anchor.set(0.5, 0.5);

		this.preloader.texture = new PIXI.Texture(PIXI.BaseTexture.from(this.image));

		this.timer = setInterval(this.rotate, 10);

	}

	public init = () => {
		this.emit('ready');

	}

	public progress = (value: number) => {
		//console.log(value);
	}

	public stop = () => {
		this.visible = false;
		clearInterval(this.timer);
	}

	public rotate = () => {
		this.preloader.rotation = this.preloader.rotation + 0.025;
	}
}