var keyPrefix = 'osc.'

class Cache {

    set(key, value, persistent = true) {

        try {

            var storage = persistent ? localStorage : sessionStorage

            storage.setItem(keyPrefix + key, JSON.stringify(value))

        } catch(e){
            console.error(`Could not write to ${persistent ? 'localStorage' : 'sessionStorage'}: ${e}`)
            console.debug(e)
        }


    }

    get(key, persistent = true) {

        try {

            var storage = persistent ? localStorage : sessionStorage

            return JSON.parse(storage.getItem(keyPrefix + key))

        } catch(e){
            console.error(`Could not read from ${persistent ? 'localStorage' : 'sessionStorage'}: ${e}`)
            console.debug(e)
            return null
        }

    }

    remove(key, persistent = true) {

        var storage = persistent ? localStorage : sessionStorage

        storage.removeItem(keyPrefix + key)

    }

    clear(domain) {

        if (domain) {

            for (let storage of [localStorage, sessionStorage]) {

                for (let k in storage) {
                    if (k.indexOf(keyPrefix + domain) === 0) {
                        storage.removeItem(k)
                    }
                }

            }


        } else {

            localStorage.clear()
            sessionStorage.clear()

        }

    }

}

export default new Cache()
