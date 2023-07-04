import { useState, useEffect } from "react"

const style = {
  input: "border-2 p-2 w-[350px]",
  tr: "",
  th: "p-2 border text-slate-900",
  td: "p-2 border"
}

function App() {
  const [name, setName] = useState("")
  const [year, setYear] = useState("")
  const [movieId, setMovieId] = useState(null)
  const [updating, setUpdating] = useState(false)

  const [movies, setMovies] = useState([])
  console.log("movies: ", movies)

  useEffect(() => {
    fetch("/api/movies")
      .then(res => res.json())
      .then(json => setMovies(json.movies))
      .catch(err => console.log(err))
  }, [])

  const createMovie = async () => {
    try {
      const res = await fetch("/api/movies", { method: "POST", body: JSON.stringify({ name, year }) })
      const json = await res.json()
      setMovies([...movies, json.movie])
      setName("")
      setYear("")
    } catch (error) {
      console.log(error)
    }
  }

  const updateMovie = async () => {
    try {
      const res = await fetch(`/api/movies/${movieId}`, { method: "PATCH", body: JSON.stringify({ name, year }) })
      const json = await res.json()

      const moviesCopy = [...movies]
      const index = movies.findIndex(m => m.id === movieId)
      moviesCopy[index] = json.movie

      setMovies(moviesCopy)
      setName("")
      setYear("")
      setUpdating(false)
      setMovieId(null)
    } catch (error) {
      console.log(error)
    }
  }

  const submitForm = async event => {
    event.preventDefault()
    if (updating) {
      updateMovie()
    } else {
      createMovie()
    }
  }

  const deleteMovie = async id => {
    try {
      await fetch(`/api/movies/${id}`, { method: "DELETE" })

      setMovies(movies.filter(m => m.id !== id))
    } catch (error) {
      console.log(error)
    }
  }

  const setFormToUpdate = async id => {
    try {
      const movie = movies.find(m => m.id === id)
      if (!movie) return
      setUpdating(true)
      setMovieId(movie.id)
      setName(movie.name)
      setYear(movie.year)
    } catch (error) {
      console.log(error)
    }
  }

  if (movies?.length === 0) {
    return <div>Loading...</div>
  }

  return (
    <div className="w-full bg-slate flex justify-center items-start">
      <div className="w-full max-w-[1020px] p-4 flex flex-col items-stretch gap-10 pt-6">
        <h1 className="self-center text-2xl font-bold">Movies</h1>
        <form onSubmit={submitForm} className="flex gap-2">
          <input type="text" name="name" value={name} onChange={e => setName(e.target.value)} className={`flex-1 ${style.input}`} placeholder="Name" />
          <input type="number" name="year" value={year} onChange={e => setYear(e.target.value)} className={`flex-1 ${style.input}`} placeholder="Year" />
          <input type="submit" value={updating ? "Update" : "Create"} className="bg-blue-400 hover:bg-slate-500 text-white py-2 px-6" />
        </form>

        <table className="border">
          <thead>
            <tr className={`${style.tr}`}>
              <th className={`${style.th}`}>Id</th>
              <th className={`${style.th}`}>Name</th>
              <th className={`${style.th}`}>Year</th>
              <th className={`${style.th}`}>Action</th>
            </tr>
          </thead>
          <tbody>
            {movies?.map(movie => {
              return (
                <tr key={movie?.id} className={`${style.tr}`}>
                  <td className={`${style.td}`}>{movie?.id}</td>
                  <td className={`${style.td}`}>{movie?.name}</td>
                  <td className={`${style.td}`}>{movie?.year}</td>
                  <td className={`${style.td} flex gap-2`}>
                    <button onClick={() => setFormToUpdate(movie?.id)} className="px-2 py-2 bg-slate-100 hover:bg-gray-300">
                      Update
                    </button>
                    <button onClick={() => deleteMovie(movie?.id)} className="px-2 py-2 bg-slate-100 hover:bg-gray-300">
                      Delete
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App
