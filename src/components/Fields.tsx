import * as React from "react";
import { FieldProps } from "formik";
import { TextField } from "@material-ui/core";
import { TextFieldProps } from "@material-ui/core/TextField/TextField";

export const GenericField: React.FC<FieldProps & TextFieldProps> = ({ placeholder, field }) => {
    // console.log(field.onChange);
    return <TextField onChange={field.onChange} variant="outlined" placeholder={placeholder} {...field} />;
};

export const PasswordField: React.FC<FieldProps & TextFieldProps> = ({ placeholder, field }) => {
    // console.log(field.onChange);
    return <TextField onChange={field.onChange} type="password" variant="outlined" placeholder={placeholder} {...field} />;
};

export const ErrorPasswordField: React.FC<FieldProps & TextFieldProps> = ({ placeholder, field }) => {
    // console.log(field.onChange);
    return <TextField onChange={field.onChange} error type="password" variant="outlined" placeholder={placeholder} {...field} helperText={'Invalid username or password'} />;
};