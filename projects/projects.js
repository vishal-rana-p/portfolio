import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
const projects = await fetchJSON('../lib/projects.json');
const projectsTitle = document.querySelector('.projects-title');
if (projectsTitle) {
  projectsTitle.textContent = `Projects (${projects.length})`;
}
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

let query = '';
const searchInput = document.querySelector('.searchBar');
let colors;
let newArcData;
let selectedIndex = -1;
// Refactor all plotting into one function
function renderPieChart(projectsGiven) {
  // re-calculate rolled data
  let newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year
  );

  // re-calculate data
  let newData = newRolledData.map(([year, count]) => {
    return { label: year, value: count };
  });

  // re-calculate slice generator, arc data, arc, etc.
  let newSliceGenerator = d3.pie().value((d) => d.value);
  newArcData = newSliceGenerator(newData);

  let newArcGenerator = d3.arc().innerRadius(0).outerRadius(50);

  // TODO: clear up paths and legends
  let svg = d3.select('#projects-plot');
  svg.selectAll('*').remove();

  let legend = d3.select('.legend');
  legend.selectAll('*').remove();

  // update paths and legends, refer to steps 1.4 and 2.2
  colors = d3
    .scaleOrdinal()
    .domain(newData.map((d) => d.label))
    .range(['gold', 'purple', 'teal', 'orange', 'pink', 'skyblue']);

  // Draw pie slices
  svg
    .selectAll('path')
    .data(newArcData)
    .enter()
    .append('path')
    .attr('d', newArcGenerator)
    .attr('fill', (d) => colors(d.data.label))
    .on('click', function(event,d,i){
      // What should we do? (Keep scrolling to find out!)
      const idx = newArcData.indexOf(d); // find its index
      console.log()
      selectedIndex = selectedIndex === idx ? -1 : idx;

  svg.selectAll('path')
    .attr('class', (_, idx) => (
      // TODO: filter idx to find correct pie slice and apply CSS from above
      (idx === selectedIndex ? 'wedge selected' : 'wedge')
    ));
  legend.selectAll('li')
    .attr('class', (_, idx) => 
      (idx === selectedIndex ? 'legend-item selected' : 'legend-item'));
    console.log('Clicked!', d, idx);

    // filter projects
  let filteredProjects;
  if (selectedIndex === -1) {
    // no wedge selected → show all
    filteredProjects = projects;
  } else {
    // wedge selected → filter by the year of the selected slice
    const selectedYear = newArcData[selectedIndex].data.label; // your slice's label
    filteredProjects = projects.filter(p => p.year == selectedYear);
  }
  renderProjects(filteredProjects, projectsContainer, 'h2');
    });

  // Draw legend
  newData.forEach((d) => {
    legend
      .append('li')
      .attr('class', 'legend-item')
      .attr('style', `--color:${colors(d.label)}`)
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });
}
function setQuery(searchTerm) {
  query = searchTerm.toLowerCase();
  return projects.filter((p) =>
    p.title.toLowerCase().includes(query)
  );
}
// Call this function on page load
renderPieChart(projects);

searchInput.addEventListener('input', (event) => {
  let filteredProjects = setQuery(event.target.value);

  // re-render legends and pie chart when event triggers
  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
});
