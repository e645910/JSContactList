// To build the application, we'll encapsulate the logic inside an object and expose only specific properties and methods, such as for adding or removing entries to and from the data store or the table:

var Contacts = {
    index: 1,

    init: function() {},

    storeAdd: function(entry) {},
    storeEdit: function(entry) {},
    storeRemove: function(entry) {},

    tableAdd: function(entry) {},
    tableEdit: function(entry) {},
    tableRemove: function(entry) {}
};
Contacts.init();  //keys are prefixed with the word "Contacts" to avoid naming conflicts with other applications/scripts that store information in the local storage on the same domain.



// ================== Initializing The Application ==========================

var Contacts = {
    index: window.localStorage.getItem("Contacts:index"),
    $table: document.getElementById("contacts-table"),
    $form: document.getElementById("contacts-form"),
    $button_save: document.getElementById("contacts-op-save"),
    $button_discard: document.getElementById("contacts-op-discard"),

		//The Contact.init() method initializes the storage index, sets up the form and populates the table with existing entries:
    init: function() {
        // initialize the storage index
        if (!Contacts.index) {
            window.localStorage.setItem("Contacts:index", Contacts.index = 1);
        }

        // initialize the form
        ...

        // initialize the table
        ...
    },
    ...
};

// ======== Setting up the form ==============

//Initializing the form simply means adding event listeners to the Discard and Save buttons:
var Contacts = {
    ...
    init: function() {
        ...
        // initialize the form
        Contacts.$form.reset();
        Contacts.$button_discard.addEventListener("click", function(event) {
        	Contacts.$form.reset();
        	Contacts.$form.id_entry.value = 0;
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
        ...
    },
    ...
};

// =========== Populating the table ==============


// To populate the table with entries, we simply iterate over each item in the localStorage object, test if their key is valid and finally add new rows to the table:


var Contacts = {
    ...
    init: function() {
        ...
        // initialize the table
        if (window.localStorage.length - 1) {
            var contacts_list = [], i, key;
            for (i = 0; i < window.localStorage.length; i++) {
                key = window.localStorage.key(i);
                if (/Contacts:\d+/.test(key)) {
                    contacts_list.push(JSON.parse(window.localStorage.getItem(key)));
                }
            }

            if (contacts_list.length) {
                contacts_list
                    .sort(function(a, b) {
                        return a.id < b.id ? -1 : (a.id > b.id ? 1 : 0);
                    })
                    .forEach(Contacts.tableAdd);
            }
        }
    },
    ...
};

// ============== Adding new entries ==================

// Now that the application is initialised, let's add some entries to both the local storage and the table:

var Contacts = {
    ...
    storeAdd: function(entry) {
        entry.id = Contacts.index;
        window.localStorage.setItem("Contacts:"+ entry.id, JSON.stringify(entry));
        window.localStorage.setItem("Contacts:index", ++Contacts.index);
    },
    ...

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
    ...
};


// ============= Deleting Existing Entries ==========

// Finally, entry removal is accomplished by removing the corresponding item from the localStorage and the corresponding table row:

var Contacts = {
    ...
    //The storeEdit() method saves the new entrƒy over the existing one using the setItem() method of the localStorage object.
    storeEdit: function(entry) {
        window.localStorage.setItem("Contacts:"+ entry.id, JSON.stringify(entry));
    },

    //Note that the setItem() method simply sets a key/value combination. If the key already exists, the associated value is replaced with the new value.
    ...

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
    ...
};

// =========== Deleting Existing Entries  ==============

// Finally, entry removal is accomplished by removing the corresponding item from the localStorage and the corresponding table row:

var Contacts = {
    ...
    storeRemove: function(entry) {
        window.localStorage.removeItem("Contacts:"+ entry.id);
    },
    ...

    tableRemove: function(entry) {
        Contacts.$table.removeChild(document.getElementById("entry-"+ entry.id));
    }
};
















