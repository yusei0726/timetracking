import React from 'react'
import {createRoot} from 'react-dom/client'
import './style.css'
import App from './App'
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';

Amplify.configure(awsExports);

const container = document.getElementById('root')

const root = createRoot(container!)

root.render(
    <React.StrictMode>
        <div></div>
        <App/>
    </React.StrictMode>
)
