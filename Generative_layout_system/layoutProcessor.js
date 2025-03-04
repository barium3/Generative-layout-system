function processLayout(doc, params) {
  var content = params.content;
  var columnCount = params.columnCount;
  var columnWidth = params.columnWidth;
  var classicModernSliderValue = params.classicModernSliderValue;
  var randomizationSliderValue = params.randomizationSliderValue;
  var textContrastSliderValue = params.textContrastSliderValue;
  var alignmentSliderValue = params.alignmentSliderValue;
  var lineSpacingSliderValue = params.lineSpacingSliderValue;
  var indentationSliderValue = params.indentationSliderValue * params.fontSize;

  var fontSize = params.fontSize;
  var textBoxSize = fontSize + 0.5;

  var paragraphs = content.split(/\r\n|\r|\n/);
  var allTextFrames = [];

  var lineCounter = 1;
  var currentColumn = 0;
  var initeLimit = 42;
  var columnLinesLimit = initeLimit;
  var initeTopMargin = params.topMargin;
  var topMargin = params.topMargin;
  var xPos = params.leftMargin;
  var yPos = params.topMargin;
  var lastYPos = 0;
  var lineHeight = 4 + lineSpacingSliderValue;

  // Title adjustments
  var titleScale = map(textContrastSliderValue, 0, 100, 2, 3);
  var wTitleValue = map(textContrastSliderValue, 0, 100, 400, 700);
  var cTitleValue = 50;
  var oTitleValue = map(textContrastSliderValue, 0, 100, 12, 30);
  var titleCount = Math.floor(map(textContrastSliderValue, 0, 100, 2, 6));
  var titleSpace = titleCount * fontSize + (titleCount - 1) * lineHeight;

  var wSubTitleValue = map(textContrastSliderValue, 0, 100, 580, 800);
  var oSubTitleValue = map(textContrastSliderValue, 0, 100, 12, 30);

  var subTitleCount = 2;
  var subTitleSpace =
    subTitleCount * fontSize + (subTitleCount - 1) * lineHeight;

  var wTextValue = 400;
  var oTextValue = 100;
  var cTextValue = 12;

  // Ensure first page has page number
  var currentPage = doc.pages[0];
  addPageNumber(currentPage, doc);

  // Process each paragraph
  for (var i = 0; i < paragraphs.length; i++) {
    if (lineCounter === 1) {
      yPos = topMargin;
    } else {
      yPos = lastYPos + lineHeight;
    }
    xPos = params.leftMargin + currentColumn * (columnWidth + 2 * 8);

    if (paragraphs[i].charAt(0) === "#") {
      // Handle title
      xPos = params.leftMargin;
      yPos = topMargin;
      lineCounter = 1;
      currentColumn = 0;

      // Add new page
      var newPage = doc.pages.add();
      currentPage = newPage;
      addPageNumber(currentPage, doc);

      var titleContent = paragraphs[i].replace("#", "");
      var textFrame = addTextFrame(
        currentPage,
        titleContent,
        xPos,
        yPos,
        columnWidth,
        titleSpace,
        fontSize * titleScale,
        { weight: wTitleValue, contrast: oTitleValue }
      );

      setAlignment(textFrame, classicModernSliderValue);
      allTextFrames.push({ textFrame: textFrame, index: i });

      topMargin = yPos + titleSpace + lineHeight;
      columnLinesLimit = columnLinesLimit - titleCount;
      lastYPos = textFrame.geometricBounds[2]; // bottom
    } else if (paragraphs[i].charAt(0) === "%") {
      // Handle subtitle
      yPos = yPos + lineHeight + fontSize;
      var subTitleContent = paragraphs[i].replace("%", "");

      var textFrame = addTextFrame(
        currentPage,
        subTitleContent,
        xPos,
        yPos,
        columnWidth,
        fontSize,
        fontSize,
        { weight: wSubTitleValue, contrast: oSubTitleValue }
      );

      allTextFrames.push({ textFrame: textFrame, index: i });
      lineCounter += subTitleCount;
      lastYPos = textFrame.geometricBounds[2]; // bottom
    } else {
      // Handle body text
      lineCounter++;

      var textFrame = addTextFrame(
        currentPage,
        paragraphs[i],
        xPos,
        yPos,
        columnWidth,
        textBoxSize,
        fontSize,
        { weight: wTextValue, width: oTextValue, contrast: cTextValue }
      );

      allTextFrames.push({ textFrame: textFrame, index: i });

      // Handle overflow
      var overflow = textFrame.overflows;

      while (overflow) {
        lineCounter++;

        if (lineCounter > columnLinesLimit) {
          lineCounter = 1;
          currentColumn++;
          if (currentColumn >= columnCount) {
            currentColumn = 0;
            topMargin = initeTopMargin;
            columnLinesLimit = initeLimit;

            // Add new page
            var newPage = doc.pages.add();
            currentPage = newPage;
            addPageNumber(currentPage, doc);
          }
        }

        // Calculate position for new text frame
        var newYPos =
          lineCounter === 1
            ? topMargin
            : textFrame.geometricBounds[2] + lineHeight;
        var newXPos = params.leftMargin + currentColumn * (columnWidth + 2 * 8);

        // Check if should start new column
        if (
          newYPos + lineHeight * columnLinesLimit >
          textFrame.geometricBounds[0] +
            doc.documentPreferences.pageHeight -
            params.bottomMargin
        ) {
          newYPos = topMargin;
          newXPos += columnWidth + 2 * 8;
          lineCounter = 0;
        }

        // Adjust margins based on page side
        var rightPage = isRightPage(currentPage);
        if (rightPage) {
          newXPos += params.rightMargin - params.leftMargin;
        } else {
          newXPos += params.leftMargin - params.rightMargin;
        }

        // Create new text frame for overflow
        var newTextFrame = currentPage.textFrames.add();
        newTextFrame.geometricBounds = [
          newYPos,
          newXPos,
          newYPos + textBoxSize,
          newXPos + columnWidth,
        ];

        // Link text frames
        textFrame.nextTextFrame = newTextFrame;

        // Set font and style
        newTextFrame.parentStory.pointSize = fontSize;
        try {
          newTextFrame.parentStory.appliedFont = app.fonts.itemByName(
            "Helvetica Now Var\tText"
          );
          if (
            newTextFrame.parentStory.appliedFont.fontType == FontTypes.VARIABLE
          ) {
            newTextFrame.parentStory.designAxes =
              textFrame.parentStory.designAxes;
          }
        } catch (e) {
          newTextFrame.parentStory.appliedFont =
            app.fonts.itemByName("Helvetica");
        }

        allTextFrames.push({ textFrame: newTextFrame, index: i });
        overflow = newTextFrame.overflows;
        textFrame = newTextFrame;
        lastYPos = textFrame.geometricBounds[2]; // bottom
      }
    }
  }

  adjustTextFrames(allTextFrames, paragraphs, {
    classicModernSliderValue: classicModernSliderValue,
    alignmentSliderValue: alignmentSliderValue,
    randomizationSliderValue: randomizationSliderValue,
    indentationSliderValue: indentationSliderValue,
    fontSize: fontSize,
    columnWidth: columnWidth,
    leftMargin: params.leftMargin,
  });
}

