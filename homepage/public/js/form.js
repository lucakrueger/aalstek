const toggleAttribute = (elem, attr, state, { onTrue, onFalse }) => {
    state == true ? (elem[attr] = onTrue) : (elem[attr] = onFalse)
}

const toggleClass = (elem, state, { onTrue, onFalse }) => {
    if (state == true) {
        elem.classList.add(onTrue)
        elem.classList.remove(onFalse)
        return
    }

    elem.classList.add(onFalse)
    elem.classList.remove(onTrue)
}

const _toggleField = (
    field,
    state,
    { onTrue, onFalse },
    { textTrue, textFalse },
) => {
    toggleAttribute(field.title, 'innerText', state, {
        onTrue: onTrue,
        onFalse: onFalse,
    })

    toggleClass(field.title, state, {
        onTrue: textTrue,
        onFalse: textFalse,
    })
}

const toggleField = (field, state, { onTrue, onFalse }) => {
    _toggleField(
        field,
        state,
        { onTrue, onFalse },
        {
            textTrue: 'text-slate-500',
            textFalse: 'text-red-500',
        },
    )
}

const testRegExp = (regexp, value) => {
    return new RegExp(regexp).test(value)
}

const validateRules = (value, rules) => {
    if (value == null || value == undefined)
        return {
            valid: false,
            reason: '',
        }

    for (let elem of rules) {
        if (typeof elem.rule == 'function') {
            if (elem.rule(value) == false)
                return {
                    valid: false,
                    reason: elem.reason,
                }
            continue
        }

        if (testRegExp(elem.rule, value) == false)
            return {
                valid: false,
                reason: elem.reason,
            }
    }

    return {
        valid: true,
        reason: '',
    }
}

const validateInput = (fieldName, field, rules) => {
    let check = validateRules(field.input.value, rules)

    toggleField(field, check.valid, {
        onTrue: `${fieldName}`,
        onFalse: `${fieldName} Invalid. ${check.reason}`,
    })

    return check.valid
}

const validateAsObject = (fieldName, field, rules) => {
    let check = validateRules(field.input.value, rules)

    return {
        failed: check.valid == false,
        reason: `${check.reason}`,
    }
}

const validateResponse = (fieldName, field, { failed, reason }) => {
    toggleField(field, failed == false, {
        onTrue: `${fieldName}`,
        onFalse: `${fieldName} Invalid. ${reason}`,
    })

    return failed
}

const approveResponse = (fieldName, field, { success, reason }) => {
    _toggleField(
        field,
        success == false,
        {
            onTrue: `${fieldName}`,
            onFalse: `${fieldName} Valid. ${reason}`,
        },
        {
            textTrue: 'text-slate-500',
            textFalse: 'text-green-500',
        },
    )

    return failed
}

const rejectInput = (fieldName, field, reason) => {
    toggleField(
        field,
        false,
        {
            onTrue: `${fieldName}`,
            onFalse: `${fieldName} Invalid. ${reason}`
        }
    )
}

const _loadForm = (fields, getElem) => {
    const helperFields = [
        'validate',
        'json',
        'jsonString',
        'populate',
        'remove',
        'validateResponse',
        'validateAsObject',
        'approveResponse',
        'reject'
    ]

    let obj = {
        validate: () => {
            let result = true

            for (let key of Object.keys(obj)) {
                if (helperFields.includes(key)) continue

                if (obj[key].validate() == false) result = false
            }

            return result
        },
        validateAsObject: () => {
            let result = {}

            for (let key of Object.keys(obj)) {
                if (helperFields.includes(key)) continue

                result[key] = obj[key].validateAsObject()
            }

            return result
        },
        json: () => {
            let result = {}

            for (let key of Object.keys(obj)) {
                if (helperFields.includes(key)) continue

                result[key] = obj[key].value()
            }

            return result
        },
        jsonString: () => {
            return JSON.stringify(obj.json())
        },
        populate: (fields) => {
            for (let key of Object.keys(fields)) {
                if (obj[key] == undefined) continue

                obj[key].setValue(fields[key])
            }
            return obj
        },
        remove: (fields) => {
            for (let field of fields) delete obj[field]
            return obj
        },
        validateResponse: (fields) => {
            for (let key of Object.keys(fields)) {
                if (obj[key] == undefined) continue

                obj[key].validateResponse(fields[key])
            }
        },
    }

    for (let fieldName of Object.keys(fields)) {
        obj[`${fieldName}`] = {
            input: getElem(`${fieldName}Input`),
            title: getElem(`${fieldName}InputTitle`),
            value: () => {
                return obj[`${fieldName}`].input.value
            },
            setValue: (value) => {
                obj[`${fieldName}`].input.value = value
            },
            validate: () => {
                return validateInput(
                    fields[fieldName].text,
                    obj[`${fieldName}`],
                    fields[fieldName].rules,
                )
            },
            validateResponse: (res) => {
                return validateResponse(
                    fields[fieldName].text,
                    obj[`${fieldName}`],
                    res,
                )
            },
            approveResponse: (res) => {
                return approveResponse(
                    fields[fieldName].text,
                    obj[`${fieldName}`],
                    res,
                )
            },
            validateAsObject: () => {
                return validateAsObject(
                    fields[fieldName].text,
                    obj[`${fieldName}`],
                    fields[fieldName].rules,
                )
            },
            reject: (reason) => {
                return rejectInput(
                    fields[fieldName].text,
                    obj[`${fieldName}`],
                    reason
                )
            }
        }
    }

    return obj
}

const loadForm = (fields) => {
    return _loadForm(fields, (elem) => {
        return document.getElementById(elem)
    })
}

const loadVerificationForm = (fields) => {
    return _loadForm(fields, (elem) => {
        return {
            classList: {
                add: (a) => {},
                remove: (a) => {},
            },
            value: null,
            text: '',
            innerText: '',
        }
    })
}

const idFromString = (str) => {
    let value = `${str}`
    let bounds = {
        start: 0,
        end: value.length
    }
    if(value[0] == ' ') bounds.start = 1
    if(value[value.length - 1] == ' ') bounds.end = value.length - 1

    value = value.slice(bounds.start, bounds.end)

    value = value.replace(' ', '-')

    return value.toLowerCase()
}

module.exports = {
    loadForm,
    loadVerificationForm,
    idFromString
}
