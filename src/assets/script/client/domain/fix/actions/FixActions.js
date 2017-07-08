import _filter from 'lodash/filter';
import _findIndex from 'lodash/findIndex';
import _map from 'lodash/map';
import ParseCsv from '../../../lib/ParseCsv/ParseCsv';
import {
    FixUpdateType,
    FixListType,
    FixImportParsedCsvListType
} from '../types/FixType';

export const ADD_FIX_TO_LIST_START = 'ADD_FIX_TO_LIST_START';
export const ADD_FIX_TO_LIST_SUCCESS = 'ADD_FIX_TO_LIST_SUCCESS';
export const ADD_FIX_TO_LIST_ERROR = 'ADD_FIX_TO_LIST_ERROR';

const addFixToListStart = () => ({ type: ADD_FIX_TO_LIST_START });

const addFixToListSuccess = (payload) => ({
    type: ADD_FIX_TO_LIST_SUCCESS,
    payload
});

const addFixToListError = (error) => ({
    type: ADD_FIX_TO_LIST_ERROR,
    error
});

export const addFixToList = (fixToAdd) => (dispatch, getState) => {
    dispatch(addFixToListStart());

    if (!FixUpdateType.is(fixToAdd)) {
        const error = new TypeError('Invalid data passed to .addFixToList()');

        return dispatch(addFixToListError(error));
    }

    const { fixList } = getState();
    const existingFixIndex = _findIndex(fixList.payload, { name: fixToAdd.name });

    if (existingFixIndex !== -1) {
        const error = new Error(`${fixToAdd.name} already exists, skipping import.`);

        return dispatch(addFixToListError(error));
    }

    return dispatch(addFixToListSuccess(fixToAdd));
};

export const SAVE_FIX_START = 'SAVE_FIX_START';
export const SAVE_FIX_SUCCESS = 'SAVE_FIX_SUCCESS';
export const SAVE_FIX_ERROR = 'SAVE_FIX_ERROR';

const saveFixStart = () => ({ type: SAVE_FIX_START });

const saveFixSuccess = (payload) => ({
    type: SAVE_FIX_SUCCESS,
    payload
});

const saveFixError = (error) => ({
    type: SAVE_FIX_ERROR,
    error
});

export const saveFix = (fixFormValues) => (dispatch) => {
    dispatch(saveFixStart());

    if (!fixFormValues) {
        const error = new Error('Invalid data passed to .saveFix()');

        return dispatch(saveFixError(error));
    }

    dispatch(addFixToList(fixFormValues));
    return dispatch(saveFixSuccess(fixFormValues));
};

export const IMPORT_FIX_LIST_START = 'IMPORT_FIX_LIST_START';
export const IMPORT_FIX_LIST_SUCCESS = 'IMPORT_FIX_LIST_SUCCESS';
export const IMPORT_FIX_LIST_ERROR = 'IMPORT_FIX_LIST_ERROR';

const importFixListStart = () => ({ type: IMPORT_FIX_LIST_START });

const importFixListSuccess = (payload) => ({
    type: IMPORT_FIX_LIST_SUCCESS,
    payload
});

const importFixListError = (error) => ({
    type: IMPORT_FIX_LIST_ERROR,
    error
});

export const importFixList = (importFixFormValues) => (dispatch) => {
    dispatch(importFixListStart(importFixFormValues));

    if (!importFixFormValues) {
        const error = new TypeError('Invalid data passed to .importFixlist()');

        return dispatch(importFixListError(error));
    }

    return ParseCsv.parse(importFixFormValues.data)
        .then(({ data }) => {
            const parsedFixList = new FixImportParsedCsvListType(data);
            const fixesToAdd = _map(parsedFixList, (fix) => fix.toFixUpdateType());
            const fixList = new FixListType(fixesToAdd);

            for (let i = 0; i < fixList.length; i++) {
                const fix = fixList[i];

                dispatch(addFixToList(fix));
            }

            return dispatch(importFixListSuccess({}));
        })
        .catch((error) => {
            dispatch(importFixListError(error));

            throw new Error(error);
        });
};

export const REMOVE_FIX_START = 'REMOVE_FIX_START';
export const REMOVE_FIX_SUCCESS = 'REMOVE_FIX_SUCCESS';
export const REMOVE_FIX_ERROR = 'REMOVE_FIX_ERROR';

const removeFixStart = () => ({ type: REMOVE_FIX_START });

const removeFixSuccess = (payload) => ({
    type: REMOVE_FIX_SUCCESS,
    payload
});

const removeFixError = (error) => ({
    type: REMOVE_FIX_ERROR,
    error
});

export const removeFix = (fixName) => (dispatch, getState) => {
    dispatch(removeFixStart());

    const { fixList } = getState();
    const existingFixIndex = _findIndex(fixList.payload, { name: fixName });

    if (existingFixIndex === -1) {
        const error = new Error(`Could not find fix ${fixName}. No fix was removed.`);

        return dispatch(removeFixError(error));
    }

    const updatedFixList = _filter(fixList.payload, (fix) => fix.name !== fixName);

    return dispatch(removeFixSuccess(updatedFixList));
};