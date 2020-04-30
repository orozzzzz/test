//Если хранилище пустое, то обращаемся к json-файлу
if (localStorage.length<1){
	var jsondata = new XMLHttpRequest();
	jsondata.open('GET', 'lpu.json', false);
	jsondata.send();
	if (jsondata.status != 200) {
		alert( jsondata.status + ': ' + jsondata.statusText );
	} 
	//Получив ответ в виде данных, записываем их в хранилище
	else {
		var data = JSON.parse(jsondata.responseText);
		for (var i = 0; i<data.length; i++){
			localStorage.setItem('key'+i, JSON.stringify(data[i]));
		}
	}
}

var keys = Object.keys(localStorage);
document.getElementById("full_name").value = "";
document.getElementById("address").value = "";
document.getElementById("phone").value = "";
var table = document.getElementById("maintable");
var tbody = table.getElementsByTagName("TBODY")[0];
var k = 0;
for(var i = 0;i<localStorage.length; i++) {
	//Если существует пробел в последовательности (key1,key2,key5,key6), то следующие данные вставляем в него
	if (localStorage.getItem("key"+k)==null){
		while (localStorage.getItem("key"+k)==null){
			k=k+1;
		}
	}
	//Разбираем строку JSON
	var item = JSON.parse(localStorage.getItem('key'+k));
	//Создаем строку для таблицы и заполняем первые 3 ячейки данными из хранилища
    var row = document.createElement("TR");
    var td1 = document.createElement("TD");
    td1.appendChild(document.createTextNode(item.full_name));
    var td2 = document.createElement("TD");
    td2.appendChild (document.createTextNode(item.address));
    var td3 = document.createElement("TD");
    td3.appendChild(document.createTextNode(item.phone));
    var td4 = document.createElement("TD");
    //В остальные ячейки вставляем кнопки редактирования и удаления с соответствующими функциями
    var a1 = document.createElement("a");
    a1.className = "btn btn-secondary";
    a1.innerHTML = "Edit";
    a1.setAttribute("onclick","updaterow('key"+k+"',this)");
    td4.appendChild (a1);
    var td5 = document.createElement("TD");
    var a2 = document.createElement("a");
    a2.className = "btn btn-danger";
    a2.innerHTML = "Delete";
    a2.setAttribute("onclick","del(this,'key"+k+"')");
    //Добавляем все ячейки к строке и добавляем строку в таблицу
    td5.appendChild (a2);
    row.appendChild(td1);
    row.appendChild(td2);
    row.appendChild(td3);
    row.appendChild(td4);
    row.appendChild(td5);
    tbody.appendChild(row);
    k++;
}

//функция для передачи данных строки в поля input
function updaterow(key,row) {
	var index = row.parentNode.parentNode.rowIndex;//индекс строки для передачи в функцию редактирования
	//"меняем" кнопку Добавить на Сохранить
	document.getElementById("addbutton").hidden = true;
	document.getElementById("changebutton").hidden = false;
	var rowdata = JSON.parse(localStorage.getItem(key));
	document.getElementById("full_name").value = rowdata.full_name;
	document.getElementById("address").value = rowdata.address;
	document.getElementById("phone").value = rowdata.phone;
	//Присваиваем кнопке Сохранить функцию для редактирования данных в хранилище
	document.getElementById("changebutton").setAttribute('onclick',"updatedata('"+key+"',"+index+")");
	var theElement = document.getElementById("inputdata");
	//Скроллинг
    var selectedPosX = 0;
    var selectedPosY = 0;
    while (theElement != null) {
        selectedPosX += theElement.offsetLeft;
        selectedPosY += theElement.offsetTop;
        theElement = theElement.offsetParent;
    } 
    window.scrollTo(selectedPosX,selectedPosY);
}


