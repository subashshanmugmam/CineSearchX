import React from 'react'

const Moviecard = ({movie}) => {
  // Extract properties from RapidAPI Movies Database structure
  const title = movie.titleText?.text || movie.originalTitleText?.text || 'Unknown Title';
  const releaseYear = movie.releaseYear?.year || movie.releaseDate?.year || 'N/A';
  const rating = movie.ratingsSummary?.aggregateRating || 'N/A';
  const posterUrl = movie.primaryImage?.url || '/no-movie.png';
  
  return (
    <div className="movie-card">
       <p className="text-white">{title}</p>
       <img src={posterUrl}
       alt={title} />
       <div className="mt-4">
         <h3>{title}</h3>
         <div className='content'>
             <div className='rating'>
                 <img src='./star.svg' alt='Star Icon' />
                 <p>{rating !== 'N/A' ? rating.toFixed(1) : 'N/A'}</p>
             </div>
             <span>.</span>
             <p className='lang'>{movie.originalTitleText?.text ? 'EN' : 'N/A'}</p>
             <span>.</span>
             <p className='year'>{releaseYear}</p>
         </div>
         </div>
     </div>
  )
}

export default Moviecard