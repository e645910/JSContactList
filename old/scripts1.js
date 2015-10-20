If your keys/values have an inherent order to them (alphabetical, numerical, etc), then putting a timestamp in them may be superfluous. Although the Storage object has no sort method, you can create a new Array() and then sort that.
function SortLocalStorage(){
if(localStorage.length > 0){
var localStorageArray = new Array();
for (i=0;i<localStorage.length;i++){
localStorageArray[i] = localStorage.key(i)+localStorage.getItem(localStorage.key(i));
}
}
var sortedArray = localStorageArray.sort();
return sortedArray;
}
The disadvantage to this is that the array is not associative, but that is by nature of the JavaScript Array object. The above function solves this by embedding the key name into the value. This way its still in there, and the functions you'd use to display the sorted array can do the footwork of separating the keys from the values.

function SortLocalStorage(){
    if (window.localStorage.length - 1) {
        var localStorageArray = new Array();
        for (i = 0; i < window.localStorage.length; i++) {
        key = window.localStorage.key(i);
    if (/Contacts:\d+/.test(key)) {
        //localStorageArray.push(JSON.parse(localStorage.key(i)+localStorage.getItem(localStorage.key(i))))
        localStorageArray[i] = localStorage.key(i)+localStorage.getItem(localStorage.key(i));
        }
    }
    var sortedArray = localStorageArray;
        sortedArray.sort(function(a, b){
        return a.company < b.company ? -1 : (a.company > b.company ? 1 : 0);
        });
    console.log(sortedArray)
    //return sortedArray;
    }
}SortLocalStorage()
                // key = window.localStorage.key(i);
                // if (/Contacts:\d+/.test(key)) {
                //  console.log(JSON.parse(window.localStorage.getItem(key)))
                //  contacts_list.push(JSON.parse(window.localStorage.getItem(key)));
                // }


===================================================
Since your current approach is to have your code managing the Table HTML and the Animal data directly, it will need to be your code that does the sorting of the data and the rewrite of the table. That is, you will need to listen for click events on the column headers, and then sort your Animal data according to that particular column, and then redraw the table completely. Redrawing the table could simply entail looping through your tableRemove() and then tableAdd() functions for all Animals being displayed, although that might be a little slow. The sorting of the data by each column is a bit more of a mess for which I have a solution below.

==================================================











var titles = document.getElementsByTagName("th");
        // var rows = document.getElementsByTagName("tr");
        for ( var i = 0; i< titles.length; i++ ) { 
            titles[i].addEventListener("click", function() {
                var x = this.innerText;
                console.log(4444444444, this.innerText)
                if (this.innerText === "company") {
                    var y = 'company';
                    console.log(222222222, 'it worked')
                }
                
                if (contacts_list.length) {
                contacts_list
                    .sort(function(a, b) {
                        
                        return a.x < b.x ? -1 : (a.x > b.x ? 1 : 0);
                    })
                    .forEach(Contacts.tableAdd);
            }
            console.log(1111111111, contacts_list)
            console.log(33333333, x)

            }, false);
        }

//====================================
// this works great
function scopepreserver() {
  return function () {
    console.log(this.innerText) // returns Address 1 when selected header Address 1 is selecgted
  };
}
function myfunction() {
  var titles = document.getElementsByTagName("th");
  var rows = document.getElementsByTagName("tr");
  for( var i = 0; i < titles.length; i++ ) {
    titles[i].onclick = scopepreserver(i,rows[i]);
  }
}
myfunction();

//================================
if (contacts_list.length) {
    function compareStrings(a, b) {
        a = a.tableHeader;
        b = b.tableHeader;
    return (a < b) ? -1 : (a > b) ? 1 : 0;
    }
    contacts_list
        .sort(function(a, b) {
            console.log(333333333, contacts_list)
            return a.tableHeader < b.tableHeader ? -1 : (a.tableHeader > b.tableHeader ? 1 : 0);
        })
        .forEach(Contacts.tableAdd);
    }



if (contacts_list.length) {
    function compareStrings(a, b) {
    a = a.toLowerCase();
    b = b.toLowerCase();
    return (a < b) ? -1 : (a > b) ? 1 : 0;
    }
    contacts_list
        .sort(function(a, b) {
        return compareStrings(a.tableHeader, b.tableHeader);
        })
    .forEach(Contacts.tableAdd);
}


function scopepreserver(a,b) {
  return function () {
    //do something with a and b
    ... etc.
  };
}
function myfunction() {
  var paras = document.getElementsByTagName('p');
  var spans = document.getElementsByTagName('span');
  for( var i = 0; i < paras.length; i++ ) {
    paras[i].onclick = scopepreserver(i,spans[i]);
  }
}
...
myfunction();


