//Definition and initializing of global variables
const wrapper = document.querySelector("#wrapper");
const timer_container = document.querySelector("#timer");
const cat_container = document.querySelector("#cat_cont");
const btn_cont = document.querySelector(".btn_container_back");
const def_sound_string_path = "sound/sound.mp3";
var interval = null;

//Button class
class Button {
  constructor(duritonone, durationtwo, durationtree, url, default_but) {
    this.duritonone = duritonone;
    this.durationtwo = durationtwo;
    this.durationthree = durationtree;
    this.url = url;
    this.default_but = default_but;
    this.interval = null;
  }

  //Method tha launch timer in timer container
  startTimerListener(e) {
    if (interval != null) {
      clearInterval(interval);
    }
    var span = document.querySelector("#span_timer");
    if (span != null) {
      span.remove();
    }
    var timer_span = document.createElement("SPAN");
    timer_span.id = "span_timer";
    timer_span.className = "span_timer";
    timer_container.appendChild(timer_span);

    var duration;
    // Choose duration of timer, depends on choosen category
    if (cat_container.dataset.actual == 1) {
      duration = parseInt(e.currentTarget.dataset.durationone);
    } else if (cat_container.dataset.actual == 2) {
      duration = parseInt(e.currentTarget.dataset.durationtwo);
    } else {
      duration = parseInt(e.currentTarget.dataset.durationthree);
    }

    var timer = parseInt(duration);
    var minutes;
    var seconds;

    interval = setInterval(
      function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        timer_span.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
          timer_span.textContent ="00:00";
          const aud = new Audio(app.sound);
          aud.play();
          clearInterval(interval);
        } 
      }.bind(this),
      1000
    );
  }

  // Getter for html button element
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

//Application class
class Aplication {
  constructor(buttons) {
    this.buttons = buttons;

    // If sound was uploaded retrieve information from localStorage
    var sound = localStorage.getItem("sound");
    if (sound == null) {
      this.sound = def_sound_string_path;
    } else {
      this.sound = sound;
    }

    // If page was changed retrieve information from localStorage
    var start = localStorage.getItem("startButtonNumber");
    if (start == null) {
      this.startButtonNumber = 0;
    } else {
      this.startButtonNumber = start;
    }
    //Init methods
    this.addAddButton();
    this.addUploadSoundButton();
    this.setStaticButtonsListeners();
    this.redrawButtons();
    this.setPageButtons();
  }

  // Change page and redraw buttons
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

  // Change page and redraw buttons
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

  // Setting listeners for next/prev page buttons
  setPageButtons() {
    var next = document.querySelector("#next_button");
    var prev = document.querySelector("#prev_button");

    var next_listener = this.nextPage.bind(this);
    next.addEventListener("click", next_listener, false);

    var prev_listener = this.prevPage.bind(this);
    prev.addEventListener("click", prev_listener, false);
  }

  // Method that redraws buttons
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

  // Method remove adding meal form from dom
  removeForm() {
    var form = document.querySelector("#add_new_meal_form");
    form.remove();
    this.addAddButton();
  }

