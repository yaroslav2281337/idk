var menu_elements_t = [];
var menu_c = [];
const menu_spacer = "                                                                                  ";
menu_c.label = function(label, upper, lower) {
    if (upper) UI.AddLabel(" ");
    UI.AddLabel(label);
    if (lower) UI.AddLabel(" ")
}
menu_c.call = function(func, name, label, properties) {
    if (label in menu_elements_t) throw new Error("[Menu] The label must be unique!");
    const final_name = name + menu_spacer + label;
    var final_props = [final_name];
    const element_info_t = {
        name: name,
        label: label,
        properties: properties
    };
    if (properties !== null) {
        for (var i = 0; i < properties.length; i++) {
            final_props.push(properties[i])
        }
    }
    func.apply(null, final_props);
    menu_elements_t[label] = element_info_t;
    return label
}
menu_c.get = function(label) {
    if (!(label in menu_elements_t)) throw new Error("[Menu] This element's label doesn't exist!");
    const properties = menu_elements_t[label];
    const final_name = properties.name + menu_spacer + properties.label;
    return UI.GetValue("Misc", "JAVASCRIPT", "Script items", final_name)
}
menu_c.get_color = function(label) {
    if (!(label in menu_elements_t)) throw new Error("[Menu] This element's label doesn't exist!");
    const properties = menu_elements_t[label];
    const final_name = properties.name + menu_spacer + properties.label;
    return UI.GetColor("Misc", "JAVASCRIPT", "Script items", final_name)
}
menu_c.get_hotkey = function(label) {
    if (!(label in menu_elements_t)) throw new Error("[Menu] This element's label doesn't exist!");
    const properties = menu_elements_t[label];
    const final_name = properties.name + menu_spacer + properties.label;
    return UI.IsHotkeyActive("Misc", "JAVASCRIPT", "Script items", final_name)
}
menu_c.set = function(label, value) {
    if (!(label in menu_elements_t)) throw new Error("[Menu] This element's label doesn't exist!");
    const properties = menu_elements_t[label];
    const final_name = properties.name + menu_spacer + properties.label;
    UI.SetValue("Misc", "JAVASCRIPT", "Script items", final_name, value)
}
menu_c.visibility = function(label, visible) {
    if (!(label in menu_elements_t)) throw new Error("[Menu] This element's label doesn't exist!");
    const properties = menu_elements_t[label];
    const final_name = properties.name + menu_spacer + properties.label;
    UI.SetEnabled("Misc", "JAVASCRIPT", "Script items", final_name, visible)
}
var vec3 = {
    __index: "vec3"
};
vec3.new = function(x, y, z) {
    if (x instanceof Array) return {
        x: x[0],
        y: x[1],
        z: x[2]
    };
    return {
        x: x,
        y: y,
        z: z
    }
}
vec3.unpack = function(self) {
    return [self.x, self.y, self.z]
}
vec3.add = function(vec, vec2) {
    if (vec2 instanceof Number) return {
        x: vec.x + vec2,
        y: vec.y + vec2,
        z: vec.z + vec2
    }
    return {
        x: vec.x + vec2.x,
        y: vec.y + vec2.y,
        z: vec.z + vec2.z
    }
}
vec3.sub = function(vec, vec2) {
    if (vec2 instanceof Number) return {
        x: vec.x - vec2,
        y: vec.y - vec2,
        z: vec.z - vec2
    }
    return {
        x: vec.x - vec2.x,
        y: vec.y - vec2.y,
        z: vec.z - vec2.z
    }
}
vec3.multiply = function(vec, vec2) {
    if (vec2 instanceof Number) return {
        x: vec.x * vec2,
        y: vec.y * vec2,
        z: vec.z * vec2
    }
    return {
        x: vec.x * vec2.x,
        y: vec.y * vec2.y,
        z: vec.z * vec2.z
    }
}
vec3.divide = function(vec, vec2) {
    if (vec2 instanceof Number) return {
        x: vec.x / vec2,
        y: vec.y / vec2,
        z: vec.z / vec2
    }
    return {
        x: vec.x / vec2.x,
        y: vec.y / vec2.y,
        z: vec.z / vec2.z
    }
}
vec3.length = function(self) {
    return Math.sqrt((self.x * self.x) + (self.y * self.y) + (self.z * self.z))
}
vec3.distance = function(self, destination) {
    return vec3.length(vec3.sub(destination, self))
}
var color = {};
color.new_rgba = function(r, g, b, a) {
    if (!r || !g || !b || !a) throw new Error("[Color] Invalid color values!");
    return {
        r: r,
        g: g,
        b: b,
        a: a
    }
};
color.new_hexa = function(hex, a) {
    if (!hex || !a) throw new Error("[Color] Invalid color values!");
    var r, g, b;
    if (hex.length > 6) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16)
    } else {
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16)
    }
    return {
        r: r,
        g: g,
        b: b,
        a: a,
        hex: hex
    }
};
color.new_hsla = function(h, s, l, a) {
    if (!h || !s || !l || !a) throw new Error("[Color] Invalid color values!");
    var r, g, b;
    h /= 360;
    s /= 100;
    l /= 100;
    if (s === 0) {
        r = g = b = l
    } else {
        var hue2rgb = function(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p
        }
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
        g = Math.round(hue2rgb(p, q, h) * 255);
        b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255)
    }
    return {
        r: r,
        g: g,
        b: b,
        a: a,
        h: h,
        s: s,
        l: l
    }
};
color.is_valid = function(self) {
    return ((self instanceof Array) && self.r && self.g && self.b && self.a)
}
color.to_hex = function(self) {
    if (!color.is_valid(self)) throw new Error("[Color] Invalid color instance!");
    var str = "#";
    str += self.r.toString(16);
    str += self.g.toString(16);
    str += self.b.toString(16);
    return str
};
color.unpack = function(self) {
    return [self.r, self.g, self.b, self.a]
};
color.new_offset = function(base, r, g, b, a) {
    if (!color.is_valid(self) || (!r && !g && !b && !a)) throw new Error("[Color] Invalid color instance and/or values!");
    return {
        r: base.r + r,
        g: base.g + g,
        b: base.b + b,
        a: base.a + a,
        offset: {
            r: r,
            g: g,
            b: b,
            a: a
        }
    }
};
color.is_zero = function(self, tolerance) {   
    return ((self.r < tolerance) && (self.g < tolerance) && (self.b < tolerance) && (self.a < tolerance))
}
color.is_transparent = function(self, tolerance) {
    return ((self.a < tolerance))
}
color.shift_hue = function(self, amount) {
   
    if (amount > 360) amount = 360 - amount;
    return color.new_hsla(amount, self.s, self.l, self.a)
}

