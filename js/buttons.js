//Definition and initializing of global variables
const wrapper = document.querySelector("#wrapper");
const timer_container = document.querySelector("#timer");
const cat_container = document.querySelector("#cat_cont");
const btn_cont = document.querySelector(".btn_container_back");

class Button {
  constructor(duritonone, durationtwo, durationtree, url, default_but) {
    this.duritonone = duritonone;
    this.durationtwo = durationtwo;
    this.durationthree = durationtree;
    this.url = url;
    this.default_but = default_but;
    this.el = 5;
  }

  startTimerListener(e) {
    var span = document.querySelector("#span_timer");
    if (span != null) {
      span.remove();
    }
    var timer_span = document.createElement("SPAN");
    timer_span.id = "span_timer";
    timer_span.className = "span_timer";
    timer_container.appendChild(timer_span);
    var duration;
    if (cat_container.dataset.actual == 1) {
      duration = e.currentTarget.dataset.durationone;
    } else if (cat_container.dataset.actual == 2) {
      duration = e.currentTarget.dataset.durationtwo;
    } else {
      duration = e.currentTarget.dataset.durationthree;
    }
    var timer = duration,
      minutes,
      seconds;
    setInterval(function () {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      timer_span.textContent = minutes + ":" + seconds;

      if (--timer < 0) {
        //TODO zvuk
        //if (x != null) {
        //x.remove();
        //}
        //timer = duration;
        timer++;
      }
    }, 1000);
  }

  get button() {
    //if (this.default_but == true) {
    var button = document.createElement("button");
    button.className = "timer_button";
    button.dataset.durationone = this.duritonone;
    button.dataset.durationtwo = this.durationtwo;
    button.dataset.durationthree = this.durationthree;
    var image = document.createElement("img");
    image.className = "timer_button_img";
    image.alt = "sorry"; // TODO поменять на норм текст
    image.src = this.url;
    button.appendChild(image);
    var listner = this.startTimerListener.bind(this);
    button.addEventListener("click", listner, false);
    return button;
    //}
  }
}

class Aplication {
  constructor(buttons) {
    this.buttons = buttons;
    // Set Item
    //localStorage.setItem("startButtonNumber", "Smith");

    // If page was changed retrieve information from localStorage
    var start = localStorage.getItem("startButtonNumber");
    if (start == null) {
      this.startButtonNumber = 0;
    } else {
      this.startButtonNumber = start;
    }
    this.addAddButton();
    this.setStaticButtonsListeners();
    this.redrawButtons();
    this.setPageButtons();
  }
  
  nextPage() {
    var start = parseInt(this.startButtonNumber);
    var number = 4;
    var validation = start + number;

    if (validation < buttons.length) {
      this.startButtonNumber = validation;
      localStorage.setItem("startButtonNumber", validation);
      this.redrawButtons();
    }
  }

  prevPage() {
    var start = parseInt(this.startButtonNumber);
    var number = 4;
    var validation = start - number;
    if (validation >= 0) {
      this.startButtonNumber = validation;
      localStorage.setItem("startButtonNumber", validation);
      this.redrawButtons();
    }
  }

  setPageButtons() {
    var next = document.querySelector("#next_button");
    var prev = document.querySelector("#prev_button");

    var next_listener = this.nextPage.bind(this);
    next.addEventListener("click", next_listener, false);

    var prev_listener = this.prevPage.bind(this);
    prev.addEventListener("click", prev_listener, false);
  }

  // Method
  redrawButtons() {
    btn_cont.innerHTML = "";
    var number = 4;
    var end = parseInt(this.startButtonNumber) + number;
    for (let i = this.startButtonNumber; i < end; i++) {
      if (i < buttons.length) {
        btn_cont.appendChild(buttons[i].button);
      }
    }
  }

  removeForm() {
    var form = document.querySelector("#add_new_meal_form");
    form.remove();
    this.addAddButton();
  }

  addLabelWithTextInput(idVal, textCont, form) {
    var label = document.createElement("label");
    label.htmlFor = idVal;
    label.textContent = textCont;
    var input = document.createElement("input");
    input.type = "text";
    input.name = idVal;
    input.id = idVal;
    input.placeholder = "0";
    form.appendChild(label);
    form.appendChild(document.createElement("br"));
    form.appendChild(input);
    form.appendChild(document.createElement("br"));
  }

  validateForm() {
    return true;
  }