//Функция для редактирования данных в localstorage
function updatedata(key,row){
	document.getElementById("full_name").value=document.getElementById("full_name").value.trim();
	document.getElementById("address").value= document.getElementById("address").value.trim();
	document.getElementById("phone").value=document.getElementById("phone").value.trim();

	var forms = document.getElementsByClassName('addnote_form');
	//Валидация
	var validation = Array.prototype.filter.call(forms, function(form) {
		if (form.checkValidity() === false) {
			form.classList.add('was-validated');
		}
		else{
			//Обновляем данные по ключу и обновляем значения в ячейках
			var kek = JSON.parse(localStorage.getItem(key));
			var obj = {
				full_name: document.getElementById("full_name").value,
				address: document.getElementById("address").value,
				phone: document.getElementById("phone").value
			}
			localStorage.setItem(key,JSON.stringify(obj));
			var table = document.getElementById("maintable");
			table.rows[row].cells[0].innerHTML = obj.full_name;
			table.rows[row].cells[1].innerHTML = obj.address;
			table.rows[row].cells[2].innerHTML = obj.phone;
			document.getElementById("full_name").value = "";
			document.getElementById("address").value = "";
			document.getElementById("phone").value = "";
			document.getElementById("addbutton").hidden = false;
			document.getElementById("changebutton").hidden = true;
			form.classList.remove('was-validated');
		}
	});
}

//Функция удаления записи
function del(i,key){
	var index = i.parentNode.parentNode.rowIndex;
	var table = document.getElementById("maintable").deleteRow(index);
	localStorage.removeItem(key);
	document.getElementById("full_name").value = "";
	document.getElementById("address").value = "";
	document.getElementById("phone").value = "";
}

//функция добавления записи
function addnote(){
	document.getElementById("full_name").value=document.getElementById("full_name").value.trim();
	document.getElementById("address").value= document.getElementById("address").value.trim();
	document.getElementById("phone").value=document.getElementById("phone").value.trim();
	
	var forms = document.getElementsByClassName('addnote_form');
	//Валидация
	var validation = Array.prototype.filter.call(forms, function(form) {
		if (form.checkValidity() === false) {
			form.classList.add('was-validated');
		}
		else{
			var k = 0;
			while (localStorage.getItem("key"+k)!=null){
				k=k+1;
			}
			var val1 = document.getElementById("full_name").value;
			var val2 = document.getElementById("address").value;
			var val3 = document.getElementById("phone").value;
			var obj = {
				full_name: val1,
				address: val2,
				phone: val3
			};
			var serialObj = JSON.stringify(obj);  
			localStorage.setItem('key'+k, serialObj); 
			var table = document.getElementById("maintable");
			var tbody = table.getElementsByTagName("TBODY")[0];
			var row = document.createElement("TR");
		    var td1 = document.createElement("TD");
		    td1.appendChild(document.createTextNode(val1))
		    var td2 = document.createElement("TD");
		    td2.appendChild (document.createTextNode(val2))
		    var td3 = document.createElement("TD");
		    td3.appendChild(document.createTextNode(val3))
		    var td4 = document.createElement("TD");
		    var a1 = document.createElement("a");
		    a1.className = "btn btn-secondary";
		    a1.innerHTML = "Edit";
		    a1.setAttribute("onclick","updaterow('key"+k+"',this)");
		    td4.appendChild (a1);
		    var td5 = document.createElement("TD");
		    var a2 = document.createElement("a");
		    a2.className = "btn btn-danger";
		    a2.innerHTML = "Delete";
		    a2.setAttribute("onclick","del(this,'key"+k+"')");
		    td5.appendChild(a2);
			row.appendChild(td1);
			row.appendChild(td2);
			row.appendChild(td3);
			row.appendChild(td4);
			row.appendChild(td5);
			tbody.appendChild(row);
			document.getElementById("full_name").value = "";
			document.getElementById("address").value = "";
			document.getElementById("phone").value = "";
			form.classList.remove('was-validated');
		}
	});	
}

