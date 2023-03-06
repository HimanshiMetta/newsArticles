import './App.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { FaSearch } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const url =
  'https://techcrunch.com/wp-json/wp/v2/posts?per_page=20&context=embed'

function App() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const fetchArticles = async (url) => {
    setLoading(true)
    try {
      const response = await axios.get(`${url}`)
      const values = response.data
      setArticles(values)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setError(true)
      setLoading(false)
    }
  }

  const formatTexts = (title) => {
    let heading = title.replaceAll('&#8217;', "'")
    heading = heading.replaceAll('&#8216;', "'")
    heading = heading.replaceAll('&#038;', '&')
    heading = heading.replaceAll('&#8220;', '"') //&#8220; "
    heading = heading.replaceAll('&#8221;', '"') //&#8221; "
    heading = heading.replaceAll('[&hellip;]</p>', '') //[&hellip;]</p> ""
    heading = heading.replaceAll('<p>', '') //<p> ""
    heading = heading.replaceAll('</p>', '')
    return heading
  }

  useEffect(() => {
    fetchArticles(url)
  }, [])

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          fontSize: '2em',
        }}
      >
        <h1>Error!</h1>
      </div>
    )
  }
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          fontSize: '2em',
        }}
      >
        <h1>Loading...</h1>
      </div>
    )
  }
  return (
    <Wrapper>
      <div className='articles-container' style={{ padding: '300px' }}>
        {articles.map((article) => {
          const {
            id,
            date,
            link,
            title,
            excerpt,
            jetpack_featured_media_url,
            author,
          } = article
          let heading = formatTexts(title.rendered)
          let info = formatTexts(excerpt.rendered)
          return (
            <div key={id} className='container' style={{ borderRadius: '5%' }}>
              <a href={link}>
                <img src={jetpack_featured_media_url} alt={id} />
              </a>
              <footer>
                <p className='date'>{date.substring(0, 10)}</p>
                <p className='title'>{heading}</p>
                <p className='details'>{info.substring(0, 150)}...</p>
                <p className='creator'>Author: {author}</p>
              </footer>
            </div>
          )
        })}
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.main`
  .articles-container {
    display: grid;
    gap: 4rem 2.5rem;
    grid-template-columns: repeat(3, 1fr);
  }

  .container {
    position: relative;
    background: var(--clr-black);
    box-shadow: 0 15px 30px 0 rgba(0, 0, 0, 0.11),
      0 5px 15px 0 rgba(0, 0, 0, 0.08);
    background-color: #ffffff;
    border-radius: 0.5rem;
    border-left: 0 solid #00ff99;
    transition: border-left 300ms ease-in-out, padding-left 300ms ease-in-out;
  }

  .container:hover {
    transform: translateY(-0.5%);
  }

  img {
    width: 100%;
    height: 147.767px;
    display: block;
    object-fit: cover;
    border-radius: 0.5rem;
    transition: var(--transition);
  }

  .container:hover img {
    opacity: 0.5;
  }

  footer {
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .date {
    font-family: monospace;
    font-size: 16px;
    display: flex;
    align-self: flex-end;
    color: lightslategrey;
  }

  .title {
    font-family: monospace;
    font-size: 19px;
    font-weight: 700;
  }

  .details {
    font-family: monospace;
    font-size: 16px;
    font-weight: 400;
    text-align: justify;
  }

  .creator {
    font-family: monospace;
    font-size: 16px;
    color: lightslategrey;
    display: flex;
    align-self: flex-end;
  }
`

export default App
