"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Helpers = exports.Types = void 0;
var Types;
(function (Types) {
    class Type {
        constructor(identifier) {
            this.identifier = identifier;
            this.rules = [];
        }
        addRule(rule) {
            this.rules.push(rule);
        }
        add(self, rule) {
            this.rules.push(rule);
            return self;
        }
        getIdentifier() {
            return this.identifier;
        }
        /**
         * Tries to validate rules with an unknown Object
         * @param value Any
         * @returns
         */
        match(value) {
            // Check if value is valid, if not return
            if (typeof this.isValid(value) === undefined)
                return false;
            for (let rule of this.rules) {
                if (rule(value) == false)
                    return false;
            }
            return true;
        }
    }
    class String extends Type {
        constructor() {
            super('string');
        }
        isValid(value) {
            return value.toString();
        }
        /**
         * Defines a custom evaluation rule
         * @param pattern Reqular Expression
         * @returns
         */
        custom(rule) {
            return this.add(this, rule);
        }
        /**
         * Ensures value matches a given regex
         * @param pattern Reqular Expression
         * @returns
         */
        regex(pattern) {
            return this.add(this, (value) => {
                return new RegExp(pattern).test(value);
            });
        }
        /**
         * Ensures value matches a given string
         * @param s String
         * @returns
         */
        matches(s) {
            return this.add(this, (value) => {
                return s == value;
            });
        }
        /**
         * Ensures value contains given string
         * @param s String
         * @returns
         */
        contains(substring) {
            return this.add(this, (value) => {
                return value.includes(substring);
            });
        }
        /**
         * Ensures values contains character at index
         * @param char Character
         * @param index Number
         * @returns
         */
        charAt(char, index) {
            if (char.length == 0)
                return this;
            let c = char[0];
            return this.add(this, (value) => {
                if (index < 0)
                    index = value.length + index;
                return value[index] == c;
            });
        }
        /**
         * Ensures digit length is bigger or equal n
         * @param n Number
         * @returns
         */
        min(n) {
            return this.add(this, (value) => {
                return value.length >= n;
            });
        }
        /**
         * Ensures digit length is smaller or equal n
         * @param n Number
         * @returns
         */
        max(n) {
            return this.add(this, (value) => {
                return value.length <= n;
            });
        }
        /**
         * Ensures digit length is bigger than n
         * @param n Number
         * @returns
         */
        bigger(n) {
            return this.add(this, (value) => {
                return value.length > n;
            });
        }
        /**
         * Ensures digit length is smaller than n
         * @param n Number
         * @returns
         */
        smaller(n) {
            return this.add(this, (value) => {
                return value.length < n;
            });
        }
    }
    Types.String = String;
    class Number extends Type {
        constructor() {
            super('number');
        }
        isValid(value) {
            return Helpers.ToNumber(value);
        }
        /**
         * Defines a custom evaluation rule
         * @param pattern Reqular Expression
         * @returns
         */
        custom(rule) {
            return this.add(this, rule);
        }
        /**
         * Ensures value is bigger or equal n
         * @param n Number
         * @returns
         */
        min(n) {
            return this.add(this, (value) => {
                return value >= n;
            });
        }
        /**
         * Ensures value is smaller or equal n
         * @param n Number
         * @returns
         */
        max(n) {
            return this.add(this, (value) => {
                return value <= n;
            });
        }
        /**
         * Ensures value is smaller than n
         * @param n Number
         * @returns
         */
        smaller(n) {
            return this.add(this, (value) => {
                return value < n;
            });
        }
        /**
         * Ensures value is bigger than n
         * @param n Number
         * @returns
         */
        bigger(n) {
            return this.add(this, (value) => {
                return value > n;
            });
        }
        /**
         * Ensures value equals n
         * @param n Number
         * @returns
         */
        equals(n) {
            return this.add(this, (value) => {
                return value == n;
            });
        }
        /**
         * Ensures value is negative
         * @returns
         */
        negative() {
            return this.add(this, (value) => {
                return value < 0;
            });
        }
        /**
         * Ensures value is positive
         * @returns
         */
        positive() {
            return this.add(this, (value) => {
                return value > 0;
            });
        }
        /**
         * Checks number is n digits long
         * @param n Number
         * @returns
         */
        digits(n) {
            return this.add(this, (value) => {
                return value.toString().length == n;
            });
        }
    }
    Types.Number = Number;
    class Boolean extends Type {
        constructor() {
            super('number');
        }
        isValid(value) {
            return Helpers.ToBoolean(value);
        }
        /**
         * Defines a custom evaluation rule
         * @param pattern Reqular Expression
         * @returns
         */
        custom(rule) {
            return this.add(this, rule);
        }
    }
    Types.Boolean = Boolean;
    class Obj extends Type {
        constructor() {
            super('object');
        }
        isValid(value) {
            return value;
        }
        /**
         * Defines a custom evaluation rule
         * @param pattern Reqular Expression
         * @returns
         */
        custom(rule) {
            return this.add(this, rule);
        }
        matches(obj) {
            return this.add(this, (value) => {
                // create new object to prevent misuse
                //let newObject: any = {}
                for (let key of Object.keys(obj)) {
                    // Check if key of model obj exists on value
                    if (value[key] === undefined)
                        return false;
                    if (obj[key].match(value[key]) == false)
                        return false;
                    // copy value to new obj
                    //newObject[key] = value[key]
                }
                return true;
            });
        }
    }
    Types.Obj = Obj;
})(Types || (exports.Types = Types = {}));
var Helpers;
(function (Helpers) {
    Helpers.ToNumber = (value) => {
        let result = Number(value);
        if (Number.isNaN(result))
            return undefined;
        return result;
    };
    Helpers.ToBoolean = (value) => {
        let result = value == "true" || value == "false" || value == "0" || value == "1" || value == 0 || value == 1 || value == true || value == false;
        if (result == false)
            return undefined;
        return (value == "true" || value == "1" || value == 1);
    };
})(Helpers || (exports.Helpers = Helpers = {}));
