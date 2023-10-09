function fixUIBehaviour() {
	for(var i in UI) {
		if(!~i.indexOf("Add")) continue;
		(function(a) {
			UI[i] = function() {
				a.apply(this, Array.prototype.slice.call(arguments));
				return arguments[0].concat(arguments[1])
			}
		}(UI[i]))
	}
}
fixUIBehaviour();
Render.ShadowString = function(x, y, a, l, c, f) {
	const alpha = Math.min(c[3], 235);
	Render.String(x, y + 1, a, l, [10, 10, 10, alpha], f);
	Render.String(x, y, a, l, c, f)
}
Render.OutlineString = function(x, y, a, s, c, f) {
	const alpha = Math.min(235, c[3]);
	Render.String(x - 1, y - 1, a, s, [10, 10, 10, alpha], f);
	Render.String(x - 1, y + 1, a, s, [10, 10, 10, alpha], f);
	Render.String(x + 1, y - 1, a, s, [10, 10, 10, alpha], f);
	Render.String(x + 1, y + 1, a, s, [10, 10, 10, alpha], f);
	Render.String(x, y, a, s, c, f)
}

function subtract(a, b) {
	return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
};

function multiply(a, b) {
	return [a[0] * b[0], a[1] * b[1], a[2] * b[2]]
};

function normalize(a) {
	while(a < -180) a += 360;
	while(a > 180) a -= 360;
	return a
}

function extrapolate(a, b, c) {
	const velocity = Entity.GetProp(a, "CBasePlayer", "m_vecVelocity[0]");
	const interval = Globals.TickInterval();
	b[0] += velocity[0] * interval * c;
	b[1] += velocity[1] * interval * c;
	b[2] += velocity[2] * interval * c;
	return b
};

function degree_to_radian(a) {
	return a * Math.PI / 180
}

function angle_to_vector(a) {
	const sp = Math.sin(degree_to_radian(a[0]));
	const cp = Math.cos(degree_to_radian(a[0]));
	const sy = Math.sin(degree_to_radian(a[1]));
	const cy = Math.cos(degree_to_radian(a[1]));
	return [cp * cy, cp * sy, -sp]
}
var cache = {
	active: false,
	reference: false
};
var shared = {
	create_fonts: true,
	fonts: {
		default: null,
		small: null
	},
	target: null,
	side: 0,
	last_side: 0
};
const path = ["Rage", "Anti Aim", "Fake"];
const mode = UI.AddDropdown(path, "Body yaw freestanding", ["Off", "Hide real", "Hide fake"], 0);
const fs_target = UI.AddDropdown(path, "Freestanding target", ["Crosshair", "Distance"], 0);
const ref_body_freestanding = ["Rage", "Anti Aim", "Fake", "Hide real angle"];
const ref_inverter = ["Rage", "Anti Aim", "General", "Key assignment", "AA Direction inverter"];

function getDistance(a, b) {
	const origin = Entity.GetRenderOrigin(a);
	const sub = subtract(b, origin);
	const distance = Math.sqrt(sub[0] * sub[0] + sub[1] * sub[1] + sub[2] * sub[2]);
	return distance
}

function getFOV(a, b) {
	const eye_pos = Entity.GetEyePosition(a);
	const viewangles = Local.GetViewAngles();
	const sub = subtract(b, eye_pos);
	const yaw = Math.atan2(sub[1], sub[0]) * 180 / Math.PI;
	const pitch = -Math.atan2(sub[2], Math.sqrt(sub[0] * 2 + sub[1] * 2)) * 180 / Math.PI;
	var c = ((viewangles[1] % 360 - yaw % 360) % 360);
	const pitch_delta = viewangles[0] - pitch;
	c = normalize(c);
	return Math.sqrt(c * c + pitch_delta * pitch_delta)
}

