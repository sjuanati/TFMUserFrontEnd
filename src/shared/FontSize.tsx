
const fontSize = (fontSize, fontScale) => {
    //console.log('fontScale: ', fontScale);
    if ((fontScale > 1) && (fontSize < 1.2)) {
        return fontSize - 5;
    } else if (fontScale > 1.2) {
        return fontSize - 8;
    } else {
        return fontSize;
    }
}

export default fontSize;