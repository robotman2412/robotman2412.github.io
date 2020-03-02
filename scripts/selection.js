
var selecting = {};

var moving_selections = {};
const moving_selection_interval_time = 10; //ms
const moving_selection_step = 0.05;

function add_selection_mover() {
	setInterval(handle_moving_selections, moving_selection_interval_time);
}

function startselect(grid_id, x, y) {
	updateselect(grid_id, x, y);
}

function snap_updateselect(grid_id, x, y) {
	var grid = grids[grid_id];
	grid.active_cell.x = x;
	grid.active_cell.y = y;
	var x_offs = left_thingy_size;
	var y_offs = grid.default_row_size;
	for (var i = 0; i < x; i++) {
		x_offs += grid.colomn_sizes[i];
	}
	for (var i = 0; i < y; i++) {
		y_offs += grid.row_sizes[i];
	}
	var elem = document.getElementById("grid_" + grid_id + "_active_cell");
	elem.setAttribute("style", "left: " + (x_offs - 2) + "px; top: " + (y_offs - 2) + "px; width: " + (grid.colomn_sizes[x] - 1) + "px; height: " + (grid.row_sizes[y] - 1) + "px;");
}

function updateselect(grid_id, x, y) {
	var grid = grids[grid_id];
	grid.active_cell.x = x;
	grid.active_cell.y = y;
	var x_offs = left_thingy_size;
	var y_offs = grid.default_row_size;
	for (var i = 0; i < x; i++) {
		x_offs += grid.colomn_sizes[i];
	}
	for (var i = 0; i < y; i++) {
		y_offs += grid.row_sizes[i];
	}
	var elem = document.getElementById("grid_" + grid_id + "_active_cell");
	var from = {
		x: parseInt(elem.style.left.substring(0, elem.style.left.length - 2)),
		y: parseInt(elem.style.top.substring(0, elem.style.top.length - 2)),
		w: parseInt(elem.style.width.substring(0, elem.style.width.length - 2)),
		h: parseInt(elem.style.height.substring(0, elem.style.height.length - 2)),
	};
	var to = {
		x: x_offs - 2,
		y: y_offs - 2,
		w: grid.colomn_sizes[x] - 1,
		h: grid.row_sizes[y] - 1
	};
	moving_selections[grid.id] = {
		from: from,
		to: to,
		progress: 0,
		elem: elem
	}
	//elem.setAttribute("style", "left: " + (x_offs - 2) + "px; top: " + (y_offs - 2) + "px; width: " + (grid.colomn_sizes[x] - 1) + "px; height: " + (grid.row_sizes[y] - 1) + "px;");
}

function handle_moving_selections() {
	var remove = [];
	for (const grid_id in moving_selections) {
		const grid = grids[grid_id];
		var moving = moving_selections[grid_id];
		var progress = moving.progress + moving_selection_step;
		if (progress >= 1) {
			progress = 1;
			remove[remove.length] = grid_id;
		}
		else
		{
			moving_selections[grid_id].progress = progress;
		}
		var x = lerp(progress, moving.from.x, moving.to.x);
		var y = lerp(progress, moving.from.y, moving.to.y);
		var w = lerp(progress, moving.from.w, moving.to.w);
		var h = lerp(progress, moving.from.h, moving.to.h);
		moving.elem.setAttribute("style", "left: " + x + "px; top: " + y + "px; width: " + w + "px; height: " + h + "px;");
	}
	for (const grid_id in remove) {
		delete moving_selections[grid_id];
	}
}

function lerp(progress, from, to) {
	return from + (to - from) * progress;
}

function endselect() {
	
}
