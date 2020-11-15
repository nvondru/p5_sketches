let clockPageController;
let messageBox;
const CLICK_MODES = {
  default: "default",
  create: "create",
  definePosition: "definePosition",
};
let clickMode = CLICK_MODES.default;

document.addEventListener("DOMContentLoaded", function (event) {
  messageBox = document.getElementById("messageBox");
  clockPageController = new ClockPageController();
});

class ClockPageController {
  constructor() {
    this.btnToggleSound = document.getElementById("btn_toggleSound");
    this.btnAddWatch = document.getElementById("btn_addWatch");
    this.btnClearCanvas = document.getElementById("btn_clearCanvas");
    this.rangeSpeedModifier = document.getElementById("range_speedModifier");
    this.lblSpeedModifier = document.getElementById("lbl_speedModifier");

    this.registerButtonListeners();
    this.registerRangeListeners();
    this.messageTimeout = setTimeout(() => {}, 0);
  }

  registerButtonListeners() {
    this.btnToggleSound.addEventListener("click", (event) => {
      soundEnabled = !soundEnabled;
      if (soundEnabled === true) {
        this.displayInfoMessage("Sound enabled", 2000);
      } else {
        this.displayInfoMessage("Sound disabled", 2000);
      }
    });

    this.btnAddWatch.addEventListener("click", (event) => {
      this.displayInfoMessage(
        "Click and drag in the gray canvas to create a new watch.",
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
    this.rangeSpeedModifier.addEventListener("mouseup", (event) => {
      let adjustedValue = this.rangeSpeedModifier.value;

      while ((p5Framerate % (p5Framerate / adjustedValue)) % 1 != 0) {
        adjustedValue -= 1;
      }

      speedModifier = adjustedValue;
      this.lblSpeedModifier.innerHTML = adjustedValue;
    });

    this.rangeSpeedModifier.addEventListener("input", (event) => {
      this.lblSpeedModifier.innerHTML = this.rangeSpeedModifier.value;
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
}
