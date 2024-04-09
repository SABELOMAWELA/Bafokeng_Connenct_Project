(async () => {
    // Check for JavaScript support (optional)
    if (!window.document.createElement) {
      console.error("JavaScript is disabled. This website requires JavaScript to function.");
      return; // Abort if no document.createElement support
    }

    function capitalizeWords(text) {
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
    // console.log("table two group PROJECT => " + capitalizeWords("table two group project."))

    // initializeRouter(`${window.location.origin}/app/router.js`);
    try {
        await import(`${window.location.origin}/app/classes/script.js`);
        if(typeof window['Script'] !== 'function'){window['Script'] = new Script();}
        const script = new Script();

        // await import(`${window.location.origin}/app/classes/router.js`);
        const getRouter = script.loadModule(`${window.location.origin}/app/classes/router.js`);

        if(typeof window.Router !== 'function'){
            await import(`${window.location.origin}/app/classes/router.js`);
            // const router = new Router();
        }
        window.router;
        const router = new Router();

    } catch (error) {
        throw new Error(`Error No Router: ${error}.`);
    }

    const script = new Script();
    const router = new Router();

    // console.log(window.location.pathname + " => " + router.getName(window.location.pathname))

    let pageTitle = capitalizeWords(router.getName(window.location.pathname));
    function setPageTitle(path=''){
        path = (typeof path === 'string' && path !== null)? path : window.location.pathname;
        document.title =  `${capitalizeWords(router.getName(path))} | Bafokeng Connect`
    }

    const headTemplate = document.querySelector('head');
    const headerTemplate = document.querySelector('header');
    const contentContainer = document.querySelector('main');
    const footerTemplate = document.querySelector('footer');
  
    // Function to load and render template content
    function loadTemplate(templateId, url) {
        const fileName = router.normalizeName(url.split('/').pop());
        // console.log(fileName)
        fetch(url)
        .then(response => {
            // Check response status to confirm file existence
            if(response.ok){
                return response.text();
            }

            if (!response.ok) {
                if (response.status === 404) {
                //   console.warn(`Template not found: ${url}`); // Specific message
                  // Optionally, handle missing footer differently (e.g., skip or display default)
                } else {
                //   console.error(`Error loading template: ${url} (status ${response.status})`);
                }
                return; // Exit the function if response is not OK
            }
        })
        .then(htmlContent => {
            if(htmlContent !== (undefined || null || '')){
                const componentToLoad = fileName;
                const componentName = componentToLoad.split('.').shift();
                const componentExt = componentToLoad.split('.').pop();
                const parser = new DOMParser();
                const headerDoc = parser.parseFromString(htmlContent, 'text/html');
                
                const isIndex = (componentToLoad === ('/' || '' || 'home'));
                // console.log(fileName)

                if(componentToLoad === 'head.html'){
                    const headerElement = headerDoc.querySelector('head'); // Get the header element from the parsed document
                    document.querySelector('head').replaceWith(headerElement);
                }
                else if(componentToLoad === 'header.html'){
                    const headerElement = headerDoc.querySelector('header'); // Get the header element from the parsed document
                    document.querySelector('header').replaceWith(headerElement);
                }
                else {
                    const headerElement = headerDoc.querySelector('header'); // Get the header element from the parsed document
                    templateId.parentElement.prepend(headerElement);
                    templateId.remove();
                }
            }
            
        })
        .catch(error => {
            // Handle errors gracefully, like displaying an error message
            // console.error(`Error loading template ${url}:`, error);
            // Load 404.html
            templateId.innerHTML = ''; // Clear template placeholder
            const errorElement = document.createElement('div');
            errorElement.innerTEXT = 'File not found'; // Customize 404 message as needed
            // templateId.appendChild(errorElement);
        });
    }

    async function loadContent(templateId, url, fullUrl = false) {
        url = url.trim();
        if(/^$|\/\//.test(url)){return;}

        const fileName = router.normalizeName(url.split('/').pop());
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
                checkName = router.getName("/");
            }
            else {
                checkName = (makeName.startsWith("/"))? router.getName(makeName) : router.getName("/"+makeName);
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

            const contentPaths = router.contentPaths;
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
                        
                        foundPaths.push(router.normalizePaths(checkFilePath));
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

                                // const script = new Script();
                                // const router = new Router();
                                
                                setPageTitle(window.location.pathname);

                                loadButton();

                                script.load('./assets/scripts/main.js');
                            }
                            else {
                                if(doc.querySelector('body > main').innerHTML !== '' && doc.querySelector('body > main').innerHTML !== null && doc.querySelector('body > main').innerHTML !== undefined){
                                    console.log();
                                }
                                else {
                                    console.log(htmlContent)
                                    const getPageName = router.getName(window.location.pathname);
                                    console.log(getPageName)
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

    ['head', 'header', 'footer'].map(name => loadTemplate(headTemplate, `./content/components/includes/${name}.html`))
    // loadContent(contentContainer, './content/components/pages/home.html', true);
    router.loadContent(contentContainer, window.location.pathname);

    async function isFilePathValid(path) {
        try {
            const response = await fetch(path);
            return response.ok && isFileValid(path); // Ensure valid response and file
        } catch (error) {
            console.error(`Error checking path ${path}: ${error.message}`);
            return false; // Reject invalid paths
        }
    }

    // Helper function to check file existence and extension
    // Function to check file existence and extension
    function isFileValid2(path) {
        const request = new XMLHttpRequest();
        request.open('HEAD', path, true); // Use synchronous request for simplicity
        request.send();
        request.onload = () => {
            console.log(request);
        }
        return request.status === 200 && /\.(html|php|tpl)$/.test(path);
    }

    async function isFileValid(url) {
        try {
          const response = await fetch(url, { method: 'HEAD' });
          return response.ok && /\.(html|php|tpl)$/.test(url);
        } catch (error) {
          // Handle errors (e.g., network issues, invalid URL)
          console.error(`Error checking file: ${url}`, error);
          return false;
        }
    }
      
    // Load additional files conditionally (replace with your logic)
    const loadScript = function(url, placement='', callback) {
        const script = document.createElement('script');
        script.src = url;

        const getScripts = document.body.querySelectorAll('script');
        const cleanUrl = url.replace("./", "/");
        const getThisScript = Object.values(getScripts).filter((script) => script.src.replace(window.location.origin, "") === cleanUrl);
        
        if(getThisScript.length === 0){
            // script.defer;
            script.onload = () => {
                // console.log('Hello');
                if(callback){callback();}
            }
            if(placement === 'head' || placement === 'header'){
                document.head.appendChild(script);
            } else {
                document.body.appendChild(script);
            }
        }
        else {
            getThisScript[0].replaceWith(script);
        }
    };

    const loadButton = function (params) {
        const goToBtns = (typeof params !== 'undefined')? params : document.querySelectorAll('button[data-go-to]');

        goToBtns.forEach(link => {
            link.addEventListener('click', (event) => {
                const goto = link.getAttribute('data-go-to');
                // let goToPath;
                // if(goto === 'auth'){
                //     goToPath = './content/components/auth/auth.html';
                // }
                // else {
                //     goToPath = `./${goto}.html`;
                // }
                // script.loadContent(contentContainer, goToPath);
                script.loadContent(contentContainer, goto);
                const hash = window.location.hash.slice(1);
                // window.location.hash = goto;
                window.history.pushState({}, null, goto);
            });
        });
    }

    loadButton();

  })();
  