import { Injectable, NotFoundException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v4 as uuidv4 } from 'uuid';
import {
  MulterOptionsFactory,
  MulterModuleOptions,
} from '@nestjs/platform-express';

@Injectable()
export class ImageService implements MulterOptionsFactory {
  private readonly storage: CloudinaryStorage;

  constructor() {
    this.storage = new CloudinaryStorage({
      cloudinary,
      params: {
        public_id: () => uuidv4(),
      },
    });
  }

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: this.storage,
    };
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      if (!file) {
        throw new NotFoundException(`Invalid Image`);
      }
      const result = await cloudinary.uploader.upload(file.path);
      const publicUrl = result.secure_url;
      return publicUrl;
    } catch (error) {
      throw error;
    }
  }
}
