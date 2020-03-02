
var selecting = {};

function startselect(grid_id, x, y) {
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

function endselect() {
	
}
