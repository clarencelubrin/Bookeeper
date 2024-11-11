import { ActionCreators } from 'redux-undo'; 
import { useSelector, useDispatch } from 'react-redux';

const Redo = ({future_data, dispatch}) => {
    if (future_data.length > 0) {
        dispatch(ActionCreators.redo())
    }
}

export default Redo;
