export interface limit {
	speed: number,
	map: {
		left: number,
		top: number,
		right: number,
		bot: number
	},
	timer: number
}

export interface state {
	bar: {
		left: number,
		right: number
	},
	ball: {
		x: number,
		y: number,
		vx: number,
		vy: number
	},
	score: {
		playerLeft: number,
		playerRight: number
	}
}

export interface intern {
	ball: {
		width: number,
		height: number,
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

export interface pause {
	cooldown: number,
	bool: boolean
}

interface bar {
	x: number,
	Up: boolean,
	Down: boolean
}