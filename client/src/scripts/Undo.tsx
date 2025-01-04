import { ActionCreators } from 'redux-undo'; 
import { Dispatch } from 'redux';

const Undo = ({ past_data, dispatch }: { past_data: any[], dispatch: Dispatch }) => {
    if (past_data.length > 1) {
        dispatch(ActionCreators.undo())
    }
}

export default Undo;
