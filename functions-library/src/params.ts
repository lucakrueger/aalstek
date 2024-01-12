export namespace Types {
    abstract class Type {
        private rules: ((value: any) => boolean)[] = []
    
        constructor(private identifier: string) {}
    
        abstract isValid(value: any): any | undefined

        abstract custom(rule: (value: any) => boolean): any

        protected addRule(rule: (value: any) => boolean) {
            this.rules.push(rule)
        }

        protected add(self: any, rule: (value: any) => boolean) {
            this.rules.push(rule)
            return self
        }
    
        public getIdentifier(): string {
            return this.identifier
        }
        
        /**
         * Tries to validate rules with an unknown Object
         * @param value Any
         * @returns 
         */
        public match(value: any): boolean {
    
            // Check if value is valid, if not return
            if(typeof this.isValid(value) === undefined) return false
    
            for(let rule of this.rules) {
                if(rule(value) == false) return false
            }
    
            return true
        }

    }
    
    export class String extends Type {
        constructor() {
            super('string')
        }
    
        public isValid(value: any): any | undefined {
            return value.toString()
        }

        /**
         * Defines a custom evaluation rule
         * @param pattern Reqular Expression
         * @returns 
         */
        public custom(rule: (value: string) => boolean): Types.String {
            return this.add(this, rule)
        }
    
        /**
         * Ensures value matches a given regex
         * @param pattern Reqular Expression
         * @returns 
         */
        public regex(pattern: string): Types.String {
            return this.add(this, (value: string): boolean => {
                return new RegExp(pattern).test(value)
            })
        }

        /**
         * Ensures value matches a given string
         * @param s String
         * @returns 
         */
        public matches(s: string): Types.String {
            return this.add(this, (value: string): boolean => {
                return s == value
            })
        }

        /**
         * Ensures value contains given string
         * @param s String
         * @returns 
         */
        public contains(substring: string): Types.String {
            return this.add(this, (value: string): boolean => {
                return value.includes(substring)
            })
        }
        
        /**
         * Ensures values contains character at index
         * @param char Character
         * @param index Number
         * @returns 
         */
        public charAt(char: string, index: number): Types.String {
            if(char.length == 0) return this
            let c = char[0]

            return this.add(this, (value: string): boolean => {
                if(index < 0) index = value.length + index
                return value[index] == c
            })
        }

        /**
         * Ensures digit length is bigger or equal n
         * @param n Number
         * @returns 
         */
        public min(n: number): Types.String {
            return this.add(this, (value: string): boolean => {
                return value.length >= n
            })
        }

        /**
         * Ensures digit length is smaller or equal n
         * @param n Number
         * @returns 
         */
        public max(n: number): Types.String {
            return this.add(this, (value: string): boolean => {
                return value.length <= n
            })
        }

        /**
         * Ensures digit length is bigger than n
         * @param n Number
         * @returns 
         */
        public bigger(n: number): Types.String {
            return this.add(this, (value: string): boolean => {
                return value.length > n
            })
        }

        /**
         * Ensures digit length is smaller than n
         * @param n Number
         * @returns 
         */
        public smaller(n: number): Types.String {
            return this.add(this, (value: string): boolean => {
                return value.length < n
            })
        }
    }
    
    export class Number extends Type {
        constructor() {
            super('number')
        }
    
        public isValid(value: any): any | undefined {
            return Helpers.ToNumber(value)
        }

        /**
         * Defines a custom evaluation rule
         * @param pattern Reqular Expression
         * @returns 
         */
        public custom(rule: (value: string) => boolean): Types.String {
            return this.add(this, rule)
        }
        
        /**
         * Ensures value is bigger or equal n
         * @param n Number
         * @returns 
         */
        public min(n: number): Types.Number {
            return this.add(this, (value: number): boolean => {
                return value >= n
            })
        }
        
        /**
         * Ensures value is smaller or equal n
         * @param n Number
         * @returns 
         */
        public max(n: number): Types.Number {
            return this.add(this, (value: number): boolean => {
                return value <= n
            })
        }
        
        /**
         * Ensures value is smaller than n
         * @param n Number
         * @returns 
         */
        public smaller(n: number): Types.Number {
            return this.add(this, (value: number): boolean => {
                return value < n
            })
        }
        
        /**
         * Ensures value is bigger than n
         * @param n Number
         * @returns 
         */
        public bigger(n: number): Types.Number {
            return this.add(this, (value: number): boolean => {
                return value > n
            })
        }
        
        /**
         * Ensures value equals n
         * @param n Number
         * @returns 
         */
        public equals(n: number): Types.Number {
            return this.add(this, (value: number): boolean => {
                return value == n
            })
        }
        
        /**
         * Ensures value is negative
         * @returns 
         */
        public negative(): Types.Number {
            return this.add(this, (value: number): boolean => {
                return value < 0
            })
        }
        
        /**
         * Ensures value is positive
         * @returns 
         */
        public positive(): Types.Number {
            return this.add(this, (value: number): boolean => {
                return value > 0
            })
        }
        
        /**
         * Checks number is n digits long
         * @param n Number
         * @returns 
         */
        public digits(n: number): Types.Number {
            return this.add(this, (value: number): boolean => {
                return value.toString().length == n
            })
        }
    }

    export class Boolean extends Type {
        constructor() {
            super('number')
        }
    
        public isValid(value: any): any | undefined {
            return Helpers.ToBoolean(value)
        }

        /**
         * Defines a custom evaluation rule
         * @param pattern Reqular Expression
         * @returns 
         */
        public custom(rule: (value: string) => boolean): Types.Boolean {
            return this.add(this, rule)
        }
    }

    export class Obj extends Type {
        constructor() {
            super('object')
        }
    
        public isValid(value: any): any | undefined {
            return value
        }

        /**
         * Defines a custom evaluation rule
         * @param pattern Reqular Expression
         * @returns 
         */
        public custom(rule: (value: string) => boolean): Types.Obj {
            return this.add(this, rule)
        }

        public matches(obj: any): Types.Obj {
            return this.add(this, (value: any): boolean => {
                // create new object to prevent misuse
                //let newObject: any = {}

                for(let key of Object.keys(obj)) {
                    // Check if key of model obj exists on value
                    if(value[key] === undefined) return false
                    
                    if(obj[key].match(value[key]) == false) return false

                    // copy value to new obj
                    //newObject[key] = value[key]
                }

                return true
            })
        }
    }
}

export namespace Helpers {
    export const ToNumber = (value: any): number | undefined => {
        let result = Number(value)

        if(Number.isNaN(result)) return undefined

        return result
    }

    export const ToBoolean = (value: any): boolean | undefined => {
        let result = value == "true" || value == "false" || value == "0" || value == "1" || value == 0 || value == 1 || value == true || value == false

        if(result == false) return undefined

        return (value == "true" || value == "1" || value == 1)
    }
}