// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {CSSProperties} from 'react';

import AsyncSelect from 'react-select/async';
import {OptionsType, ValueType, Theme as ComponentTheme} from 'react-select/src/types';
import {Props as ComponentProps, StylesConfig} from 'react-select/src/styles';
import {ThemeConfig} from 'react-select/src/theme';

import {Theme} from 'mattermost-redux/types/preferences';
import {UserProfile} from 'mattermost-redux/types/users';

import {getColorStyles, getDescription} from '../../utils';
import './autocomplete_selector.scss';

type Props = {
    loadOptions: (inputValue: string, callback: ((options: OptionsType<UserProfile>) => void)) => Promise<unknown> | void,
    label?: string,
    labelClassName?: string,
    helpText?: string,
    inputClassName?: string,
    placeholder?: string,
    disabled?: boolean,
    onSelected?: (value: ValueType<UserProfile>) => void,
    theme: Theme,
}

const useTheme = (mattermostTheme: Theme): [StylesConfig, ThemeConfig] => {
    const mmColors = getColorStyles(mattermostTheme);

    const styles: StylesConfig = {
        option: (provided: CSSProperties, state: ComponentProps) => ({
            ...provided,
            color: state.isDisabled ? mmColors.neutral30 : mmColors.neutral90,
        }),
    };

    const compTheme: ThemeConfig = (componentTheme: ComponentTheme) => ({
        ...componentTheme,
        colors: {
            ...componentTheme.colors,
            ...mmColors,
        },
    });

    return [styles, compTheme];
};

export default function AutocompleteSelector(props: Props) {
    const {
        loadOptions,
        label,
        labelClassName,
        helpText,
        inputClassName,
        placeholder,
        disabled,
        onSelected,
        theme,
    } = props;

    const [styles, componentTheme] = useTheme(theme);

    const handleSelected = (selected: ValueType<UserProfile>) => {
        if (onSelected) {
            onSelected(selected);
        }
    };

    let labelContent;
    if (label) {
        labelContent = (
            <label
                className={'control-label ' + labelClassName}
            >
                {label}
            </label>
        );
    }

    let helpTextContent;
    if (helpText) {
        helpTextContent = (
            <div className='help-text'>
                {helpText}
            </div>
        );
    }

    return (
        <div
            data-testid='autoCompleteSelector'
            className='form-group todo-select'
        >
            {labelContent}
            <div className={inputClassName}>
                <AsyncSelect
                    cacheOptions={true}
                    loadOptions={loadOptions}
                    defaultOptions={true}
                    isClearable={true}
                    disabled={disabled}
                    placeholder={placeholder}
                    getOptionLabel={(option: UserProfile) => option.username}
                    getOptionValue={(option: UserProfile) => option.id}
                    formatOptionLabel={
                        (option, {context}) => {
                            const {username} = option;
                            const description = getDescription(option);

                            if (context === 'menu') {
                                return (
                                    <div className='option-container'>
                                        <div className='option-name'>{`@${username}`}</div>
                                        {description !== '' && (
                                            <div className='option-nickname'>{description}</div>
                                        )}
                                    </div>
                                );
                            }

                            return <div>{`@${username}`}</div>;
                        }
                    }
                    onChange={handleSelected}
                    styles={styles}
                    theme={componentTheme}
                />
                {helpTextContent}
            </div>
        </div>
    );
}
