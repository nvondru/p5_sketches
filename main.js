let clockPageController;
let messageBox;
const CLICK_MODES = {
  default: "default",
  create: "create",
  definePosition: "definePosition",
  grab: "grab",
  scale: "scale",
  scale: "duplicate",
};
let clickMode = CLICK_MODES.default;

document.addEventListener("DOMContentLoaded", function (event) {
  messageBox = document.getElementById("messageBox");
  clockPageController = new ClockPageController();
});

class ClockPageController {
  constructor() {
    this.btnAddWatch = document.getElementById("btn_addWatch");
    this.btnClearCanvas = document.getElementById("btn_clearCanvas");
    this.rangeSpeedModifier = document.getElementById("range_speedModifier");
    this.lblSpeedModifier = document.getElementById("lbl_speedModifier");
    this.rangeP5Framerate = document.getElementById("range_p5Framerate");
    this.lblP5Framerate = document.getElementById("lbl_p5Framerate");
    this.lblActualFramerate = document.getElementById("lbl_actualFramerate");

    this.registerButtonListeners();
    this.registerRangeListeners();
    this.messageTimeout = setTimeout(() => {}, 0);
  }

  registerButtonListeners() {
    this.btnAddWatch.addEventListener("click", (event) => {
      this.displayInfoMessage(
        "Click and drag within the black rectangle to create a new watch.",
        3000
      );
      clickMode = CLICK_MODES.definePosition;
    });

    this.btnClearCanvas.addEventListener("click", (event) => {
      this.displayInfoMessage("Cleared all watches.", 3000);
      clocks = [];
    });
  }

  registerRangeListeners() {
    this.rangeSpeedModifier.addEventListener("input", (event) => {
      this.lblSpeedModifier.innerHTML = this.rangeSpeedModifier.value;
      speedModifier = this.rangeSpeedModifier.value;
    });

    this.rangeP5Framerate.addEventListener("input", (event) => {
      this.lblP5Framerate.innerHTML = this.rangeP5Framerate.value;
      p5Framerate = Number(this.rangeP5Framerate.value);
    });
  }

  displayInfoMessage(message, duration) {
    clearTimeout(this.messageTimeout);
    messageBox.innerHTML = message;
    messageBox.classList.remove("messageBox--inactive");
    messageBox.classList.add("messageBox--active");
    this.messageTimeout = setTimeout(() => {
      messageBox.classList.remove("messageBox--active");
      messageBox.classList.add("messageBox--inactive");
    }, duration);
  }

  updateActualFrameRateDisplay(value) {
    this.lblActualFramerate.innerHTML = value;
  }
}
