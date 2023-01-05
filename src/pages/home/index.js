import React, { useState } from "react";
import home from "./home.css"
import tmdb from "./tmdb.js"
import { useEffect } from 'react'
import { Link } from "react-router-dom";


const Home = () => {
    const [movieList, setMovieList] = useState([])
    const [recommended, setRecommended] = useState([])
    const [touchX, setTouchX] = useState()
    const [firstTimeTouch, setFirstTimeTouch] = useState([true, true, true, true, true, true, true, true,  true,  true])
    const [cooldownResize, setCooldownResize] = useState(true)
    const arrow = document.getElementById('loggout')
    const Menu = document.getElementById('loggoutMenu')
    const [visible, setVisible] = useState(true)
    const [transparent, setTransparent] = useState(true)
    const [light, setLight] = useState([])
    const [widthConfig, setWidthConfig] = useState([[0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0]])
    

    useEffect(() => {

        const loadAll = async () => {
            let list = await tmdb.getHomeList()
            setMovieList(list)
            const trending = list.filter(i => i.slug === 'trending')
            const randonChoice = Math.floor(trending[0].itens.results.length * Math.random())
            setRecommended(trending[0].itens.results[randonChoice])
            setTimeout(() => {
                resize()
            }, 1000);
        }

        loadAll()
    }, [])
    useEffect(() => {
        const resizeLoad = async () => {
            window.addEventListener("load", resize);
            window.addEventListener("resize", resize);
            }
        resizeLoad()
    }, [])

    const setScrollTop = () => {
        window.scrollTo(0, 0)
    }



    useEffect(() => {
        const scrollAnaliser = () => {
            if (window.scrollY > 10) {
                setTransparent(false)
            } else {
                setTransparent(true)
            }
        }
        window.addEventListener('scroll', scrollAnaliser)
        return () => {
            window.removeEventListener('scroll', scrollAnaliser)
        }
    }, [])


    const toggleMenu = () => {
        if (visible === true) {
            arrow.style.transform = 'rotate(180deg)'
            Menu.style.display = 'flex'
            Menu.style.animation = 'loading1 1s linear'
        } else {
            arrow.style.transform = 'rotate(0deg)'
            setTimeout(() => {
                Menu.style.display = 'none'
            }, 200)
        }

    }

    const moveList = (distance, direction, numberList) => {
        const list = document.getElementById(`list${numberList}`)
        const pages = document.querySelectorAll(`#rowPage${numberList} > *`)
        const pagesFather = document.getElementById(`rowPage${numberList}`)
        const pagesCel = document.querySelectorAll(`#rowPageCel${numberList} > *`)
        const leftButton = document.getElementById(`buttonLeft${numberList}`)
        const size = movieList[numberList].itens.results.length
        let number = list.style.marginLeft.indexOf('v')
        if (direction === 'right') {
            distance = -distance
        }
        chageColor(direction, pages, pagesCel, 'rgb(150, 143, 143)', 'rgb(229, 229, 229)', numberList, distance, pagesCel)
    }

    
    const chageColor = (direction, elements, elementsCel, defaultColor, newColor, key, distance) => {
        const list = document.getElementById(`${key}list`)
        const celList = document.getElementById(`${key}listCel`)
        document.getElementById(`buttonLeft${key}`).style.display = 'flex'
        const rowLight = light.find((element) => {
            return element.row === key
        })
        const twinList = list.cloneNode(true)
        twinList.style.display = 'flex'
        const ListAndTwinList = document.querySelectorAll('.Home--list--movie--box--infoBox')
        const largura = list.clientWidth
        if (typeof (rowLight) === 'undefined') {
            elements[0].style.backgroundColor = defaultColor
            elementsCel[0].style.backgroundColor = defaultColor
                const newArrayWidthConfig = widthConfig
                const row = key
                newArrayWidthConfig[row] = window.screen.width > 680? [1,2,1,0] : [0,1,0,1]
                setWidthConfig(newArrayWidthConfig)
                const positionLight = widthConfig[key][2]
                const positionLightCel = widthConfig[key][3]
                elements[positionLight].style.backgroundColor = newColor
                elementsCel[positionLightCel].style.backgroundColor = newColor
                const configLists = 1
                const configListsCel = window.screen.width > 680? 2 : 1
                setLight([...light, { row: row, lightElement: positionLight, lightElementCel: positionLightCel, configLists, configListsCel }])
                 if (window.screen.width > 680){
                list.style.marginLeft = `${distance}vw`
                celList.style.marginLeft = `${2*distance}vw`
                }else{
                celList.style.marginLeft = `${distance}vw`
                }
                document.getElementById(`list${key}`).lastChild.appendChild(twinList)
        } else {

            elements[widthConfig[key][2]].style.backgroundColor = defaultColor
            elementsCel[widthConfig[key][3]].style.backgroundColor = defaultColor
            const index = light.findIndex(element => element.row === key)
            if (direction === 'left') {
                const newArray = light
                const config = listOrder(list, celList, twinList, distance, key, rowLight.configLists, rowLight.configListsCel)
                setTimeout(() => {
                    const positionLight = widthConfig[key][2]
                    const positionLightCel = widthConfig[key][3]
                    elements[positionLight].style.backgroundColor = newColor
                    elementsCel[positionLightCel].style.backgroundColor = newColor
                    const newRowLight = { row: rowLight.row, lightElement: positionLight, lightElementCel: positionLightCel, configLists: config.Lists, configListsCel: config.ListsCel }
                    newArray.splice(index, 1, newRowLight)
                    setLight(newArray)
                }, 100);
            } else {
                const newArray = light
                const config = listOrder(list, celList, twinList, distance, key, rowLight.configLists, rowLight.configListsCel)
                setTimeout(() => {                
                    const positionLight = widthConfig[key][2]
                    const positionLightCel = widthConfig[key][3]
                    elements[positionLight].style.backgroundColor = newColor
                    elementsCel[positionLightCel].style.backgroundColor = newColor
                    const newRowLight = { row: rowLight.row, lightElement: positionLight, lightElementCel: positionLightCel, configLists: config.Lists, configListsCel: config.ListsCel}
                    newArray.splice(index, 1, newRowLight)
                    setLight(newArray)
                }, 100);
            }
        }
    }

    const listOrder = (originalList, celList, twinList, distance, key, configLists, configListsCel) => {
        let number = originalList.style.marginLeft.indexOf('v')
        let currentX = parseFloat(originalList.style.marginLeft.substring(0, number))
        let currentXCel = parseFloat(celList.style.marginLeft.substring(0, number))
        if (isNaN(currentX)) {
            currentX = 0
        }
        if (isNaN(currentXCel)) {
            currentXCel = 0
        }
        if (window.screen.width > 680){
            if (distance <= 0) {
                let newArrayWidthConfig = widthConfig
                switch (configLists) {
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:                        
                        let ListsCel = Math.floor((configLists + 1)*5/2)
                        let lightCel = ListsCel
                        if(lightCel > 9){
                            lightCel = lightCel - 10
                        }
                        newArrayWidthConfig[key]=[(configLists + 1)%8 , ListsCel, (widthConfig[key][2] + 1)%4, lightCel]
                        setWidthConfig(newArrayWidthConfig)
                        originalList.style.marginLeft = `${currentX + distance}vw`
                        celList.style.marginLeft = `${ListsCel * distance}vw`
                        return {Lists: (configLists + 1) % 8, ListsCel}
                        break
                    case 6:
                        setTimeout(() => {
                            originalList.style.transition = `none`
                            originalList.style.marginLeft = `${2 * distance}vw`
                        }, 10)
                        setTimeout(() => {
                            originalList.style.transition = `all ease 0.8s`
                            originalList.style.marginLeft = `${3 * distance}vw`
                            celList.style.marginLeft = `${7 * distance}vw`
                        }, 50)
                        
                        newArrayWidthConfig[key] = [3, 7, 3, 7]
                        setWidthConfig(newArrayWidthConfig)
                        return {Lists: 3, ListsCel: 7 }
                    default:
                }
            } else {
                let newArrayWidthConfig = widthConfig
                switch (configLists) {
                    
                    case 0:
                    case 1:
                        setTimeout(() => {
                            originalList.style.transition = `none`
                            originalList.style.marginLeft = `${-5 * distance}vw`
                        }, 10)
                        setTimeout(() => {
                            originalList.style.transition = `all ease 0.8s`
                            originalList.style.marginLeft = `${-4 * distance}vw`
                            celList.style.marginLeft = `${-10 * distance}vw`
                            
                        }, 50)
                        newArrayWidthConfig[key] = [4, 10, 0, 0]
                        setWidthConfig(newArrayWidthConfig)
                        return {Lists: 4, ListsCel: 9}
                        break

                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                        let Lists = (configLists + 7) % 8
                        let ListsCel = Math.floor((((Lists)*5)/2))
                        let lightCel = ListsCel
                        if(lightCel > 9){
                            lightCel = lightCel - 10
                        }
                        newArrayWidthConfig[key] = [Lists, ListsCel, (widthConfig[key][2] + 3)%4, lightCel]
                        originalList.style.marginLeft = `${currentX + distance}vw`
                        celList.style.marginLeft = `${-ListsCel * distance}vw`
                        setWidthConfig(newArrayWidthConfig)
                        return {Lists ,ListsCel}
                        break
                    default:
                }
        }
            }else{
                
                if(distance <= 0){
                    let newArrayWidthConfig = widthConfig
                    if(configListsCel === 19){
                        setTimeout(() => {
                            celList.style.transition = `none`
                            celList.style.marginLeft = `${ 9* distance}vw`
                        }, 10)
                        setTimeout(() => {
                            celList.style.transition = `all ease 0.8s`
                            originalList.style.marginLeft = `${4 * distance}vw`
                            celList.style.marginLeft = `${10 * distance}vw`
                        }, 90)
                        newArrayWidthConfig[key] = [4, 10, 0, 0]
                        setWidthConfig(newArrayWidthConfig)
                        return {Lists:4, ListsCel:10}
                    }else{
                        const ListsCel = (configListsCel + 1)%20
                        celList.style.marginLeft = `${ListsCel*distance}vw`
                        const pageConverter = ListsCel % 5 
                        const Lists = (pageConverter === 2 || pageConverter === 0) ? (widthConfig[key][0] + 1) : widthConfig[key][0]
                        let lightPc = Lists
                        if(lightPc > 3){
                            lightPc = lightPc - 4
                        }
                        const conversorCel = (ListsCel)%3 === 0 ? ListsCel - 1 : ListsCel
                        originalList.style.marginLeft = `${Lists*distance}vw`
                        newArrayWidthConfig[key] = [Lists, ListsCel, lightPc,(widthConfig[key][3] + 1)%10]
                        setWidthConfig(newArrayWidthConfig)
                        return {Lists, ListsCel}
                    }
                }else{
                    let newArrayWidthConfig = widthConfig
                    if(configListsCel === 1){
                        setTimeout(() => {
                            celList.style.transition = `none`
                            celList.style.marginLeft = `${-11 * distance}vw`
                        }, 10)
                        setTimeout(() => {
                            celList.style.transition = `all ease 0.8s`
                            originalList.style.marginLeft = `${-4 * distance}vw`
                            celList.style.marginLeft = `${-10 * distance}vw`
                        }, 90)
                        newArrayWidthConfig[key] = [4, 10, 0, 0]
                        setWidthConfig(newArrayWidthConfig)
                        return {Lists:4, ListsCel:10}
                    }else{
                        const ListsCel = (configListsCel + 19)%20
                        celList.style.marginLeft = `${-ListsCel * distance}vw`
                        const pageConverter = ListsCel % 5 
                        const Lists = (pageConverter === 1 || pageConverter === 4) ? (widthConfig[key][0] - 1) : widthConfig[key][0] 
                        let lightPc = Lists
                        if(lightPc > 3){
                            lightPc = lightPc - 4
                        }
                        originalList.style.marginLeft = `${-Lists * distance}vw`    
                        newArrayWidthConfig[key] = [Lists, ListsCel, lightPc, (widthConfig[key][3]+9)%10]
                        setWidthConfig(newArrayWidthConfig)
                        return {Lists, ListsCel}
                    }
                }
                
                }

            }
    


    const convert = {
        vh: function (px) {
            px = parseFloat(px);
            const wh = window.innerHeight;
            return (px * 100) / wh;
        },
        vw: function (px) {
            px = parseFloat(px);
            const ww = window.innerWidth;
            return (px * 100) / ww;
        }
    }










    const [onCooldown, setOnCooldown] = useState([false, false, false, false, false, false, false, false])
    const cooldown = (delay, key, func, ...params) => {
        const arrayCooldown = onCooldown
        if (!onCooldown[key]) {
            arrayCooldown[key] = true
            setOnCooldown(arrayCooldown)
            func(...params)
            setTimeout(() => {
                const arrayCooldown = onCooldown
                arrayCooldown.splice(key, 1, false)
                setOnCooldown(arrayCooldown)
            }, delay);
        }
    }










    function resize() {
        setTimeout(() => {
            const correctPics = document.getElementsByClassName('Home--list--movie--box--image')
            const correctPic = window.screen.width > 680? document.getElementById(correctPics[0].id): document.getElementById((correctPics[correctPics.length-1]).id)
            const incorrectPics = document.getElementsByClassName('Home--list--movie--box--noImage')
            const buttonsR = document.getElementsByClassName("Home--lists--moveBox--rightMoveButton")
            const buttonsL = document.getElementsByClassName("Home--lists--moveBox--leftMoveButton")
            const correctSizeY = correctPic.clientHeight
            console.log(correctSizeY)
            const arrayIncorrect = [...incorrectPics]
            const arrayIncorrectButtons = [...buttonsR, ...buttonsL]
            arrayIncorrectButtons.forEach((element) => {
                const id = element.id
                document.getElementById(id).style.height = `${correctSizeY + 8}px`
            })
            arrayIncorrect.forEach((element) => {
                const id = element.id
                document.getElementById(id).style.paddingTop = `0px`
                document.getElementById(id).style.paddingBottom = `0`
                document.getElementById(id).style.height = `${correctSizeY}px`
            })
        }, 250);


    }
    const deletAuth = () => {
        setTimeout(() => {
            localStorage.setItem('token', '')

        }, 300);

    }

    const textAnaliser = () => {
        const element = document.getElementById('textOverview')
        const textElement = element.innerHTML
        if (window.screen.width < 570) {
            if (textElement.length > 200) {
                element.innerHTML = `${textElement.substring(0, 200)} ...`
            }
        }
    }
    const touchAnaliser = (x, key) => {
        const xVw = convert.vw(x)
        const touchXVw = convert.vw(touchX)
        let xDirection = touchXVw - xVw
        const list = document.getElementById(`${key}list`)
        let distance = 90
        if (Math.abs(xDirection) > 10) {

            if (xDirection > 0) {
                let newTouchs = firstTimeTouch
                newTouchs[key]= false
                setFirstTimeTouch(newTouchs)
                moveList(distance, 'right', key)
            } else {
                if (!firstTimeTouch[key]) {
                    moveList(distance, 'left', key)
                }
            } {
                const arrayCooldown = onCooldown
                arrayCooldown.splice(key, 1, false)
            }

        }
    }

    const token = JSON.parse(localStorage.getItem('token'))

    return (


        <div className="Home" >
            <div id='logged-image'></div>

            {/* ------------header----------- */}
            <header className="Home--header" id={transparent ? 'transparent' : ''}>
                <div className="Home-header-image">
                    <button className="Home--header--logo" onClick={e => setScrollTop()} />
                </div>

                <ul className="Home--header--genre" >
                    <li>Início</li>
                    <li>Séries</li>
                    <li>Filmes</li>
                    <li>Bombando</li>
                    <li>Minha lista</li>
                    <li>Navegar por idiomas</li>
                </ul>

                <ul className="Home--header--resources" >
                    <li id="search"></li>
                    <li id="notification"></li>
                    <li id='logged--image' onClick={() => (setVisible(!visible), toggleMenu(visible))}></li>
                </ul>
                <button id="loggout" onClick={() => (setVisible(!visible), toggleMenu(visible))} >▼</button>
                <ul id="loggoutMenu" >
                    <li>
                        <div id='userImage' />
                        <span>{token.email}</span>
                    </li>
                    <li>
                        <Link to='/' id='exit' onClick={() => deletAuth()}>Sair da Netflix</Link>
                    </li>
                </ul>

            </header>

            {/* ------------header----------- */}
            {/* ------------banner----------- */}

            <section className="Home--banner">
                <div className="Home--banner--vertical" />
                <div className="Home--banner--horizontal" />
                <div className="Home--banner--recommended">
                    <div onLoad={() => textAnaliser()} className="Home--banner--info">
                        <h2>{recommended.title}{recommended.name}</h2>
                        <div id='textOverview'> {recommended.overview}</div>
                        <div className="Home--banner--info--buttons">
                            <div id='playButton'>
                                <div id='playButtonLogo'>►</div><span>Assistir</span>
                            </div>
                            <div id="infoButton">
                                <div id="infoButtonLogo">i</div><span> Mais informações</span>
                            </div>
                        </div>
                    </div>
                    <img src={`https://image.tmdb.org/t/p/original${recommended.backdrop_path}`} alt='' />


                </div>



            </section>
            {/* ------------banner----------- */}


            {/* ------------linhas----------- */}
            <section className="Home--lists">
                {movieList.map((object, key) => {
                    return (
                        <div key={key} className='Home--listArea'>
                            <h2>{object.title}</h2>
                            <div className="Home--list" id={`list${key}`}>
                                <div className="Home--list--movie--page" id={`rowPage${key}`}> <span id={`page0-${key}`} /> <span id={`page1-${key}`} /> <span id={`page2-${key}`} /> <span id={`page3-${key}`} /> </div>
                                <div className="Home--list--movie--pageCel" id={`rowPageCel${key}`}> <span id={`page0Cel-${key}`} /> <span id={`page1Cel-${key}`} /> <span id={`page2Cel-${key}`} /> <span id={`page3Cel-${key}`} /> <span id={`page4Cel-${key}`} /> <span id={`page5Cel-${key}`} /> <span id={`page6Cel-${key}`} /> <span id={`page7Cel-${key}`} /> <span id={`page8Cel-${key}`} /> <span id={`page9Cel-${key}`} /></div>
                                <div className="Home--list--moveBox">
                                    <button className="Home--lists--moveBox--rightMoveButton" onClick={() => cooldown(700, key, moveList, 90, 'right', key)} id={`buttonRight${key}`}>› </button>
                                    <button className="Home--lists--moveBox--leftMoveButton" onClick={() => cooldown(700, key, moveList, 90, 'left', key)} id={`buttonLeft${key}`}> ‹ </button>
                                </div>
                                <div className="Home--list--movies" id={`${key}list`}>

                                    {object.itens.results.length > 0 && object.itens.results.map((item, key1) => {

                                        return (
                                            <span key1={`${key1}${key}`} className='Home--list--movie'  >
                                                <div  className="Home--list--movie--box">
                                                    <img onTouchEnd={e => (cooldown(700, key, touchAnaliser, e.changedTouches[0].clientX, key))} onTouchStart={(e) => (setTouchX(e.touches[0].clientX))} src={item.backdrop_path === null ? `https://image.tmdb.org/t/p/w400${item.poster_path}` : `https://image.tmdb.org/t/p/w400${item.backdrop_path}`} alt='' className={item.backdrop_path === null ? 'Home--list--movie--box--noImage' : 'Home--list--movie--box--image'} id={`image${key}${key1}`} />
                                                    <div id={`info-box${key}${key1}`} className="Home--list--movie--box--infoBox">
                                                        <h2>{item.name}{item.title}</h2>
                                                        <div id='average'>{(item.vote_average).toFixed(1) * 10 + '% Relevante'}</div>
                                                        <div> {item.overview.length > 350 ? item.overview.substring(0, 350) + '...' : item.overview}</div>
                                                    </div>
                                                </div>
                                            </span>
                                        )
                                    })}
                                </div>
                                <div  className="Home--list--moviesCel" id={`${key}listCel`}>
                                    {object.itens.results.length > 0 && object.itens.results.map((item, key1) => {
                                        return (
                                            <span key1={`${key1}${key}`} className='Home--list--movie'  >
                                                <div className="Home--list--movie--box">
                                                    <img onTouchEnd={e => (cooldown(700, key, touchAnaliser, e.changedTouches[0].clientX, key))} onTouchStart={(e) => (setTouchX(e.touches[0].clientX))} src={item.backdrop_path === null ? `https://image.tmdb.org/t/p/w400${item.poster_path}` : `https://image.tmdb.org/t/p/w400${item.backdrop_path}`} alt='' className={item.backdrop_path === null ? 'Home--list--movie--box--noImage' : 'Home--list--movie--box--image'} id={`imageCel${key}${key1}`} />
                                                    <div id={`info-box${key}${key1}`} className="Home--list--movie--box--infoBox">
                                                        <h2>{item.name}{item.title}</h2>
                                                        <div id='average'>{(item.vote_average).toFixed(1) * 10 + '% Relevante'}</div>
                                                        <div> {item.overview.length > 350 ? item.overview.substring(0, 350) + '...' : item.overview}</div>
                                                    </div>
                                                </div>
                                            </span>
                                        )
                                    })}
                                </div>
                                <section onTouchEnd={e => (cooldown(700, key, touchAnaliser, e.changedTouches[0].clientX, key))} onTouchStart={(e) => (setTouchX(e.touches[0].clientX))} >

                                </section>
                            </div>
                        </div>

                    )
                })}

            </section>
            {/* ------------linhas----------- */}
            {/* ------------Footer----------- */}
            <div className="footer2">

                <div className="footer--container2">

                    <span>Dúvidas? Ligue</span> <a>0800 000 0000</a>
                    <div className="footer--links2">
                        <a>Perguntas frequentes</a>
                        <a>Central de Ajuda</a>
                        <a>Termos de Uso</a>
                        <a>Privacidade</a>
                        <a>Preferências de cookies</a>
                        <a>informações corporativas</a>

                    </div>

                </div>
            </div>


            {/* ------------Footer----------- */}

        </div>
    )
}

export default Home
