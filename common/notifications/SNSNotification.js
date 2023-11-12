const INotification = require('./INotification');
const { logger } = require('../logger');
const { messageBinder } = require('../../utils/locale/locale-binder');
const { 
    NOTIFICATION_SNS_TOPIC_ARN,
    AWS_REGION,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_SESSION_TOKEN,
} = require('../../config');
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

class SNSNotification extends INotification {
    client = null;

    constructor() {
        super();
        this.client = new SNSClient({
            region: AWS_REGION,
            credentials: {
                accessKeyId: AWS_ACCESS_KEY_ID,
                secretAccessKey: AWS_SECRET_ACCESS_KEY,
                sessionToken: AWS_SESSION_TOKEN,
            },
        });
    }

    publish(data, topicArn = NOTIFICATION_SNS_TOPIC_ARN) {
        const params = {
            Message: JSON.stringify(data),
            TopicArn: topicArn,
        };
        const command = new PublishCommand(params);
        this.client.send(command)
            .then((_) => {
                logger.info(messageBinder().notificationPublishSuccess);
            })
            .catch((error) => {
                logger.error(messageBinder().notificationPublishError);
                logger.error(error);
            });
    }

    subscribe() {
        
    }

    unsubscribe() {
        console.log('SNSNotification unsubscribe');
    }
}

module.exports = SNSNotification;