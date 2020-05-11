import { get, set } from 'lodash'
import { observer } from 'mobx-react-lite'
import React, { useContext, useState, useEffect } from 'react'
import useFormComponents from '../hooks/useFormComponents'
import Context from './FormContext'
import { wrapperFunctions } from './utils'
import { reaction } from 'mobx'

function Field({
    path,
    use,
    children,
    onChange,
    displayValue,
    defaultValue,
    debounce = 0,
    ...otherProps
}) {

    const {
        values,
        errors,
        onBlur
    } = useContext(Context)

    const components = useFormComponents("form")

    const { ...props } = React.useMemo(() => {
        return components[use] || otherProps
    }, [components, use])

    const {
        asValue = DEFAULTS.asValue,
        asChange = [],
        asOnBlur = DEFAULTS.asOnBlur.alias,
    } = props

    const [
        changeAlias = DEFAULTS.asChange.alias,
    ] = asChange

    const changeApply = React.useMemo(() => {
        if (!asChange[1]) {
            return DEFAULTS.asChange.apply
        }
        if (typeof asChange[1] === 'function') {
            return asChange[1]
        } else if (typeof asChange[1] === 'string') {
            return value => get(value, asChange[1])
        }
    }, [asChange])

    function getDisplayValue() {
        const value = get(values, path)
        return (displayValue ? displayValue(value) : value)
    }

    const [localValue, setLocalValue] = useState(getDisplayValue)

    useEffect(() => {
        return reaction(() => get(values, path), () => {
            setLocalValue(getDisplayValue())
        })
    }, [])

    const bindProps = {
        [asValue]: localValue,
        [changeAlias]: wrapperFunctions(
            (...params) => set(values, path, changeApply(...params)),
            onChange
        ),
        [asOnBlur]: () => onBlur(path),
        error: get(errors, path)
    }

    const child = React.Children.only(children)

    return React.cloneElement(
        child,
        {
            key: path,
            ...bindProps
        },
        child.props.children
    )

}

const DEFAULTS = {
    asChange: {
        alias: 'onChange',
        apply: value => value
    },
    asValue: 'value',
    asOnBlur: {
        alias: 'onBlur'
    }
}

function getInitialValueForType(type = String) {
    switch (type) {
        case String:
            return ""
        case Number:
            return 0;
        case Boolean:
            return false;
    }
}

export default observer(Field)
