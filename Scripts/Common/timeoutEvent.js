function TimeoutEvent(time, callbackFunc, obj) {
    this.maxTime = time;
    this.currentTime = 0;
    this.callbackFunc = callbackFunc;
    this.obj = obj;

    this.launch = function() {
        if (this.currentTime === 0) {
            this.currentTime = this.maxTime;
        }
    }

    this.handleEvent = function() {
        if (this.currentTime > 0) {
            this.currentTime--;

            if (this.currentTime === 1) {
                if (this.obj) {
                    callbackFunc(this.obj);
                } else {
                    callbackFunc();
                }
            }
        }
    }

    this.isLaunched = function() {
        return this.currentTime > 0;
    }
}