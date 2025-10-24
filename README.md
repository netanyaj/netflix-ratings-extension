# Netflix Ratings Extension

A Tampermonkey userscript that automatically displays IMDb and Rotten Tomatoes ratings directly on Netflix movie and TV show thumbnails, eliminating the need to search for ratings separately.

![Demo Screenshot](screenshots/demo.png)

## 🌟 Features

- **Real-time Ratings**: Automatically fetches and displays IMDb ratings and Rotten Tomatoes scores
- **Non-intrusive Design**: Clean badge overlay in the corner of thumbnails
- **Smart Caching**: Remembers ratings to minimize API calls
- **Dynamic Loading**: Works with Netflix's infinite scroll and dynamic content
- **Fast Performance**: Optimized with debouncing and efficient DOM manipulation

## 🚀 Installation

### Prerequisites
- [Tampermonkey](https://www.tampermonkey.net/) browser extension installed
- OMDb API key (free) - [Get one here](http://www.omdbapi.com/apikey.aspx)

### Steps
1. Install Tampermonkey for your browser:
   - [Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - [Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

2. Get your free OMDb API key:
   - Visit [OMDb API](http://www.omdbapi.com/apikey.aspx)
   - Select the FREE tier (1,000 requests/day)
   - Verify your email

3. Install the script:
   - Click here: [Install Script](https://github.com/netanyaj/netflix-ratings-extension/raw/main/netflix-ratings.user.js)
   - Tampermonkey will open automatically
   - Click "Install"

4. Configure your API key (two methods):
   - Method 1 (Recommended):
     - Click on the Tampermonkey icon in your browser
     - Find "Netflix IMDb & Rotten Tomatoes Ratings" in the menu
     - Click "Set OMDB API Key"
     - Enter your API key in the prompt
     - Refresh Netflix to apply changes
   - Method 2 (Manual):
     - Open Tampermonkey dashboard
     - Find "Netflix IMDb & Rotten Tomatoes Ratings"
     - Click edit
     - Replace `<YOUR_OMDB_API_KEY>` with your actual API key
     - Save (Ctrl+S)

5. Browse Netflix and enjoy instant ratings!

## 📸 Screenshots

*Ratings appear automatically as you browse*

## 🛠️ Technical Details

### Technologies Used
- **JavaScript (ES6+)**: Core scripting language
- **Tampermonkey API**: Browser extension framework
- **OMDb API**: Movie and TV show metadata
- **MutationObserver**: Dynamic DOM monitoring
- **CSS3**: Badge styling and animations

### Key Features Implementation
- **Caching Strategy**: In-memory cache prevents redundant API calls
- **DOM Observation**: MutationObserver detects dynamically loaded content
- **Debouncing**: Scroll events are debounced for optimal performance
- **Fallback Selectors**: Multiple title extraction methods for reliability

## 🎯 Use Cases

- **Movie Selection**: Make informed viewing decisions without leaving Netflix
- **Quality Filtering**: Quickly identify highly-rated content
- **Time Saving**: No more tab-switching to check ratings
- **Discover Hidden Gems**: Spot high-rated shows you might have missed

## 🔧 Configuration

The script can be customized by editing these variables:

```javascript
// The API key can be set via the Tampermonkey menu or directly in the script
const OMDB_API_KEY = '<YOUR_OMDB_API_KEY>';  // Your API key
```

## 📝 Future Enhancements

- [ ] Add Metacritic scores
- [ ] Implement custom rating thresholds with color coding
- [ ] Add click-through links to IMDb/RT pages
- [ ] Support for multiple languages
- [ ] User settings panel for customization
- [ ] Local storage for persistent caching

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OMDb API](http://www.omdbapi.com/) for providing movie data
- Netflix for the streaming platform
- Tampermonkey for the userscript framework

## 📧 Contact

netanyaj - [GitHub Profile](https://github.com/netanyaj)

Project Link: [https://github.com/netanyaj/netflix-ratings-extension](https://github.com/netanyaj/netflix-ratings-extension)

---
