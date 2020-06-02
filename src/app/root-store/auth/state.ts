export interface AuthState {
    // additional entities state properties
    isLoading?: boolean;
    error?: any;
}

export const initialState: AuthState = {
    isLoading: false,
    error: null,
};
