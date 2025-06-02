const default_node_color = "rgb(115,106,255)"; // Default color of rendered node
const default_edge_color = "rgb(185,112,255)"; // Default color of rendered edge
const final_color = "rgb(106,255,243)"; // Color of the final rendered path
const intermediate_color = "rgb(255,243,142)"; // Color of the intermediate rendered path

var net = cytoscape({
    container: document.getElementById("canvas"), // container to render in
    style: [
        {
            selector: 'node',
            style: {
                'label': 'data(id)', // uses the "id" property value from node's data property as the label
                'text-valign': 'center', // sets vertical alignment of label
                'text-halign': 'center', // sets horizontal alignment of label
                'background-color': default_node_color // sets color of the node
            }
        },
        {
            selector: 'edge',
            style: {
                'label': 'data(weight)', // uses the "weight" property value from edge's data property as the label
                'text-margin-x': 10, // sets margin for label along the x-axis
                'text-margin-y': -10, // sets margin for label along the y-axis
                'line-color': default_edge_color, // sets color of the edge
                'color': 'white' // sets color of label
            }
        }
    ],
});

var g = new graph();

/**
 * Clears the current graph
 */
function clearGraph() {
    g.removeAll();
    net.elements().remove();
}

/**
 * Builds a sample graph
 */
function buildSample() {
    clearGraph();

    g.nodes = ['n1', 'n2', 'n3', 'n4', 'n5', 'n6']
    g.edges = [['n1', 'n2', 5], 
             ['n1', 'n4', 6], 
             ['n1', 'n3', 3], 
             ['n2', 'n4', 4], 
             ['n2', 'n5', 2], 
             ['n2', 'n6', 2], 
             ['n3', 'n4', 2], 
             ['n3', 'n6', 8], 
             ['n5', 'n6', 7]]
    
    for (let node of g.nodes) {
        net.add({group: "nodes", data: {id: node}});
    }
    for (let edge of g.edges) {
        net.add({group: "edges", data: {id: edge[0]+"_"+edge[1], weight: edge[2], source: edge[0], target: edge[1]}});
    }
    net.layout({name: "grid"}).run();
}

/**
 * Takes the value from node input field and adds the node to the graph.
 * If successful, renders the node on the canvas.
 */
function renderNode() {
    let node = document.getElementById("node").value;
    
    if (g.addNode(node)) {
        net.add({group: "nodes", data: {id: node}});
        net.layout({name: "grid"}).run();
    }
}

/**
 * Takes the values from edge input fields and adds the edge to the graph.
 * If successful, renders the edge on the canvas.
 */
function renderEdge() {
    let node_x = document.getElementById("node_x").value;
    let node_y = document.getElementById("node_y").value;
    let weight = Number(document.getElementById("weight").value);
    
    if (g.addEdge(node_x, node_y, weight)) {
        net.add({group: "edges", data: {id: node_x+"_"+node_y, weight: weight, source: node_x, target: node_y}});
    }
}

/**
 * Changes the color of a node
 * @param {*} node - The node whose color is changed
 * @param {string} color - The new color of the node
 */
function colorNode(node, color) {
    let id = '[id = "' + node + '"]';
    net.nodes(id).style('background-color', color);
}

/**
 * Changes the color of an edge
 * @param {Array} edge - The edge whose color is changed
 * @param {string} color - The new color of the edge
 */
function colorEdge(edge, color) {
    let id_1 = '[id = "' + edge[0]+"_"+ edge[1] + '"]';
    let id_2 = '[id = "' + edge[1]+"_"+ edge[0] + '"]';
    
    net.edges(id_1).style('line-color', color);
    net.edges(id_2).style('line-color', color);
}

/**
 * Resets the color of all nodes and edges
 */
function resetColors() {
    for (let node of g.nodes){
        colorNode(node, default_node_color);
    }
    for (let edge of g.edges){
        colorEdge(edge, default_edge_color);
    }
}

/**
 * Toggles all form buttons 'disabled' attribute
 */
