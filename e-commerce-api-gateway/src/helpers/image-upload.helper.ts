/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from 'express';
import httpStatus from 'http-status';
import ApiError from '../errors/ApiError';

import { imageDeleteToAwsS3, imageUploadToAwsS3 } from '../shared/awsS3';
import { getUniqueKey } from '../shared/getUniqueKey';
import { IFile } from '../interfaces';

// image upload to S3 bucket for making
const imageUploadToS3Bucket = async (
  prefix: string,
  imageName: string,
  file: Buffer
) => {
  // get unique random unique id
  const uniqueId = getUniqueKey(prefix);

  // upload image to aws s3 bucket
  const uploadedImageURL = await imageUploadToAwsS3(
    `${imageName}-image-${uniqueId}.jpg`,
    file
  );

  // check image is upload or not
  if (!uploadedImageURL) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `${
        imageName?.[0]?.toUpperCase() + imageName?.slice(1)
      } Image Upload Failed!`
    );
  }

  return uploadedImageURL;
};

// image upload to S3 bucket for updating
const imageUploadToS3BucketForUpdate = async (
  prefix: string,
  imageName: string,
  file: Buffer,
  imageURLArrayObject: string[]
) => {
  // get unique random unique id
  const uniqueId = getUniqueKey(prefix);

  // upload image to aws s3 bucket
  const uploadedImageURL = await imageUploadToAwsS3(
    `${imageName}-image-${uniqueId}.jpg`,
    file
  );

  // check image is upload or not
  if (!uploadedImageURL) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `${
        imageName?.[0]?.toUpperCase() + imageName?.slice(1)
      } Image Upload Failed!`
    );
  }

  // old image file delete
  if (uploadedImageURL) {
    await imageDeleteToAwsS3(
      imageURLArrayObject[imageURLArrayObject.length - 1]
    );
  }

  return uploadedImageURL;
};

// image file validate for creating
const imageFileValidate = async (
  req: Request,
  imageFileName: string,
  prefix: string
) => {
  // check file of the image
  if (!req.files || !(imageFileName in req.files)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Please upload ${prefix} image file!`
    );
  }

  const files: { [key: string]: IFile[] } = req.files as any;
  const imageFile = files[imageFileName]?.[0];

  // image file validation
  if (!imageFile) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Please upload ${prefix} image file!`
    );
  }

  return imageFile;
};

// image file validate for updating
const imageFileValidateForUpdate = async (
  req: Request,
  imageFileName: string,
  prefix: string
) => {
  // check file of the image
  if (req.files && imageFileName in req.files) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Please upload ${prefix} image file!`
    );
  }

  const files: { [key: string]: IFile[] } = req.files as any;
  const imageFile = files[imageFileName]?.[0];

  // image file validation
  if (!imageFile) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Please upload ${prefix} image file!`
    );
  }

  return imageFile;
};

export const ImageUploadHelpers = {
  imageUploadToS3Bucket,
  imageUploadToS3BucketForUpdate,
  imageFileValidate,
  imageFileValidateForUpdate,
};
