"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const params_1 = require("../src/params");
test('Number min modifer - smaller match', () => {
    let num = new params_1.Types.Number().min(10);
    expect(num.match(6)).toBe(false);
});
test('Number min modifer - exact match', () => {
    let num = new params_1.Types.Number().min(10);
    expect(num.match(10)).toBe(true);
});
test('Number min modifer - larger match', () => {
    let num = new params_1.Types.Number().min(10);
    expect(num.match(16)).toBe(true);
});
test('Number min and max modifer - larger match', () => {
    let num = new params_1.Types.Number().min(10).max(11);
    expect(num.match(16)).toBe(false);
});
test('Number validity test - number', () => {
    expect(params_1.Helpers.ToNumber(10)).toBe(10);
});
test('Number validity test - string', () => {
    expect(params_1.Helpers.ToNumber("10")).toBe(10);
});
test('Number validity test - boolean', () => {
    expect(params_1.Helpers.ToNumber(false)).toBe(0);
});
test('Number validity test - string text', () => {
    expect(params_1.Helpers.ToNumber("ten")).toBe(undefined);
});
test('Object matches modifier - nested object', () => {
    let obj = new params_1.Types.Obj().matches({
        a: new params_1.Types.Number().min(10),
        b: new params_1.Types.String().min(3),
        c: new params_1.Types.Obj().matches({
            d: new params_1.Types.Number().negative(),
            e: new params_1.Types.Obj().matches({
                f: new params_1.Types.String().matches('Testing')
            })
        })
    });
    expect(obj.match({
        a: 15,
        b: 'Hello World',
        c: {
            d: -50,
            e: {
                f: 'Testing'
            }
        }
    })).toBe(true);
});
test('String charAt modifier - positive index', () => {
    let str = new params_1.Types.String().charAt('d', 3);
    expect(str.match('abcdef')).toBe(true);
});
test('String charAt modifier - negative index', () => {
    let str = new params_1.Types.String().charAt('e', -3);
    expect(str.match('abcdefg')).toBe(true);
});
test('Boolean validity test - boolean true', () => {
    expect(params_1.Helpers.ToBoolean(true)).toBe(true);
});
test('Boolean validity test - boolean false', () => {
    expect(params_1.Helpers.ToBoolean(false)).toBe(false);
});
test('Boolean validity test - number valid true', () => {
    expect(params_1.Helpers.ToBoolean(1)).toBe(true);
});
test('Boolean validity test - number invalid', () => {
    expect(params_1.Helpers.ToBoolean(10)).toBe(undefined);
});
test('Boolean validity test - number valid false', () => {
    expect(params_1.Helpers.ToBoolean(0)).toBe(false);
});
test('Boolean validity test - string valid true', () => {
    expect(params_1.Helpers.ToBoolean("true")).toBe(true);
});
test('Boolean validity test - string invalid', () => {
    expect(params_1.Helpers.ToBoolean("ten")).toBe(undefined);
});
