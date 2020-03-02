var dragging = null;

var mouseX = 0;
var mouseY = 0;
var mouseRight = false;

var control_key = false;

function undrag() {
	if (dragging == null) {
		return;
	}
	clearInterval(dragging.interval);
	dragging = null;
}

function dragger() {
	var elem;
	var handle;
	if (dragging.is_vertical) {
		elem = document.getElementById("grid_" + dragging.grid + "_row_" + dragging.id);
		handle = document.getElementById("grid_" + dragging.grid + "_row_" + dragging.id + "_handle");
		var rect = elem.getClientRects()[0];
		var height = mouseY - rect.top + 3;
		if (height < 10) {
			height = 10;
		}
		grids[dragging.grid].set_row_size(dragging.id, height);
		grids[dragging.grid].update_sizes();
	}
	else
	{
		elem = document.getElementById("grid_" + dragging.grid + "_colomn_" + dragging.id);
		handle = document.getElementById("grid_" + dragging.grid + "_colomn_" + dragging.id + "_handle");
		var rect = elem.getClientRects()[0];
		var width = mouseX - rect.left + 3;
		if (width < 10) {
			width = 10;
		}
		grids[dragging.grid].set_colomn_size(dragging.id, width);
		grids[dragging.grid].update_sizes();
	}
}

function drag_h(id, grid) {
	undrag();
	if (mouseRight) {
		grids[grid].set_colomn_size(id, grids[grid].default_colomn_size);
		grids[grid].update_sizes();
		mouseRight = false;
	}
	else
	{
		dragging = {
			interval: setInterval(dragger, 10),
			id: id,
			grid: grid,
			is_vertical: false,
			last: -1
		}
	}
}


function drag_v(id, grid) {
	undrag();
	if (mouseRight) {
		grids[grid].set_row_size(id, grids[grid].default_row_size);
		grids[grid].update_sizes();
		mouseRight = false;
	}
	else
	{
		dragging = {
			interval: setInterval(dragger, 10),
			id: id,
			grid: grid,
			is_vertical: true,
			last: -1
		}
	}
}

function add_listeners() {
    document.onmousemove = handleMouseMove;
	document.oncontextmenu = handleContextMenu;
	document.onkeydown = handleKeyDown;
	document.onkeyup = handleKeyUp;
	function handleKeyDown(event) {
		control_key = event.ctrlKey;
	}
	function handleKeyUp(event) {
		control_key = event.ctrlKey;
	}
	function handleContextMenu(event) {
		var clazz = event.srcElement.getAttribute("class");
		if (clazz != null && clazz.indexOf("drag") != -1) {
			if (dragging == null) {
				var meta = event.srcElement.getAttribute("drag_meta");
				var split = meta.split(",");
				var grid = parseInt(split[0]);
				var id = parseInt(split[1]);
				if (split[2] == "vertical") {
					grids[grid].set_row_size(id, grids[grid].default_row_size);
					grids[grid].update_sizes();
				}
				else
				{
					grids[grid].set_colomn_size(id, grids[grid].default_colomn_size);
					grids[grid].update_sizes();
				}
			}
			else
			{
				colsole.log("Nah.");
				if (dragging.is_vertical) {
					grids[dragging.grid].set_row_size(dragging.id, grids[dragging.grid].default_row_size);
				}
				else
				{
					grids[dragging.grid].set_colomn_size(dragging.id, grids[dragging.grid].default_colomn_size);
				}
				grids[dragging.grid].update_sizes();
				undrag();
			}
			return false;
		}
		return true;
	}
    function handleMouseMove(event) {
        var eventDoc, doc, body;

        event = event || window.event; // IE-ism

        // If pageX/Y aren't available and clientX/Y are,
        // calculate pageX/Y - logic taken from jQuery.
        // (This is to support old IE)
        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
              (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
              (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
              (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
              (doc && doc.clientTop  || body && body.clientTop  || 0 );
        }

        // Use event.pageX / event.pageY here
		mouseX = event.pageX;
		mouseY = event.pageY;
    }
}
