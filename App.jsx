import { useState, useEffect } from "react";

function App() {
  const [article, setArticle] = useState(null);

  const [selectedText, setSelectedText] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  // const [pageViews, setPageViews] = useState(null);
  // const [articleTitle, setArticleTitle] = useState(null);

  useEffect(() => {
    // fetchRandomArticle();
    // handleArticleClick();
    addSelectionListener();
  }, []);

  // const fetchRandomArticle = async () => {
  //   try {
  //     setPageViews(0);
  //     const response = await fetch(
  //       "https://en.wikipedia.org/api/rest_v1/page/random/html"
  //     );
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch article");
  //     }
  //     let html = await response.text();

  //     // Find and remove the references section
  //     html = html.replace(
  //       /<h2.*?id="References".*?<\/h2>[\s\S]*?<(?:div|table)[^>]+class=".*?references.*?">[\s\S]*?<\/(?:div|table)>/,
  //       ""
  //     );

  //     const parser = new DOMParser();
  //     const doc = parser.parseFromString(html, "text/html");
  //     const titleElement = doc.querySelector("title");
  //     const title = titleElement
  //       ? titleElement.textContent.replace(/\s/g, "_")
  //       : "Unknown";
  //     setArticleTitle(title);
  //     console.log("see", title);
  //     setArticle(html);
  //   } catch (error) {
  //     console.error(error);
  //   }
  //   fetchPageViews();
  // };

  // const fetchPageViews = async () => {
  //   try {
  //     const yesterday = new Date();
  //     yesterday.setDate(yesterday.getDate() - 1);
  //     const yesterdayFormatted = yesterday
  //       .toISOString()
  //       .slice(0, 10)
  //       .replace(/-/g, "");
  //     const response = await fetch(
  //       `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/${articleTitle}/daily/${yesterdayFormatted}/${yesterdayFormatted}`
  //     );
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch article's pageview");
  //     }
  //     const data = await response.json();
  //     console.log("bet", data.items[0].views);
  //     // if (data.items[0].views) {
  //     //   fetchRandomArticle();
  //     // }
  //     setPageViews(data.items[0].views);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(
          searchQuery
        )}?redirects=1`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }

      let html = await response.text();

      html = html.replace(
        /<h2.*?id="References".*?<\/h2>[\s\S]*?<(?:div|table)[^>]+class=".*?references.*?">[\s\S]*?<\/(?:div|table)>/,
        ""
      );
      setArticle(html);
    } catch (error) {
      console.error(error);
      setArticle("No Articles");
    }
  };

  const addSelectionListener = () => {
    document.addEventListener("selectionchange", handleSelectionChange);
  };

  const handleSelectionChange = () => {
    const selectedText = window.getSelection().toString();
    setSelectedText(selectedText);
    console.log();
  };

  const handleLinkClick = async (event) => {
    event.preventDefault();
    const linkWord = event.target.textContent.trim();
    if (event.target.nodeName === "A" && event.target.hasAttribute("href")) {
      try {
        const response = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(
            linkWord
          )}?redirects=1`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch linked article");
        }
        const html = await response.text();
        setArticle(html);
      } catch (error) {
        console.error(error);
        setArticle("Failed to load linked article");
      }
    }
  };

  return (
    <div className="App">
      <h1>Wiki Passion</h1>
      {selectedText && (
        <div>
          <p>{selectedText}</p>
          <button>Post</button>
        </div>
      )}
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Enter article title"
        />
        <button type="submit">Search</button>
      </form>

      {article && (
        <div
          dangerouslySetInnerHTML={{ __html: article }}
          onClick={handleLinkClick}
        ></div>
      )}
    </div>
  );
}

export default App;
