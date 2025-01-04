import { ActionCreators } from 'redux-undo'; 
import { Dispatch } from 'redux';

const Redo = ({ future_data, dispatch }: { future_data: any[], dispatch: Dispatch }) => {
    if (future_data.length > 0) {
        dispatch(ActionCreators.redo())
    }
}

export default Redo;
