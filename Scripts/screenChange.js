screenChange = {
    isChanging: false,
    coords: 0,
    change: function(callBackfunc) {
        if (screenChange.image === undefined) {
            screenChange.image = new Image();
            screenChange.image.src = 'GFX/ScreenChanger.png';
        }
        screenChange.isChanging = true;
        screenChange.coords = 0;
        screenChange.callBackfunc = callBackfunc;
    },
    changing: function() {
        if (!screenChange.isChanging) {
            return;
        }
        screenChange.coords += 7;
        ctx.drawImage(screenChange.image, screenChange.coords, 0);
        ctx.drawImage(screenChange.image, 640- screenChange.coords, 0);
        if (screenChange.coords > 320) {
            screenChange.isChanging = false;
            screenChange.callBackfunc();
        }
    }
}