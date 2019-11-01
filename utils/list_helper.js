const dummy = (blogs) => {
  return 1
}

const totalLikes = blog => blog.reduce(( accumulator, blogLikes) => {

  return accumulator + blogLikes.likes
  }, 0)

const favoriteBlog = blog => {
  const reducer = (previousLikes, currentLikes) => {

    return (previousLikes > currentLikes.likes) ? previousLikes : currentLikes.likes
  }

  return blog.reduce(reducer, 0)
}


  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
  }
