function createDialog() {
  var dialog = new Window("dialog", "Layout Generator");
  dialog.orientation = "row";
  dialog.alignChildren = "fill";

  dialog.controlPanel = dialog.add("group");
  dialog.controlPanel.orientation = "column";
  dialog.controlPanel.alignChildren = "center";
  dialog.controlPanel.spacing = 10;

  // Classic-Modern slider
  dialog.controlPanel.classicModernLabel = dialog.controlPanel.add(
    "statictext",
    undefined,
    "Classic - Modern:"
  );
  dialog.controlPanel.classicModernSlider = dialog.controlPanel.add(
    "slider",
    undefined,
    0,
    -1,
    1
  );
  dialog.controlPanel.classicModernSlider.size = [200, 15];

  var singleColumnWidth = dialog.controlPanel.add("group");
  singleColumnWidth.orientation = "column";
  singleColumnWidth.alignChildren = "center";
  singleColumnWidth.spacing = 3;

  dialog.controlPanel.singleColumnWidthLabel = dialog.controlPanel.add(
    "statictext",
    undefined,
    "Single Column Width:"
  );
  dialog.controlPanel.singleColumnWidthSlider = dialog.controlPanel.add(
    "slider",
    undefined,
    19 * 8,
    19 * 8,
    26 * 8
  );
  dialog.controlPanel.singleColumnWidthSlider.size = [100, 5];

  dialog.controlPanel.alignmentLabel = dialog.controlPanel.add(
    "statictext",
    undefined,
    "Alignment:"
  );
  dialog.controlPanel.alignmentSlider = dialog.controlPanel.add(
    "slider",
    undefined,
    0,
    -1,
    1
  );
  dialog.controlPanel.alignmentSlider.size = [100, 5];

  // Function-Form slider
  dialog.controlPanel.functionFormLabel = dialog.controlPanel.add(
    "statictext",
    undefined,
    "Function - Form:"
  );
  dialog.controlPanel.functionFormSlider = dialog.controlPanel.add(
    "slider",
    undefined,
    0,
    -1,
    1
  );
  dialog.controlPanel.functionFormSlider.size = [200, 15];

  dialog.controlPanel.textContrastLabel = dialog.controlPanel.add(
    "statictext",
    undefined,
    "Text Contrast:"
  );
  dialog.controlPanel.textContrastSlider = dialog.controlPanel.add(
    "slider",
    undefined,
    0,
    0,
    100
  );
  dialog.controlPanel.textContrastSlider.size = [100, 5];

  dialog.controlPanel.lineSpacingLabel = dialog.controlPanel.add(
    "statictext",
    undefined,
    "Line Spacing:"
  );
  dialog.controlPanel.lineSpacingSlider = dialog.controlPanel.add(
    "slider",
    undefined,
    0,
    0,
    5
  );
  dialog.controlPanel.lineSpacingSlider.size = [100, 5];

  dialog.controlPanel.indentationLabel = dialog.controlPanel.add(
    "statictext",
    undefined,
    "Indentation:"
  );
  dialog.controlPanel.indentationSlider = dialog.controlPanel.add(
    "slider",
    undefined,
    0,
    0,
    5
  );
  dialog.controlPanel.indentationSlider.size = [100, 5];

  dialog.controlPanel.randomizationLabel = dialog.controlPanel.add(
    "statictext",
    undefined,
    "Randomization:"
  );
  dialog.controlPanel.randomizationSlider = dialog.controlPanel.add(
    "slider",
    undefined,
    0,
    0,
    4
  );
  dialog.controlPanel.randomizationSlider.size = [100, 5];

  dialog.controlPanel.columnCountLabel = dialog.controlPanel.add(
    "statictext",
    undefined,
    "Column Count:"
  );
  dialog.controlPanel.columnCountInput = dialog.controlPanel.add(
    "edittext",
    undefined,
    "1"
  );
  dialog.controlPanel.columnCountInput.characters = 5;

  // Text input panel on the right
  var textPanel = dialog.add("group");
  textPanel.orientation = "column";
  textPanel.alignChildren = "fill";

  textPanel.add("statictext", undefined, "Input Text:");
  dialog.textInput = textPanel.add("edittext", undefined, "", {
    multiline: true,
  });
  dialog.textInput.size = [300, 400];

  // Add sample text
  var sampleText =
    "# Sample Title\n\nThis is a paragraph of text. You can add more text here.\n\n% Subtitle\n\nAnother paragraph of text follows the subtitle.\n\nUse # for titles and % for subtitles.";
  dialog.textInput.text = sampleText;

  // Button panel
  var buttonGroup = dialog.add("group");
  buttonGroup.orientation = "column";

  dialog.okButton = buttonGroup.add("button", undefined, "OK");
  dialog.cancelButton = buttonGroup.add("button", undefined, "Cancel");

  setupSliderEvents(dialog);

  return dialog;
}

