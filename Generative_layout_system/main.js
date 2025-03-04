#include "utils.js"
#include "textFrame.js"
#include "dialog.js"
#include "layoutProcessor.js"

function main() {
  // Create new document or use current document
  var doc = app.documents.length > 0 ? app.activeDocument : app.documents.add();

  // Set document units to points
  doc.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.POINTS;
  doc.viewPreferences.verticalMeasurementUnits = MeasurementUnits.POINTS;

  var fontSize = 8;
  var dialog = createDialog();
  var result = dialog.show();

  if (result == 2) {
    return;
  }

  if (result == 1) {
    // Get text content from the dialog input field
    var content = dialog.textInput.text;

    // Get control values from controlPanel
    var columnCount = parseInt(dialog.controlPanel.columnCountInput.text);
    var sliderPosition = parseFloat(dialog.controlPanel.singleColumnWidthSlider.value);
    var columnWidth = calculateColumnWidth(columnCount, sliderPosition);
    
    // Page margins
    var pageMargins = {
      leftMargin: 20,
      rightMargin: 20,
      topMargin: 32,
      bottomMargin: 20
    };
    
    // Process layout parameters
    var layoutParams = {
      content: content,
      columnCount: columnCount,
      columnWidth: columnWidth,
      classicModernSliderValue: dialog.controlPanel.classicModernSlider.value,
      functionFormSliderValue: dialog.controlPanel.functionFormSlider.value,
      randomizationSliderValue: dialog.controlPanel.randomizationSlider.value,
      textContrastSliderValue: dialog.controlPanel.textContrastSlider.value,
      alignmentSliderValue: dialog.controlPanel.alignmentSlider.value,
      lineSpacingSliderValue: dialog.controlPanel.lineSpacingSlider.value,
      indentationSliderValue: Math.floor(dialog.controlPanel.indentationSlider.value),
      fontSize: fontSize,
      leftMargin: pageMargins.leftMargin,
      rightMargin: pageMargins.rightMargin,
      topMargin: pageMargins.topMargin,
      bottomMargin: pageMargins.bottomMargin
    };
    
    processLayout(doc, layoutParams);
  }
}

// Run main function
main();
