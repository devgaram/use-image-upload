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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertFile = exports.isFileSizeValid = exports.getListFiles = exports.getFileName = void 0;
var await_to_js_1 = __importDefault(require("await-to-js"));
/**
 * 파일 이름 얻기
 * @param {string} url 파일 url
 * @returns {string} 파일 이름 (확장자 X)
 */
var getFileName = function (url) {
    return url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
};
exports.getFileName = getFileName;
/**
 * 파일의 base 64 얻기
 * @param {File} file
 */
var getBase64 = function (file) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () { return resolve(String(reader.result)); };
        reader.onerror = reject;
    });
};
/**
 * FileList -> Array<ImageInfo> 형태로 변경
 * @param {FileList} files
 */
var getListFiles = function (files) { return __awaiter(void 0, void 0, void 0, function () {
    var promises, i, _a, error, result, fileList;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                promises = [];
                for (i = 0; i < files.length; i += 1) {
                    promises.push(getBase64(files[i]));
                }
                return [4 /*yield*/, await_to_js_1.default(Promise.all(promises))];
            case 1:
                _a = _b.sent(), error = _a[0], result = _a[1];
                if (error)
                    throw error;
                if (!result)
                    throw new Error('no result');
                fileList = result.map(function (base64, index) {
                    return {
                        name: files[index].name,
                        url: base64,
                    };
                });
                return [2 /*return*/, fileList];
        }
    });
}); };
exports.getListFiles = getListFiles;
/**
 * 이미지 크기 유효성 체크
 * @param {string} base64
 * @param {number} minW 최소 width
 * @param {number} minH 최소 height
 * @returns {boolean} true: 이미지 width, height가 기준에 충족
 */
var isSizeValid = function (base64, minW, minH) {
    return new Promise(function (resolve, reject) {
        var image = new Image();
        image.src = base64;
        image.onload = function () { return resolve(image.width >= minW && image.height >= minH); };
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
var isFileSizeValid = function (fileList, minW, minH) { return __awaiter(void 0, void 0, void 0, function () {
    var promises, i, _a, error, result;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                promises = [];
                for (i = 0; i < fileList.length; i += 1) {
                    promises.push(isSizeValid(fileList[i].url, minW, minH));
                }
                return [4 /*yield*/, await_to_js_1.default(Promise.all(promises))];
            case 1:
                _a = _b.sent(), error = _a[0], result = _a[1];
                if (error)
                    throw error;
                if (!result)
                    throw new Error('no result');
                return [2 /*return*/, !result.includes(false)];
        }
    });
}); };
exports.isFileSizeValid = isFileSizeValid;
/**
 * 이미지 전송을 위해 ImageInfo -> File 로 변경
 * @param {ImageInfo}
 */
var convertFile = function (_a) {
    var name = _a.name, url = _a.url;
    return __awaiter(void 0, void 0, void 0, function () {
        var canvas, ctx, image, blob;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    canvas = document.createElement('canvas');
                    if (!canvas.getContext)
                        throw new Error('canvas.getContext 없음');
                    ctx = canvas.getContext('2d');
                    image = new Image();
                    image.src = url;
                    canvas.width = image.naturalWidth;
                    canvas.height = image.naturalHeight;
                    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(image, 0, 0);
                    return [4 /*yield*/, new Promise(function (resolve) { return canvas.toBlob(resolve); })];
                case 1:
                    blob = _b.sent();
                    if (!blob)
                        throw new Error('blob is null');
                    return [2 /*return*/, new File([blob], name, {
                            lastModified: new Date().getTime(),
                            type: blob.type,
                        })];
            }
        });
    });
};
exports.convertFile = convertFile;
