
// detect if browser supports HTML5 local storage
function supports_local_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch(e){

	alert("Sorry! No native support for local storage")
    return false;
  }
};supports_local_storage()

// =================set up the DOM ==========================================
var Contacts = {
	index: window.localStorage.getItem("Contacts:index"),
	$table: document.getElementById("contacts-table"),
	$form: document.getElementById("contacts-form"),
	$button_save: document.getElementById("contacts-op-save"),
	$button_discard: document.getElementById("contacts-op-discard"),
	
	init: function() {
// =================== initialize storage index =============================
		if (!Contacts.index) {
			window.localStorage.setItem("Contacts:index", Contacts.index = 1);
		}
// ==================== initialize form ======================================
		Contacts.$form.reset();
		Contacts.$button_discard.addEventListener("click", function(event) {
			Contacts.$form.reset();
			Contacts.$form.idEntry.value = 0;
		}, true);
		Contacts.$form.addEventListener("submit", function(event) {
			var entry = {
				id: parseInt(this.id_entry.value),
				first_name: this.first_name.value,
				last_name: this.last_name.value,
				email: this.email.value
			};
			if (entry.id == 0) { // add
				Contacts.storeAdd(entry);
				Contacts.tableAdd(entry);
			}
			else { // edit
				Contacts.storeEdit(entry);
				Contacts.tableEdit(entry);
			}

			this.reset();
			this.id_entry.value = 0;
			event.preventDefault();
		}, true);

 		// initialize table
		if (window.localStorage.length - 1) {
			var contacts_list = [], i, key;
			for (i = 0; i < window.localStorage.length; i++) {
				key = window.localStorage.key(i);
				if (/Contacts:\d+/.test(key)) {
					contacts_list.push(JSON.parse(window.localStorage.getItem(key)));
				}
			}.forEach(Contacts.tableAdd);

		// 	function scopepreserver() {
		// 		return function() {
		// 		var string = this.innerText;
		// 		var tableHeader = string.toLowerCase();
		// 		console.log('tableHeader= ', tableHeader)
		// 		console.log('localStorage = ', window.localStorage)	
		// 	// ==== sorts the database 
		// 	var x = tableHeader;
		// 	//sort table
		// 	var sortOn = function(arr, prop, reverse, numeric) {
		// 		//emsure there is a property
		// 		if (!prop || !arr) {
		// 			return arr;
		// 		}
		// 		//set up sort function
		// 		var sort_by = function (field, rev, primer) {
		// 			//return the required a,b function
		// 			return function(a, b) {
		// 				//reset a, b to the field
		// 				a = primer(a[field]),
		// 				b = primer(b[field]);
		// 				// console.log(11,a) //value
		// 				// console.log(22,field)// key (name of value)
		// 				//do actual sorting, reverse as needed
		// 				return ((a < b) ? -1 : ((a > b) ? 1 : 0)) * (rev ? -1 : 1);
		// 			}
		// 		}

		// 	if (numeric) {
		// 		//do sort "in place" with sort_by function
		// 		arr.sort(sort_by(prop, reverse, function(a) {
		// 			//force value to a string.
		// 			//replace any non numeric characters.
		// 			//parse as float to allow 0.02 values
		// 		return parseFloat(String(a).replace(/[^0-9.-]+/g, ''));
		// 		}));
		// 	} else {
		// 		//do sort "in place" with sort_by function
		// 		arr.sort(sort_by(prop, reverse, function(a){
		// 			// - force value to string.
		// 		return String(a).toUpperCase();
		// 		}));
		// 		}
		// 	}

		// 	//acsending order
		// 	sortOn(contacts_list, x, false, false);
		// 	console.log(11111111, contacts_list)
		// 	//reverse order
		// 	//sortOn(contacts_list, x, true, false);

		// 			};
		// 		}
		// 	}; 

		// // keeps scope from being lost and starts sort based on "th" selection 
		// function myfunction() {
		// var titles = document.getElementsByTagName("th");
		// var rows = document.getElementsByTagName("tr");
		// 	for( var i = 0; i < titles.length; i++) {
		// 		titles[i].onclick = scopepreserver( i, rows[i]);
		// 	}
		// };myfunction();

// =============== create, update, delete individual contacts ==============	

		storeAdd: function(entry) {
		entry.id = Contacts.index;
		window.localStorage.setItem("Contacts:index", ++Contacts.index);
		window.localStorage.setItem("Contacts:"+ entry.id, JSON.stringify(entry));
		},
		storeEdit: function(entry) {
			window.localStorage.setItem("Contacts:"+ entry.id, JSON.stringify(entry));
		},
		storeRemove: function(entry) {
			window.localStorage.removeItem("Contacts:"+ entry.id);
		},

		tableAdd: function(entry) {
			console.log(9999999, entry)
			var $tr = document.createElement("tr"), $td, key;
			for (key in entry) {
				if (entry.hasOwnProperty(key)) {
					$td = document.createElement("td");
					$td.appendChild(document.createTextNode(entry[key]));
					$tr.appendChild($td);
				}
			}
			$td = document.createElement("td");
			$td.innerHTML = '<a data-op="edit" data-id="'+ entry.id +'">Edit</a> | <a data-op="remove" data-id="'+ entry.id +'">Remove</a>';
			$tr.appendChild($td);
			$tr.setAttribute("id", "entry-"+ entry.id);
			Contacts.$table.appendChild($tr);
		},

		tableEdit: function(entry) {
			var $tr = document.getElementById("entry-"+ entry.id), $td, key;
			$tr.innerHTML = "";
			for (key in entry) {
				if (entry.hasOwnProperty(key)) {
					$td = document.createElement("td");
					$td.appendChild(document.createTextNode(entry[key]));
					$tr.appendChild($td);
				}
			}
			$td = document.createElement("td");
			$td.innerHTML = '<a data-op="edit" data-id="'+ entry.id +'">Edit</a> | <a data-op="remove" data-id="'+ entry.id +'">Remove</a>';
			$tr.appendChild($td);
		},

		tableRemove: function(entry) {
			Contacts.$table.removeChild(document.getElementById("entry-"+ entry.id));
		}
	};
	Contacts.init();//starts var contacts init
