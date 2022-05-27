const display = document.querySelector('#timer');

function startTimer(evt) {
    span = document.querySelector('#span_timer');
    if(span != null){
        span.remove();
    }
    var x = document.createElement("SPAN");
    x.id = "span_timer"
    x.className = "span_timer";
    display.appendChild(x);
    var duration = evt.currentTarget.dataset.duration
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        x.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            timer = duration;
        }
    }, 1000);
}

const someInput = document.querySelector('#test');
someInput.addEventListener('click', startTimer, false);

