interface pos {
	x: number,
	y: number
}

export interface bar {
	left: pos,
	right: pos,
	width: number,
	height: number,
	speed: number
}

export interface ball {
	old: pos,
	new: pos,
	width: number,
	height: number,
	vx: number,
	vy: number
}

export interface limit {
	map: {
		left: number,
		top: number,
		right: number,
		bot: number
	}
}

export interface input {
	up: boolean,
	down: boolean
}