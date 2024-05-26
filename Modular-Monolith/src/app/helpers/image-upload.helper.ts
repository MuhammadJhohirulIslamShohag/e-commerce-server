import httpStatus from 'http-status';
import ApiError from '../errors/ApiError';

import { imageDeleteToAwsS3, imageUploadToAwsS3 } from '../shared/awsS3';
import { getUniqueKey } from '../shared/getUniqueKey';
import { IFile } from '../interfaces';
import { arraysAreEqual } from '../shared/compareArrays';

// image upload to S3 bucket for making
const imageUploadToS3Bucket = async (
  prefix: string,
  imageName: string,
  file: Buffer
) => {
  // get unique random unique id
  const uniqueId = getUniqueKey(prefix);

  // upload image to aws s3 bucket
  const uploadedImageURL = (await imageUploadToAwsS3(
    `${imageName}-image-${uniqueId}.jpg`,
    file
  )) as { Location: string };
  
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

  // old image file delete
  if (uploadedImageURL) {
    await imageDeleteToAwsS3(
      imageURLArrayObject[imageURLArrayObject.length - 1]
    );
  }

  return uploadedImageURL?.Location;
};

// image upload to S3 bucket for updating
const imageUploadsToS3BucketForUpdate__V2 = async (
  updatedImages: string[],
  oldImages: string[],
  imageFiles: IFile[] | null,
  imageName: string,
  uniqueName: string
): Promise<string[]> => {
  const isArrayEqual = arraysAreEqual(updatedImages, oldImages);

  const newImageUrls: string[] = [];

  if (!isArrayEqual) {
    const newRemovalImages = oldImages.filter(
      oldImage => !updatedImages.includes(oldImage)
    );

    newImageUrls.push(...updatedImages);

    // old image file delete
    if (newRemovalImages.length) {
      for (const img of newRemovalImages) {
        await imageDeleteToAwsS3(img[img.length - 1]);
      }
    }
  } else {
    newImageUrls.push(...updatedImages);
  }

  // upload image if image file has
  if (imageFiles?.length) {
    // upload image to aws s3 bucket
    for (const imgFile of imageFiles) {
      const imageURL = await imageUploadToS3Bucket(
        uniqueName,
        imageName,
        imgFile.buffer
      );
      newImageUrls.push(imageURL);
    }
  }
  return newImageUrls.length ? newImageUrls : [];
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
  let imageFile = null;

  if (files && imageFileName in files) {
    // check file of the image
    if (!files || !(imageFileName in files)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Please upload ${prefix} image file!`
      );
    }

    const filesData: { [key: string]: IFile[] } = files;
    const imageFileData = filesData[imageFileName]?.[0];

    // image file validation
    if (!imageFileData) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Please upload ${prefix} image file!`
      );
    }

    imageFile = imageFileData;
  }

  return imageFile;
};

// image file validate for updating
const imageFilesValidateForUpdate = async (
  files: { [key: string]: IFile[] },
  imageFileName: string,
  prefix: string
) => {
  let imageFiles = null;

  if (files && imageFileName in files) {
    // check file of the image
    if (!files || !(imageFileName in files)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Please upload ${prefix} image file!`
      );
    }

    const filesData: { [key: string]: IFile[] } = files;
    const imageFilesData = filesData[imageFileName];

    // image file validation
    if (!imageFilesData.length) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Please upload ${prefix} image file!`
      );
    }

    imageFiles = imageFilesData;
  }

  return imageFiles;
};

export const ImageUploadHelpers = {
  imageUploadToS3Bucket,
  imageUploadToS3BucketForUpdate,
  imageFileValidate,
  imageFileValidateForUpdate,
  imageFilesValidate,
  imageFilesValidateForUpdate,
  imageUploadsToS3BucketForUpdate__V2,
};
