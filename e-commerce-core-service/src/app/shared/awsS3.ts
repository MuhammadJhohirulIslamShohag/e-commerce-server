import AWS, { AWSError } from 'aws-sdk';

import config from '../config';

import { DeleteObjectOutput, ManagedUpload } from 'aws-sdk/clients/s3';

type AwsConfig = {
  aws_bucket_name: string;
};

const awsS3 = new AWS.S3({
  accessKeyId: config.aws.aws_access_key_id,
  secretAccessKey: config.aws.aws_secret_access_key,
});

// Upload Image File To Amazon Web S3 Service
export const imageUploadToAwsS3 = (filename: string, file: Buffer) => {
  const params: AWS.S3.Types.PutObjectRequest = {
    Key: filename,
    Bucket: (config.aws as AwsConfig).aws_bucket_name,
    Body: file,
    ContentType: 'image/*',
    ACL: 'public-read',
  };

  return new Promise((resolve, reject) => {
    awsS3.upload(params, (error, data: ManagedUpload.SendData) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
};

// Delete Image File To Amazon Web S3 Service
export const imageDeleteToAwsS3 = (filename: string) => {
  const params: AWS.S3.Types.DeleteObjectRequest = {
    Key: filename,
    Bucket: (config.aws as AwsConfig).aws_bucket_name,
  };

  return new Promise((resolve, reject) => {
    awsS3.deleteObject(params, (error: AWSError, data: DeleteObjectOutput) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
};
