import ToastContainer from 'react-bootstrap/ToastContainer';

import SingleAlert from './single-alert';

function ToastAlerts(props) {

    return (
        <ToastContainer className="position-static">
            {props.alertList.map(e => (
                <SingleAlert status={e.status} method={e.method} message={e.message} type={e.type} key={e.id} />
            ))}
        </ToastContainer>
    );
};

export default ToastAlerts;