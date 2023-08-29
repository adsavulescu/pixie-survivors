class Controls {
    constructor() {
        this.keys = {};


        window.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'w':
                case 'W':
                    this.keys.w = true;
                    break;
                case 'a':
                case 'A':
                    this.keys.a = true;
                    break;
                case 's':
                case 'S':
                    this.keys.s = true;
                    break;
                case 'd':
                case 'D':
                    this.keys.d = true;
                    break;
                case ' ':
                    this.keys.space = true;
                    break;
                case 'Shift':
                    this.keys.shift = true;
                    break;
            }
        });

        window.addEventListener('keyup', (event) => {
            switch (event.key) {
                case 'w':
                case 'W':
                    this.keys.w = false;
                    break;
                case 'a':
                case 'A':
                    this.keys.a = false;
                    break;
                case 's':
                case 'S':
                    this.keys.s = false;
                    break;
                case 'd':
                case 'D':
                    this.keys.d = false;
                    break;
                case ' ':
                    this.keys.space = false;
                    break;
                case 'Shift':
                    this.keys.shift = false;
                    break;
            }
        });
    }

    getInput() {
        return this.keys;
    }
}

export default Controls;
