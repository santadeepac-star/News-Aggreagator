// Dashboard.jsx

import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const newsRef = useRef(null);

  // STATES
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const [search, setSearch] = useState("");
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [category, setCategory] = useState("");
  const [channel, setChannel] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  const [isListening, setIsListening] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);

  // WEATHER
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);

  // TRENDING
  const [trendingNews, setTrendingNews] = useState([]);

  // API KEYS
  const NEWS_API_KEY = "YOUR_GNEWS_API_KEY";
  const WEATHER_API_KEY = "YOUR_WEATHER_API_KEY";

  // DARK MODE
  const toggleMode = () => {
    const newTheme = !isDarkMode;

    setIsDarkMode(newTheme);

    localStorage.setItem(
      "theme",
      newTheme ? "dark" : "light"
    );
  };

  // APPLY THEME
  useEffect(() => {
    document.body.className = isDarkMode
      ? "dark-mode"
      : "light-mode";
  }, [isDarkMode]);

  // VOICE SEARCH
  const startVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice Search not supported");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.start();

    setIsListening(true);

    recognition.onresult = (event) => {
      setSearch(event.results[0][0].transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };
  };

  // FETCH WEATHER
  const fetchWeather = async () => {
    if (city.trim() === "") return;

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
      );

      const data = await response.json();

      setWeather(data);
    } catch (error) {
      console.log(error);
    }
  };

  // FETCH NEWS
  const fetchNews = async () => {
    try {
      setLoading(true);

      let url = "";

      if (search.trim() !== "") {
        url = `https://gnews.io/api/v4/search?q=${search}&lang=en&max=10&page=${page}&apikey=${NEWS_API_KEY}`;
      } else if (channel !== "") {
        url = `https://gnews.io/api/v4/search?q=${channel}&lang=en&max=10&page=${page}&apikey=${NEWS_API_KEY}`;
      } else {
        url = `https://gnews.io/api/v4/top-headlines?category=${
          category || "general"
        }&lang=en&country=in&max=10&page=${page}&apikey=${NEWS_API_KEY}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.articles) {
        const updatedNews = data.articles.map((item) => ({
          ...item,
          rating: Math.floor(Math.random() * 5) + 1,
        }));

        if (page === 1) {
          setNews(updatedNews);
        } else {
          setNews((prev) => [...prev, ...updatedNews]);
        }
      } else {
        setNews([]);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // TRENDING NEWS
  const fetchTrendingNews = async () => {
    try {
      const response = await fetch(
        `https://gnews.io/api/v4/top-headlines?lang=en&country=in&max=5&apikey=${NEWS_API_KEY}`
      );

      const data = await response.json();

      if (data.articles) {
        setTrendingNews(data.articles);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // INITIAL FETCH
  useEffect(() => {
    fetchNews();
  }, [category, channel, page]);

  // TRENDING FETCH
  useEffect(() => {
    fetchTrendingNews();
  }, []);

  // INFINITE SCROLL
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight +
          document.documentElement.scrollTop + 1 >=
          document.documentElement.scrollHeight &&
        !loading
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, [loading]);

  // BOOKMARK
  const handleBookmark = (item) => {
    const alreadyBookmarked = bookmarks.find(
      (bookmark) => bookmark.url === item.url
    );

    if (alreadyBookmarked) {
      alert("Already Bookmarked");
      return;
    }

    setBookmarks([...bookmarks, item]);

    alert("News Bookmarked");
  };

  // FILTER + SORT
  const filteredNews = news
    .filter((item) =>
      item.title
        ?.toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "ratings") {
        return b.rating - a.rating;
      }

      return 0;
    });

  return (
    <div
      className={`dashboard ${
        isDarkMode ? "dark-mode" : "light-mode"
      }`}
    >
      <h1 className="header">Geosphere 🌏</h1>

      {/* TOPBAR */}
      <div className="topbar">
        <button onClick={toggleMode}>
          {isDarkMode
            ? "☀️ Light Mode"
            : "🌙 Dark Mode"}
        </button>

        <button
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/");
          }}
        >
          Logout
        </button>
      </div>

      {/* SEARCH */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Search news..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <button
          onClick={() => {
            setPage(1);
            fetchNews();

            newsRef.current?.scrollIntoView({
              behavior: "smooth",
            });
          }}
        >
          Search 🔍
        </button>

        <button onClick={startVoiceSearch}>
          {isListening
            ? "🎙️ Listening..."
            : "🎤 Voice"}
        </button>
      </div>

      {/* WEATHER */}
      <div className="weather-card">
        <h2>Weather 🌤️</h2>

        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) =>
            setCity(e.target.value)
          }
        />

        <button onClick={fetchWeather}>
          Check Weather
        </button>

        {weather && weather.main && (
          <div>
            <h3>{weather.name}</h3>

            <p>
              🌡️ {weather.main.temp}°C
            </p>

            <p>
              ☁️ {weather.weather[0].main}
            </p>
          </div>
        )}
      </div>

      {/* CATEGORIES */}
      <div className="categories">
        <button
          onClick={() => {
            setCategory("technology");
            setPage(1);
          }}
        >
          Technology
        </button>

        <button
          onClick={() => {
            setCategory("sports");
            setPage(1);
          }}
        >
          Sports
        </button>

        <button
          onClick={() => {
            setCategory("business");
            setPage(1);
          }}
        >
          Business
        </button>
      </div>

      {/* NEWS */}
      <div
        className="cards-container"
        ref={newsRef}
      >
        {filteredNews.map((item, index) => (
          <Link
            key={index}
            to="/news-details"
            state={item}
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div className="card">
              <button
                className="bookmark-btn"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  handleBookmark(item);
                }}
              >
                🔖
              </button>

              <img
                src={
                  item.image ||
                  "https://via.placeholder.com/300"
                }
                alt="news"
              />

              <h2>{item.title}</h2>

              <p>{item.description}</p>

              <p>
                ⭐ {item.rating}/5
              </p>

              <p>{item.source?.name}</p>
            </div>
          </Link>
        ))}
      </div>

      {loading && (
        <h2 style={{ textAlign: "center" }}>
          Loading...
        </h2>
      )}
    </div>
  );
}

export default Dashboard;