var grids = {};

const default_row_size = 25;
const default_colomn_size = 100;

function initialise_grid(grid_id, grid_width, grid_height) {
	var container = document.getElementById("grid_container_" + grid_id);
	var row_sizes = [];
	var colomn_sizes = [];
	for (i = 0; i < grid_width; i++) {
		colomn_sizes[i] = default_colomn_size;
	}
	for (i = 0; i < grid_height; i++) {
		row_sizes[i] = default_row_size;
	}
	var values = [];
	for (x = 0; x < grid_width; x++) {
		values[x] = [];
		for (y = 0; y < grid_height; y++) {
			values[x][y] = "";
		}
	}
	var grid = {
		id: grid_id,
		width: grid_width,
		height: grid_height,
		row_sizes: row_sizes,
		colomn_sizes: colomn_sizes,
		values: values
	};
	grids[grid_id] = grid;
	var temp = parse_template("cell_template", {grid_id: grid_id, cell_id: "0_0"});
	console.log(temp);
	container.innerHTML += temp;
}

function parse_template(template_id, meta) {
	var raw = document.getElementById(template_id).innerHTML;
	var split = raw.split("meta");
	var template = split[0];
	for (i = 1; i < split.length; i++) {
		var i0 = split[i].indexOf('[');
		var i1 = split[i].indexOf(']');
		if (i0 == 0 && i1 > 0) {
			template += meta[split[i].substring(1, i1)] + split[i].substring(i1 + 1);
		}
		else 
		{
			template += split[i];
		}
	}
	return template;
}
