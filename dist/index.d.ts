import React from 'react';
import { ImageInfo, Options } from './types';
interface UseImageUpload {
    (images?: Array<string>, selectedImage?: string, options?: Partial<Options>): {
        uploadImages: Array<ImageInfo>;
        uploadError?: string;
        mainImage: string;
        handleFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        handleMainImageChange: (event: React.MouseEvent<HTMLOrSVGElement, MouseEvent>, imageName: string) => void;
        handleImageDelete: (event: React.MouseEvent<HTMLOrSVGElement, MouseEvent>, imageName: string) => void;
        getAllFiles: () => Promise<Array<File>>;
        setImageError: (message: string) => void;
    };
}
declare type ImageError = 'EXCEED_FILE_NUMBER' | 'IMAGE_SIZE' | 'GENERAL' | 'NOT_CHOICE_MAIN_IMAGE' | 'REQUIRED' | 'DUPLICATE_FILENAME' | 'NONE';
export declare const ERROR: Record<ImageError, string>;
/**
 *
 * @param {Array<string>} images 이미 등록된 이미지들 url
 * @param {string} selectedImage 메인 이미지 url
 * @param {Option} options
 *
 */
declare const useImageUpload: UseImageUpload;
export default useImageUpload;
