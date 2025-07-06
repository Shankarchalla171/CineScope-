import React from 'react'

const Search=({ input, setinput})=>{
    return(
        <div className="search">
            <div>
                <img src="./search.svg" alt="search-img" />
                <input type="text" placeholder='Search through thousands of movies' value={input}
                   onChange={(event)=>setinput(event.target.value)}
                />
            </div>
        </div>
    )
}

export default Search