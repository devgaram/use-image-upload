export interface Options {
  // 업로드 가능한 최대 이미지 개수
  maxNumber: number;
  // 최소 이미지 width
  minWidth: number;
  // 최소 이미지 height
  minHeight: number;
}

export interface ImageInfo {
  // 파일 이름(확장자 X)
  name: string;
  // base64 또는 이미지 url
  url: string;
}
