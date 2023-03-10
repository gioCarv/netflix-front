import React from "react";
import login from "./login.css"
import { json, Link } from 'react-router-dom'
import { useState } from "react";
import Axios from "axios";

const Login = () => {
    const URL = "https://nodejs-netflix.onrender.com"
    const URL_SITE = "https://projectnetflix.netlify.app"
    const [values, setValues] = useState()
    const handleChangeValues = event => {
        setValues((prevValue) => ({
            ...prevValue,
            [event.target.name]: event.target.value,
        }))


    }
    const handleClickButton = async () => {


        const emailExist = await Axios.post(`${URL}/userEmail`, {
            email: values.email,
        }).then(result => { return result.data })

        if (emailExist) {
            document.getElementById('text').textContent = ''
            const userExist = await Axios.post(`${URL}/user`, {
                email: values.email,
                password: values.password,
            }).then(result => { return result.data })
            document.getElementById('textHeader').style.display = 'none'
            document.getElementById('textHeaderPassword').style.display = 'none'
            if (userExist) {
                document.querySelector(".login--password").style.borderBottom = '0px solid #e87c03'
                document.querySelector(".login--email").style.borderBottom = '0px solid #e87c03'
                document.getElementById("loading").style.display = 'initial'
                document.getElementById('login').style.display = 'none'

                const tokenAndUser = await Axios.post(`${URL}/signin`, {
                    email: values.email,
                    password: values.password,
                }).then(result => {
                    localStorage.setItem('token', JSON.stringify(result.data))
                    window.location.href = `${URL_SITE}/home`

                })

            } else {
                document.getElementById('textHeaderPassword').style.display = 'inline'
                document.querySelector(".login--email").style.borderBottom = '0px solid #e87c03'
                document.querySelector(".login--password").style.borderBottom = '2px solid #e87c03'
            }
        } else {
            document.getElementById('textHeaderPassword').style.display = 'none'
            document.querySelector(".login--email").style.borderBottom = '2px solid #e87c03'
            document.querySelector(".login--password").style.borderBottom = '0px solid #e87c03'
            document.getElementById('textHeader').style.display = 'inline'
            document.getElementById('textHeaderDashed').style.display = 'inline'
        }


    }





    return (

        <>
            <div id="loading">
                  <div id="loading"/>
            </div>
            <section id="login" >
            <img className="img--background" src="https://assets.nflxext.com/ffe/siteui/vlv3/5aecc44d-2a1f-4313-8399-98df20908b64/2fd8349f-d951-4b47-af30-89378a71cd16/BR-pt-20221114-popsignuptwoweeks-perspective_alpha_website_large.jpg" />
            <div className="background">

                <div className="img--logo1" />
                <div className="container">
                    <div className="container2">


                        <h1>Entrar</h1>
                        <span id='textHeaderPassword'> <b>Senha incorreta.</b> Tente novamente ou <span id="Headerlink">redefina sua senha.</span></span>
                        <span id='textHeader'>Desculpe, n??o encontramos uma conta com esse endere??o de email. <Link to="/signup" id='textHeaderDashed'>crie um nova conta.</Link></span>
                        <input placeholder="email" type="email" name="email" className="login--email" onChange={handleChangeValues} />
                        <span id='text'></span>
                        <input placeholder="senha" type="password" name="password" className="login--password" onChange={handleChangeValues} />
                        <button onClick={() => handleClickButton()} className="login--button"> Entrar </button>
                        <div className="login--assets">
                            <input type="checkbox" className="login--checkbox" />
                            <span > Lembre-se de mim </span>
                            <a> Precisa de ajuda? </a>
                        </div>
                        <div className="login--register">
                            <span className="login--registertext">Novo por aqui?</span>
                            <Link to="/signup" className="login--registerlink"> Assine agora. </Link>
                            <div />
                            <div className="login--extrainfos">
                                <span className="login--text">Esta p??gina ?? protegida pelo Google reCAPTCHA para garantir que voc?? n??o ?? um rob??.  </span>
                                <a href="/" className="login--captcha" onClick={e => e.preventDefault()}>Saiba mais. </a>


                            </div>

                            <div />


                        </div>
                    </div>
                </div>
            </div>
                <div className="footer1">

                    <div className="footer--container1">

                        <span>D??vidas? Ligue</span> <a>0800 000 0000</a>
                        <div className="footer--links1">
                            <a>Perguntas frequentes</a>
                            <a>Central de Ajuda</a>
                            <a>Termos de Uso</a>
                            <a>Privacidade</a>
                            <a>Prefer??ncias de cookies</a>
                            <a>informa????es corporativas</a>

                        </div>

                    </div>
                </div>
           </section>

        </>



    )

}

export default Login
