import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputAdornment,
    TextField,
    Stack,
    Typography,
    IconButton,
} from "@mui/material";
import * as Yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import requestsApi from "../../app/requestsApi";
import { getErrorDetails } from "../../common/utility";
import { showAlert, startLoader, stopLoader } from "../../reducers/commonSilce";
import { ALERT_ERROR, ALERT_SUCCESS } from "../../common/constants";

const AuthResetPassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [currentshowPassword, setCurrentShowPassword] = useState(false);
    const API_URL = 'http://localhost:8080/user/reset-password';
    const validationSchema = Yup.object().shape({
        userName: Yup.string().required("User Name is required"),
        password: Yup.string().required("Password is required"),
    });

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            userName: "",
            password: "",
        },
        mode: "onTouched",
    });

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleClickCurrentShowPassword = () => {
        setCurrentShowPassword(!currentshowPassword);
    };

    const handleMouseDownCurrentPassword = (event) => {
        event.preventDefault();
    };

    const onChangePassword = async (data) => {
        dispatch(startLoader());
        let formData = new FormData();
        formData.append('userName', data.userName);
        formData.append('password', data.password);
      
        // let postData = {
        //     userName: data.userName,
        //     password: data.password,
        // };
        try {
            const response = await fetch(API_URL, {
                method: 'PUT',
                body: formData,
              });
          
            if (response.status === 200) {
                reset();
                dispatch(
                    showAlert({
                        type: ALERT_SUCCESS,
                        message: "Password reset link sent successfully",
                    })
                );
                navigate("/"); // Redirect to login page after password reset link sent
            } else {
                alert(" failed");
                dispatch(
                    showAlert({
                        type: ALERT_ERROR,
                        message:
                            "Failed to send reset link. Please try again later.",
                    })
                );
            }
        } catch (error) {
            let { msg } = getErrorDetails(error);
            dispatch(
                showAlert({
                    type: ALERT_ERROR,
                    message: msg || "Failed to send reset link",
                })
            );
        } finally {
            dispatch(stopLoader());
        }
    };

    return (
        <>
            <form noValidate onSubmit={handleSubmit(onChangePassword)}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Stack spacing={1}>
                            <Controller
                                name="userName"
                                control={control}
                                render={({
                                    field: { onChange, onBlur, value },
                                }) => (
                                    <TextField
                                        fullWidth
                                        label="User Name"
                                        variant="outlined"
                                        id="userName"
                                        placeholder="Enter user name"
                                        onBlur={onBlur}
                                        onChange={onChange}
                                        value={value}
                                        InputProps={{
                                            autoComplete: "off",
                                        }}
                                    />
                                )}
                            />
                            {errors.userName && (
                                <FormHelperText
                                    error
                                    id="helper-text-username"
                                >
                                    {errors.userName.message}
                                </FormHelperText>
                            )}
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack spacing={1}>
                            <Controller
                                name="password"
                                control={control}
                                render={({
                                    field: { onChange, onBlur, value },
                                }) => (
                                    <TextField
                                        fullWidth
                                        label="Password"
                                        variant="outlined"
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder="Enter password"
                                        onBlur={onBlur}
                                        onChange={onChange}
                                        value={value}
                                        InputProps={{
                                            autoComplete: "off",
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={
                                                            handleClickShowPassword
                                                        }
                                                        onMouseDown={
                                                            handleMouseDownPassword
                                                        }
                                                        edge="end"
                                                        size="large"
                                                    >
                                                        {showPassword ? (
                                                            <EyeOutlined />
                                                        ) : (
                                                            <EyeInvisibleOutlined />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />
                            {errors.password && (
                                <FormHelperText
                                    error
                                    id="helper-text-password"
                                >
                                    {errors.password.message}
                                </FormHelperText>
                            )}
                        </Stack>
                    </Grid>
                    {errors.submit && (
                        <Grid item xs={12}>
                            <FormHelperText error>
                                {errors.submit}
                            </FormHelperText>
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <Button
                            disableElevation
                            disabled={isSubmitting}
                            fullWidth
                            size="large"
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            Reset Password
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </>
    );
};

export default AuthResetPassword;