function setupSliderEvents(dialog) {
  // Add a change listener to the classicModernSlider
  dialog.controlPanel.classicModernSlider.onChange = function () {
    if (
      dialog.controlPanel.classicModernSlider.value >= -1 &&
      dialog.controlPanel.classicModernSlider.value < 0
    ) {
      dialog.controlPanel.alignmentSlider.value = map(
        dialog.controlPanel.classicModernSlider.value,
        -1,
        0,
        0,
        -1
      );
      dialog.controlPanel.singleColumnWidthSlider.value = map(
        dialog.controlPanel.classicModernSlider.value,
        -1,
        0,
        26 * 8,
        19 * 8
      );
      dialog.controlPanel.columnCountInput.text = "1";
    } else if (
      dialog.controlPanel.classicModernSlider.value >= 0 &&
      dialog.controlPanel.classicModernSlider.value < 0.5
    ) {
      dialog.controlPanel.columnCountInput.text = "2";
      dialog.controlPanel.alignmentSlider.value = -1;
    } else {
      dialog.controlPanel.columnCountInput.text = "3";
      dialog.controlPanel.alignmentSlider.value = -1;
    }
  };

  // functionForm slider change listener
  dialog.controlPanel.functionFormSlider.onChange = function () {
    if (
      dialog.controlPanel.functionFormSlider.value >= -1 &&
      dialog.controlPanel.functionFormSlider.value < 0
    ) {
      dialog.controlPanel.textContrastSlider.value = map(
        dialog.controlPanel.functionFormSlider.value,
        -1,
        0,
        100,
        0
      );
      dialog.controlPanel.indentationSlider.value = 0;
      dialog.controlPanel.randomizationSlider.value = 0;
    } else if (
      dialog.controlPanel.functionFormSlider.value >= 0 &&
      dialog.controlPanel.functionFormSlider.value < 0.3
    ) {
      dialog.controlPanel.textContrastSlider.value = 0;
      dialog.controlPanel.indentationSlider.value = map(
        dialog.controlPanel.functionFormSlider.value,
        0,
        0.3,
        0,
        6
      );
      dialog.controlPanel.randomizationSlider.value = 0;
    } else if (
      dialog.controlPanel.functionFormSlider.value >= 0.3 &&
      dialog.controlPanel.functionFormSlider.value < 0.6
    ) {
      dialog.controlPanel.textContrastSlider.value = 0;
      dialog.controlPanel.indentationSlider.value = 0;
      dialog.controlPanel.randomizationSlider.value = map(
        dialog.controlPanel.functionFormSlider.value,
        0.3,
        0.6,
        0,
        3
      );
    } else {
      dialog.controlPanel.textContrastSlider.value = 0;
      dialog.controlPanel.indentationSlider.value = 0;
      dialog.controlPanel.randomizationSlider.value = map(
        dialog.controlPanel.functionFormSlider.value,
        0.6,
        1,
        0,
        4
      );
    }
  };
}
