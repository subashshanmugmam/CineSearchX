import React from 'react'


const Search = ({searchTerm,setsearchTerm}) => {

  return (
    <div className="search">
        <div>
            <img src="./Search.svg" alt="search" /> 
            <input
                type="text"
                placeholder="Search through thousands of  movie"
                value={searchTerm}
                onChange={(e) => setsearchTerm(e.target.value)}
            />
            </div>
    </div>
  )
}

export default Search