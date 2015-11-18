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
	$select: document.getElementById("contacts-dropdown"),
	$button_save: document.getElementById("contacts-op-save"),
	$button_discard: document.getElementById("contacts-op-discard"),

// ==================== initialize storage index =============================	
	
	init: function() {
		if (!Contacts.index) {
			window.localStorage.setItem("Contacts:index", Contacts.index = 1);
		}

		function setFocus(){
			document.getElementById('setFocus').focus()
		}

		function removeTableRows(){
			// console.log('removeTable Rows ran')
			var tableRowCount = 1;
			var rowCount = Contacts.$table.rows.length;
				for (var i = tableRowCount; i < rowCount; i++){
					Contacts.$table.deleteRow(tableRowCount);
				}
		};

// ==================== initialize form ======================================
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
		if (Contacts.$form.setFocus === null) {
			Contacts.storeAdd(entry);
			Contacts.tableAdd(info);
		}
		else { 
			Contacts.storeAdd(entry)
			// ==========write code to handle table view here
			Contacts.tableAdd(info);

			// Contacts.storeEdit(entry);
			// Contacts.tableEdit(entry);
		}
		this.reset();
		Contacts.$select.value = '';
		this.idEntry.value = 0;
		setFocus();
		event.preventDefault();
	}, true);

// ==================== initialize the DOM table =====================================

		if (window.localStorage.length - 1) {
			var contacts_list = [], i, key;
			for (i = 0; i < window.localStorage.length; i++) {
				key = window.localStorage.key(i);
				if (/Contacts:\d+/.test(key)) {
					contacts_list.push(JSON.parse(window.localStorage.getItem(key)));
				}
			}

			// function getTableView(view){
			// 	var tableView = [];
			// 	view.forEach(function(query){
			// 		if (query.company === selectCompany) {
			// 			tableView.push({
			// 			"id" 		: query.id,
			// 			"fullname"	: query.fullname,
			// 			"dept"		: query.dept,
			// 			"phone"		: query.phone,
			// 			"email"		: query.email,
			// 			"notes"		: query.notes
			// 			})
			// 		}
			// 	})
			// 	return tableView;
			// };
			// var tableView = getTableView(contacts_list)
			// tableView.forEach(Contacts.tableAdd)
		};

// ==================== initialize the dropdown list ================================= 
		function getCompanyName(names){
			var companyName = [];
			names.forEach(function(query){
				companyName.push(query.company);
			})
			Contacts.$select.add( new Option(''));
			return companyName.sort().filter(function(item, position, array){
				return !position || item != array[position - 1];
			});
		};

		var companyName = getCompanyName(contacts_list);
			for(name in companyName) {
			Contacts.$select.add( new Option(companyName[name]));
			}

		Contacts.$select.onchange = function(){
    		var selectCompany = Contacts.$select.options[Contacts.$select.selectedIndex].value;
    		removeTableRows();

//========================== create filtered array linked to dropdown ===   
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

// ==================== sort contacts ========================================
			// var sortOrderAscending = true;
			// function scopePreserver() {
			// 	return function() {
			// 	var string = this.innerText;
			// 	var tableHeader = string.toLowerCase();

			// 		function sortOn(arr, prop, reverse) {
			// 			if (!prop || !arr) {
			// 				return arr;
			// 			}

			// 			function sort_by(field, rev, primer) {
			// 				return function(a, b) {
			// 					a = primer(a[field]),
			// 					b = primer(b[field]);

			// 					if (sortOrderAscending === false){
			// 						return ((a < b) ? 1 : ((a > b) ? -1 : 0)) * (rev ? 1 : 1);
			// 					}
			// 					return ((a < b) ? -1 : ((a > b) ? 1 : 0)) * (rev ? -1 : 1);
			// 				}
			// 			}
			// 			if (tableHeader === 'id') {
			// 				arr.sort(sort_by(prop, reverse, function(a) {
			// 				return parseFloat(String(a).replace(/[^0-9.-]+/g, ''));
			// 				}));
			// 			}else {	
			// 				arr.sort(sort_by(prop, reverse, function(a){
			// 				return String(a).toUpperCase();
			// 				}));
			// 			}
			// 		};

			// 		if (tableHeader !== 'actions') {
			// 			removeTableRows();
						
			// 		    sortOrderAscending === true ? sortOrderAscending = false: sortOrderAscending = true;

			// 		    function sortTable(){
			// 		    	sortOn(selectedInfo, tableHeader, false, false);
			// 				selectedInfo.forEach(Contacts.tableAdd)
			// 		    }sortTable();
			// 		}
			// 	};
			// };

			// function tableContainScope() {
			// var titles = document.getElementsByTagName('th');
			// var rows = document.getElementsByTagName('tr');
			// 	for( var i = 0; i < titles.length; i++) {
			// 		titles[i].onclick = scopePreserver( i, rows[i]);
			// 	}
			// }tableContainScope();
		};

// == add event listener then determine which callback function was triggered ======
	
		Contacts.$table.addEventListener("click", function(event) {
			var op = event.target.getAttribute("data-op");
			if (/edit|remove/.test(op)) {
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
						setFocus();
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
		},
		storeEdit: function(entry) {
			window.localStorage.setItem("Contacts:"+ entry.id, JSON.stringify(entry));
			setFocus();
		},
		storeRemove: function(entry) {
			window.localStorage.removeItem("Contacts:"+ entry.id);
		},

// =============================== table build =====================================
		tableAdd: function(info) {
			var $tr = document.createElement("tr"), $td, key;
			for (key in info) {
				if (info.hasOwnProperty(key)) {
					$td = document.createElement("td");
					$td.appendChild(document.createTextNode(info[key]));
					$tr.appendChild($td);
				}
			}
			$td = document.createElement("td");
			$td.innerHTML = '<a data-op="edit" data-id="'+ info.id +'">Edit</a> | <a data-op="remove" data-id="'+ info.id +'">Remove</a>';
			$tr.appendChild($td);
			$tr.setAttribute("id", "info-"+ info.id);
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
		tableRemove: function(info) {
			// console.log(entry, entry.id)
			Contacts.$table.removeChild(document.getElementById("info-"+ info.id));
		}
};
Contacts.init();