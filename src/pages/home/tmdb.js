
const API_KEY = '3038f162cb27c4f669f6a78631c6c74d'
const apiText = `&api_key=${API_KEY}`
const baseUrl = 'https://api.themoviedb.org/3'
const language = '&language=pt-BR'
/*
Lançamentos
Em alta
Só na NetFlix
Documentarios
Comedia
Séries
Drama
ação
*/

// const reqApi = async (endPoint)=>{
//     const req = await Axios.get(`${baseUrl}${endPoint}`,{}).then(response =>{
//         console.log(response.data)
//         return response.data})
    
// }

const reqApi = async (endPoint)=>{
    const req = await fetch(`${baseUrl}${endPoint}`)
    const json = await req.json()
    return json
}

export default {
    getHomeList: async()=>{
        return[
            {
                slug:'originals',
                title:'Só na Netflix',
                itens:await reqApi(`/discover/tv?with_network=213?${language}${apiText}`)
            },
            {
                slug:'toprated',
                title:'Em Alta',
                itens:await reqApi(`/movie/top_rated?${language}${apiText}`)
            },
            {
                slug:'trending',
                title:'Recomendado para você',
                itens: await reqApi(`/trending/all/week?${language}${apiText}`),
            },
            {
                slug:'action',
                title:'Ação',
                itens:await reqApi(`/discover/movie?with_genres=28${language}${apiText}`)
            },
            {
                slug:'comedy',
                title:'Comédia',
                itens:await reqApi(`/discover/movie?with_genres=35${language}${apiText}`)

            },
            {
                slug:'horror',
                title:'Terror',
                itens:await reqApi(`/discover/movie?with_genres=27${language}${apiText}`)
            },
            {
                slug:'romance',
                title:'Romance',
                itens:await reqApi(`/discover/movie?with_genres=10749${language}${apiText}`)
            },
            {
                slug:'documentary',
                title:'Documentários',
                itens:await reqApi(`/discover/movie?with_genres=99${language}${apiText}`)
            },
        ]
    },

    getBannerInfo: async (movieId, type)=>{
        let info = {}

        if (movieId) {
            switch(type){
                case 'movie':
                    info = await reqApi(`/movie/${movieId}?${language}${apiText}`)
                break;
                    case 'tv':
                    info = await reqApi(`/tv/${movieId}?${language}${apiText}`)
                break;
            }
        return(info)
        }


    }



}