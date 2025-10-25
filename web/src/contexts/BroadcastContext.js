import React, { createContext, useContext, useReducer } from 'react';

const BroadcastContext = createContext();

const broadcastReducer = (state, action) => {
    switch (action.type) {
        case 'SET_BROADCASTS':
            return { ...state, broadcasts: action.payload };
        case 'ADD_BROADCAST':
            return { ...state, broadcasts: [action.payload, ...state.broadcasts] };
        case 'UPDATE_BROADCAST':
            return {
                ...state,
                broadcasts: state.broadcasts.map(broadcast =>
                    broadcast.id === action.payload.id ? action.payload : broadcast
                )
            };
        case 'DELETE_BROADCAST':
            return {
                ...state,
                broadcasts: state.broadcasts.filter(broadcast => broadcast.id !== action.payload)
            };
        case 'SET_FILTER':
            return { ...state, filter: action.payload };
        case 'SET_SORT':
            return { ...state, sort: action.payload };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        default:
            return state;
    }
};

const initialState = {
    broadcasts: [],
    filter: 'all',
    sort: 'newest',
    loading: false
};

export const BroadcastProvider = ({ children }) => {
    const [state, dispatch] = useReducer(broadcastReducer, initialState);

    return (
        <BroadcastContext.Provider value={{ state, dispatch }}>
            {children}
        </BroadcastContext.Provider>
    );
};

export const useBroadcastContext = () => {
    const context = useContext(BroadcastContext);
    if (!context) {
        throw new Error('useBroadcastContext must be used within a BroadcastProvider');
    }
    return context;
};
