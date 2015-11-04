
// detect if browser supports HTML5 local storage
function supports_local_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch(e){

	alert("Sorry! No native support for local storage")
    return false;
  }
}supports_local_storage();

// set Company Name as main focus
function setFocus(){
	document.getElementById('setFocus').focus()
}

// ==================== set up the DOM =======================================
var Contacts = {//use $ in front of varible as an identifier DOM elements
	index: window.localStorage.getItem("Contacts:index"),
	$table: document.getElementById("contacts-table"),
	$form: document.getElementById("contacts-form"),
	$button_save: document.getElementById("contacts-op-save"),
	$button_discard: document.getElementById("contacts-op-discard"),

// ==================== initialize storage index =============================	
	
	init: function() {
		if (!Contacts.index) {
			window.localStorage.setItem("Contacts:index", Contacts.index = 1);// adds Contacts: index number.
		}

// ==================== initialize form ======================================
		Contacts.$form.reset(); //restore forms default value
		Contacts.$button_discard.addEventListener("click", function(event) {//listen for when the Clear button is then resets the form back to its orginal state and setting
			Contacts.$form.reset();
			Contacts.$form.idEntry.value = 0;
			setFocus();
		}, true);
		Contacts.$form.addEventListener("submit", function(event) {
			String.prototype.capitalize = function() {
    		return this.replace(/(?:^|\s)\S/g, 
    			function(a) { 
    				return a.toUpperCase(); 
    			});
			};
			// var entry = {// listens for when the save button is selected then either saves the data entered as a new record or updates an existing record  
			var entry = {
				id: parseInt(this.idEntry.value),
				company: this.company.value.capitalize(),
				address1: this.address1.value,
				address2: this.address2.value,
				city: this.city.value.capitalize(),
				state: this.state.value.capitalize(),
				zip: this.zip.value,
				notes: this.notes.value,
				fullname: this.fullname.value.capitalize(),
				dept: this.dept.value,
				phone: this.phone.value,
				email: this.email.value
			};
		if (entry.id === 0) {
			Contacts.storeAdd(entry);
			Contacts.tableAdd(entry);
		}
		else { 
			Contacts.storeEdit(entry);
			Contacts.tableEdit(entry);
		}
		// reset the form input back to blank
		this.reset();
		this.idEntry.value = 0;
		event.preventDefault();//stops the default action of an element from happening
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
		};

		var newList = [], key;
		for (var key in contacts_list) {
			var item = contacts_list[key];
			if (contacts_list.hasOwnProperty(key)){
				newList.push({
					"fullname"	: item.fullname,
					"dept"		: item.dept,
					"phone"		: item.phone,
					"email"		: item.email
				})
			}
		};
		newList.forEach(Contacts.tableAdd)

// ==================== sort contacts ========================================

		//preserve table header (key) name scope for for sorting data
		var sortOrderAscending = true;
		function scopePreserver() {
			return function() {
			var string = this.innerText;// table header name
			var tableHeader = string.toLowerCase();

				// sort the data 
				function sortOn(arr, prop, reverse) {
					//ensure there is a property
					if (!prop || !arr) {// prevents sort if there are no records
						return arr;
					}

					//set up sort function
					function sort_by(field, rev, primer) {
						return function(a, b) {
							a = primer(a[field]),
							b = primer(b[field]);
							//=== do actual sorting ========

							//descending order
							if (sortOrderAscending === false){
								return ((a < b) ? 1 : ((a > b) ? -1 : 0)) * (rev ? 1 : 1);
							}
							//ascending order	
							return ((a < b) ? -1 : ((a > b) ? 1 : 0)) * (rev ? -1 : 1);
						}
					}
					if (tableHeader === 'id') {
						//do sort "in place" with sort_by function
						arr.sort(sort_by(prop, reverse, function(a) {
							//force value to a string.
							//replace any non numeric characters.
							//parse as float to allow 0.02 values
						return parseFloat(String(a).replace(/[^0-9.-]+/g, ''));// parseFloat determines if the first character in the specified string is a number.
						}));
					}else {	
						//do sort "in place" with sort_by function
						arr.sort(sort_by(prop, reverse, function(a){
						// - force value to string.
						return String(a).toUpperCase();
						}));
					}
				};

				//delete current table records and change to new sort order
				if (tableHeader !== 'actions') {
					var tableHeaderRowCount = 1;// start index from 0
					var table = document.getElementById('contacts-table');
					var rowCount = table.rows.length;// take row count first since row length will keep changes as row is deleted preventing odd or even rows only getting deleted
						for (var i = tableHeaderRowCount; i < rowCount; i++) {
				    	table.deleteRow(tableHeaderRowCount);// deleteRow is fixed to prevent errors/exceptions when deleted
				    	}

				    // Toggle Sort Order
				    sortOrderAscending === true ? sortOrderAscending = false: sortOrderAscending = true;

				    //re-sort list
				    function sortTable(){
				    	sortOn(newList, tableHeader, false, false);// see function sortOn(arr, prop, reverse, numeric) { arr = contacts_list, prop = tableHeader, reverse = false, numeric = false
						newList.forEach(Contacts.tableAdd)
				    }sortTable();
				}
			};
		};

		// keeps scope from being lost and allows sort to be based on DOM table header selection 
		function tableContainScope() {
		var titles = document.getElementsByTagName('th');
		var rows = document.getElementsByTagName('tr');
			for( var i = 0; i < titles.length; i++) {
				titles[i].onclick = scopePreserver( i, rows[i]);
			}
		}tableContainScope();


// == add event listener then determine which callback function was triggered ======
	
		Contacts.$table.addEventListener("click", function(event) {// wait until you click on some
			var op = event.target.getAttribute("data-op"); //event.target refers to the element that triggered the event, which is getAttribute("data-op") or on the edit/remove button
			if (/edit|remove/.test(op)) {// The test(op) method tests for a match in a string equal to op.
				var entry = JSON.parse(window.localStorage.getItem("Contacts:"+ event.target.getAttribute("data-id")));
				if (op === "edit") {
					Contacts.$form.company.value = entry.company;
					Contacts.$form.address1.value = entry.address1;
					Contacts.$form.address2.value = entry.address2;
					Contacts.$form.city.value = entry.city;
					Contacts.$form.state.value = entry.state;
					Contacts.$form.zip.value = entry.zip;
					Contacts.$form.notes.value = entry.notes;
					Contacts.$form.fullname.value = entry.fullname;
					Contacts.$form.dept.value = entry.dept;
					Contacts.$form.phone.value = entry.phone;
					Contacts.$form.email.value = entry.email;
					Contacts.$form.idEntry.value = entry.id;
				}
				else if (op === "remove") {
					if (confirm('Are you sure you want to remove "'+ entry.fullname + ' with '+ entry.company + '" from your contacts?')) {
						Contacts.storeRemove(entry);
						Contacts.tableRemove(entry);
					}
				}
				event.preventDefault();
			}
			setFocus();
		}, true);
	},

// ==================== create, update, delete individual entries ============
		storeAdd: function(entry) {
			entry.id = Contacts.index;
			window.localStorage.setItem("Contacts:index", ++Contacts.index);
			window.localStorage.setItem("Contacts:"+ entry.id, JSON.stringify(entry));
			location.reload();
			setFocus();
		},
		storeEdit: function(entry) {
			window.localStorage.setItem("Contacts:"+ entry.id, JSON.stringify(entry));
			location.reload();
			setFocus();
		},
		storeRemove: function(entry) {
			window.localStorage.removeItem("Contacts:"+ entry.id);
			location.reload()
			setFocus();
		},

// =============================== table build =====================================
		tableAdd: function(entry) {
			// console.log(44444444, entry)
			var $tr = document.createElement("tr"), $td, key;//create a standard tr cell for data to be put into
			for (key in entry) {//key = table header names
				if (entry.hasOwnProperty(key)) {//best practice for the for-"in"-loop prevents the loop from enumerating over any inherited properties on the object
					// console.log("Key is " + key + ", value is " + entry[key])
					$td = document.createElement("td");
					$td.appendChild(document.createTextNode(entry[key]));
					$tr.appendChild($td);
					// console.log(55555555, entry[key]["fullname"]+ ' ,' + entry[key]["dept"])
				}
			}
			$td = document.createElement("td");//create a standard td cell for data to be put into
			$td.innerHTML = '<a data-op="edit" data-id="'+ entry.id +'">Edit</a> | <a data-op="remove" data-id="'+ entry.id +'">Remove</a>';//adds edit/remove action to each row via innerHTML
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