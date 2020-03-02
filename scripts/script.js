var grids = {};
var active_grid_id;
var g;

const left_thingy_size = 40;

function initialise_grid(grid_id, grid_width, grid_height, colomn_size, row_size, font_size, font_size_s) {
	var container = document.getElementById("grid_container_" + grid_id);
	var row_sizes = [];
	var colomn_sizes = [];
	var temp = "";
	var values = [];
	for (var x = 0; x < grid_width; x++) {
		values[x] = [];
		for (var y = 0; y < grid_height; y++) {
			values[x][y] = "";
			temp += parse_template("cell_template", {
				grid_id: grid_id,
				left: colomn_size * x + left_thingy_size,
				top: row_size * (y + 1),
				cell_id: x + "_" + y,
				width: colomn_size - 1,
				height: row_size - 1,
				font_size: font_size,
				x: x,
				y: y
			});
		}
	}
	for (var i = 0; i < grid_width; i++) {
		colomn_sizes[i] = colomn_size;
		temp += parse_template("colomn_cell_template", {
			grid_id: grid_id,
			top: 0,
			left: colomn_size * i + left_thingy_size,
			id: i,
			letter: letter(i),
			width: colomn_size - 1,
			height: row_size - 1,
			font_size_s: font_size_s,
			bottom_offset: (row_size - font_size_s) / 2 - font_size_s / 5.5
		});
	}
	for (var i = 0; i < grid_height; i++) {
		row_sizes[i] = row_size;
		temp += parse_template("row_cell_template", {
			grid_id: grid_id,
			left: 0,
			top: row_size * (i + 1),
			id: i,
			letter: i + 1,
			width: left_thingy_size - 1,
			height: row_size - 1,
			font_size_s: font_size_s,
			bottom_offset: (row_size - font_size_s) / 2 - font_size_s / 5.5
		});
	}
	var grid = {
		id: grid_id,
		default_row_size: row_size,
		default_colomn_size: colomn_size,
		default_font_size: font_size,
		default_small_font_size: font_size_s,
		width: grid_width,
		height: grid_height,
		row_sizes: row_sizes,
		colomn_sizes: colomn_sizes,
		values: values,
		width: grid_width,
		height: grid_height,
		selections: [
			{
				x0: 0,
				y0: 0,
				x1: 0,
				y1: 0
			}
		],
		active_cell: {
			x: 0,
			y: 0
		},
		update_sizes: function() {
			var x_offs = left_thingy_size;
			var y_offs = 0;
			for (var x = 0; x < this.width; x++) {
				y_offs = this.default_row_size;
				var elem0 = document.getElementById("grid_" + this.id + "_colomn_" + x);
				elem0.setAttribute("style", "left: " + x_offs + "px; top: 0; width: " + (this.colomn_sizes[x] - 1) + "px; height: " + (this.default_row_size - 1) + "px;");
				for (var y = 0; y < this.height; y++) {
					if (x == 0) {
						var elem1 = document.getElementById("grid_" + this.id + "_row_" + y);
						elem1.setAttribute("style", "left: 0; top: " + y_offs + "px; width: " + (left_thingy_size - 1) + "px; height: " + (this.row_sizes[y] - 1) + "px;");
						var elem2 = document.getElementById("grid_" + this.id + "_row_" + y + "_content");
						elem2.setAttribute("style", "font-size: " + this.default_small_font_size + "px; bottom: " + ((this.row_sizes[y] - this.default_small_font_size) / 2 - this.default_small_font_size / 5.5) + "px;");
					}
					var elem3 = document.getElementById("grid_" + this.id + "_cell_" + x + "_" + y);
					elem3.setAttribute("style", "cursor: cell; left: " + x_offs + "px; top: " + y_offs + "px; width: " + (this.colomn_sizes[x] - 1) + "px; height: " + (this.row_sizes[y] - 1) + "px;");
					y_offs += this.row_sizes[y];
				}
				x_offs += this.colomn_sizes[x];
			}
		},
		set_row_size: function(row, size) {
			if (row < 0) {
				console.error("Row may not be under 0!");
				return;
			}
			else if (row >= this.width) {
				console.error("Row is out of range!");
				return;
			}
			this.row_sizes[row] = size;
		},
		set_colomn_size: function(colomn, size) {
			if (colomn < 0) {
				console.error("Colomn may not be under 0!");
				return;
			}
			else if (colomn >= this.height) {
				console.error("Colomn is out of range!");
				return;
			}
			this.colomn_sizes[colomn] = size;
		}
	};
	grids[grid_id] = grid;
	g = grid;
	container.innerHTML = parse_template("grid_content_template", {grid: grid, cells: temp});
}

function letter(number) {
	if (number == Infinity || number < 0) {
		return "ERROR";
	}
	const chars = [
		'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
		'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
	];
	var out = "";
	number ++;
	while (number > 0) {
		number --;
		var num0 = number % 26;
		out = chars[num0] + out;
		number = (number - num0) / 26;
	}
	return out;
}

function parse_template(template_id, meta_raw) {
	meta = JSON.parse(JSON.stringify(meta_raw)); //to not modify the meta input
	meta._global = window;
	var raw = document.getElementById(template_id).innerHTML;
	var split = raw.split("meta");
	var template = split[0];
	for (var i = 1; i < split.length; i++) {
		var i0 = split[i].indexOf('[');
		var i1 = split[i].indexOf(']');
		if (i0 == 0 && i1 > 0) {
			var adr = split[i].substring(1, i1);
			var adrs = adr.split(".");
			var holder = meta;
			for (var x = 0; x < adrs.length; x++) {
				holder = holder[adrs[x]];
			}
			template += holder + split[i].substring(i1 + 1);
		}
		else 
		{
			template += "meta" + split[i];
		}
	}
	return template;
}
