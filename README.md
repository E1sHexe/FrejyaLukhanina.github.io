# Portfolio Website

A minimalist, JSON-driven photography portfolio website designed for photographers and creatives. Built with vanilla HTML, CSS, and JavaScript.

## Features

- **JSON-Driven Content**: Update your entire portfolio (images, text, contact info) by editing a single `content.json` file.
- **Minimalist Design**: Dark mode aesthetic with brutalist touches and smooth micro-interactions.
- **Responsive**: Fully responsive layout that works beautifully on mobile, tablet, and desktop.
- **Lightbox**: Custom image viewer with keyboard navigation and touch swipe support.
- **No Build Step**: Works directly in the browser. No Node.js, Webpack, or complex build tools required.

## How to Customize

1.  Open `content.json`.
2.  Update the `pageName` with your name or brand.
3.  Add your own galleries in the `galleries` object.
    *   `images`: Array of image URLs.
    *   `tags`: Array of short descriptive tags.
    *   `description`: A brief description of the collection.
4.  **Hero Section**: Add a `hero` object to customize the homepage banner.
    *   `title`: Main headline.
    *   `subtitle`: Subheadline.
    *   `ctaText`: Text for the call-to-action button.
    *   `backgroundImage`: URL for the hero background.
5.  Update the `contact` section with your details.

## Deployment

This site is ready for **GitHub Pages**.

1.  Push this repository to GitHub.
2.  Go to **Settings** > **Pages**.
3.  Select the `main` branch as the source.
4.  Your site will be live in minutes!

## Local Development

Since this site uses `fetch()` to load the JSON file, you must run it on a local server (browsers block file:// protocol fetch requests).

You can use any simple HTTP server. For example:

**Python**:
```bash
python -m http.server
```

**Node.js (http-server)**:
```bash
npx http-server .
```


Then open `http://localhost:8000` (or the port shown) in your browser.

## SEO & Static Content Generation

To improve search engine discoverability, this project includes a script to generate static HTML versions of your content and a sitemap.

1.  **Run the generation script**:
    ```bash
    node scripts/generate.js
    ```

2.  **Output**:
    -   `home.html`, `contact.html`, `gallery-*.html`: Static HTML files with your content for crawlers.
    -   `sitemap.xml`: XML sitemap for search engines.
    -   `robots.txt`: Robots exclusion standard file pointing to your sitemap.

**Note**: These generated files contain a JavaScript redirect to the main single-page application (SPA) for human visitors.

## Project Structure

-   `index.html`: The main entry point for the Single Page Application (SPA).
-   `content.json`: The data source for your portfolio.
-   `scripts/generate.js`: Node.js script to generate static SEO files.
-   `css/`: Stylesheets.
-   `js/`: JavaScript logic for the SPA.
-   `assets/` (optional): Recommended folder for your images.
