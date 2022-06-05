if ("serviceWorker" in navigator) {
  if (navigator.serviceWorker.controller) {
    console.log("[PWA Builder] active service worker found, no need to register");
  } else {
    navigator.serviceWorker
      .register("pwabuilder-sw.js", {
        scope: "./"
      })
      .then(function(reg) {
        console.log("[PWA Builder] Service worker has been registered for scope: " + reg.scope);
      });
  }
}

function addTask(id) {
  event.preventDefault();
  var tasks = getTasks();
  if(tasks.length == 0) tasks = toObject(tasks);

  var task = document.getElementById(id).value;
  var ms = Date.now()+"";
  ms = parseInt(ms);
  tasks[ms] = task;
  tasks = JSON.stringify(tasks); 

  setTasks(tasks);
  clearText(id);
}

function deleteTask(id) {
  closeTask(id);
  var tasks = getTasks();
  console.log(tasks);
  delete tasks[id];
  tasks = JSON.stringify(tasks); 
  setTasks(tasks);
}

function setTasks(tasks) {
  localStorage.setItem("tasks", tasks);
}

function getTasks() {
  var tasks = localStorage.getItem("tasks");
  if(tasks) {
    tasks = JSON.parse(tasks);
  } else {
    tasks = [];
  }
  return tasks;
}

function listTasks() {
  var tasks = getTasks();
  for (var i of Object.keys(tasks)) {
    var task = nl2br(tasks[i]);
    showTask(i, task);
  }
}

function showTask(id = 1, taskDetail = "Task detail") {
  const tdiv = document.createElement("div");
  tdiv.setAttribute("id", id);
  tdiv.classList.add('full-height', 'task-details');
  tdiv.innerHTML = "Task "+id+"<hr>";
  tdiv.innerHTML += "<div class='task-detail-view'>"+taskDetail+"<div>";
  tdiv.innerHTML += "<hr><button class='btn done-button' id='delete-"+id+"' onclick='deleteTask("+id+")'>Done</button>";
  tdiv.innerHTML += "<button class='btn close-button' id='close-"+id+"' onclick='closeTask("+id+")'>Close</button>";
  document.getElementById("app").appendChild(tdiv);
}

function closeTask(id) {
  var task = document.getElementById(id);
  task.remove();
}

function toObject(arr) {
  var rv = {};
  for (var i = 0; i < arr.length; ++i)
    rv[i] = arr[i];
  return rv;
}

function nl2br(str, is_xhtml = false) {
  if (typeof str === 'undefined' || str === null) {
      return '';
  }
  var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
  return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

function copyText(id) {
  var txt = document.getElementById(id);
  txt.select();
  txt.setSelectionRange(0, 99999); /* For mobile devices */
  document.execCommand("copy");
}

function clearText(id) {
  var txt = document.getElementById(id);
  txt.value = "";
}

function countRandom (id, displayId) {
  var txt = document.getElementById(id);
  txt = txt.value;

  display = document.getElementById(displayId);
  charsLeft = numChars - txt.length;
  
  display.innerHTML = charsLeft;
}

function setCookie(cname, cvalue, exdays = 1) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}