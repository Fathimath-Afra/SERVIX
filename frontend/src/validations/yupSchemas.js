import * as Yup from 'yup';

// 1. Login Schema
export const loginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

// 2. Register Schema (Citizen)
export const registerSchema = Yup.object().shape({
    name: Yup.string().min(3, "Name too short").required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Min 6 characters").required("Password is required"),
    phone: Yup.string().matches(/^[0-9]{10}$/, "Phone must be 10 digits").required("Phone required"),
    societyId: Yup.string().required("Please select a society"),
});

// 3. Society Schema (Admin)
export const societySchema = Yup.object().shape({
    name: Yup.string().min(3, "Too short").required("Society name required"),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
});

// 4. Issue Schema (Citizen)
export const issueSchema = Yup.object().shape({
    title: Yup.string().min(5, "Title must be at least 5 chars").required("Title required"),
    description: Yup.string().min(10, "Provide more details").required("Description required"),
    category: Yup.string().required("Select a category"),
});

// 5. Worker Schema (Manager)
export const workerSchema = Yup.object().shape({
    name: Yup.string().min(3, "Name is too short").required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string().matches(/^[0-9]{10}$/, "Phone must be exactly 10 digits").required("Phone required"),
    password: Yup.string().when('$isEdit', {
        is: false,
        then: (schema) => schema.min(6, "Password must be 6+ chars").required("Password required"),
        otherwise: (schema) => schema.notRequired(),
    }),
});