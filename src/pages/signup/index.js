import React, { useEffect, useState } from "react";
import signup from "./signup.css"
import { Link } from "react-router-dom";
import Axios from 'axios'

const Signup = () => {
    const URL = "https://nodejs-netflix.herokuapp.com"
    const URL_SITE = "https://netflix-app-react.herokuapp.com/"
    const [values, setValues] = useState()
    const handleChangeValues = event => {
        setValues((prevValue) => (
            {
                ...prevValue,
                [event.target.name]: event.target.value,
            }))

    }

    const handleClickButton = async () => {
        try {
            const validEmail = isEmail(values.email)
            const passwordEqual = isEqual(values.password, values.confirmPassword)
            if (passwordEqual && validEmail) {

                await existOrNot(values.email)
                await Axios.post(`${URL}/signup`, {
                    email: values.email,
                    password: values.password

                }).then((err) => { if (err) console.log(err) })
            }


        } catch (err) {
            console.log(err)
        }

    }

    const isEmail = (Email) => {
        if (Email.indexOf('@') > 0 && Email.indexOf('.com') > 1 + Email.indexOf('@')) {
            document.getElementById('email').textContent = ''
            return true
        }
        else {
            document.getElementById('email').innerHTML = 'Digite um email valido'
            return false
        }
    }

    const isEqual = (password, confirmPassword) => {
        if (password != confirmPassword) {
            document.getElementById('password').innerHTML = 'Senhas não conferem'
            return false
        }
        else {
            document.getElementById('password').textContent = ''
            return true
        }
    }

    const existOrNot = async (email) => {
        Axios.get(`${URL}/get/${email}`, {
        }).then((response) => {
            console.log(response.data[0])

            if (typeof response.data[0] === "undefined") {
                setTimeout(() => window.location.href = URL_SITE, 2000)
                alert("usuário cadastrado com sucesso")
                return true
            }
            else {
                document.getElementById('emailRep').textContent = 'Email já cadastrado'
                document.getElementById('password').innerHTML = ''
                document.getElementById('email').innerHTML = ''
                return false
            }
        }).catch(err => console.log(err))
    }


    return (

        <div className="signup">
            <div className="Header">
                <Link to='/' className="img--logo" />
                <Link to='/' className="Header--login">
                    Entrar
                </Link>
            </div>

            <div className="Register--Container">
                <div className="Register--Box">
                    <h1> Registrar </h1>
                    <span id="email"></span>
                    <span id="password"></span>
                    <span id="emailRep"></span>
                    <input placeholder="Email" type={'text'} className='Register--Email' name="email" onChange={handleChangeValues} />
                    <input placeholder="Senha" type={'password'} className='Register--Password' name="password" onChange={handleChangeValues} />
                    <input placeholder="Confirmar senha" type={'password'} className='Register--ConfirmPassword' name="confirmPassword" onChange={handleChangeValues} />
                    <button className="Register--Button" onClick={() => handleClickButton()}>Cadastrar </button>
                </div>

            </div>

            <div className="footer">
                <div className="footer--container">

                    <span>Dúvidas? Ligue</span> <a>0800 000 0000</a>
                    <div className="footer--links">
                        <a>Perguntas frequentes</a>
                        <a>Central de Ajuda</a>
                        <a>Termos de Uso</a>
                        <a>Privacidade</a>
                        <a>Preferências de cookies</a>
                        <a>informações corporativas</a>

                    </div>

                </div>
            </div>
        </div>



    )

}

export default Signup
