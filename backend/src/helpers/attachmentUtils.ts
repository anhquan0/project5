import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('AttachmentUtils');


// TODO: Implement the fileStogare logic
export function createDynamoDBClient() {
    logger.info('create DB');
    try {
      let db = new XAWS.DynamoDB();
      return db;
    } catch (error) {
      logger.error('error Create DB', error);
      return null;
    }
  }