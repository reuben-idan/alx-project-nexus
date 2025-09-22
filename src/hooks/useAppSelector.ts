import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { RootState } from '../store';

// Custom hook that provides type information for the Redux store state
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