  addForm() {
    var form = document.createElement("form");
    form.id = "add_new_meal_form";

    this.addLabelWithTextInput("d_one", "Timer duration for microwave:", form);
    this.addLabelWithTextInput("d_two", "Timer duration for duchovka:", form);
    this.addLabelWithTextInput(
      "d_three",
      "Timer duration for skovorodka:",
      form
    );
    var input = document.createElement("input");
    input.type = "file";
    input.name = "picture";
    input.id = "picture";
    input.accept = "image/png, image/jpeg";
    form.appendChild(input);
    form.appendChild(document.createElement("br"));

    var input = document.createElement("input");
    input.type = "submit";
    input.id = "submit_but";
    form.appendChild(input);
    form.appendChild(document.createElement("br"));

    var validate = this.validateForm.bind(this);
    form.onsubmit = function () {
      if (validate() == true) {
        uploadButton(
          document.querySelector("#d_one").value,
          document.querySelector("#d_two").value,
          document.querySelector("#d_three").value
        );
        this.removeForm();
      }
    };

    wrapper.appendChild(form);
  }

  addFormListener() {
    this.addForm();
  }

  addAddButton() {
    var button = document.createElement("button");
    button.className = "timer_button";
    button.id = "add_button";
    button.textContent = "Add new meal";
    var f = this.addFormListener.bind(this);
    button.addEventListener("click", f, false);
    wrapper.appendChild(button);
  }

  changeActualOfCatContainerNumberListener(e) {
    cat_container.dataset.actual = e.currentTarget.dataset.number;
  }

  setStaticButtonsListeners() {
    var listener = this.changeActualOfCatContainerNumberListener.bind(this);

    var button = document.querySelector("#cat_one");
    button.addEventListener("click", listener, false);
    button = document.querySelector("#cat_two");
    button.addEventListener("click", listener, false);
    button = document.querySelector("#cat_three");
    button.addEventListener("click", listener, false);
  }
}

var buttons = [
  new Button(5, 4, 3, "../img/chicken.jpg", true),
  new Button(5, 4, 3, "../img/chicken.jpg", true),
  new Button(5, 4, 3, "../img/chicken.jpg", true),
  new Button(5, 4, 3, "../img/chicken.jpg", true),
];

let db;

let request = indexedDB.open("myDb", 1);

request.onerror = function (e) {
  console.error("Unable to open database.");
};

request.onsuccess = function (e) {
  db = e.target.result;
  loadButtonsFromDb();
  console.log("db opened");
};

request.onupgradeneeded = function (e) {
  let db = e.target.result;
  var buttons_store = db.createObjectStore("buttons", {
    keyPath: "id",
    autoIncrement: true,
  });
  buttons_store.createIndex("durationone", "durationone", { unique: false });
  buttons_store.createIndex("durationtwo", "durationtwo", { unique: false });
  buttons_store.createIndex("durationthree", "durationthree", {
    unique: false,
  });
  buttons_store.createIndex("picture", "picture", { unique: false });
  dbReady = true;
};

function loadButtonsFromDb() {
  let trans = db.transaction(["buttons"], "readwrite");
  let store = trans.objectStore("buttons");
  var all_data = (store.getAll().onsuccess = function (event) {
    console.log(event.target.result);
    event.target.result.forEach((x, i) => {
      var src = "data:image/jpeg;base64," + btoa(x.picture);
      buttons.push(
        new Button(x.durationone, x.durationtwo, x.durationthree, src, false)
      );
    });
    app.redrawButtons();
  });
}

function uploadButton(durationone, durationtwo, durationthree) {
  let file = document.querySelector("#picture").files[0];
  var reader = new FileReader();
  reader.readAsBinaryString(file);

  reader.onload = function (e) {
    let bits = e.target.result;
    let ob = {
      durationone: durationone,
      durationtwo: durationtwo,
      durationthree: durationthree,
      picture: bits,
    };

    let trans = db.transaction(["buttons"], "readwrite");
    let addReq = trans.objectStore("buttons").add(ob);

    addReq.onerror = function (e) {
      console.log("error storing data");
      console.error(e);
    };

    trans.oncomplete = function (e) {
      var src = "data:image/jpeg;base64," + btoa(bits);
      buttons.push(new Button(durationone, durationtwo, durationthree, src));
      app.redrawButtons();
      console.log("data stored");
    };
  };
}

var app = new Aplication(buttons);