function adjustTextFrames(allTextFrames, paragraphs, params) {
  // Calculate horizontal translation for alignment
  var horizontalTranslation = 0;
  if (
    params.classicModernSliderValue >= -1 &&
    params.classicModernSliderValue < 0
  ) {
    horizontalTranslation = Math.abs(params.classicModernSliderValue) * 80;
  }

  // Generate random offsets for paragraphs
  var paragraphRandomValuesX = [];
  for (var i = 0; i < paragraphs.length; i++) {
    var randomOffsetX =
      Math.floor(
        Math.random() * (params.randomizationSliderValue * 2 + 1) -
          params.randomizationSliderValue
      ) * params.fontSize;
    paragraphRandomValuesX.push(randomOffsetX);
  }

  // Adjust alignment and indentation for each text frame
  for (var i = 0; i < allTextFrames.length; i++) {
    var currentTextFrameObj = allTextFrames[i];
    var currentTextFrame = currentTextFrameObj.textFrame;
    var currentParagraphIndex = currentTextFrameObj.index;
    var numLines = currentTextFrame.lines.length;

    for (var j = 0; j < numLines; j++) {
      var line = currentTextFrame.lines[j];
      var lineWidth = calculateLineWidth(line);

      // Calculate offset based on alignmentSlider value
      var offset =
        ((params.columnWidth - lineWidth) * (params.alignmentSliderValue + 1)) /
        2;

      // Apply randomization and indentation
      var currentParagraphRandomOffsetX =
        paragraphRandomValuesX[currentParagraphIndex];
      var isEven = currentParagraphIndex % 2 === 0;
      var indentation = !isEven ? params.indentationSliderValue * 0.5 : 0;

      // Calculate column position
      var columnPos =
        (currentTextFrame.geometricBounds[1] - params.leftMargin) /
        (params.columnWidth + 2 * 8);

      // Set text frame X position
      var newXPos =
        params.leftMargin +
        offset +
        indentation +
        currentParagraphRandomOffsetX +
        columnPos * (params.columnWidth + 2 * 8);

      if (
        params.classicModernSliderValue >= -1 &&
        params.classicModernSliderValue < 0
      ) {
        newXPos += horizontalTranslation;
      }

      // Update text frame position
      var currentBounds = currentTextFrame.geometricBounds;
      currentTextFrame.geometricBounds = [
        currentBounds[0],
        newXPos,
        currentBounds[2],
        newXPos + (currentBounds[3] - currentBounds[1]),
      ];
    }
  }
}