function text(x, y, a, text, color, font) {
    Render.StringCustom(x + 1, y + 1, a, text, [15, 15, 15, 55], font);
    Render.StringCustom(x, y, a, text, color, font)
}

function draw_container(x, y, w, title) {
    Render.GradientRect(x, y, w / 2, 2, 1, color.unpack(colors[1]), color.unpack(colors[0]));
    Render.GradientRect(x + w / 2, y, w / 2, 2, 1, color.unpack(colors[0]), color.unpack(colors[1]));
    Render.FilledRect(x, y + 2, w, 16, color.unpack(colors[3]));
    text(x + w / 2, y + 2, 1, title, color.unpack(colors[2]), font_title)
}
const clamp = function(v, min, max) {
    return Math.min(Math.max(v, min), max)
}
const exec = function(cmd, args) {
    const str = cmd + " ";
    if (args) {
        for (var i = 0; i < args.length; i++) {
            str += args[i];
            str += " "
        }
    }
    Cheat.ExecuteCommand(str)
}
const setup_color = function(label, def) {
    if (menu_c.get_color(label)[3] !== 0) return menu_c.get_color(label);
    return def
};
const CHAT_COLOR = {
    WHITE: '\x01',
    RED: '\x02',
    LIGHT_PURPLE: '\x03',
    GREEN: '\x04',
    LIGHT_GREEN: '\x05',
    LIME: '\x06',
    GRAY: '\x08',
    YELLOW: '\x09',
    LIGHT_BLUE: '\x0A',
    CYAN: '\x0B',
    BLUE: '\x0C',
    MAGENTA: '\x0D',
    PINK: '\x0E',
    LIGHT_RED: '\x0F',
    GOLD: '\x10',
};
const max_radius = Math.PI * 2;
const step = max_radius / 24;
var unduck = false;
var is_lj = false;
var last_log = 0;
var last_delta = 0;
var last_color = null;
var velocity_data = [];
var last_position = null;
var last_angles = null;
var last_mode = 0;
const practice_modes = ["Vanilla", "Vanilla KZ", "NoPre KZ"];
const configurations = [{
    air_accel: 12,
    accel: 5.5,
    stamina: 80,
    ladder_accel: 0.78,
    speed_cap: 0
}, {
    air_accel: 12,
    accel: 6.5,
    stamina: 0,
    ladder_accel: 1,
    speed_cap: 1
}, {
    air_accel: 100,
    accel: 6.5,
    stamina: 0,
    ladder_accel: 1,
    speed_cap: 1
}];
var last_jumping = false;
var jump_positions = [];
var last_pre = 0;
const scores = [
    [220, 225, 235],
    [230, 235, 245],
    [240, 245, 255],
    [245, 255, 265]
];
const sounds = ["perfect", "impressive", "godlike", "ownage"];
menu_c.label("| Movement features", true, false);
const jb = menu_c.call(UI.AddHotkey, "Automatic jumpbug", "mv_jumpbug", null);
const cb = menu_c.call(UI.AddHotkey, "Automatic crouchbug", "mv_crouchbug", null);
const lj = menu_c.call(UI.AddHotkey, "Automatic strafer", "mv_strafer", null);
menu_c.label("| Miscellaneous features", true, false);
const movement_type = menu_c.call(UI.AddDropdown, "Movement mode", "mv_practice_mode", [practice_modes]);
const practice = menu_c.call(UI.AddCheckbox, "Enable practice mode", "mv_practice", null);
const jumpstats = menu_c.call(UI.AddCheckbox, "Enable jumpstats", "mv_jumpstats", null);
menu_c.label("| Visual features", true, false);
const info = menu_c.call(UI.AddCheckbox, "Draw speed graph", "mv_showinfo", null);
const keystatus = menu_c.call(UI.AddCheckbox, "Draw keystatus", "mv_showkeys", null);
const info_offset = menu_c.call(UI.AddSliderInt, "Drawing vertical offset", "mv_showinfo_offset", [0, 500]);
menu_c.label("| Settings", true, false);
const setup_keys = menu_c.call(UI.AddCheckbox, "Setup keys", "mv_setup_keys", null);
const practice_hotkeys = {
    get: menu_c.call(UI.AddHotkey, "Save position", "keys_save", null),
    set: menu_c.call(UI.AddHotkey, "Set position", "keys_set", null),
};
const move_hotkeys = {
    forward: menu_c.call(UI.AddHotkey, "Move forward", "keys_fwrd", null),
    backward: menu_c.call(UI.AddHotkey, "Move backwards", "keys_back", null),
    left: menu_c.call(UI.AddHotkey, "Move to the left", "keys_left", null),
    right: menu_c.call(UI.AddHotkey, "Move to the right", "keys_right", null)
};
const hotkeys_t = [practice_hotkeys, move_hotkeys];
const setup_colors = menu_c.call(UI.AddCheckbox, "Setup colors", "mv_setup_colors", null);
const chart_colors = {
    main: menu_c.call(UI.AddColorPicker, "Chart: Main", "clrs_chart_main", null),
    axis: menu_c.call(UI.AddColorPicker, "Chart: Axis", "clrs_chart_axis", null),
    speed_loss: menu_c.call(UI.AddColorPicker, "Chart: Speed (loss)", "clrs_chart_velocity_loss", null),
    speed_stable: menu_c.call(UI.AddColorPicker, "Chart: Speed (normal)", "clrs_chart_velocity_stable", null),
    speed_gain: menu_c.call(UI.AddColorPicker, "Chart: Speed (gain)", "clrs_chart_velocity_gain", null),
    land_speed: menu_c.call(UI.AddColorPicker, "Chart: Landing speed", "clrs_chart_velocity_land", null),
    unit: menu_c.call(UI.AddColorPicker, "Chart: Unit", "clrs_chart_unit", null)
};
const keystatus_colors = {
    dormant: menu_c.call(UI.AddColorPicker, "Keystatus: Dormant", "clrs_hotkeys_dormant", null),
    active: menu_c.call(UI.AddColorPicker, "Keystatus: Active", "clrs_hotkeys_active", null),
    overlap: menu_c.call(UI.AddColorPicker, "Keystatus: Overlap", "clrs_hotkeys_overlap", null)
};
const practice_colors = {
    dormant: menu_c.call(UI.AddColorPicker, "Practice: Dormant", "clrs_practice_dormant", null),
    active: menu_c.call(UI.AddColorPicker, "Practice: Active", "clrs_practice_active", null)
};
const colors_t = [chart_colors, keystatus_colors, practice_colors];

