import { BadRequestException } from '@nestjs/common';
import {
  IsNotEmpty,
  IsString,
  validate,
  ValidationError,
} from 'class-validator';
import imageSize from 'image-size';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  categoryImage: string;

  // Custom validator for image format
  async isValidImageFormat(): Promise<boolean> {
    const buffer = Buffer.from(this.categoryImage, 'base64');

    try {
      const dimensions = imageSize(buffer);
      // Check if it's in JPG, PNG, or WEBP format
      const allowedFormats = ['jpg', 'jpeg', 'png', 'webp'];
      return allowedFormats.includes(dimensions.type.toLowerCase());
    } catch (error) {
      return false;
    }
  }

  // custom validator for base64 content
  async isValidBase64Content(): Promise<boolean> {
    const buffer = Buffer.from(this.categoryImage, 'base64');
    return !isNaN(buffer.length);
  }

  // validate the entire DTO
  async validate(): Promise<void> {
    const errors: ValidationError[] = await validate(this);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    if (!(await this.isValidImageFormat())) {
      throw new BadRequestException(
        'Image must be in JPG, PNG, or WEBP format',
      );
    }

    if (!(await this.isValidBase64Content())) {
      throw new BadRequestException('Invalid base64 content');
    }
  }
}
