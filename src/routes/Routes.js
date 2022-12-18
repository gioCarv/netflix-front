import React, { useState } from 'react';
import Signup from '../pages/signup';
import Home from '../pages/home';
import Login from '../pages/login';
import { Route, Routes, Navigate, BrowserRouter, useAsyncValue } from "react-router-dom"
import Axios from 'axios';


const RoutesApp = () => {
    const URL = "https://nodejs-netflix.herokuapp.com"

    const [authenticated, setAuthenticated] = useState()

    const isAuthenticated = (TrueOrFalse) =>{
        setAuthenticated(TrueOrFalse)
    }


    const PrivateRoute =  ({children}) => {
        let token
        if (localStorage.getItem('token')){
            token = JSON.parse(localStorage.getItem('token'))
        }else{
            token = null
        }
            
            Axios.post(`${URL}/home`, {
                token: token,
            }).then(result => { 
                    isAuthenticated(result.data)                     
            })


            return authenticated === true ? children : (authenticated === undefined ? <Login/> : <Navigate to="/" />)
    }
    return (

        <BrowserRouter>
            <Routes>
                <Route exact path='/' element={<Login />} />
                <Route exact path='/signup' element={<Signup />} />
                <Route
                    path="/home"
                    element={
                        <PrivateRoute>
                            <Home/>
                        </PrivateRoute>
                    }
                />
                <Route exact path="*" element={<Login />} />
            </Routes>
        </BrowserRouter>
        
    )
}

export default RoutesApp
