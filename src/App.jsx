import React, {useEffect, useState } from 'react'

import Api from './components/api'
import MovieRow from './components/MovieRow';
import Featuredmovie from './components/FeaturedMovie';
import Header from './components/Header'



import  './App.css'

export default function App () {

  const [movieList, setMovieList] = useState([])
  const [featuredData, setFeaturedData] = useState(null)
  const [blackHeader, setBlackHeader] = useState (false)

  useEffect (() => {
    const loadAll = async () => {
      // pegando toda a lista de filmes

      let list = await Api.getHomeList();
      setMovieList(list)
      console.log(list)
      
      // pegando o featured
      let originals = list.filter( i => i.slug === 'originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].itens.results.length -1))
      let chosen = originals[0].itens.results[randomChosen]
      let chosenInfo = await Api.getMovieInfo(chosen.id, 'tv')

      setFeaturedData(chosenInfo)
    }
    loadAll()
  }, []);


  useEffect (()=> {
    // monitoramento do scroll da página


    const scrollListener = () => {
      if(window.scrollY > 30) {
        setBlackHeader(true)
      } else {
        setBlackHeader(false)
      }
    }

    window.addEventListener('scroll', scrollListener);
    return () => {
      window.removeEventListener('scroll', scrollListener)
    }
  },[])

  return(
    <div className='page'>

      <Header black={blackHeader}/>

      {
        featuredData && <Featuredmovie item={featuredData} />
      }


      <section className='lists'>
        {movieList.map((item, key)=>(
          <MovieRow key={key} title={item.title} itens= {item.itens}/>
        )
        )}
      </section>

      <footer>
        <p>Feito por <a href="https://vicemanu.github.io/portfolio/"> Victor Mielke  </a> pela aulas do <a href="https://www.youtube.com/c/BoniekyLacerdaLeal"> Bonieky lacerda.</a></p>
        <p>
          Direitos de imagem <a href="https://www.netflix.com/browse">Netflix.</a>
        </p>
          <p>Dados pegos do site <a href="https://www.themoviedb.org/">themoviedb.org</a></p>
      </footer>

        {movieList.length <= 0 &&
      <div className='loading'>
        <img src="https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif" alt="carregando" />
      </div>
      }
    </div>
  )
  }
