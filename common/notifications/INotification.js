class INotification {
    constructor() {
        if (this.constructor === INotification) {
            throw new TypeError('Abstract class "INotification" cannot be instantiated directly.');
        }
    }

    async healthCheck() {
        throw new Error('Method "healthCheck" must be implemented.');
    }

    publish() {
        throw new Error('Method "publish" must be implemented.');
    }

    subscribe() {
        throw new Error('Method "subscribe" must be implemented.');
    }

    unsubscribe() {
        throw new Error('Method "unsubscribe" must be implemented.');
    }
}

module.exports = INotification;