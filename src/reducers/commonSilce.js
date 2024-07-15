import { createSlice } from "@reduxjs/toolkit";
import { getUserById, logout } from "./authSlice";
/**
 * @type {AuthState}
 */
const initialState = {
    appName: "React-Template",
    isAuthenticated: false,
    isLoading: false,
    // alert initial state
    alertType: "",
    alertMessage: "",
    isAlertShow: false,
    selfCloseAlert: {
        isAlertShow: false,
        type: "",
        message: ""
    }
};

const commonSlice = createSlice({
    name: "common",
    initialState,
    reducers: {
        startLoader(state) {
            state.isLoading = true;
        },
        stopLoader(state) {
            state.isLoading = false;
        },
        // alert
        showAlert(state, action) {
            state.isAlertShow = true;
            state.type = action.payload.type;
            state.message = action.payload.message;
        },
        hideAlert: (state) => {
            state.isAlertShow = false;
            state.type = "";
            state.message = "";
        },
        // Self Close alert
        showSelfCloseAlert(state, action) {
            state.selfCloseAlert= {
                isAlertShow: true,
                type: action.payload.type,
                message: action.payload.message
            }
        },
        hideSelfCloseAlert: (state, action) => {
            state.selfCloseAlert.isAlertShow= false
            state.selfCloseAlert.message= ""
        }
        // clearRedirect(state) {
        //     delete state.redirectTo;
        // },
    },
});

export const { clearRedirect, startLoader, stopLoader, showAlert, hideAlert, showSelfCloseAlert, hideSelfCloseAlert } =
    commonSlice.actions;

export default commonSlice.reducer;