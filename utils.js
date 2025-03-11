function map(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

function calculateLineWidth(line) {
  var textRange = line.texts[0];
  return textRange.endHorizontalOffset - textRange.horizontalOffset;
}

function isRightPage(page) {
  return (page.documentOffset + 1) % 2 === 0;
}

function calculateColumnWidth(columnCount, sliderPosition) {
  switch (columnCount) {
    case 1:
      return sliderPosition;
    case 2:
      return 19 * 8;
    case 3:
      return 12 * 8;
    default:
      return 19 * 8;
  }
}
