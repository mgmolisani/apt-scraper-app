import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import './App.css';

const buttonStyle = {
  fontSize: `2em`,
  alignText: `center`,
};

const pageButtonStyle = {...buttonStyle, width: `50%`};
const viewButtonStyle = {...buttonStyle, width: `100%`};

const GITHUB_URI = `https://api.github.com/repos/mgmolisani/apt-scraper/contents/`;
const LISTINGS_PER_PAGE = 8;

function App() {
  const [data, setData] = useState(``);
  const [page, setPage] = useState(0);
  const [view, setView] = useState(`apartments.tsv`);

  const firstListing = page * LISTINGS_PER_PAGE;
  const nextListing = firstListing + LISTINGS_PER_PAGE;
  const totalApts = data.trim().split(`\n`).length;

  const scrollRef = useRef(null);

  const toggleView = () => view === `apartments.tsv` ? setView(`hotpads.tsv`) : setView(`apartments.tsv`);

  const changePage = step => setPage(p => p + step);

  const incrementPage = () => changePage(1);

  const deccrementPage = () => changePage(-1);

  useLayoutEffect(() => {
    scrollRef.current.scrollTop = 0;
  });

  useEffect(() => {
    fetch(`${GITHUB_URI}${view}`)
      .then(res => res.json())
      .then(data => setData(atob(data.content)));
    setPage(0);
  }, [view]);

  return (
    <div style={{
      display: `flex`,
      flexDirection: `column`,
      height: `100vh`
    }}>
      <div style={{
        flex: `none`,
        display: `flex`,
      }}>
        <h1 style={{
          textAlign: `center`,
          width: `100%`,
        }}>
          Listings for {view === `apartments.tsv` ? `Apartments.com` : `Hotpads.com`}
        </h1>
      </div>
      <div style={{
        overflow: `auto`,
        flex: `auto`,
        boxShadow: `inset 0px 0px 10px 0px rgba(0,0,0,0.15)`
      }}
           ref={scrollRef}>
        <div style={{
          display: `grid`,
          gridTemplateColumns: `repeat(auto-fill, minmax(320px, 1fr)`,
        }}
        >
          {data.trim().split(`\n`).map((row, index) => {
            const values = row.split(`\t`);

            const location = values[0];
            const url = values[1];
            const price = values[2];

            return index >= firstListing && index < nextListing &&
              <div key={`${index}-${view}`} style={{
                margin: `1em`,
                borderRadius: `0.5em`,
                boxShadow: `0px 0px 15px 4px rgba(0,0,0,0.15)`,
                backgroundColor: `white`,
              }}>
                <div style={{
                  position: `relative`,
                  paddingBottom: `100%`,
                }}>
                  <iframe
                    style={{border: 0, width: `100%`, height: `100%`, position: `absolute`,}}
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBwNLgxfMs5h2u3h9GjpAXNeylzCYP0K18&q=${encodeURI(location)}&zoom=13`}
                    allowFullScreen>
                  </iframe>
                </div>
                <div style={{
                  overflow: `hidden`,
                  padding: `1.5em`,
                }}>
                  <a href={url} style={{
                    display: `inline-block`,
                    width: `100%`,
                    fontWeight: `bold`,
                    textDecoration: `none`,
                    color: `black`,
                    marginTop: `0.5em`,
                  }}
                  >
                    {location}
                  </a>
                  <span style={{
                    display: `inline-block`,
                    width: `100%`,
                    textDecoration: `none`,
                    color: `dimgrey`,
                    marginTop: `0.5em`,
                  }}>
                  {price}
                </span>
                </div>
              </div>;
          })}
        </div>
      </div>
      <div style={{
        flex: `none`,
        display: `flex`,
      }}>
        <button style={viewButtonStyle} onClick={toggleView}>
          {view === `apartments.tsv` ? `Show Hotpads.com` : `Show Apartments.com`}
        </button>
      </div>
      <div style={{
        flex: `none`,
        display: `flex`,
      }}>
        <button style={pageButtonStyle} onClick={deccrementPage} disabled={firstListing === 0}>
          Previous
        </button>
        <button style={pageButtonStyle} onClick={incrementPage} disabled={nextListing >= totalApts}>
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