function getBestTarget(b) {
	const sanitize = function(a) {
		return Entity.IsDormant(a) || !Entity.IsAlive(a)
	}
	const distance_based = UI.GetValue(fs_target);
	const enemies = Entity.GetEnemies();
	var c = {
		target: null,
		fov: 180,
		distance: 8192
	};
	for(var i = 0; i < enemies.length; i++) {
		const entity = enemies[i];
		if(sanitize(entity)) return;
		if(!distance_based) {
			const head_position = Entity.GetHitboxPosition(entity, 0);
			const fov = getFOV(b, head_position);
			if(fov < c.fov) {
				c.fov = fov;
				c.target = entity
			}
		} else {
			const origin = Entity.GetRenderOrigin(entity);
			const distance = getDistance(b, origin);
			if(distance < c.distance) {
				c.distance = distance;
				c.target = entity
			}
		}
	}
	shared.target = c.target
}

function getFreestandingSide(a) {
	const eye_position = Entity.GetEyePosition(a);
	const eye_angles = Local.GetViewAngles()[1];
	var b = {
		damages: [0, 0],
		fractions: {
			left: 0,
			right: 0
		}
	};
	shared.side = 0;
	if(shared.target) {
		const head_position = Entity.GetHitboxPosition(shared.target, 0);
		const multiplier = [32, 32, 32];
		const angles = [-90, 90];
		for(var i = 0; i < angles.length; i++) {
			const current = angles[i];
			const direction = multiply(angle_to_vector([0, eye_angles + current, 0]), multiplier);
			const point = extrapolate(a, [eye_position[0] + direction[0], eye_position[1] + direction[1], eye_position[2] + direction[2], ], 4);
			const bullet = Trace.Bullet(a, shared.target, point, head_position);
			if(!bullet) continue;
			b.damages[i] = bullet[1]
		}
		if(b.damages[0] < b.damages[1]) {
			shared.side = 1
		} else if(b.damages[0] > b.damages[1]) {
			shared.side = 2
		}
	}
	if(shared.side) return;
	for(var i = eye_angles - 180; i < eye_angles + 180; i += 180 / 12) {
		if(i === eye_angles) continue;
		const rotation = degree_to_radian(i);
		const point = [eye_position[0] + Math.cos(rotation) * 256, eye_position[1] + Math.sin(rotation) * 256, eye_position[2]];
		const line = Trace.Line(a, eye_position, point);
		if(!line) continue;
		b.fractions[i > eye_angles ? "right" : "left"] += line[1]
	}
	if(b.fractions.left < b.fractions.right) {
		shared.side = 1
	} else if(b.fractions.left > b.fractions.right) {
		shared.side = 2
	}
}

function updateFreestandingData() {
	const me = Entity.GetLocalPlayer();
	getBestTarget(me);
	getFreestandingSide(me)
}

function updateSettings() {
	const current_mode = UI.GetValue(mode);
	if(shared.side === shared.last_side) return;
	shared.last_side = shared.side;
	if(!current_mode) return;
	const inverted = UI.GetValue(ref_inverter);
	const desired = current_mode == 1 ? shared.side == 1 : shared.side == 2;
	if(!UI.GetHotkey(ref_inverter)) UI.SetValue(ref_inverter, 100);
	if(UI.GetHotkeyState(ref_inverter) != "Toggle") UI.SetHotkeyState(ref_inverter, "Toggle");
	if(inverted != desired) UI.ToggleHotkey(ref_inverter)
}

function onEnable() {
	const value = UI.GetValue(mode);
	shared.last_side = 0;
	if(value && !cache.active) {
		cache.active = true;
		cache.reference = UI.GetValue(ref_body_freestanding);
		UI.SetValue(ref_body_freestanding, 0)
	} else if(!value && cache.active) {
		cache.active = false;
		UI.SetValue(ref_body_freestanding, cache.reference)
	}
	UI.SetEnabled(fs_target, +value);
	UI.SetEnabled(ref_body_freestanding, +!value)
}
UI.RegisterCallback(mode, 'onEnable');

function onCreateMove() {
	updateFreestandingData();
	updateSettings()
}
function onEnable() 

UI.SetEnabled(fs_target, +value)
const value = UI.GetValue(mode)


Cheat.RegisterCallback("CreateMove", "onCreateMove");