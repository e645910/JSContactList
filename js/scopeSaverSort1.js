
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
				id: parseInt(this.idEntry.value),
				company: this.company.value,
				address1: this.address1.value,
				address2: this.address2.value,
				city: this.city.value,
				state: this.state.value,
				zip: this.zip.value,
				notes: this.notes.value,
				fullName: this.fullName.value,
				dept: this.dept.value,
				phone: this.phone.value,
				email: this.email.value
			};
		if (entry.id == 0) {
			Contacts.storeAdd(entry);
			Contacts.tableAdd(entry);
		}
		else { 
			Contacts.storeEdit(entry);
			Contacts.tableEdit(entry);
		}

		this.reset();
		this.idEntry.value = 0;
		event.preventDefault();
		}, true);

// ======================== initialize table ===================================

	if (window.localStorage.length - 1) {
		var contacts_list = [], i, key;
		for (i = 0; i < window.localStorage.length; i++) {
			key = window.localStorage.key(i);
			if (/Contacts:\d+/.test(key)) {
				contacts_list.push(JSON.parse(window.localStorage.getItem(key)));
			}
		}
			//initial data sort by id  
			if (contacts_list.length) {
				contacts_list
					.sort(function(a, b) {
						return a.id < b.id ? -1 : (a.id > b.id ? 1 : 0);
					})
					.forEach(Contacts.tableAdd);

		//preserve var table Header scope
		function scopepreserver() {
			return function() {
				var string = this.innerText;
				var tableHeader = string.toLowerCase();
				console.log('tableHeader= ', tableHeader)

				// sorts the data 
				// makes the sort function dynamic
				var x = tableHeader;

				var sortOn = function(arr, prop, reverse, numeric) {
						//ensure there is a property
						if (!prop || !arr) {
							return arr;
						}
						//set up sort function
						var sort_by = function (field, rev, primer) {
							//return the required a,b function
							return function(a, b) {
								//reset a, b to the field
								a = primer(a[field]),
								b = primer(b[field]);
								//console.log(11,a) //value
								//console.log(22,field)// key (name of value)
								//do actual sorting, reverse as needed
								return ((a < b) ? -1 : ((a > b) ? 1 : 0)) * (rev ? -1 : 1);
							}
						}

						if (numeric) {
							//do sort "in place" with sort_by function
							arr.sort(sort_by(prop, reverse, function(a) {
								//force value to a string.
								//replace any non numeric characters.
								//parse as float to allow 0.02 values
							return parseFloat(String(a).replace(/[^0-9.-]+/g, ''));
							}));
						}else {	
							//do sort "in place" with sort_by function
							arr.sort(sort_by(prop, reverse, function(a){
								// - force value to string.
							return String(a).toUpperCase();
							}));
						}
				}

				if (window.localStorage.length - 1) {
					var contacts_list = [], i, key;
					for (i = 0; i < window.localStorage.length; i++) {
						key = window.localStorage.key(i);
						if (/Contacts:\d+/.test(key)) {
							contacts_list.push(JSON.parse(window.localStorage.getItem(key)));
						}
					} 
					
					if (tableHeader !== 'actions') {
						var tableHeaderRowCount = 1;
						var table = document.getElementById('contacts-table');
						var rowCount = table.rows.length;
						for (var i = tableHeaderRowCount; i < rowCount; i++) {
					    	table.deleteRow(tableHeaderRowCount);
					    }
							//acsending order
							sortOn(contacts_list, x, false, false);
							contacts_list.forEach(Contacts.tableAdd)
							console.log('Sorted Array', contacts_list)
							//reverse order
							//sortOn(contacts_list, x, true, false);	
					}
				};
			};
		}

			// keeps scope from being lost and starts sort based on "th" selection 
			function myfunction() {
			var titles = document.getElementsByTagName('th');
			var rows = document.getElementsByTagName('tr');
				for( var i = 0; i < titles.length; i++) {
					titles[i].onclick = scopepreserver( i, rows[i]);
				}
			};myfunction();
		}
	};
//===============================================		
		Contacts.$table.addEventListener("click", function(event) {
			var op = event.target.getAttribute("data-op");
			if (/edit|remove/.test(op)) {
				var entry = JSON.parse(window.localStorage.getItem("Contacts:"+ event.target.getAttribute("data-id")));
				if (op == "edit") {
					Contacts.$form.company.value = entry.company;
					Contacts.$form.address1.value = entry.address1;
					Contacts.$form.address2.value = entry.address2;
					Contacts.$form.city.value = entry.city;
					Contacts.$form.state.value = entry.state;
					Contacts.$form.zip.value = entry.zip;
					Contacts.$form.notes.value = entry.notes;
					Contacts.$form.fullName.value = entry.fullName;
					Contacts.$form.dept.value = entry.dept;
					Contacts.$form.phone.value = entry.phone;
					Contacts.$form.email.value = entry.email;
					Contacts.$form.idEntry.value = entry.id;
				}
				else if (op == "remove") {
					if (confirm('Are you sure you want to remove "'+ entry.first_name +' '+ entry.last_name +'" from your contacts?')) {
						Contacts.storeRemove(entry);
						Contacts.tableRemove(entry);
					}
				}
				event.preventDefault();
			}
		}, true);
	},

// =============== show, create, update, delete individual contacts ==============	
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
		Contacts.init();