function handle_menu_visibility() {
    for (var i = 0; i < hotkeys_t.length; i++) {
        const group = hotkeys_t[i];
        for (var elem in group) {
            const label = group[elem];
            const enabled = menu_c.get(setup_keys);
            menu_c.visibility(label, enabled)
        }
    }
    for (var i = 0; i < colors_t.length; i++) {
        const group = colors_t[i];
        for (var elem in group) {
            const label = group[elem];
            const enabled = menu_c.get(setup_colors);
            menu_c.visibility(label, enabled)
        }
    }
}
const hotkey_status = {
    get: false,
    set: false
};

function handle_hotkeys() {
    if (!menu_c.get(practice)) return;
    const player = Entity.GetLocalPlayer();
    if (!player || !Entity.IsAlive(player)) return;
    if (menu_c.get_hotkey(practice_hotkeys.get) === hotkey_status.get && menu_c.get_hotkey(practice_hotkeys.set) === hotkey_status.set) return;
    hotkey_status.get = menu_c.get_hotkey(practice_hotkeys.get);
    hotkey_status.set = menu_c.get_hotkey(practice_hotkeys.set);
    if (hotkey_status.get) {
        last_position = Entity.GetRenderOrigin(player);
        last_angles = Local.GetViewAngles();
        exec("playvol", ["buttons\\blip1", "1"])
    }
    if (hotkey_status.set) {
        if (last_position && last_angles) {
            exec("setpos_exact", [last_position[0], last_position[1], last_position[2]]);
            exec("setang_exact", [last_angles[0], last_angles[1]]);
            exec("playvol", ["buttons\\blip1", "1"])
        }
    }
}

