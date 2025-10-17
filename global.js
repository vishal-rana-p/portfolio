const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "../"                  // Local server
  : "/portfolio/";         // GitHub Pages repo name


let pages = [
    { url: 'index.html', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'resume/', title: 'Resume'},
    { url: 'contact/', title: 'Contact'},
    { url: 'https://github.com/vishal-rana-p', title: 'GitHub'}
    // add the rest of your pages here
  ];
let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
    let url = p.url;
    url = !url.startsWith('http') ? BASE_PATH + url : url;
    let title = p.title;

    // Only prefix BASE_PATH if it's a relative path (does not start with "/")
    if (!url.startsWith("http") && !url.startsWith("/")) {
    url = BASE_PATH + url;
    }


    // Create link and add it to nav
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    // Open truly external links (absolute URLs with a different host) in a new tab
    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
      }
    if (a.host !== location.host){
        a.target = "_blank";
    }

    nav.append(a);
  }


