// Create the router class
export default class Router {
    constructor() {
        this.routes = {
            // '/': '/',
            home: '/',
            about: '/about-us',
            history: '/history',
            auth: '/auth',
            contact: '/contact',
            products: '/products',
            product: '/products/:id', // Dynamic route for product details
            blog: '/blog',
            blogPost: '/blog/:post', // Dynamic route for blog posts
          };
          this.defaultRoutes = {
            home: true,
          };
          this.currentRoute = null;
          this.symlinks = {
            '/company/about': 'about',
            '/auth': 'auth',
          };
          this.contentPaths = [
            './', // Default directory
            './content/components/pages/',
            './content/components/',
            "./content/pages",
          ];
          this.defaultContentPaths = [
            "./content/pages",
            "./content/components",
            "./content/components/pages/",
          ];

        // this.routes = {};
        // this.defaultRoutes = {};
        // this.currentRoute = null;
        // this.contentPaths = ['./content/components/pages/']; // Array to store default content paths
      }
  
    // Define a method to add a route with a name and path (optional default path)
    addRoute(name, path = `/${name}`) {
      name = this.normalizeName(name);
      path = this.normalizePaths(path);
      this.routes[name] = path;
      // Optionally set a default path for the route name
      if (path === `/${name}`) {
        this.defaultRoutes[name] = true;
      }
    }

    // Define a method to add default content paths
    addContentPath(path) {
        this.contentPaths.push(path);
    }
  
    // Define a method to get the name for a route path
    getName(routePath) {
      const getArr = Object.entries(this.routes).filter((arr) => {
        const [arrName, arrPath] = arr;
        
        return arrPath === routePath? arrName : routePath.toString().split('/').pop().split('.').shift();
      });

      if(Array.isArray(getArr)){
        const match = Object.entries(this.routes).find(([routeName, routePattern]) => {
          const regex = routePattern.replace(/:\w+/g, '(.+)'); // Replace dynamic segments with capture groups
          return new RegExp(`^${regex}$`).test(routePath);
        });
      
        if (match) {
          const [name, path] = match;
          return this.normalizeName(name); // Assuming normalizeName handles name extraction
        }
      }
      else{
        return this.normalizeName(getArr);
      }
    }

    // Define a method to get the path for a route name
    getPath(name) {
      name = this.normalizeName(name);
      // Check for existing route with the original name
      const originalPath = this.routes[name];
      if (originalPath) {
        return originalPath;
      }
    
      // Create a base name without extension
      const baseName = name.split('.')[0];
    
      // Check for common extensions and preserve them
      const extensions = ['.html', '.php', '.tpl'];
      for (const extension of extensions) {
        if (name.endsWith(extension)) {
          const pathWithExtension = `${baseName}${extension}`;
          if (this.routes[pathWithExtension]) {
            return pathWithExtension;
          }
        }
      }
    
      // Define replacement mapping for spaces and dashes
      const replacements = {
        ' ': ['_', '-'], // Replace space with underscore or dash
        '-': ['_', ' ']  // Replace dash with underscore or space
      };
    
      // Check for variations with replaced spaces and dashes
      for (const originalChar of Object.keys(replacements)) {
        for (const replacement of replacements[originalChar]) {
          const modifiedName = baseName.replace(new RegExp(originalChar, 'g'), replacement);
          const pathWithModifiedName = extensions.map(ext => `${modifiedName}${ext}`);
          for (const path of pathWithModifiedName) {
            if (this.routes[path]) {
              return path;
            }
          }
        }
      }
    
      // No matching path found
      return null;
    }

    // Helper method to check for route in default content paths
    getRouteFromDefaultPaths(path) {
        for (const contentPath of this.contentPaths) {
            const fullPath = `${contentPath}${path}`;
            if (this.isFileValid(fullPath)) {
                return fullPath;
            }
            else {
                const fullPathSpan = `<span class="math-inline">\{contentPath\}</span>{path}`;
                if (this.isFileValid(fullPathSpan)) {
                    return fullPath;
                }
            }
        }
        return null;
    }

    resolveFullPath(path) {
        // Check for files in default content paths if needed
        // for (const defaultPath of this.defaultContentPaths) {
        for (const defaultPath of this.contentPaths) {
          const fullPath = this.normalizePaths(`${defaultPath}/${path}`);
          if (this.fileExists(fullPath)) {
            return fullPath;
          }
        }
        return path; // If not found in default paths, return the original path
    }

