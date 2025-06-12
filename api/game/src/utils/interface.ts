export interface limit {
	speed: number,
	map: {
		left: number,
		top: number,
		right: number,
		bot: number
	}
}

export interface state {
	bar: {
		left: number,
		right: number
	},
	ball: {
		x: number,
		y: number
	},
	score: {
		player1: number,
		player2: number
	}
}

export interface intern {
	ball: {
		width: number,
		height: number,
		vx: number,
		vy: number,
		speed: number
	},
	bar: {
		left: bar,
		right: bar,
		width: number,
		height: number,
		speed: number
	}
}

interface bar {
	x: number,
	Up: boolean,
	Down: boolean
}