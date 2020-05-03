console.clear();

const { sin, cos, tan, sign, pow, abs, floor, PI } = Math;

const CANVAS_HEIGHT = 400,
	CANVAS_WIDTH = 400;

let canvases = [];

const waveProps = {
	y: CANVAS_HEIGHT / 2,
	length: 0.01,
	amplitude: CANVAS_HEIGHT / 8,
	frequency: 0.035,
};

const waveFunctions = [
	(t) => sin(t),
	(t) => sin(tan(t) * 0.05),
	(t) => pow(sin(t), 3),

	(t) => sin(t) * cos(t),
	(t) => sin(pow(8, sin(t))),
	(t) => pow(sin(t * 3), 8) * sin(t),

	(t) => sin(t + cos(t)),
	(t) => abs(pow(cos(t * 2), 6)) * 2 - 1,
	(t) => (sin(t * 3) + sin(t * 6) + sin(t * 9)) / 3,

	(t) => sin(cos(tan(t / 2))) * cos(t) * sin(t),
	(t) => abs(sin(t)),
	(t) => tan(sin(t * 3) * cos(t * 2)),

	(t) => sin(tan(cos(t * 4))) * cos(tan(sin(t * 4))),
	(t) => 1 - abs(((t * PI) % 2) - 2),
	(t) => sign(sin(2 * PI * t)),
];

class Canvas {
	constructor(waveFunction, props = {}) {
		this.canvas = document.createElement("canvas");
		this.ctx = this.canvas.getContext("2d");
		this.canvas.height = CANVAS_HEIGHT;
		this.canvas.width = CANVAS_WIDTH;

		this.color = `hsl(${props.ratio * 360}, 100%, 65%)`;

		this.div = document.createElement("div");
		this.span = document.createElement("span");
		this.span.style.color = this.color;

		this.div.appendChild(this.canvas);
		this.div.appendChild(this.span);

		this.waveFunction = waveFunction;
		this.frequency = props.frequency;
		this.amplitude = props.amplitude;
		this.length = props.length;
		this.fromTop = props.y;
		this.increment = props.frequency;

		this.minRadius = this.canvas.height / 40;
		this.radius = this.minRadius;
		this.radiusIncrement = 10;

		this.t = 0;
	}

	draw() {
		// Line along x - axis at the middle
		this.ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
		this.ctx.lineWidth = 1;
		this.ctx.beginPath();
		this.ctx.moveTo(0, this.fromTop);
		this.ctx.lineTo(this.canvas.width, this.fromTop);
		this.ctx.stroke();
		this.ctx.closePath();

		// drawing the wave
		this.ctx.strokeStyle = this.color;
		this.ctx.lineWidth = 2;
		this.ctx.moveTo(0, this.fromTop);
		this.ctx.beginPath();
		for (let i = 0; i <= this.canvas.width; i++) {
			this.t = i * this.length + this.increment;
			this.ctx.lineTo(i, this.fromTop + this.waveFunction(this.t) * this.amplitude);
		}
		this.ctx.stroke();
		this.ctx.closePath();

		this.drawCircle();
	}

	drawCircle() {
		// draw the circle at the middle
		this.ctx.beginPath();
		this.ctx.fillStyle = this.color.replace("l", "la").replace("65%", "75%, 0.8");
		this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, this.radius, 0, PI * 2, false);
		this.ctx.fill();
		this.ctx.closePath();
	}

	update() {
		this.updateText(
			`${formateString(this.waveFunction.toString())} <br/> y = ${this.waveFunction(
				this.t
			).toFixed(2)}`
		);
		this.updateRadius();
		this.increment += this.frequency;
	}

	updateRadius() {
		this.radius =
			this.minRadius +
			abs(this.waveFunction((this.canvas.width / 2) * this.length + this.increment)) *
				this.radiusIncrement;
	}

	updateText(text) {
		this.span.innerHTML = text;
	}

	clear() {
		this.ctx.fillStyle = "#111";
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}
}

function init() {
	const container = document.createElement("main");
	canvases = waveFunctions.map((wave, i) => {
		const canvas = new Canvas(wave, { ...waveProps, ratio: i / waveFunctions.length });
		container.appendChild(canvas.div);
		return canvas;
	});
	document.body.appendChild(container);
}
init();

function animate() {
	requestAnimationFrame(animate);
	canvases.forEach((canvas) => {
		canvas.clear();
		canvas.draw();
		canvas.update();
	});
}
animate();

function formateString(string) {
	string = string.replace("(t) =>", "y = ");
	return string;
}