  // Method remove adding meal form from dom
  removeSoundForm() {
    var form = document.querySelector("#add_new_sound_form");
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

  // Validation adding meal form
  validateForm(f, s, t, input) {
    var err = document.querySelector("#meal_form_err");
    err.textContent = "";
    if (isNaN(f.value)) {
      f.style.backgroundColor = "red";
      err.textContent = "Please fill time in seconds!";
    }
    if (isNaN(s.value)) {
      s.style.backgroundColor = "red";
      err.textContent = "Please fill time in seconds!";
    }
    if (isNaN(t.value)) {
      t.style.backgroundColor = "red";
      err.textContent = "Please fill time in seconds!";
    }
    if (!input.files[0]) {
      err.textContent = "Please select a file!";
      return false;
    } else {
      var file = input.files[0];
      if (file.size > 1000000) {
        err.textContent = "Size must be under 1 mb!";
        return false;
      }
      return err.textContent == "";
    }
  }

  // Validation uploading form
  validateSoundForm(input) {
    var err = document.querySelector("#sound_form_err");
    if (!input.files[0]) {
      err.textContent = "Please select a file!";
      return false;
    } else {
      var file = input.files[0];
      if (file.size > 256000) {
        err.textContent = "Size must be under 256 kb!";
        return false;
      }
      return true;
    }
  }

  // Method that construct and adds uploading sound form
  addSoundForm() {
    var form = document.createElement("form");
    form.id = "add_new_sound_form";

    var label = document.createElement("label");
    label.htmlFor = "upl_sound";
    label.textContent = "Please choose new sound for alarm:";
    var input_file = document.createElement("input");
    input_file.type = "file";
    input_file.name = "upl_sound";
    input_file.id = "upl_sound";
    input_file.accept = "audio/mp3";
    form.appendChild(label);
    form.appendChild(document.createElement("br"));
    form.appendChild(input_file);

    var div = document.createElement("div");
    div.id = "sound_form_err";
    form.appendChild(div);

    form.appendChild(document.createElement("br"));

    var input = document.createElement("input");
    input.type = "submit";
    input.id = "submit__sound_but";
    form.appendChild(input);
    form.appendChild(document.createElement("br"));

    var validate = this.validateSoundForm.bind(this, input_file);

    form.onsubmit = function (e) {
      e.preventDefault();
      if (validate() == true) {
        uploadSound();
        this.remove();
      }
    };

    wrapper.appendChild(form);
  }

  addSoundFormListener() {
    this.addSoundForm();
  }

  // Method that construct and adds uploading sound button
  addUploadSoundButton() {
    var button = document.createElement("button");
    button.className = "timer_button";
    button.id = "upload_sound";
    button.textContent = "Upload sound";
    var f = this.addSoundFormListener.bind(this);
    button.addEventListener("click", f, false);
    wrapper.appendChild(button);
  }

  // Method that construct and adds new meal form
  addForm() {
    var form = document.createElement("form");
    form.id = "add_new_meal_form";

    this.addLabelWithTextInput(
      "d_one",
      "Duration for microwave in seconds:",
      form
    );
    this.addLabelWithTextInput("d_two", "Duration for oven in seconds:", form);
    this.addLabelWithTextInput("d_three", "Duration for pan in seconds:", form);
    var span = document.createElement("span");
    span.id = "meal_form_err";

    form.appendChild(span);
    form.appendChild(document.createElement("br"));

    var input_file = document.createElement("input");
    input_file.type = "file";
    input_file.name = "picture";
    input_file.id = "picture";
    input_file.accept = "image/png, image/jpeg";
    form.appendChild(input_file);
    form.appendChild(document.createElement("br"));

    var input = document.createElement("input");
    input.type = "submit";
    input.id = "submit_but";
    form.appendChild(input);
    form.appendChild(document.createElement("br"));
    wrapper.appendChild(form);
    var f = document.querySelector("#d_one");
    var s = document.querySelector("#d_two");
    var t = document.querySelector("#d_three");
    var validate = this.validateForm.bind(this, f, s, t, input_file);

    form.onsubmit = function (e) {
      e.preventDefault();
      if (validate() == true) {
        uploadButton(f.value, s.value, t.value);
        this.remove();
      }
    };
  }

  addFormListener() {
    this.addForm();
  }

  // Method that construct and adds new meal button
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
    var choosed = document.querySelector("#choosed_cat");
    if (e.currentTarget.dataset.number == 1) {
      choosed.className = "cat_one";
    } else if (e.currentTarget.dataset.number == 2) {
      choosed.className = "cat_two";
    } else {
      choosed.className = "cat_three";
    }
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

// Default buttons array
var buttons = [
  new Button(5, 4, 3, "img/chicken.jpg", true),
  new Button(3600, 2600, 3200, "img/fish.jpg", true),
  new Button(1000, 3000, 500, "img/potato.jpg", true),
  new Button(1000, 500, 500, "img/spagg.png", true),
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

//Loading buttons from indexeddb
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

//Uploading button to indexeddb
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

//Uploading sound to localStorage
function uploadSound() {
  const reader = new FileReader();
  reader.onload = function () {
    var str = this.result;
    localStorage.setItem("sound", str);
    app.sound = str;
    console.log(str);
  };
  var input_fil = document.querySelector("#upl_sound");
  reader.readAsDataURL(input_fil.files[0]);
}

var app = new Aplication(buttons);
