function setAlignment(textFrame, classicModernSliderValue) {
  if (classicModernSliderValue >= -1 && classicModernSliderValue < 0.7) {
    textFrame.paragraphs.everyItem().justification = Justification.LEFT_ALIGN;
  } else {
    textFrame.paragraphs.everyItem().justification =
      Justification.FULLY_JUSTIFIED;
  }
}

function setFont(textFrame, fontWeight, fontWidth, fontContrast) {
  try {
    textFrame.parentStory.appliedFont = app.fonts.itemByName(
      "Helvetica Now Var\tText"
    );

    if (textFrame.parentStory.appliedFont.fontType == FontTypes.VARIABLE) {
      var designAxesValues = textFrame.parentStory.appliedFont.designAxesValues;
      designAxesValues[0] = fontWeight;

      if (fontWidth !== undefined) {
        designAxesValues[1] = fontWidth;
      }

      if (fontContrast !== undefined) {
        designAxesValues[2] = fontContrast;
      }

      textFrame.parentStory.designAxes = designAxesValues;
    }
  } catch (e) {
    textFrame.parentStory.appliedFont = app.fonts.itemByName("Helvetica");
  }
}

function addTextFrame(
  page,
  content,
  xPos,
  yPos,
  width,
  height,
  fontSize,
  fontSettings
) {
  var textFrame = page.textFrames.add();
  textFrame.geometricBounds = [yPos, xPos, yPos + height, xPos + width];
  textFrame.contents = content;
  textFrame.parentStory.pointSize = fontSize;

  if (fontSettings) {
    setFont(
      textFrame,
      fontSettings.weight,
      fontSettings.width,
      fontSettings.contrast
    );
  }

  return textFrame;
}

function addPageNumber(page, doc) {
  var pageNumber = page.textFrames.add();
  pageNumber.geometricBounds = [
    doc.documentPreferences.pageHeight - 30,
    0,
    doc.documentPreferences.pageHeight - 10,
    doc.documentPreferences.pageWidth,
  ];
  pageNumber.contents = (page.documentOffset + 1).toString();
  pageNumber.parentStory.pointSize = 10;
  pageNumber.parentStory.appliedFont = app.fonts.itemByName("Helvetica");
  pageNumber.paragraphs[0].justification = Justification.CENTER_ALIGN;
}