function do_keystatus_ui() {
    if (!menu_c.get(keystatus)) return;
    const player = Entity.GetLocalPlayer();
    if (!player || !Entity.IsAlive(player)) return;
    const colors = {
        dormant: setup_color(keystatus_colors.dormant, [150, 150, 150, 125]),
        active: setup_color(keystatus_colors.active, [225, 225, 225, 200]),
        overlap: setup_color(keystatus_colors.overlap, [225, 0, 75, 125])
    };
    const x = Render.GetScreenSize()[0], y = Render.GetScreenSize()[1] + menu_c.get(info_offset);
    const status = {
        forward: menu_c.get_hotkey(move_hotkeys.forward),
        backward: menu_c.get_hotkey(move_hotkeys.backward),
        left: menu_c.get_hotkey(move_hotkeys.left),
        right: menu_c.get_hotkey(move_hotkeys.right)
    };
    if ((status.forward && status.backward) || (status.left && status.right)) {
        colors.dormant = colors.overlap;
        colors.active = colors.overlap
    };
    Render.String(x / 2 - 39, y / 2 + 205, 0, "W", status.forward ? colors.active : colors.dormant, 4);
    Render.String(x / 2 - 14, y / 2 + 205, 0, "A", status.left ? colors.active : colors.dormant, 4);
    Render.String(x / 2 + 5, y / 2 + 205, 0, "S", status.backward ? colors.active : colors.dormant, 4);
    Render.String(x / 2 + 19, y / 2 + 205, 0, "D", status.right ? colors.active : colors.dormant, 4)
}

