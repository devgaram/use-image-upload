import { ImageInfo } from '../types';
/**
 * 파일 이름 얻기
 * @param {string} url 파일 url
 * @returns {string} 파일 이름 (확장자 X)
 */
export declare const getFileName: (url: string) => string;
/**
 * FileList -> Array<ImageInfo> 형태로 변경
 * @param {FileList} files
 */
export declare const getListFiles: (files: FileList) => Promise<Array<ImageInfo>>;
/**
 * 모든 이미지 사이즈 유효성 체크
 * @param {Array<ImageInfo>} fileList
 * @param {number} minW
 * @param {minH} minH
 * @returns {boolean} true: 모든 이미지 사이즈가 기준에 충족
 */
export declare const isFileSizeValid: (fileList: Array<ImageInfo>, minW: number, minH: number) => Promise<boolean>;
/**
 * 이미지 전송을 위해 ImageInfo -> File 로 변경
 * @param {ImageInfo}
 */
export declare const convertFile: ({ name, url }: ImageInfo) => Promise<File>;
