import { useState,useEffect } from 'react'
import { useDebounce } from 'use-debounce';
import Search from './components/search'
import Moviecard from './components/moviecard';
import './App.css'
import { updatdcount } from './appwrite';


 const API_BASE_URL="https://api.themoviedb.org/3";
 const API_KEY=import.meta.env.VITE_TMDB_API_KEY;

 const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YzJhOTgyZjcwZjFkMjc0ZjlhYzM4MTYyNDQwZDBlOSIsIm5iZiI6MTc0NzU1MjEyMS4xMjYwMDAyLCJzdWIiOiI2ODI5ODc3OTAwZDFjZWM2YzFkYjI1OTQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0._EyHwvUX--NPmCqkw7YL6UAvdCOoI1uk09p_xdqZUHk'
  }
};

function App() {
 
  const [input,setinput]=useState("");
  const [deInput]=useDebounce(input,500);
  const [error,seterror]=useState(null);
  const [movieList,setmovieList]=useState([]);
  const [isloading,setisloading]=useState(false);


 console.log(deInput);

  const fetchMovies= async(query)=>{
     setisloading(true);
     seterror("");
    try {

      const END_POINT = query ?`${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&include_adult=false`
      :`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`

      let response=await fetch(END_POINT,options);
      console.log(response);

      if(!response.ok)
      {
         throw new Error('failed to fetch movies');
      }

      let data=await response.json();

      if(data.Resonse === 'False'){
         seterror(data.error || 'failed to fetch the moviess');
         setmovieList([]);
         return ;
      }
      console.log(data);
      setmovieList(data.results || []);
      updatdcount();
      console.log(movieList);
      
    } catch (error) {
      console.log(`error in fetching the movies :${error}`);
    }finally{
      setisloading(false);
    }
  }

 useEffect(()=>{

  fetchMovies(deInput);

 },[deInput])

  return (
    <>
     <main>
        <div className="pattern">
          <div className="wrapper">
              <header>
                <img src="./hero.png" alt="hero-bg" />
                <h1>Find <span className='text-gradient'>Movies</span> you will enjoy without the hassle</h1>
                <Search input={input} setinput={setinput}/>
              </header>
              <section className='all-movies'>
                 <h2 className='mt-[40px]'>All Movies</h2>
                {
                  isloading ?(
                    <p className='text-white'>Loading.....</p>
                  ) : error ?(
                    <p className='text-white'>{error}</p>
                  ): movieList && movieList.length>0 &&(
                    <ul>
                       {
                          movieList.map((movie)=>(
                           <Moviecard key={movie.id} movie={movie}/>
                          ))
                       }
                    </ul>
                  )
                }
              </section>
              
          </div>
        </div>
     </main>
    </>
  )
}

export default App
