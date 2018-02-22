"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
var core_1 = require("@domain-schema/core");
var debug_1 = require("debug");
var humps_1 = require("humps");
var debug = debug_1["default"]('@domain-schema/knex');
var DomainKnex = /** @class */ (function () {
    function DomainKnex(knex) {
        var _this = this;
        this.selectBy = function (schema, fields) {
            var domainSchema = new core_1["default"](schema);
            // form table name
            var tableName = humps_1.decamelize(domainSchema.__.name);
            // select fields
            var parentPath = [];
            var selectItems = [];
            var joinNames = [];
            _this._getSelectFields(fields, parentPath, domainSchema, selectItems, joinNames, []);
            debug('Select items:', selectItems);
            debug('Join on tables:', joinNames);
            return function (query) {
                // join table names
                joinNames.map(function (joinName) {
                    query.leftJoin(joinName, joinName + "." + tableName + "_id", tableName + ".id");
                });
                return query.select(selectItems);
            };
        };
        this.knex = knex;
    }
    DomainKnex.prototype.createTables = function (schema) {
        var domainSchema = new core_1["default"](schema);
        if (domainSchema.__.transient) {
            throw new Error("Unable to create tables for transient schema: " + domainSchema.__.name);
        }
        return this._createTables(null, domainSchema, []);
    };
    DomainKnex.prototype.dropTables = function (schema) {
        var _this = this;
        var domainSchema = new core_1["default"](schema);
        var tableNames = this._getTableNames(domainSchema, []);
        debug('Dropping tables:', tableNames);
        return Promise.all(tableNames.map(function (name) { return _this.knex.schema.dropTable(name); }));
    };
    DomainKnex._addColumn = function (tableName, table, key, value) {
        var columnName = humps_1.decamelize(key);
        var column;
        var type = value.type.constructor === Array ? value.type[0] : value.type;
        var hasTypeOf = function (targetType) { return type === targetType || type.prototype instanceof targetType; };
        if (hasTypeOf(Boolean)) {
            column = table.boolean(columnName);
        }
        else if (hasTypeOf(core_1["default"].Int)) {
            column = table.integer(columnName);
        }
        else if (hasTypeOf(core_1["default"].Float)) {
            column = table.float(columnName);
        }
        else if (hasTypeOf(String)) {
            column = table.string(columnName, value.max || undefined);
        }
        else if (hasTypeOf(Date)) {
            column = table.dateTime(columnName);
        }
        else {
            throw new Error("Don't know how to handle type " + type.__.name + " of " + tableName + "." + columnName);
        }
        if (value.unique) {
            column.unique();
        }
        if (!value.optional) {
            column.notNullable();
        }
        if (value["default"] !== undefined) {
            column.defaultTo(value["default"]);
        }
    };
    DomainKnex.prototype._createTables = function (parentTableName, schema, seen) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var domainSchema, tableName;
            return __generator(this, function (_a) {
                if (seen.indexOf(schema.__.name) >= 0) {
                    return [2 /*return*/, Promise.resolve(null)];
                }
                seen.push(schema.__.name);
                domainSchema = new core_1["default"](schema);
                tableName = humps_1.decamelize(domainSchema.__.name);
                return [2 /*return*/, this.knex.schema.createTable(tableName, function (table) {
                        if (parentTableName) {
                            table
                                .integer(parentTableName + "_id")
                                .unsigned()
                                .references('id')
                                .inTable(parentTableName)
                                .onDelete('CASCADE');
                            debug("Foreign key " + tableName + " -> " + parentTableName + "." + parentTableName + "_id");
                        }
                        table.increments('id');
                        table.timestamps(false, true);
                        var promises = [];
                        for (var _i = 0, _a = domainSchema.keys(); _i < _a.length; _i++) {
                            var key = _a[_i];
                            var column = humps_1.decamelize(key);
                            var value = domainSchema.values[key];
                            var type = value.type.constructor === Array ? value.type[0] : value.type;
                            if (type.isSchema) {
                                var hostTableName = domainSchema.__.transient ? parentTableName : tableName;
                                var newPromise = _this._createTables(hostTableName, type, seen);
                                promises.push(newPromise);
                                debug("Schema key: " + tableName + "." + column + " -> " + type.__.name);
                            }
                            else if (!value.transient && key !== 'id') {
                                DomainKnex._addColumn(tableName, table, key, value);
                                debug("Scalar key: " + tableName + "." + column + " -> " + domainSchema.__.name);
                            }
                        }
                        return Promise.all(promises);
                    })];
            });
        });
    };
    DomainKnex.prototype._getTableNames = function (domainSchema, seen) {
        if (seen.indexOf(domainSchema.__.name) >= 0) {
            return [];
        }
        seen.push(domainSchema.__.name);
        var tableName = humps_1.decamelize(domainSchema.__.name);
        var tableNames = [];
        if (domainSchema.__.transient) {
            tableNames.push(tableName);
        }
        for (var _i = 0, _a = domainSchema.keys(); _i < _a.length; _i++) {
            var key = _a[_i];
            var value = domainSchema.values[key];
            var type = value.type.constructor === Array ? value.type[0] : value.type;
            if (type.isSchema) {
                tableNames = tableNames.concat(this._getTableNames(type, seen));
            }
        }
        return tableNames;
    };
    DomainKnex.prototype._getSelectFields = function (fields, parentPath, domainSchema, selectItems, joinNames, seen) {
        if (seen.indexOf(domainSchema.__.name) >= 0) {
            return;
        }
        seen.push(domainSchema.__.name);
        for (var _i = 0, _a = Object.keys(fields); _i < _a.length; _i++) {
            var key = _a[_i];
            if (key !== '__typename') {
                var value = domainSchema.values[key];
                if (fields[key] === true) {
                    if (!value.transient) {
                        var as = parentPath.length > 0 ? parentPath.join('_') + "_" + key : key;
                        selectItems.push(humps_1.decamelize(domainSchema.__.name) + "." + humps_1.decamelize(key) + " as " + as);
                    }
                }
                else {
                    var type = value.type.constructor === Array ? value.type[0] : value.type;
                    if (!type.__.transient) {
                        joinNames.push(humps_1.decamelize(type.__.name));
                    }
                    parentPath.push(key);
                    this._getSelectFields(fields[key], parentPath, type, selectItems, joinNames, seen);
                    parentPath.pop();
                }
            }
        }
    };
    return DomainKnex;
}());
exports["default"] = DomainKnex;
