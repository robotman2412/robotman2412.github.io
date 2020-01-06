var hash;
var query;
var cookie;

function git(id) {
	return document.getElementById(id);
}	

function loaded() {
	hash = null;
	if (document.location.hash != undefined && document.location.hash != null && document.location.hash !== "") {
		hash = document.location.hash.substring(1);
	}
	query = {};
	if (document.location.search != undefined && document.location.search != null && document.location.search !== "") {
		var rawQuery = document.location.search.substring(1).split('&');
		for (i in rawQuery) {
			var m = rawQuery[i].split('=');
			query[m[0]] = decodeURIComponent(m[1]);
		}
	}
	cookie = {};
	if (document.cookie !== "") {
		var rawCookie = document.cookie.split(';');
		for (i in rawCookie) {
			var m = rawCookie[i].split('=');
			cookie[m[0]] = m[1];
		}
	}
	cart = {};
	if (cookie.cart != undefined && cookie.cart !== "") {
		var rawCart = cookie.cart.split(',');
		for (i in rawCart) {
			var m = rawCart[i].split(' ');
			cart[m[1]] = m[0];
		}
	}
	String.prototype.replaceAll = function(search, replacement) {
		var target = this;
		return target.split(search).join(replacement);
	};
}

function save_cart_meta() {
	var keys = Object.keys(cart);
	var s = "";
	for (i in keys) {
		s += cart[keys[i]] + " " + keys[i];
		if (i < keys.length - 1) {
			s += ",";
		}
	}
	cookie.cart = s;
}

function save_cookie() {
	save_cart_meta();
	var keys = Object.keys(cookie);
	var s = "";
	for (i in keys) {
		s += keys[i] + "=" + cookie[keys[i]] + ";";
	}
	document.cookie = s;
}

function return_to_last() {
	if (query.return != undefined && query.return != null) {
		document.location = query.return;
	}
}

function load_products() {
	console.log("ok");
	$.getJSON("products.json", function(data) {
		for (i in data.index) {
			let id = data.index[i];
			$.getJSON("product/" + id + ".json", function(mData) {
				mData.id = id;
				load_product(mData);
			});
		}
	});
}

function add_to_cart_now(id) {
	//let count = git("add_to_cart_count").value;
	git("add_to_cart").innerHTML = "";
	cart[id] = count;
	$.getJSON("product/" + product + ".json", function(data) {
		data.no_add = true;
		data.count = product;
		git("cart").innerHTML += product(data);
	});
}

function add_to_cart(id) {
	document.location = "cart.html?add=" + id + "&return=" + encodeURIComponent(document.location);
}

function product(data) {
	var add_to_cart = "<button id='add_to_cart' class='shopping-cart' onclick='add_to_cart(\"" + data.id + "\")'>"
						+ "<i class='fa fa-shopping-cart'></i> add to cart"
					+ "</button>";
	if (data.no_add == true) {
		add_to_cart = "";
	}
	if (data.alternate_add == true) {
		add_to_cart = "<button id='add_to_cart' class='shopping-cart' onclick='add_to_cart_now(\"" + data.id + "\")'>"
						+ "<i class='fa fa-shopping-cart'></i> add to cart"
					+ "</button>";
	}
	if (data.add == true) {
		
	}
	var elem = "<div class='product-w'>"
				 + "<div class='product'>"
					 + "<div class='product-image-w'>"
						+ "<div class='product-image-align'></div>"
						+ "<image src='" + data.image + "' class='product-image'>"
					 + "</div>"
					 + "<h4 class='product-name'>" + data.name + "</h4>"
					 + "<h4 class='product-price'>Price: " + data.price + "</h4>"
					 + add_to_cart
					 + "<div class='product-desc'>"
						 + data.description.replaceAll('\n', "<br>")
					 + "</div>"
				 + "</div>"
			 + "</div>";
	return elem;
}

function load_product(data) {
	git("content").innerHTML += product(data);
}

function load_cart_page() {
	if (cookie.add != undefined) {
		$.getJSON("product/" + cookie.add + ".json", function(data) {
			data.count = true;
			data.alternate_add = true;
			git("add_to_cart").innerHTML += product(data);
		});
	}
	for (item in cart) {
		$.getJSON("product/" + item + ".json", function(data) {
			data.no_add = true;
			data.count = item;
			git("cart").innerHTML += product(data);
		});
	}
}
