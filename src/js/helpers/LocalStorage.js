class LocalStorageHelper {

    static isAvailable() {
        try {
            const testKey = '__test__';
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    static setItem(key, value) {
        if (this.isAvailable()) {
            try {
                // Uložení dat do localStorage
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.error(e);
            }
        }
    }

    static getItem(key) {
        if (this.isAvailable()) {
            try {
                const value = localStorage.getItem(key);
                if (value !== null) {
                    return JSON.parse(value);
                }
                return null;
            } catch (e) {
                console.error(e);
                return null;
            }
        }
    }

    static removeItem(key) {
        if (this.isAvailable()) {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.error(e);
            }
        }
    }

    static clear() {
        if (this.isAvailable()) {
            try {
                localStorage.clear();
            } catch (e) {
                console.error(e);
            }
        }
    }
}

export default LocalStorageHelper;