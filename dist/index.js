"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR = void 0;
var react_1 = require("react");
var await_to_js_1 = __importDefault(require("await-to-js"));
var lodash_1 = require("lodash");
var utils_1 = require("./utils");
// options 기본 값
var DEFAULT_OPTIONS = {
    maxNumber: 3,
    minWidth: 170,
    minHeight: 170,
};
// TODO: 영문 체크
// 에러 메시지
exports.ERROR = {
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
var useImageUpload = function (images, selectedImage, options) {
    var _a = options || {}, _b = _a.maxNumber, maxNumber = _b === void 0 ? DEFAULT_OPTIONS.maxNumber : _b, _c = _a.minWidth, minWidth = _c === void 0 ? DEFAULT_OPTIONS.minWidth : _c, _d = _a.minHeight, minHeight = _d === void 0 ? DEFAULT_OPTIONS.minHeight : _d;
    var _e = react_1.useState([]), uploadImages = _e[0], setUploadImages = _e[1];
    var _f = react_1.useState(''), mainImage = _f[0], setMainImage = _f[1];
    var _g = react_1.useState(), uploadError = _g[0], setUploadError = _g[1];
    react_1.useEffect(function () {
        if (!images)
            return;
        setUploadImages(images.map(function (url) {
            return {
                name: utils_1.getFileName(url),
                url: url,
            };
        }));
    }, [images]);
    react_1.useEffect(function () {
        if (selectedImage)
            setMainImage(utils_1.getFileName(selectedImage));
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
    var handleFileInputChange = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var files, fileNames, uploadedFiles, diff, _a, error, fileList, _b, validError, isSizeValid;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    files = e.target.files;
                    if (!files)
                        return [2 /*return*/];
                    // 1)
                    if (uploadImages.length + files.length > maxNumber) {
                        setUploadError(exports.ERROR.EXCEED_FILE_NUMBER);
                        return [2 /*return*/];
                    }
                    fileNames = Array.from(files).map(function (_a) {
                        var name = _a.name;
                        return name;
                    });
                    uploadedFiles = lodash_1.map(uploadImages, 'name');
                    diff = lodash_1.difference(fileNames, uploadedFiles);
                    if (diff.length < fileNames.length) {
                        setUploadError(exports.ERROR.DUPLICATE_FILENAME);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, await_to_js_1.default(utils_1.getListFiles(files))];
                case 1:
                    _a = _c.sent(), error = _a[0], fileList = _a[1];
                    if (error)
                        throw error;
                    if (!fileList) {
                        setUploadError(exports.ERROR.GENERAL);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, await_to_js_1.default(utils_1.isFileSizeValid(fileList, minWidth, minHeight))];
                case 2:
                    _b = _c.sent(), validError = _b[0], isSizeValid = _b[1];
                    if (validError)
                        throw validError;
                    if (!isSizeValid) {
                        setUploadError(exports.ERROR.IMAGE_SIZE);
                        return [2 /*return*/];
                    }
                    // 5)
                    setUploadError(mainImage ? exports.ERROR.NONE : exports.ERROR.NOT_CHOICE_MAIN_IMAGE);
                    setUploadImages(function (prev) { return __spreadArrays(prev, fileList); });
                    return [2 /*return*/];
            }
        });
    }); };
    /**
     * 메인 이미지 변경
     * @param event onClick 이벤트 객체
     * @param imageName 파일명
     */
    var handleMainImageChange = function (event, imageName) {
        setUploadError(exports.ERROR.NONE);
        setMainImage(imageName);
        event.stopPropagation();
    };
    var handleImageDelete = function (event, imageName) {
        var isMainImage = imageName === mainImage;
        var isLastImage = uploadImages.length === 1;
        if (isMainImage)
            setMainImage('');
        if (isLastImage)
            setUploadError(exports.ERROR.REQUIRED);
        else if (isMainImage)
            setUploadError(exports.ERROR.NOT_CHOICE_MAIN_IMAGE);
        else
            setUploadError(exports.ERROR.NONE);
        setUploadImages(function (prev) { return prev.filter(function (img) { return img.name !== imageName; }); });
        event.stopPropagation();
    };
    /**
     * file upload 를 위해 현재까지 모든 이미지 -> File 형태로 변경 후 반환
     */
    var getAllFiles = function () { return __awaiter(void 0, void 0, void 0, function () {
        var files;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all(uploadImages.map(function (image) {
                        return utils_1.convertFile(image);
                    }))];
                case 1:
                    files = _a.sent();
                    return [2 /*return*/, files];
            }
        });
    }); };
    var setImageError = function (error) {
        if (typeof error === 'string')
            setUploadError(error);
        else
            setUploadError(exports.ERROR[error]);
    };
    return {
        uploadImages: uploadImages,
        uploadError: uploadError,
        mainImage: mainImage,
        handleFileInputChange: handleFileInputChange,
        handleMainImageChange: handleMainImageChange,
        handleImageDelete: handleImageDelete,
        getAllFiles: getAllFiles,
        setImageError: setImageError,
    };
};
exports.default = useImageUpload;
