import React, { useEffect, useState } from 'react';

import to from 'await-to-js';
import { difference, map } from 'lodash';
import { ImageInfo, Options } from './types';
import { convertFile, getFileName, getListFiles, isFileSizeValid } from './utils';

interface UseImageUpload {
  (images?: Array<string>, selectedImage?: string, options?: Partial<Options>): {
    // 업로드할 이미지들
    uploadImages: Array<ImageInfo>;
    // 업로드 중 발생한 에러 메시지
    uploadError?: string;
    // 메인 이미지 파일 이름(확장자 X)
    mainImage: string;
    // input file의 onChange 이벤트 핸들러
    handleFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    // 메인 이미지 변경 onClick 이벤트 핸들러
    handleMainImageChange: (
      event: React.MouseEvent<HTMLOrSVGElement, MouseEvent>,
      imageName: string,
    ) => void;
    // 이미지 삭제 onClick 이벤트 핸들러
    handleImageDelete: (
      event: React.MouseEvent<HTMLOrSVGElement, MouseEvent>,
      imageName: string,
    ) => void;
    // 모든 이미지 -> 파일로 변경 후 반환
    getAllFiles: () => Promise<Array<File>>;
    // 에러 메시지 변경
    setImageError: (message: string) => void;
  };
}

// 에러 코드
type ImageError =
  | 'EXCEED_FILE_NUMBER'
  | 'IMAGE_SIZE'
  | 'GENERAL'
  | 'NOT_CHOICE_MAIN_IMAGE'
  | 'REQUIRED'
  | 'DUPLICATE_FILENAME'
  | 'NONE';

// options 기본 값
const DEFAULT_OPTIONS: Options = {
  maxNumber: 3,
  minWidth: 170,
  minHeight: 170,
};

// TODO: 영문 체크
// 에러 메시지
export const ERROR: Record<ImageError, string> = {
  EXCEED_FILE_NUMBER: 'The number of images you can registered is at maximum.',
  IMAGE_SIZE: 'The minimum size of an image is 170 X 170 pixels.',
  GENERAL: 'ERROR',
  NOT_CHOICE_MAIN_IMAGE: 'Please select a default image.',
  REQUIRED: 'You must register an image at least.',
  DUPLICATE_FILENAME: 'An image with the same name was already registered.',
  NONE: '',
};

/**
 *
 * @param {Array<string>} images 이미 등록된 이미지들 url
 * @param {string} selectedImage 메인 이미지 url
 * @param {Option} options
 *
 */
const useImageUpload: UseImageUpload = (images, selectedImage, options) => {
  const {
    maxNumber = DEFAULT_OPTIONS.maxNumber,
    minWidth = DEFAULT_OPTIONS.minWidth,
    minHeight = DEFAULT_OPTIONS.minHeight,
  } = options || {};

  const [uploadImages, setUploadImages] = useState<Array<ImageInfo>>([]);
  const [mainImage, setMainImage] = useState<string>('');
  const [uploadError, setUploadError] = useState<string>();

  useEffect(() => {
    if (!images) return;

    setUploadImages(
      images.map((url: string) => {
        return {
          name: getFileName(url),
          url,
        } as ImageInfo;
      }),
    );
  }, [images]);

  useEffect(() => {
    if (selectedImage) setMainImage(getFileName(selectedImage));
  }, [selectedImage]);

  /**
   * input file의 onChange 이벤트 핸들러
   *
   * 프로세스
   * 1) 업로드 가능한 최대 이미지 개수 초과 여부 -> 초과 시 에러
   * 2) 이름 중복 체크
   * 3) 업로드할 파일 -> ImageInfo 형태로 변경(이미지 미리보기, width & height 체크 위해서)
   * 4) 이미지 width, height가 최소 기준보다 작으면 에러
   * 5) uploadImages 상태 업데이트
   */
  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (!files) return;

    // 1)
    if (uploadImages.length + files.length > maxNumber) {
      setUploadError(ERROR.EXCEED_FILE_NUMBER);
      return;
    }

    // 2)
    const fileNames = Array.from(files).map(({ name }) => name);
    const uploadedFiles = map(uploadImages, 'name');
    const diff = difference(fileNames, uploadedFiles);

    if (diff.length < fileNames.length) {
      setUploadError(ERROR.DUPLICATE_FILENAME);
      return;
    }

    // 3)
    const [error, fileList] = await to(getListFiles(files));

    if (error) throw error;
    if (!fileList) {
      setUploadError(ERROR.GENERAL);
      return;
    }

    // 4)
    const [validError, isSizeValid] = await to(isFileSizeValid(fileList, minWidth, minHeight));

    if (validError) throw validError;
    if (!isSizeValid) {
      setUploadError(ERROR.IMAGE_SIZE);
      return;
    }

    // 5)
    setUploadError(mainImage ? ERROR.NONE : ERROR.NOT_CHOICE_MAIN_IMAGE);
    setUploadImages((prev) => [...prev, ...fileList]);
  };

  /**
   * 메인 이미지 변경
   * @param event onClick 이벤트 객체
   * @param imageName 파일명
   */
  const handleMainImageChange = (
    event: React.MouseEvent<HTMLOrSVGElement, MouseEvent>,
    imageName: string,
  ) => {
    setUploadError(ERROR.NONE);
    setMainImage(imageName);
    event.stopPropagation();
  };

  const handleImageDelete = (
    event: React.MouseEvent<HTMLOrSVGElement, MouseEvent>,
    imageName: string,
  ) => {
    const isMainImage = imageName === mainImage;
    const isLastImage = uploadImages.length === 1;

    if (isMainImage) setMainImage('');
    if (isLastImage) setUploadError(ERROR.REQUIRED);
    else if (isMainImage) setUploadError(ERROR.NOT_CHOICE_MAIN_IMAGE);
    else setUploadError(ERROR.NONE);

    setUploadImages((prev) => prev.filter((img) => img.name !== imageName));
    event.stopPropagation();
  };

  /**
   * file upload 를 위해 현재까지 모든 이미지 -> File 형태로 변경 후 반환
   */
  const getAllFiles = async () => {
    const files = await Promise.all(
      uploadImages.map((image) => {
        return convertFile(image);
      }),
    );

    return files;
  };

  const setImageError = (error: ImageError | string) => {
    if (typeof error === 'string') setUploadError(error);
    else setUploadError(ERROR[error as ImageError]);
  };

  return {
    uploadImages,
    uploadError,
    mainImage,
    handleFileInputChange,
    handleMainImageChange,
    handleImageDelete,
    getAllFiles,
    setImageError,
  };
};

export default useImageUpload;
