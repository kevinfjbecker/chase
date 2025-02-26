import * as d3 from 'd3'
import GUI from 'lil-gui'

const gui = new GUI()
const debugObject = {
    node: {
        color: '#4682B4',
        radius: 5
    }
}
gui
    .addColor(debugObject.node, 'color')
    .onChange(() =>
    {
        node.attr('fill', debugObject.node.color)
    })
gui
    .add(debugObject.node, 'radius')
    .min(1)
    .max(10)
    .step(1)
    .onChange(() =>
    {
        node.attr('r', debugObject.node.radius)
    })


const data = await d3.json('london.json');

const width = 2400;
const height = 2400;

const links = data.links.map(d => ({ ...d }));
const nodes = data.nodes.map(d => ({ ...d }));

const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2))
    .on("tick", ticked);

const svg = d3.select('body').append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");

const link = svg.append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll()
    .data(links)
    .join("line")
    .attr("stroke-width", d => Math.sqrt(d.value));

const node = svg.append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .selectAll()
    .data(nodes)
    .join("circle")
    .attr("r", debugObject.node.radius)
    .attr("fill", debugObject.node.color);

node.append("title")
    .text(d => d.id);

node.call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

function ticked() {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
}

function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
}
function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
}
function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
}
