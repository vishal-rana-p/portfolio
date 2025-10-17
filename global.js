console.log("IT’S ALIVE!");

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let navLinks = $$("nav a");
console.log("Found nav links:", navLinks.map(a => a.href));

let currentPath = location.pathname.replace(/\/+$/, ""); // remove trailing slash
console.log("Current path:", currentPath);

let currentLink = navLinks.find(a => {
  let linkPath = a.pathname.replace(/\/+$/, ""); // remove trailing slash
  console.log(`Comparing link "${linkPath}" to page "${currentPath}"`);
  
  // ✅ Match either exact path or when the link path is a prefix of the current page
  return currentPath === linkPath || currentPath.startsWith(linkPath + "/");
});

console.log("Matched link:", currentLink ? currentLink.href : "none");

currentLink?.classList.add("current");