function do_practice_ui() {
    if (!menu_c.get(practice)) return;
    const player = Entity.GetLocalPlayer();
    if (!player || !Entity.IsAlive(player)) return;
    const y = Render.GetScreenSize()[1];
    const font_practice = Render.AddFont("Segoe UI", 14, 800);
    const colors = {
        dormant: setup_color(practice_colors.dormant, [255, 210, 35, 125]),
        active: setup_color(practice_colors.active, [255, 225, 225, 200])
    };
    draw_container(5, y / 2 - 100, 200, "practice mode (" + practice_modes[menu_c.get(movement_type)] + ")");
    text(5, y / 2 - 80, 0, "1. Checkpoint", hotkey_status.get ? colors.active : colors.dormant, font_practice);
    text(5, y / 2 - 60, 0, "2. Teleport", hotkey_status.set ? colors.active : colors.dormant, font_practice)
}

function handle_movement_mode() {
    const type = menu_c.get(movement_type);
    if (type === last_mode) return;
    last_mode = type;
    exec("sv_airaccelerate", [configurations[type].air_accel]);
    exec("sv_accelerate", [configurations[type].accel]);
    exec("sv_staminamax", [configurations[type].stamina]);
    exec("sv_ladder_scale_speed", [configurations[type].ladder_accel])
}

function handle_jumpstats() {
    if (!menu_c.get(jumpstats)) return;
    const player = Entity.GetLocalPlayer();
    if (!player || !Entity.IsAlive(player)) return;
    const vec = vec3.new(Entity.GetProp(player, "CBasePlayer", "m_vecVelocity[0]"));
    const flags = Entity.GetProp(player, "CBasePlayer", "m_fFlags");
    var landed = false;
    if (!(flags & 1)) {
        if (!last_jumping) {
            jump_positions[0] = vec3.new(Entity.GetRenderOrigin(player));
        }
        last_jumping = true;
        return
    }
    if (flags & 1) {
        if (last_jumping) {
            landed = true;
            jump_positions[1] = vec3.new(Entity.GetRenderOrigin(player))
        }
        last_jumping = false
    }
    if (!landed) return;
     sub = vec3.sub(jump_positions[1], jump_positions[0]);  const dist = Math.round((Math.sqrt(sub.x * sub.x + sub.y * sub.y) + 31) * 100) / 100;
    const get_jump_level = function(dist) {
        const type = menu_c.get(movement_type);
        const data = {
            level: -1,
            color: CHAT_COLOR.WHITE
        };
        const current_scores = {
            perfect: scores[0][type],
            impressive: scores[1][type],
            godlike: scores[2][type],
            ownage: scores[3][type]
        };
        if (dist < current_scores.perfect) {
            return data
        } else if (dist >= current_scores.perfect && dist < current_scores.impressive) {
            data.level = 0;
            data.color = CHAT_COLOR.CYAN;
            return data
        } else if (dist >= current_scores.impressive && dist < current_scores.godlike) {
            data.level = 1;
            data.color = CHAT_COLOR.GREEN;
            return data
        } else if (dist >= current_scores.godlike && dist < current_scores.ownage) {
            data.level = 2;
            data.color = CHAT_COLOR.RED;
            return data
        } else if (dist >= current_scores.ownage) {
            data.level = 3;
            data.color = CHAT_COLOR.GOLD;
            return data
        }
    }
    if (flags & (1 << 1)) dist += 5;
    const jump_data = get_jump_level(dist);
    if (dist > 220 && dist < 300 && Math.abs(jump_positions[1].z - jump_positions[0].z) < 8) {
        if (jump_data.level > -1) {
            Cheat.ExecuteCommand("playvol " + sounds[jump_data.level] + " 1")
        }
        Global.PrintChat(" " + CHAT_COLOR.GRAY + "[" + CHAT_COLOR.YELLOW + "JS" + CHAT_COLOR.GRAY + "] Distance: " + jump_data.color + dist.toString() + CHAT_COLOR.GRAY + " | Pre-speed: " + CHAT_COLOR.WHITE + last_pre.toString())
    }
}

