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
  ) as { Location: string };

  // check image is upload or not
  if (!uploadedImageURL) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `${
        imageName?.[0]?.toUpperCase() + imageName?.slice(1)
      } Image Upload Failed!`
    );
  }

  return uploadedImageURL?.Location;
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
  files: { [key: string]: IFile[] },
  imageFileName: string,
  prefix: string
) => {
  // check file of the image
  if (!files || !(imageFileName in files)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Please upload ${prefix} image file!`
    );
  }

  const filesData: { [key: string]: IFile[] } = files;
  const imageFile = filesData[imageFileName]?.[0];



  // image file validation
  if (!imageFile) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Please upload ${prefix} image file!`
    );
  }

  return imageFile;
};

// image files validate for creating
const imageFilesValidate = async (
  files: { [key: string]: IFile[] },
  imageFileName: string,
  prefix: string
) => {
  // check file of the image
  if (!files || !(imageFileName in files)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Please upload ${prefix} image file!`
    );
  }

  const filesData: { [key: string]: IFile[] } = files;
  const imageFiles = filesData[imageFileName];



  // image file validation
  if (!imageFiles.length) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Please upload ${prefix} image file!`
    );
  }

  return imageFiles;
};

// image file validate for updating
const imageFileValidateForUpdate = async (
  files: { [key: string]: IFile[] },
  imageFileName: string,
  prefix: string
) => {
  // check file of the image
  if (files && imageFileName in files) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Please upload ${prefix} image file!`
    );
  }

  const filesData: { [key: string]: IFile[] } = files;
  const imageFile = filesData[imageFileName]?.[0];

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
  imageFilesValidate
};
