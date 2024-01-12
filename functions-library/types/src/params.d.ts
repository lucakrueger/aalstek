export declare namespace Types {
    abstract class Type {
        private identifier;
        private rules;
        constructor(identifier: string);
        abstract isValid(value: any): any | undefined;
        abstract custom(rule: (value: any) => boolean): any;
        protected addRule(rule: (value: any) => boolean): void;
        protected add(self: any, rule: (value: any) => boolean): any;
        getIdentifier(): string;
        /**
         * Tries to validate rules with an unknown Object
         * @param value Any
         * @returns
         */
        match(value: any): boolean;
    }
    export class String extends Type {
        constructor();
        isValid(value: any): any | undefined;
        /**
         * Defines a custom evaluation rule
         * @param pattern Reqular Expression
         * @returns
         */
        custom(rule: (value: string) => boolean): Types.String;
        /**
         * Ensures value matches a given regex
         * @param pattern Reqular Expression
         * @returns
         */
        regex(pattern: string): Types.String;
        /**
         * Ensures value matches a given string
         * @param s String
         * @returns
         */
        matches(s: string): Types.String;
        /**
         * Ensures value contains given string
         * @param s String
         * @returns
         */
        contains(substring: string): Types.String;
        /**
         * Ensures values contains character at index
         * @param char Character
         * @param index Number
         * @returns
         */
        charAt(char: string, index: number): Types.String;
        /**
         * Ensures digit length is bigger or equal n
         * @param n Number
         * @returns
         */
        min(n: number): Types.String;
        /**
         * Ensures digit length is smaller or equal n
         * @param n Number
         * @returns
         */
        max(n: number): Types.String;
        /**
         * Ensures digit length is bigger than n
         * @param n Number
         * @returns
         */
        bigger(n: number): Types.String;
        /**
         * Ensures digit length is smaller than n
         * @param n Number
         * @returns
         */
        smaller(n: number): Types.String;
    }
    export class Number extends Type {
        constructor();
        isValid(value: any): any | undefined;
        /**
         * Defines a custom evaluation rule
         * @param pattern Reqular Expression
         * @returns
         */
        custom(rule: (value: string) => boolean): Types.String;
        /**
         * Ensures value is bigger or equal n
         * @param n Number
         * @returns
         */
        min(n: number): Types.Number;
        /**
         * Ensures value is smaller or equal n
         * @param n Number
         * @returns
         */
        max(n: number): Types.Number;
        /**
         * Ensures value is smaller than n
         * @param n Number
         * @returns
         */
        smaller(n: number): Types.Number;
        /**
         * Ensures value is bigger than n
         * @param n Number
         * @returns
         */
        bigger(n: number): Types.Number;
        /**
         * Ensures value equals n
         * @param n Number
         * @returns
         */
        equals(n: number): Types.Number;
        /**
         * Ensures value is negative
         * @returns
         */
        negative(): Types.Number;
        /**
         * Ensures value is positive
         * @returns
         */
        positive(): Types.Number;
        /**
         * Checks number is n digits long
         * @param n Number
         * @returns
         */
        digits(n: number): Types.Number;
    }
    export class Boolean extends Type {
        constructor();
        isValid(value: any): any | undefined;
        /**
         * Defines a custom evaluation rule
         * @param pattern Reqular Expression
         * @returns
         */
        custom(rule: (value: string) => boolean): Types.Boolean;
    }
    export class Obj extends Type {
        constructor();
        isValid(value: any): any | undefined;
        /**
         * Defines a custom evaluation rule
         * @param pattern Reqular Expression
         * @returns
         */
        custom(rule: (value: string) => boolean): Types.Obj;
        matches(obj: any): Types.Obj;
    }
    export {};
}
export declare namespace Helpers {
    const ToNumber: (value: any) => number | undefined;
    const ToBoolean: (value: any) => boolean | undefined;
}