function do_jump_bug(should_jump) {
    const player = Entity.GetLocalPlayer();
    if (!player || !Entity.IsAlive(player)) return;
    if (!menu_c.get_hotkey(jb) && !menu_c.get_hotkey(cb)) {
        if (unduck) {
            unduck = false;
            Cheat.ExecuteCommand("-duck")
        }
        return
    }
    if (unduck) {
        unduck = false;
        Cheat.ExecuteCommand("-duck")
    }
    const flags = Entity.GetProp(player, "CBasePlayer", "m_fFlags");
    const origin = vec3.new(Entity.GetProp(player, "CBaseEntity", "m_vecOrigin"));
    const vel = vec3.new(Entity.GetProp(player, "CBasePlayer", "m_vecVelocity[0]"));
    vel = vec3.multiply(vel, vec3.new(Globals.TickInterval(), Globals.TickInterval(), 0));
    origin = vec3.add(origin, vel);
    if (flags & 1) {
        if (should_jump) {
            UserCMD.ForceJump()
        }
        return
    }
    for (var i = 0; i < max_radius; i += step) {
        const start = vec3.add(origin, vec3.new(Math.cos(i) * 17, Math.sin(i) * 17, 0));
        const end = vec3.add(origin, vec3.new(Math.cos(i) * 17, Math.sin(i) * 17, -128));
        const trace_t = Trace.Line(player, vec3.unpack(start), vec3.unpack(end));
        if (trace_t[1] * 128 < 9) {
            Cheat.ExecuteCommand("+duck");
            unduck = true;
            return
        }
    }
}

function do_long_jump() {
    const player = Entity.GetLocalPlayer();
    if (!player || !Entity.IsAlive(player)) return;
    const flags = Entity.GetProp(player, "CBasePlayer", "m_fFlags");
    if (!menu_c.get_hotkey(lj)) {
        if (is_lj) {
            is_lj = false;
            Cheat.ExecuteCommand("-jump");
            UI.SetValue("Misc", "Movement", "Auto strafe", 0)
        }
        return
    }
    if (flags & 1) {
        if (is_lj) {
            is_lj = false;
            Cheat.ExecuteCommand("-jump");
            UI.SetValue("Misc", "Movement", "Auto strafe", 0);
            return
        }
    } else {
        if (!is_lj) {
            is_lj = true;
            UI.SetValue("Misc", "Movement", "Auto strafe", 3);
            return
        }
        Cheat.ExecuteCommand("+jump")
    }
}
const get_delta_color = function(delta) {
    delta = Math.round(delta);
    if (delta > 0) {
        delta = setup_color(chart_colors.speed_loss, [255, 200, 200, 200])
    } else if (delta < 0) {
        delta = setup_color(chart_colors.speed_gain, [220, 255, 200, 200])
    } else if (delta > -1 && delta < 1) {
        delta = setup_color(chart_colors.speed_stable, [255, 255, 200, 200])
    }
    return delta
}

