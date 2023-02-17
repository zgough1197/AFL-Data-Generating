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
exports.__esModule = true;
var types_1 = require("./types");
var genDataTypes_1 = require("./processing/genDataTypes");
var players_1 = require("./output/players");
var start = 1990, end = 2022;
var yb = {
    startYear: start,
    endYear: end
};
genDataTypes_1.getAllCareersBetween(start - 25, end).then(function (res) { return __awaiter(void 0, void 0, void 0, function () {
    var clubs, players, _i, clubs_1, c, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                clubs = res.clubs, players = res.players;
                clubs.sort(function (a, b) {
                    if (a.name > b.name)
                        return 1;
                    if (a.name < b.name)
                        return -1;
                    return 0;
                });
                _i = 0, clubs_1 = clubs;
                _a.label = 1;
            case 1:
                if (!(_i < clubs_1.length)) return [3 /*break*/, 6];
                c = clubs_1[_i];
                if (c.playerCareers.length === 0)
                    return [3 /*break*/, 5];
                if (c.name === types_1.CLUB.NONE)
                    console.error("Some clubs were not found from the data");
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                console.log("START: " + c.name);
                // await saveClubData(c)
                return [4 /*yield*/, savePlayerDataForClub(c)];
            case 3:
                // await saveClubData(c)
                _a.sent();
                console.log("SUCCESS: " + c.name);
                return [3 /*break*/, 5];
            case 4:
                e_1 = _a.sent();
                console.log("FAIL: " + c.name + " (reason: " + e_1 + ")");
                return [3 /*break*/, 5];
            case 5:
                _i++;
                return [3 /*break*/, 1];
            case 6: return [2 /*return*/];
        }
    });
}); });
var savePlayerDataForClub = function (club) { return __awaiter(void 0, void 0, Promise, function () {
    var players, _i, _a, s;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                players = club.playerCareers;
                // Numbers
                return [4 /*yield*/, players_1["default"].byNumbers.all(players, club.name, yb)];
            case 1:
                // Numbers
                _b.sent();
                return [4 /*yield*/, players_1["default"].byNumbers.byYear(players, club.name, yb)];
            case 2:
                _b.sent();
                return [4 /*yield*/, players_1["default"].byNumbers.byYearSplit(players, club.name, yb)
                    // Stats
                ];
            case 3:
                _b.sent();
                _i = 0, _a = Object.values(types_1.STAT);
                _b.label = 4;
            case 4:
                if (!(_i < _a.length)) return [3 /*break*/, 8];
                s = _a[_i];
                return [4 /*yield*/, players_1["default"].byStats.top50(s, players, club.name, yb)];
            case 5:
                _b.sent();
                return [4 /*yield*/, players_1["default"].byStats.top10ByYear(s, players, club.name, yb)];
            case 6:
                _b.sent();
                _b.label = 7;
            case 7:
                _i++;
                return [3 /*break*/, 4];
            case 8: return [2 /*return*/];
        }
    });
}); };
var saveClubData = function (club) { return __awaiter(void 0, void 0, Promise, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/];
    });
}); };
