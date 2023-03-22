import { toast } from 'react-toastify';
const toastHelper = {
    errorToastWithMessage(errorMessage) { toast.error(errorMessage); },
};

export default toastHelper;