
const fontSize = (fontSizeParam: number, fontScale: number) => {
    if ((fontScale > 1) && (fontSizeParam < 1.2)) {
        return fontSizeParam - 5;
    } else if (fontScale > 1.2) {
        return fontSizeParam - 8;
    } else {
        return fontSizeParam;
    }
};

export default fontSize;
