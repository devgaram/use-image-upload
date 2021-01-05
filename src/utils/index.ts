import to from 'await-to-js';
import { ImageInfo } from '../types';

/**
 * 파일 이름 얻기
 * @param {string} url 파일 url
 * @returns {string} 파일 이름 (확장자 X)
 */
export const getFileName = (url: string): string =>
  url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));

/**
 * 파일의 base 64 얻기
 * @param {File} file
 */
const getBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
  });
};

/**
 * FileList -> Array<ImageInfo> 형태로 변경
 * @param {FileList} files
 */
export const getListFiles = async (files: FileList): Promise<Array<ImageInfo>> => {
  const promises: Array<Promise<string>> = [];

  for (let i = 0; i < files.length; i += 1) {
    promises.push(getBase64(files[i]));
  }

  const [error, result] = await to(Promise.all(promises));

  if (error) throw error;
  if (!result) throw new Error('no result');

  const fileList = result.map((base64, index) => {
    return {
      name: files[index].name,
      url: base64,
    } as ImageInfo;
  });

  return fileList;
};

/**
 * 이미지 크기 유효성 체크
 * @param {string} base64
 * @param {number} minW 최소 width
 * @param {number} minH 최소 height
 * @returns {boolean} true: 이미지 width, height가 기준에 충족
 */
const isSizeValid = (base64: string, minW: number, minH: number): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = base64;

    image.onload = () => resolve(image.width >= minW && image.height >= minH);

    image.onerror = reject;
  });
};

/**
 * 모든 이미지 사이즈 유효성 체크
 * @param {Array<ImageInfo>} fileList
 * @param {number} minW
 * @param {minH} minH
 * @returns {boolean} true: 모든 이미지 사이즈가 기준에 충족
 */
export const isFileSizeValid = async (
  fileList: Array<ImageInfo>,
  minW: number,
  minH: number,
): Promise<boolean> => {
  const promises = [];

  for (let i = 0; i < fileList.length; i += 1) {
    promises.push(isSizeValid(fileList[i].url, minW, minH));
  }

  const [error, result] = await to(Promise.all(promises));

  if (error) throw error;
  if (!result) throw new Error('no result');

  return !result.includes(false);
};

/**
 * 이미지 전송을 위해 ImageInfo -> File 로 변경
 * @param {ImageInfo}
 */
export const convertFile = async ({ name, url }: ImageInfo): Promise<File> => {
  const canvas = document.createElement('canvas');

  if (!canvas.getContext) throw new Error('canvas.getContext 없음');

  const ctx = canvas.getContext('2d');
  // TODO: 현재 이미지 수정은 안됨(이미 등록된 image url로 image.src를 하려면 onload 필요하나 onload 시 크로스오리진 문제 발생함)
  const image = new Image();
  image.src = url;

  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  ctx?.drawImage(image, 0, 0);

  const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve));

  if (!blob) throw new Error('blob is null');

  return new File([blob], name, {
    lastModified: new Date().getTime(),
    type: blob.type,
  });
};
