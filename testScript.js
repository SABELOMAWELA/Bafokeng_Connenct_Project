async function initializeRouter(path) {
  try {
      await import(path);
      const router = new Router();
      // console.log(router.getPath(window.location.pathname));
  } catch (error) {
      throw new Error(`Error No Router: ${error} | ${path}.`);
  }
}
// initializeRouter(`${window.location.origin}/app/router.js`);


////////////////////////////////////////////////


console.log(body.querySelectorAll("script"))
Object.values(body.querySelectorAll("script")).map((thisScript) => {
  if(thisScript.getAttribute('src') === './init.js'){
    thisScript.remove();
  }
});


////////////////////////////////////////////


const script = new Function('"use strict";' + text)();
    const router = script(); // Assuming the script exports a function and assigns it to 'router'

    // Now you can call the router function with your router logic
    router(); // Call the function to execute the loaded code

    // Method for data binding in templates (optional)
  renderTemplate(template) {
    // You can implement data binding logic here using string interpolation or templating libraries
    // This example uses basic string replacement with curly braces ({ })
    return template.replace(/\{\{([^}]+)}}/g, (match, key) => this.data[key] || "");
  }


////////////////////////////////////////////////////


// Define routes as an object
const routes = {
    '/': 'home.html',
    '/about': 'about.html',
    '/contact': 'contact.html',
    // Add more routes as needed
  };
  
  // Function to handle route changes
  function navigate(path) {
    // Check if route exists
    if (!routes.hasOwnProperty(path)) {
      console.warn(`Route not found: ${path}`);
      return;
    }
  
    // Load content from the corresponding HTML file
    const contentUrl = routes[path];
    fetch(contentUrl)
      .then(response => response.text())
      .then(htmlContent => {
        const contentContainer = document.getElementById('content'); // Assuming you have a content container element
        contentContainer.innerHTML = htmlContent;
        // Update document title (optional)
        document.title = path.slice(1) + ' | Your Website Name'; // Remove leading slash for title
      })
      .catch(error => {
        console.error('Error loading content:', error);
        // Handle errors gracefully (e.g., display an error message)
      });
  }
  
  // Handle initial route based on URL hash (optional)
  window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash;
    navigate(hash || '/'); // Load content based on hash or default route
  });
  
  // Handle hash changes for navigation
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash;
    navigate(hash);
  });
  
  // Add navigation link click event listeners (optional)
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault(); // Prevent default anchor link behavior
      const href = link.getAttribute('href');
      navigate(href);
    });
  });

  
//////////////////////////////////////////////////////


// Define routes (hash-based routing)
const routes = {
    '/': 'home.html',
    '/about': 'about.html',
    '/contact': 'contact.html',
    // Add more routes as needed
  };
  
  // Get the current route (hash) from URL
  function getCurrentRoute() {
    return window.location.hash.slice(1) || '/'; // Default to '/' for no hash
  }
  
  // Function to load and render content based on route
  function loadContent(route) {
    const contentContainer = document.getElementById('content');
    fetch(`./content/${routes[route]}`)
      .then(response => response.text())
      .then(htmlContent => {
        contentContainer.innerHTML = htmlContent;
      })
      .catch(error => {
        console.error('Error loading content:', error);
        // Handle errors gracefully, like displaying a 404 page
      });
  }
  
  // Navigation handling function
  function navigate(route) {
    window.location.hash = route;
    loadContent(route);
  }
  
  // Add event listeners to navigation links (assuming links have class="nav-link")
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault(); // Prevent default link behavior (full page reload)
      navigate(link.getAttribute('href').slice(1)); // Extract route from href
    });
  });
  
  // Load initial content based on current route
  window.addEventListener('DOMContentLoaded', () => {
    loadContent(getCurrentRoute());
  });
  
  // Optional: Handle popstate event (browser back/forward buttons)
  window.addEventListener('popstate', () => {
    loadContent(getCurrentRoute());
  });

  //////////////////////////////////////////////////////////


  
      
      

  function isFile(path) {
    let result;
    if(typeof path === 'string' && path !== null){
        const request = new XMLHttpRequest();
        request.open('HEAD', path, false); // Use synchronous request for simplicity
        request.send();
        result =  (request.status === 200 && /\.(html|php|tpl)$/.test(path));
    }
    else {
        result = false;
    }
    return result;
}

// Function to check if a path is a directory
async function isDirectory(path) {
    try {
        const resolvedPath = path.endsWith('/') ? path : `${path}/`;
        const response = await fetch(resolvedPath, { method: 'HEAD', mode: 'cors', });

        if (!response.ok) {
            return false; // Not a valid path or access denied
        }
        const contentType = response.headers.get('Content-Type');
        // console.log(contentType)
        return contentType && contentType.includes('directory'); // Check for 'directory' substring
    } catch (error) {
        throw new Error(`Error checking path: ${resolvedPath}: ${error.message}`);
        return false; // Handle errors gracefully
    }
}

function isfolder(path) {
    const resolvedPath = path.endsWith('/') ? path : `${path}/`;
    const request = new XMLHttpRequest();
    request.open('HEAD', resolvedPath, false); // Use synchronous request for simplicity
    request.send();
    return request.status === 200 && request.getResponseHeader('Content-Type') === 'text/html; charset=UTF-8';
  }

// Function to check for and load index file from a directory
function loadIndexFromDir(dirPath) {
    const indexFiles = ['index.html', 'index.php', 'index.tpl', `${dirPath}.html`];
    for (const indexFile of indexFiles) {
    const indexPath = `<span class="math-inline">\{dirPath\}/</span>{indexFile}`;
    if (this.isFileValid(indexPath)) {
        return this.loadContent(indexPath);
    }
    }
    return Promise.resolve(null); // No suitable index file found
}

const makepath = './content/components/pages/home.html';
// console.log(isFileValid(makepath))
// console.log(isFile(makepath))

const dirPath = makepath.endsWith('/') ? makepath : `${makepath.slice(0, makepath.lastIndexOf('/'))}/`;
// console.log("isDirectory: " + dirPath + " - " + isDirectory(dirPath));
// console.log(isDirectory(dirPath));
// console.log("isfolder: " +  makepath + " - " + isfolder( makepath));
// console.log("isfolder: " + dirPath + " - " + isfolder(dirPath));

// Function to check if a path is a directory using Promises (async/await)
function isDir(path) {
    return new Promise((resolve, reject) => {
        // Resolve to true if path ends with a trailing slash (likely a directory)
        if (path.endsWith('/')) {
            // return resolve(true);
        }

        // Use fetch API for asynchronous file system access (if supported)
        if (window.fetch) {
            fetch(path + '/', { method: 'HEAD' })
            .then(response => {
            if (response.ok && response.redirected) { // Check for redirects
                return resolve(true); // Redirect likely indicates a directory
            } else {
                return resolve(response.status === 200 && response.headers.get('Content-Type').startsWith('text/directory'));
            }
            })
            .catch(error => reject(error));
        } else {
            // Fallback for environments without fetch (consider using a polyfill)
            console.warn("Fetch API not available. Directory check might be inaccurate.");
            return resolve(false); // Unable to reliably determine directory status
        }
    });
}
// console.log("isDirectory: " + dirPath + " - " + isDir(dirPath));
// console.log(isDir(dirPath));

const paths = [
    './content/components/pages/home.html',
    './content/components/pages/',
    './content/components/',
    './content/components/home.html'
  ];
  
  for (const path of paths) {
    isDirectory(path).then(isDirectory => {
      console.log(`${path} is directory: ${isDirectory}`);
    });
  }
  