function toggleDisabledButtons() {
    for (let button of document.getElementsByClassName("locked-button")) {
        button.disabled = !button.disabled;
    }
    document.getElementById("step").disabled = !document.getElementById("step").disabled;
    document.getElementById("skip").disabled = !document.getElementById("skip").disabled;
}

/**
 * Takes the values from path input fields and creates a Dijkstras object using them and the graph.
 * Disables all buttons until the algorithm goes to completion. 
 * Steps through the algorithm and generates the path.
 */
function pathDijkstras() {
    let start = document.getElementById("start").value;
    let end = document.getElementById("end").value;
    if (!g.nodes.includes(start) || !g.nodes.includes(end)) {
        window.alert("One or both of the nodes do not exist.");
        return;
    }
    let d = new Dijkstras(g, start, end);
    let step = d.stepThrough();

    if (!d.solved) {
        toggleDisabledButtons();
    }
    resetColors();
    clearTableView();

    // Handler for step button click event steps through the algorithm
    document.getElementById("step").addEventListener("click", () => {
        step.next();
        dijkstraTableGenerator(d);

        resetColors();
        for (let edge of d.dijkstraPossibleEdges) {
            colorEdge([edge[0], edge[1]], intermediate_color);
        }
        for (let node of d.dijkstraNodes) {
            colorNode(node, final_color);
        }
        for (let edge of d.dijkstraEdges) {
            colorEdge([edge[0], edge[1]], final_color);
        }

        if (d.solved) {
            dijkstrasFinalStep(d, end);
            d = null;
        }
    });

    // Handler for skip button click event skips to the end of the algorithm
    document.getElementById("skip").addEventListener("click", () => {
        while (!d.solved) {
            step.next();
            dijkstraTableGenerator(d);
        }
        dijkstrasFinalStep(d, end);
        d = null;
    });
}

/**
 * Runs the final step of the Dijkstra's algorithm
 * @param {Dijkstras} d - The Dijkstras object representing the algorithm
 * @param {*} end - The end node of the path
 */
function dijkstrasFinalStep(d, end) {
    let path = d.dijkstraDistances[end][1];
    resetColors();
    for (let node of path){
        colorNode(node, final_color);
    }
    for (let i = 0; i < path.length - 1; i++) {
        colorEdge([path[i], path[i+1]], final_color);
    }
    toggleDisabledButtons();
}

/**
 * Takes the values from path input fields and creates a BellmanFord object using them and the graph.
 * Disables all buttons until the algorithm goes to completion. 
 * Steps through the algorithm and generates the path.
 */
function pathBellman() {
    let start = document.getElementById("start").value;
    let end = document.getElementById("end").value;
    if (!g.nodes.includes(start) || !g.nodes.includes(end)) {
        window.alert("One or both of the nodes do not exist.");
        return;
    }
    let b = new BellmanFord(g, start, end);
    let step = b.stepThrough();

    if (!b.solved) {
        toggleDisabledButtons();
    }
    resetColors();
    clearTableView();
    
    // Handler for step button click event steps through the algorithm
    document.getElementById("step").addEventListener("click", () => {
        step.next();
        bellmanTableGenerator(b);

        if (b.solved) {
            bellmanFinalStep(b, start, end);
            b = null;
        }
    });

    // Handler for skip button click event skips to the end of the algorithm
    document.getElementById("skip").addEventListener("click", () => {
        while (!b.solved) {
            step.next();
            bellmanTableGenerator(b);
        }
        bellmanFinalStep(b, start, end);
        b = null;
    });
}

/**
 * Runs the final step of the Bellman-Ford algorithm
 * @param {BellmanFord} b - The BellmanFord object representing the algorithm
 * @param {*} start - The start node of the path
 * @param {*} end - The end node of the path
 */
function bellmanFinalStep(b, start, end) {
    let path = b.bfTable[start][end][1];
    for (let node of path){
        colorNode(node, final_color);
    }
    for (let i = 0; i < path.length - 1; i++) {
        colorEdge([path[i], path[i+1]], final_color);
    }
    toggleDisabledButtons();
}