
// detect if browser supports HTML5 local storage
function supports_local_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch(e){

	alert("Sorry! No native support for local storage")
    return false;
  }
}supports_local_storage();

// ==================== set up the DOM ===============================================
var Contacts = {
	index: window.localStorage.getItem("Contacts:index"),
	$table: document.getElementById("contacts-table"),
	$form: document.getElementById("contacts-form"),
	$select: document.getElementById("contacts-dropdown"),
	$button_save: document.getElementById("contacts-op-save"),
	$button_discard: document.getElementById("contacts-op-discard"),

// ==================== initialize storage index =====================================
	
	init: function() {
		if (!Contacts.index) {
			window.localStorage.setItem("Contacts:index", Contacts.index = 1);
		}

		function setFocus(){
			document.getElementById('setFocus').focus()
		}

		function removeTableRows(){
			var tableRowCount = 1;
			var rowCount = Contacts.$table.rows.length;
				for (var i = tableRowCount; i < rowCount; i++){
					Contacts.$table.deleteRow(tableRowCount);
				}
		};

// ==================== initialize form ==============================================
		Contacts.$form.reset();
		Contacts.$button_discard.addEventListener("click", function(event) {
			Contacts.$form.reset();
			Contacts.$select.value = '';
			Contacts.$form.idEntry.value = 0;
			removeTableRows();
			setFocus();
		}, true);
		Contacts.$form.addEventListener("submit", function(event) {
			String.prototype.capitalize = function() {
    		return this.replace(/(?:^|\s)\S/g, 
    			function(a) { 
    				return a.toUpperCase(); 
    			});
			};
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

			if (this.company.value !== '') {
				if (entry.id == 0) {
					Contacts.storeAdd(entry);
					newTableList();
					}
				else { 
					Contacts.storeEdit(entry);
					newTableList();
				}
			}
			event.preventDefault();
		}, true);

// ==================== create the DOM table =====================================
		function newTableList(){
			var testList = [], i, key;
			for (i = 0; i < window.localStorage.length; i++) {
				key = window.localStorage.key(i);
				if (/Contacts:\d+/.test(key)) {
					testList.push(JSON.parse(window.localStorage.getItem(key)));
				}
			}
			var tableTest = [];
			testList.forEach(function(query){
				if (Contacts.$select.value === query.company) {
					tableTest.push({ 
						"id"		: query.id,
						"fullname"	: query.fullname,
						"dept"		: query.dept,
						"phone"		: query.phone,
						"email"		: query.email,
						"notes"		: query.notes
				    });
				}
			})
		removeTableRows();
		tableTest.forEach(Contacts.tableAdd)
		};


// ==================== initialize the dropdown list ================================= 

		if (window.localStorage.length - 1) {
			var contacts_list = [], i, key;
			for (i = 0; i < window.localStorage.length; i++) {
				key = window.localStorage.key(i);
				if (/Contacts:\d+/.test(key)) {
					contacts_list.push(JSON.parse(window.localStorage.getItem(key)));
				}
			}
		};

		function getCompanyName(names) {
			var companyName = [];
			names.forEach(function(query) {
				companyName.push(query.company);
			})
			Contacts.$select.add( new Option(''));
			return companyName.sort().filter(function(item, position, array) {
				return !position || item != array[position - 1];
			});
		};
		var companyName = getCompanyName(contacts_list);
		
			for(name in companyName) {
			Contacts.$select.add( new Option(companyName[name]));
			}

		Contacts.$select.onchange = function() {
    		var selectCompany = Contacts.$select.options[Contacts.$select.selectedIndex].value;
    		removeTableRows();

//================= create filtered array for dropdown and show list in table ======== 
		    function getSelectedCompany(info){
				var selectedInfo = [];
				info.forEach(function(query) {
					if (query.company === selectCompany) {
						selectedInfo.push({
							"id"		: query.id,
							"fullname"	: query.fullname,
							"dept"		: query.dept,
							"phone"		: query.phone,
							"email"		: query.email,
							"notes"		: query.notes
						})
					//populate the input fields with info from the company Drop down selection	
					Contacts.$form.company.value = query.company;
					Contacts.$form.address1.value = query.address1;
					Contacts.$form.address2.value = query.address2;
					Contacts.$form.city.value = query.city;
					Contacts.$form.state.value = query.state;
					Contacts.$form.zip.value = query.zip;
					Contacts.$form.notes.value = '';
					}

				})
				return selectedInfo;
			};
			var selectedInfo = getSelectedCompany(contacts_list);
	    	selectedInfo.forEach(Contacts.tableAdd)

// ==================== sort contacts ================================================
			var sortOrderAscending = true;
			function scopePreserver() {
				return function() {
				var string = this.innerText;
				var tableHeader = string.toLowerCase();

					function sortOn(arr, prop, reverse) {
						if (!prop || !arr) {
							return arr;
						}

						function sort_by(field, rev, primer) {
							return function(a, b) {
								a = primer(a[field]),
								b = primer(b[field]);

								if (sortOrderAscending === false) {
									return ((a < b) ? 1 : ((a > b) ? -1 : 0)) * (rev ? 1 : 1);
								}
								return ((a < b) ? -1 : ((a > b) ? 1 : 0)) * (rev ? -1 : 1);
							}
						}
						if (tableHeader === 'id') {
							arr.sort(sort_by(prop, reverse, function(a) {
							return parseFloat(String(a).replace(/[^0-9.-]+/g, ''));
							}));
						}else {	
							arr.sort(sort_by(prop, reverse, function(a) {
							return String(a).toUpperCase();
							}));
						}
					};

					if (tableHeader !== 'actions') {
						removeTableRows();
						
					    sortOrderAscending === true ? sortOrderAscending = false: sortOrderAscending = true;

					    function sortTable() {
					    	sortOn(selectedInfo, tableHeader, false, false);
							selectedInfo.forEach(Contacts.tableAdd)
					    }sortTable();
					}
				};
			};

			function tableContainScope() {
			var titles = document.getElementsByTagName('th');
			var rows = document.getElementsByTagName('tr');
				for( var i = 0; i < titles.length; i++) {
					titles[i].onclick = scopePreserver( i, rows[i]);
				}
			}tableContainScope();
		};

// ==== add event listener then determine which callback function was triggered ======
	
		Contacts.$table.addEventListener("click", function(event) {
			var op = event.target.getAttribute("data-op");
			if (/edit|remove/.test(op)) {
				var record = JSON.parse(window.localStorage.getItem("Contacts:"+ event.target.getAttribute("data-id")));
				if (op === "edit") {
					Contacts.$form.company.value = record.company;
					Contacts.$form.address1.value = record.address1;
					Contacts.$form.address2.value = record.address2;
					Contacts.$form.city.value = record.city;
					Contacts.$form.state.value = record.state;
					Contacts.$form.zip.value = record.zip;
					Contacts.$form.notes.value = record.notes;
					Contacts.$form.fullname.value = record.fullname;
					Contacts.$form.dept.value = record.dept;
					Contacts.$form.phone.value = record.phone;
					Contacts.$form.email.value = record.email;
					Contacts.$form.idEntry.value = record.id;
				}
				else if (op === "remove") {
					if (confirm('Are you sure you want to remove "'+ record.fullname + ' with '+ record.company + '" from your contacts?')) {
						Contacts.storeRemove(record);
						Contacts.tableRemove(record);
					}
				}
				event.preventDefault();
			}
			setFocus();
		}, true);
	},

// ==================== create, update, delete individual entries ====================
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
 
// ==================== table build ==================================================
		tableAdd: function(newTable) {
			var $tr = document.createElement("tr"), $td, key;
			for (key in newTable) {
				if (newTable.hasOwnProperty(key)) {
					$td = document.createElement("td");
					$td.appendChild(document.createTextNode(newTable[key]));
					$tr.appendChild($td);
				}
			}
			$td = document.createElement("td");
			$td.innerHTML = '<a data-op="edit" data-id="'+ newTable.id +'">Edit</a> | <a data-op="remove" data-id="'+ newTable.id +'">Remove</a>';
			$tr.appendChild($td);
			$tr.setAttribute("id", "newTable-"+ newTable.id);
			Contacts.$table.appendChild($tr);
		},
		tableRemove: function(newTable) {
			Contacts.$table.removeChild(document.getElementById("newTable-"+ newTable.id));
		}
};
Contacts.init();