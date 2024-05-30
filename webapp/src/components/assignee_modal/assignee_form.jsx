import React, {useState, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';

import AutocompleteSelector from '../user_selector/autocomplete_selector';
import Button from '../../widget/buttons/button';
import IconButton from '../../widget/iconButton/iconButton';

import CompassIcon from '../icons/compassIcons';

const AssigneeForm = (
    {
        visible,
        close,
        autocompleteUsers,
        theme,
        getAssignee,
        removeAssignee,
        removeEditingTodo,
        changeAssignee,
        editingTodo,
    },
) => {
    const [assignee, setAssignee] = useState();

    useEffect(() => {
        function handleKeypress(e) {
            if (e.key === 'Escape') {
                close();
            }
        }

        document.addEventListener('keyup', handleKeypress);

        return () => {
            document.removeEventListener('keyup', handleKeypress);
        };
    }, [visible]);

    const submit = useCallback(() => {
        if (editingTodo && assignee) {
            changeAssignee(editingTodo, assignee.username);
            removeEditingTodo();
        } else if (assignee) {
            getAssignee(assignee);
        } else {
            removeAssignee();
        }
        close();
    }, [close, changeAssignee, removeAssignee, getAssignee, assignee, removeEditingTodo, editingTodo]);

    const closeModal = () => {
        removeEditingTodo();
        close();
    };

    const changeAssigneeDropdown = (selected) => {
        setAssignee(selected);
    };

    const style = getStyle(theme);

    return (
        <div
            style={style.backdrop}
        >
            <div style={style.modal}>
                <h1 style={style.heading}>{'Assign todo to…'}</h1>
                <IconButton
                    size='medium'
                    style={style.closeIcon}
                    onClick={closeModal}
                    icon={<CompassIcon icon='close'/>}
                />
                <AutocompleteSelector
                    autoFocus={true}
                    id='send_to_user'
                    loadOptions={autocompleteUsers}
                    onSelected={changeAssigneeDropdown}
                    placeholder={''}
                    theme={theme}
                />
                <div
                    className='todoplugin-button-container'
                    style={style.buttons}
                >
                    <Button
                        emphasis='tertiary'
                        size='medium'
                        onClick={closeModal}
                    >
                        {'Cancel'}
                    </Button>
                    <Button
                        emphasis='primary'
                        size='medium'
                        onClick={submit}
                        disabled={!assignee}
                    >
                        {'Assign'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

AssigneeForm.propTypes = {
    visible: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    autocompleteUsers: PropTypes.func.isRequired,
    getAssignee: PropTypes.func.isRequired,
    editingTodo: PropTypes.string.isRequired,
    removeAssignee: PropTypes.func.isRequired,
    removeEditingTodo: PropTypes.func.isRequired,
    changeAssignee: PropTypes.func.isRequired,
};

const getStyle = (theme) => ({
    backdrop: {
        position: 'absolute',
        display: 'flex',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.50)',
        zIndex: 2000,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modal: {
        position: 'relative',
        width: 600,
        padding: 24,
        borderRadius: 8,
        maxWidth: '100%',
        color: theme.centerChannelColor,
        backgroundColor: theme.centerChannelBg,
    },
    buttons: {
        marginTop: 24,
    },
    heading: {
        fontSize: 20,
        fontWeight: 600,
        margin: '0 0 24px 0',
    },
    closeIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
});

export default AssigneeForm;
