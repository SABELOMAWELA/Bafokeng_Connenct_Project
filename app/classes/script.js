export default class Script {
  constructor(url) {
    this.url = url;
    this.element = document.createElement('script');
  }

  load(url = this.url, placement = 'bottom', element = null, isModule = false, ClassName = null) {
    return new Promise((resolve, reject) => {
      const script = this.element.cloneNode(false); // Clone to avoid memory leaks
      script.src = url;

      const getScripts = document.body.querySelectorAll('script');
      const cleanUrl = url.replace("./", "/");
      const getThisScript = Object.values(getScripts).filter((script) => script.src.replace(window.location.origin, "") === cleanUrl);
      
      if(getThisScript.length === 0){
        script.onload = () => resolve();
        script.onerror = (error) => reject(error);

        if (element === null) {
          if (placement === 'head' || placement === 'header') {
            document.head.appendChild(script);
          } else {
            document.body.appendChild(script);
          }
        } else {
          if (placement === 'before') {
            document.insertBefore(script, element);
          } else if (placement === 'after') {
            document.insertAfter(script, element);
          } else {
            document.body.appendChild(script);
          }
        }
      }
      else {
        // console.log("Script is already loaded: " + cleanUrl);
        // getThisScript[0].replaceWith(script);
      }

      this.loadButton();
      
    });
  }

  loadButton = function (goToElements,contentContainer) {
    const goToBtns = (typeof goToElements !== 'undefined')? goToElements : document.querySelectorAll('button[data-go-to]');

    goToBtns.forEach(link => {
        link.addEventListener('click', (event) => {
            //event.preventDefault(); // Prevent default anchor link behavior
            const goto = link.getAttribute('data-go-to');
            let goToPath;
            if(goto === 'auth'){
                goToPath = './content/components/auth/auth.html';
            }
            else {
                goToPath = `./${goto}.html`;
            }
            const router = new Router();
            // let goToPath = (goto === 'auth')? './content/components/auth/auth.html' : goto;
            const getContentContainer = (typeof contentContainer !== 'undefined')? contentContainer : document.querySelector('main');
            router.loadContent(getContentContainer, goToPath);
            const hash = window.location.hash.slice(1);
            // window.location.hash = goto;
            window.history.pushState({}, null, goto);
        });
    });
  }

  // Optional methods for asynchronous execution control
  async execute(url = this.url, placement = 'bottom', element = null) {
    await this.load(url, placement, element);
    // Code to be executed after the script is loaded (if applicable)
  }

  // Static method to load multiple scripts in sequence
  static async loadAll(scripts) {
    for (const script of scripts) {
      await new Script(script).execute();
    }
  }

  // Use dynamic import syntax for robust module loading
  async loadModule(url) {
    try {
      const module = await import(url);
      for (const [key, value] of Object.entries(module)) {
        
        if(typeof value === 'function'){
          const patterns = [
            /export default class (.+?) \{/,
            /export class (.+?) \{/,
            /export default (.+?);/,
            /export (.+?);/,
            /class (.+?) \{/,
          ];
      
          for (const pattern of patterns) {
            const match = pattern.exec(value.toString()); // Ensure string conversion before matching
            if (match) {
              const foundClass = match[1].trim(); // Capture and trim the class name
              
              if(foundClass){
                // Check if the exported value is a class by checking its prototype
                if (value.prototype && value.prototype.constructor) {
                  window[foundClass] = value; // Assign the class itself
                  
                  if (typeof window[foundClass] === 'function') { // Check for exported class
                    window[foundClass];
                    const getClass = window[foundClass];
                    return getClass.toString();
                  } 
                  else {
                    console.log("Trying to initiate")
                    window[foundClass] = new window[foundClass](); // Initiate the class instance

                    if (typeof window[foundClass] === 'function') { // Check for exported class
                      window[foundClass];
                      const getClass = window[foundClass];
                      return getClass.toString();
                    } 
                    else {
                      console.error(`No default exported class / matching export found in script: ${url}`);
                      return null;
                    }
                  }
                } else {
                  console.error(`"${foundClass}" is not a class export in script: ${url}`);
                }
                
              }
            }
          }
        }
      }
    }
    catch (error) {
      console.error(`Error loading script as a module: ${url}`, error);
      console.error(`Error getting exported class: ${error.message}`);
      throw error; // Re-throw for error handling
    }
  }
}

window['Script'] = Script;


// Example usage - Define script URLs as an array
// const scriptUrls = ['chart.js', 'router.js', 'buttons.js'];

// // Load all scripts sequentially using the static method
// Script.loadAll(scriptUrls).then(() => {
//   console.log('All scripts loaded and executed successfully!');
// });

// const scriptUrl = ['component.js'];

