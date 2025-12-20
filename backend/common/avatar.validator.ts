import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsValidAvatar', async: false })
export class IsValidAvatarConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    if (!value) return true;

    // URL
    if (typeof value === 'string' && value.startsWith('http')) {
      return true;
    }

    // Base64 image
    if (typeof value === 'string' && value.startsWith('data:image/')) {
      return true;
    }

    // Multer file
    if (value?.mimetype?.startsWith('image/')) {
      return true;
    }

    return false;
  }

  defaultMessage(): string {
    return 'Avatar must be an image URL, base64 image, or image file';
  }
}
