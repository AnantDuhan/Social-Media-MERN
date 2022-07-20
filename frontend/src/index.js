import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import store from './store';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const options = {
    autoClose: 6000,
    position: toast.POSITION.TOP_RIGHT,
    transition: Bounce,
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <ToastContainer {...options} />
                <App />
        </Provider>
    </React.StrictMode>
);
