import { ActionCreators } from 'redux-undo'; 
import { useSelector, useDispatch } from 'react-redux';

const Undo = ({past_data, dispatch}) => {
    if (past_data.length > 1) {
        dispatch(ActionCreators.undo())
    }
}

export default Undo;
