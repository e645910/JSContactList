// detect if browser supports HTML5 local storage
function supportsLocalStorage() {
  try {
    return 'localStorage' in window && window.localStorage !== null;
  } catch(e){

    alert("Sorry! No native support for local storage");
    return false;
  }
}supportsLocalStorage();

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

// ==================== initialize form ==============================================
		function setFocus() {
			document.getElementById('set-focus').focus();
		}

		Contacts.$button_discard.addEventListener("click", function(event) {
			Contacts.$form.reset();
			Contacts.$select.value = '';
			removeTableRow();
			setFocus();
		}, true);
		Contacts.$form.addEventListener("submit", function(event) {
			String.prototype.capitalize = function() {
    		return this.replace(/(?:^|\s)\S/g, 
    			function(firstLetter) { 
    				return firstLetter.toUpperCase(); 
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
				fullname: this.fullname.value.capitalize(),
				dept: this.dept.value,
				phone: this.phone.value,
				email: this.email.value,
				notes: this.notes.value
			};

			if (this.company.value !== '') {
				if (entry.id === 0) {
					Contacts.storeAdd(entry);
					clearEmployeeFormInput();
					updateEmployeeInfoTable();
					if (Contacts.$table.rows.length === 1) {
						Contacts.$form.reset();
						addCompanyNames();
					}

				}else { 
					Contacts.storeEdit(entry);
					updateEmployeeInfoTable();
			    	clearEmployeeFormInput();
				}
			Contacts.$form.idEntry.value = '0';
			}
			event.preventDefault();
		}, true);

		function clearEmployeeFormInput() {
			Contacts.$form.fullname.value = '';
			Contacts.$form.dept.value = '';
			Contacts.$form.phone.value = '';
			Contacts.$form.email.value = '';
			Contacts.$form.idEntry.value = '';
			Contacts.$form.notes.value = '';
		}

// ==================== initialize table info ========================================
		function removeTableRow() {
		var tableRowCount = 1;
		var rowCount = Contacts.$table.rows.length;
			for (var i = tableRowCount; i < rowCount; i++) {
				Contacts.$table.deleteRow(tableRowCount);
			}
			return rowCount;
		}

		function storedContactData() {
			var list = [], i, key;
			for (i = 0; i < window.localStorage.length; i++) {
				key = window.localStorage.key(i);
				if (/Contacts:\d+/.test(key)) {
					list.push(JSON.parse(window.localStorage.getItem(key)));
				}
			}
			return list;
		}storedContactData();

// ==================== initialize the dropdown list ================================= 
		function getCompanyName(names) {
			var companyName = [];
			names.forEach(function(query) {
				companyName.push(query.company);
			});
			return companyName.sort().filter(function(item, position, array) {
				return !position || item != array[position - 1];
			});
		}
		
		function addCompanyNames() {
			var dataRetrieval = storedContactData();
			var companyName = getCompanyName(dataRetrieval);
			Contacts.$select.options.length = 0;
			Contacts.$select.add( new Option(''));
			for(var name in companyName) {
				if (companyName.hasOwnProperty(name)) {
					Contacts.$select.add( new Option(companyName[name]));
				}
			}
		}addCompanyNames();
		
		Contacts.$select.onchange = function() {
    		updateEmployeeInfoTable();
    	};

//===================== dropdown filtered array and form update ======================
		function getSelectedCompany(info) {
			var selectedInfo = [];
			info.forEach(function(query) {
				if (query.company === Contacts.$select.value) {
					selectedInfo.push({
						"id"		: query.id,
						"fullname"	: query.fullname,
						"dept"		: query.dept,
						"phone"		: query.phone,
						"email"		: query.email,
						"notes"		: query.notes
					});
				Contacts.$form.company.value = query.company;
				Contacts.$form.address1.value = query.address1;
				Contacts.$form.address2.value = query.address2;
				Contacts.$form.city.value = query.city;
				Contacts.$form.state.value = query.state;
				Contacts.$form.zip.value = query.zip;
				}
			});
			return selectedInfo;
		}

// ==================== update employee table ========================================
		function updateEmployeeInfoTable() {
			removeTableRow();
			var dataRetrieval = storedContactData();
			var selectedInfo = getSelectedCompany(dataRetrieval);
			selectedInfo.forEach(Contacts.tableAdd);
		}
	    
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
							a = primer(a[field]);
							b = primer(b[field]);

							if (sortOrderAscending === false) {
								return ((a < b) ? 1 : ((a > b) ? -1 : 0)) * (rev ? 1 : 1);
							}
							return ((a < b) ? -1 : ((a > b) ? 1 : 0)) * (rev ? -1 : 1);
						};
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
				}

				if (tableHeader !== 'actions') {
					removeTableRow();
					sortTable();
				    if (sortOrderAscending === true) {
				    	sortOrderAscending = false;
				    	document.getElementById('sort-icon').setAttribute('class', 'sort-asc');
				    }else {
				    	sortOrderAscending = true;
				    	document.getElementById('sort-icon').setAttribute('class', 'sort-dsc');
				    }
				}

				function sortTable() {
			    	var dataRetrieval = storedContactData();
					var selectedInfo = getSelectedCompany(dataRetrieval);
			    	sortOn(selectedInfo, tableHeader, false, false);
					selectedInfo.forEach(Contacts.tableAdd);
				 }

			};
		}

		function tableContainScope() {
		var titles = document.getElementsByTagName('th');
		var rows = document.getElementsByTagName('tr');
			for( var i = 0; i < titles.length; i++) {
				titles[i].onclick = scopePreserver( i, rows[i]);
			}
		}tableContainScope();
		
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
					Contacts.$form.fullname.value = record.fullname;
					Contacts.$form.dept.value = record.dept;
					Contacts.$form.phone.value = record.phone;
					Contacts.$form.email.value = record.email;
					Contacts.$form.idEntry.value = record.id;
					Contacts.$form.notes.value = record.notes;
				}else if (op === "remove") {
					if (Contacts.$form.company.value !== '') {
						if (confirm('Are you sure you want to remove "'+ record.fullname + ' with '+ record.company + '" from your contacts?')) {
							Contacts.storeRemove(record);
							Contacts.tableRemove(record);
							updateEmployeeInfoTable();
							if (Contacts.$select.value === '') {
								addCompanyNames();
							}
							if (Contacts.$table.rows.length === 1) {
								Contacts.$form.reset();
								addCompanyNames();
							}
						}
					}
				}
			}
			event.preventDefault();
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
 
// ==================== table build/remove ============================================
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