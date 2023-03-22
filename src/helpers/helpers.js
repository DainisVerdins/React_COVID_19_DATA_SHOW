
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
export default {
    isNumeric(str) {
        if (typeof str != "string") return false // we only process strings!  
        return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
               !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
      },

      errorToastWithMessage(errorMessage) { toast.error(errorMessage);}
};