    findDefaultFile(path) {
      console.log("path: " + path + " | " + /\.(html|php|tpl)$/.test(path))
      if(path === null) {return null;}
        const dirPath = path.endsWith('/') ? path : path.slice(0, path.lastIndexOf('/'));
        const defaultFiles = ['index.html', 'index.php', 'index.tpl', `${dirPath.slice(1)}.html`];
        for (const defaultFile of defaultFiles) {
          const fullPath = `${dirPath}/${defaultFile}`;
          if (this.fileExists(fullPath)) {
            return fullPath;
          }
        }
        return null;
    }

    normalizeName(name){
      // Convert to lowercase
      name = name.toString().toLowerCase().trim();

      // Collapse redundant separators
      name = name.replace(/\/{2,}/g, "/");

      // Regular expression to match all special characters and spaces
      // const specialCharsAndSpacesRegex = /\W+|_/g;
      
      // Regular expression to match special characters and spaces
      const regex = /^[\W\s_/-]|[-\W\s_\/]$/g;

      // Check for special characters/spaces at the beginning and end
      if (regex.test(name)) {
        // Remove all leading and trailing special characters/spaces
        name = name.replace(regex, "");
      }

      // Regex replaces all occurrences of quotes and commas 
      name = name.replace(/["',]/g, '');

      return name.replace(/["',]/g, '');
    }

    normalizePaths(path) {
      // Check if path starts with http or https protocol
      if (path.startsWith("http://") || path.startsWith("https://")) {
        // Extract protocol and hostname (optional)
        const protocolAndHostname = path.split("/", 3)[0]; // Get first segment (protocol + hostname)
        // Use slice to extract the remaining path after protocol and hostname
        const remainingPath = path.slice(protocolAndHostname.length + 1);
        // Replace double slashes with single slash in the remaining path
        const normalizedRemainingPath = remainingPath.replace(/(?<!:\/\/)(?:\/\/|\\)/g, "/");
        // Combine the normalized remaining path with the protocol and hostname
        return `${protocolAndHostname}/${normalizedRemainingPath}`;
      } else {
        // Path doesn't start with http/https, replace double slashes with single slash
        return path.replace(/(?<!:\/\/)(?:\/\/|\\)/g, '/');
      }
    }

    // Helper function to check file existence and extension
    // Function to check file existence and extension
    fileExists(path) {
      const newPath = this.normalizePaths(path);

      console.log("fileExistsPath: " + newPath)

        const request = new XMLHttpRequest();
        request.open('HEAD', newPath, false); // Use synchronous request for simplicity
        request.send();
        return request.status === 200 && /\.(html|php|tpl)$/.test(newPath);
    }
    
    loadAssociatedAssets(path) {
        const dirPath = path.endsWith('/') ? path : path.slice(0, path.lastIndexOf('/'));
        // Implementation for loading CSS and script files from dirPath
    }
  
    // Define a method to navigate to a route by name or path
    navigateTo(route, options = {}) {
      let path;
      if (typeof route === 'string') {
        // Check if it's a route name
        path = this.getPath(route);
      } else {
        // Assume it's a direct path
        path = route;
      }

      // console.log("route-:" + route)
  
      // if (!path) {
      //   console.error("Route not found:", route);
      //   return;
      // }

      const fullPath = this.normalizePaths(this.resolveFullPath(path));
      console.log("fullPath: " + fullPath + " | " + path);

      if (this.fileExists(fullPath)) {
        // Load the file (implementation depends on your content loading approach)
        console.log('Loading file:', fullPath);
        // ... load file content
      } else {
        // Check for default files within directories
        const defaultFile = this.normalizePaths(this.findDefaultFile(fullPath));
        if (defaultFile) {
          // Load the default file
          console.log('Loading default file:', defaultFile);
          // ... load default file content
        } else {
          console.error('File not found:', fullPath);
        }
      }
  
      // Load any CSS and script files in the directory
      // this.loadAssociatedAssets(fullPath);
  
      this.currentRoute = path;
      // Update the browser's URL
      window.history.pushState(options.state, options.title, path);
      // Call the matching route's callback (implementation left for your usage)
      // const callback = this.routes[path]; // Assuming you have route callbacks
      // if (callback) {
      //   callback();
      // }
    }

    navigateTo2(route, options = {}) {
        // ... existing path resolution logic
    
        const fullPath = this.resolveFullPath(path);
    
        if (this.fileExists(fullPath)) {
          // Load the file (implementation depends on your content loading approach)
          console.log('Loading file:', fullPath);
          // ... load file content
        } else {
          // Check for default files within directories
          const defaultFile = this.findDefaultFile(fullPath);
          if (defaultFile) {
            // Load the default file
            console.log('Loading default file:', defaultFile);
            // ... load default file content
          } else {
            console.error('File not found:', fullPath);
          }
        }
    
        // Load any CSS and script files in the directory
        this.loadAssociatedAssets(fullPath);
    }
    
    // Function to load content from a path
    async loadContent(templateId, url, fullUrl = false) {
      url = url.trim();
      if(/^$|\/\//.test(url)){return;}

      const fileName = this.normalizeName(url.split('/').pop());
      const hasExtension = /\.(html|php|tpl)$/.test(fileName);
      const notMainRootPath = /^(?!\/$|^\.$|\.)/.test(url);
      const isMainRootPath = /^(?:\.\/|\/\/|\/|)$/.test(url);
      const isNotMainRootPath = (!isMainRootPath && notMainRootPath || !isMainRootPath && !notMainRootPath);
      let foundPaths = [];

      if(fullUrl){
          foundPaths.push(url);
      }
      else {
          const makeName = fileName.toLowerCase().split('.').shift();
          const namesArr = [];
          let checkName = null;
          if(makeName === "/" || makeName === 'home' || makeName === ''){
              checkName = this.getName("/");
          }
          else {
              checkName = (makeName.startsWith("/"))? this.getName(makeName) : this.getName("/"+makeName);
          }
          checkName = (checkName === undefined)? makeName : checkName;

          if(hasExtension){
              namesArr.push(fileName);
          }
          else {
              namesArr.push(`${checkName}.html`);
              namesArr.push(`${checkName}.php`);
              namesArr.push(`${checkName}.tpl`);
          }

          // console.log("makeName: " + makeName + " | checkName: " + checkName + " | " +  router.getName("/"+makeName))

          const contentPaths = this.contentPaths;
          for (const contentPath of contentPaths) {
              const cpath = (contentPath.endsWith("/"))? contentPath : `${contentPath}/`;
              
              for(const fname of namesArr){
                  const filePaths = [
                      `${cpath}${fname}`,
                      `${cpath}${checkName}/${fname}`,
                      `${cpath}${checkName}/pages/${fname}`,
                      `${cpath}${checkName}/index.html`,
                      `${cpath}${checkName}/index.php`,
                      `${cpath}${checkName}/index.tpl`,
                      `${cpath}${checkName}/pages/index.html`,
                      `${cpath}${checkName}/pages/index.php`,
                      `${cpath}${checkName}/pages/index.tpl`,
                      `${cpath}${url}`,
                  ];

                  for(const filepath of filePaths){
                      const checkFilePath = (filepath.startsWith("./"))? filepath.replace("./","/") : filepath;
                      // const makeFullURL = (checkFilePath.includes(window.location.host))? checkFilePath : `${window.location.host}${checkFilePath}`;
                      // console.log(isFileValid(makeFullURL));
                      
                      foundPaths.push(this.normalizePaths(checkFilePath));
                  }

              }
          }

          // console.log(makeName + " | " + hasExtension + " | " + router.getName(url))
      }

      if(foundPaths.length > 0){
          for(const foundPath of foundPaths){

            fetch(foundPath)
            .then(response => response.text())
            .then(htmlContent => {
                if(htmlContent !== undefined && htmlContent !== null && htmlContent !== ''){
                    
                    // console.log(htmlContent);
                    if(htmlContent){
                        
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(htmlContent, 'text/html');
                        
                        if(doc.querySelector('body > main') === null){
                            templateId.innerHTML = htmlContent;
                            
                            this.setPageTitle(window.location.pathname);

                            const script = new Script();

                            script.load('./assets/scripts/main.js');
                            script.loadButton();
                            return true;
                        }
                        else {
                          async function compareFiles(url1, url2) {
                            try {
                              const [response1, response2] = await Promise.all([
                                fetch(url1),
                                fetch(url2)
                              ]);
                          
                              if (!response1.ok || !response2.ok) {
                                throw new Error(`Error fetching files: ${url1} or ${url2}`);
                              }
                          
                              const content1 = await response1.text();
                              const content2 = await response2.text();
                          
                              const areEqual = content1 === content2;
                              return areEqual;
                              // console.log(`Files ${url1} and ${url2} are ${areEqual ? 'equal' : 'different'}`);
                            } catch (error) {
                              console.error('Error comparing files:', error);
                            }
                          }

                          if(compareFiles(foundPath, window.location.host)){return;}

                          if(doc.querySelector('body > main').innerHTML !== '' && doc.querySelector('body > main').innerHTML !== null && doc.querySelector('body > main').innerHTML !== undefined){
                              console.log("Check main element");
                          }
                          else {
                            // console.log();
                              // const getPageName = this.getName(window.location.pathname);
                              console.log(getPageName + " -|- " + foundPath)
                              // console.log(doc)
                              // templateId.innerHTML = "404 Page HERE";
                          }
                        }
                    }
                }
                else {
                    console.log(url + " DOES NOT EXIST")
                }
            })
            .catch(error => {
                console.error('Error loading template:', error);
                // Handle errors gracefully, like displaying an error message
            });
          }
      }
    }

    setPageTitle(path=''){
      function capitalizeTitleWords(text) {
          if(typeof text === 'string'){
              return text.replace(/\b\w/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
          }
          else if (typeof text === 'object') {
              // Handle arrays and other iterable objects
              if (Array.isArray(text)) {
                return text.map(item => item.replace(/\b\w/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()));
              } else {
                // Handle objects with string values
                return Object.fromEntries(
                  Object.entries(text).map(([key, value]) => [key, value.replace(/\b\w/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())])
                );
              }
          } else {
              return text; // Return as-is for non-string/non-object types
          }
      }
      path = (typeof path === 'string' && path !== null)? path : window.location.pathname;
      document.title =  `${capitalizeTitleWords(this.getName(path))} | Bafokeng Connect`
    }

    // Function to load CSS and Script files from a directory
    loadAssets(dirPath) {
        const cssFiles = Array.from(document.querySelectorAll(`link[href^="${dirPath}/styles"]`));
        const scriptFiles = Array.from(document.querySelectorAll(`script[src^="${dirPath}/scripts"]`));

        cssFiles.forEach(link => link.href = link.href); // Trigger CSS reload (if modified)
        scriptFiles.forEach(script => {
        const newScript = document.createElement('script');
        newScript.src = script.src;
        document.body.appendChild(newScript); // Load scripts dynamically
        });
    }

    // Function to check for and load CSS/JS files in a directory
    loadAssets2(dirPath) {
        const scriptPattern = /.*\.js$/;
        const cssPattern = /.*\.css$/;
        fetch(`${dirPath}/assets.json`) // Assuming an optional assets.json file
        .then(response => response.json())
        .then(assets => {
            if (assets) {
            const scripts = assets.scripts || [];
            const styles = assets.styles || [];
            scripts.forEach(script => {
                if (scriptPattern.test(script)) {
                const scriptPath = `<span class="math-inline">\{dirPath\}/</span>{script}`;
                const scriptElement = document.createElement('script');
                scriptElement.src = scriptPath;
                document.head.appendChild(scriptElement);
                }
            });
            styles.forEach(style => {
                if (cssPattern.test(style)) {
                const stylePath = `<span class="math-inline">\{dirPath\}/</span>{style}`;
                const linkElement = document.createElement('link');
                linkElement.href = stylePath;
                linkElement.rel = 'stylesheet';
                document.head.appendChild(linkElement);
                }
            });
            }
        })
        .catch(error => console.error("Error loading assets:", error));
    }
  
    // Define a method to listen for navigation events
    // Define a method to listen for navigation events (start method)
    start() {
      window.addEventListener("popstate", (event) => {
        const path = window.location.pathname;
        this.navigateTo(path);
        console.log("gsfdfsd")
      });

      // Check for initial route and navigate if necessary
      const initialRoute = this.getInitialRoute();
      if (initialRoute) {
        // this.navigateTo(initialRoute);
        console.log("navigateTo: gsfdfsd " + initialRoute)
      } else {
      // Handle no initial route found (optional)
      }
    }

    // Method to check for the initial route based on default route names and symlinks
    getInitialRoute() {
        const defaultRouteNames = Object.keys(this.defaultRoutes);
        let initialRoute = null;
    
        // Check default route names first
        for (const name of defaultRouteNames) {
          const path = this.getPath(name);
          if (path) {
              initialRoute = path;
              break; // Stop searching once a default route is found
          }
        }
    
        // If no default route name found, check symlinks with default paths
        if (!initialRoute) {
          for (const symlink of Object.keys(this.symlinks)) {
              if (this.defaultRoutes[symlink]) {
              const path = this.getPath(symlink);
              if (path) {
                  initialRoute = path;
                  break; // Stop searching once a symlink with default path is found
              }
              }
          }
        }
    
        // If no default route or symlink found, check for a matching route in contentPaths
        if (!initialRoute) {
          const currentPath = window.location.pathname;
          const matchingPath = this.getRouteFromDefaultPaths(currentPath);
          if (matchingPath) {
              initialRoute = matchingPath;
          }
        }
    
        return initialRoute;
    }
  
}
  
// Export the router as a module

window.Router = Router;
// module.exports = Router;


(function() {
  // const router = new Router();
  // ... perform any router initialization or setup here ...
  // Optionally expose the router instance as a global variable (not recommended for large projects)
  // window.router = router;
})();
  