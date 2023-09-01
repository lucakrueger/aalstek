const toggleAttribute = (elem, attr, state, { onTrue, onFalse }) => {
    state == true ? elem[attr] = onTrue : elem[attr] = onFalse
}

const toggleClass = (elem, state, { onTrue, onFalse }) => {
    if(state == true) {
        elem.classList.add(onTrue)
        elem.classList.remove(onFalse)
        return
    }

    elem.classList.add(onFalse)
    elem.classList.remove(onTrue)
}

const toggleField = (field, state, { onTrue, onFalse }) => {
    toggleAttribute(field.title, 'innerText', state, {
        onTrue: onTrue,
        onFalse: onFalse
    })

    toggleClass(field.title, state, {
        onTrue: 'text-slate-500',
        onFalse: 'text-red-500'
    })
}

const testRegExp = (regexp, value) => {
    return new RegExp(regexp).test(value)
}

const validateRules = (value, rules) => {
    for(let elem of rules) {
        if(typeof elem.rule == 'function') {
            if(elem.rule(value) == false) return {
                valid: false,
                reason: elem.reason
            }
            continue
        }

        if(testRegExp(elem.rule, value) == false) return {
            valid: false,
            reason: elem.reason
        }
    }

    return {
        valid: true,
        reason: ''
    }
}

const validateInput = (fieldName, field, rules) => {
    let check = validateRules(field.input.value, rules)
    
    toggleField(field, check.valid, {
        onTrue: `${fieldName}`,
        onFalse: `${fieldName} Invalid. ${check.reason}`
    })

    return check.valid
}

const loadForm = (fields) => {
    let obj = {}

    for(let fieldName of Object.keys(fields)) {
        obj[`${fieldName}`] = {
            input: document.getElementById(`${fieldName}Input`),
            title: document.getElementById(`${fieldName}InputTitle`),
            validate: () => {
                return validateInput(fields[fieldName].text, obj[`${fieldName}`], fields[fieldName].rules)
            }
        }

    }

    obj.validate = () => {
        let result = true

        for(let key of Object.keys(obj)) {
            if(key == 'validate') continue

            if(obj[key].validate() == false) result = false
        }

        return result
    }

    return obj
}