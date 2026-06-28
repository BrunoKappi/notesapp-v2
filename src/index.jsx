import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import store from './components/store/store';
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router } from "react-router-dom";
import './index.css';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <QueryClientProvider client={queryClient}>
        <Router>
            <Provider store={store}>
                <App />
            </Provider>
        </Router>
    </QueryClientProvider>
);


         