function do_velocity_info() {
    const player = Entity.GetLocalPlayer();
    if (!player || !Entity.IsAlive(player)) return;
    if (!menu_c.get(info)) return;
    const x = Render.GetScreenSize()[0], y = Render.GetScreenSize()[1] + menu_c.get(info_offset);
    const vec = Entity.GetProp(player, "CBasePlayer", "m_vecVelocity[0]");
    const velocity = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
    const in_air = Entity.GetProp(player, "CBasePlayer", "m_fFlags") & 1 || Entity.GetProp(player, "CBasePlayer", "m_fFlags") & 17;
    const colors = {
        main: setup_color(chart_colors.main, [200, 200, 200, 255]),
        unit: setup_color(chart_colors.unit, [225, 225, 225, 225]),
        axis: setup_color(chart_colors.axis, [100, 100, 100, 125]),
        land_speed: setup_color(chart_colors.land_speed, [255, 200, 200, 255])
    };
    Render.String(x / 2, y / 2 + 150, 1, Math.round(velocity).toString(), get_delta_color(last_delta), 4);
    Render.String(x / 2 + 1, y / 2 + 185, 1, "u/s", colors.unit, 2);
    Render.Line(x / 2 - 100, y / 2 + 25, x / 2 - 100, y / 2 + 145, colors.axis);
    Render.Line(x / 2 - 115, y / 2 + 130, x / 2 + 95, y / 2 + 130, colors.axis);
    if (Globals.Curtime() - last_log > Globals.TickInterval()) {
        last_log = Globals.Curtime();
        velocity_data.unshift([velocity, in_air])
    }
    if (velocity_data.length < 2) {
        Render.String(x / 2, 120, 1, "CREATING CHART...", [200, 200, 200, Math.sin((Globals.Realtime() % 3) * 4) * (255 / 2 - 1) + 255 / 2], 12);
        return
    }
    if (velocity_data.length > 40) velocity_data.pop();
    for (var i = 0; i < velocity_data.length - 1; i++) {
        const cur = velocity_data[i][0];
        const next = velocity_data[i + 1][0];
        const landed = velocity_data[i][1] && !velocity_data[i + 1][1];
        if (i === 0) last_delta = next - cur;
        Render.Line(x / 2 + 90 - (i - 1) * 5, y / 2 + 130 - (clamp(cur, 0, 450) * 75 / 320), x / 2 + 90 - i * 5, y / 2 + 130 - (clamp(next, 0, 450) * 75 / 320), colors.main);
        if (landed) {
            Render.String(x / 2 + 100 - (i + 1) * 5, y / 2 + 115 - (clamp(next, 0, 450) * 75 / 320), 0, Math.round(next).toString(), colors.land_speed, 3)
        }
    }
}
handle_menu_visibility();

function on_create_move() {
    const should_jump = menu_c.get_hotkey(jb);
    handle_hotkeys();
    handle_movement_mode();
    handle_jumpstats();
    handle_menu_visibility();
    do_jump_bug(should_jump);
    do_long_jump()
}

function on_paint() {
    do_practice_ui();
    do_velocity_info();
    do_keystatus_ui()
}

function reset() {
    last_log = Globals.Curtime();
    velocity_data = [];
    last_jumping = false;
    last_pre = 0;
    jump_positions = [];
    last_position = [];
    last_angles = []
}
Cheat.RegisterCallback("CreateMove", "on_create_move");
Cheat.RegisterCallback("Draw", "on_paint");
Cheat.RegisterCallback("player_connect_full", "reset");