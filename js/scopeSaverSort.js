
// detect if browser supports HTML5 local storage
function supports_local_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch(e){

	alert("Sorry! No native support for local storage")
    return false;
  }
}supports_local_storage();

// ==================== set up the DOM =======================================
var Contacts = {
	index: window.localStorage.getItem("Contacts:index"),
	$table: document.getElementById("contacts-table"),
	$form: document.getElementById("contacts-form"),
	$button_save: document.getElementById("contacts-op-save"),
	$button_discard: document.getElementById("contacts-op-discard"),

// ==================== initialize storage index =============================	
	
	init: function() {
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

// ==================== initialize table =====================================

	if (window.localStorage.length - 1) {
		var contacts_list = [], i, key;
		for (i = 0; i < window.localStorage.length; i++) {
			key = window.localStorage.key(i);
			if (/Contacts:\d+/.test(key)) {
				contacts_list.push(JSON.parse(window.localStorage.getItem(key)));
			}
		}

// ==================== sort contacts ========================================

		var sortOrderAscending = true;
		// primary sort is done by id 
		if (sortOrderAscending = true){
			if (contacts_list.length) {
			contacts_list
				.sort(function(a, b) {
					return a.id < b.id ? -1 : (a.id > b.id ? 1 : 0);
				})
				.forEach(Contacts.tableAdd);
			}
		}
	} 

	//preserve table header (key) name scope
	function scopePreserver() {
		return function() {
		var string = this.innerText;
		var tableHeader = string.toLowerCase();
		var keyName = tableHeader;

		// sort the data 
			var sortOn = function(arr, prop, reverse, numeric) {
				//ensure there is a property
				if (!prop || !arr) {
					return arr;
				}
				//set up sort function
				var sort_by = function (field, rev, primer) {
					return function(a, b) {
						a = primer(a[field]),
						b = primer(b[field]);
						//do actual sorting

						//descending order
						if (sortOrderAscending === false){
							return ((a < b) ? 1 : ((a > b) ? -1 : 0)) * (rev ? 1 : 1);
						}
						//ascending order	
						return ((a < b) ? -1 : ((a > b) ? 1 : 0)) * (rev ? -1 : 1);
					}
				}

				if (numeric) {
					//do sort "in place" with sort_by function
					arr.sort(sort_by(prop, reverse, function(a) {
					return parseFloat(String(a).replace(/[^0-9.-]+/g, ''));
					}));
				}else {	
					arr.sort(sort_by(prop, reverse, function(a){
					return String(a).toUpperCase();
					}));
				}
			}

			//delete current table records and change to new sort order
			if (tableHeader !== 'actions') {
				var tableHeaderRowCount = 1;
				var table = document.getElementById('contacts-table');
				var rowCount = table.rows.length;
					for (var i = tableHeaderRowCount; i < rowCount; i++) {
			    	table.deleteRow(tableHeaderRowCount);
			    	}

			    // Toggle Sort Order
			    sortOrderAscending === true ? sortOrderAscending = false: sortOrderAscending = true;
			    //resort list
			    function sortTable(){
			    	sortOn(contacts_list, keyName, false, false);
					contacts_list.forEach(Contacts.tableAdd)
			    }sortTable();
			}
		};
	}

			// keeps scope from being lost and allows sort to be based on table header selection 
			function tableContainScope() {
			var titles = document.getElementsByTagName('th');
			var rows = document.getElementsByTagName('tr');
				for( var i = 0; i < titles.length; i++) {
					titles[i].onclick = scopePreserver( i, rows[i]);
				}
			}tableContainScope();

// = add event listener then determine which callback function was triggered =

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

// ==================== create, update, delete individual entries ============
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