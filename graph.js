/**
 * A class for a simple graph containing nodes and positive weighted edges.
 * Attributes:
 *      nodes (Array) - An array of nodes in the graph
 *      edges (Array) - An array of weighted edges connecting the graph nodes
 * Methods:
 *      addNode, removeNode, updateNode, addEdge, removeEdge, updateEdgeWeight
 */
class graph {
    

    /**
     * Constructs a graph object by setting the nodes and edges
     * @param {Array} [nodes=[]] - An array of nodes in the graph
     * @param {Array} [edges=[]] - An array of weighted edges connecting the graph nodes
     */
    constructor(nodes = [], edges = []) {
        this.nodes = [...new Set(nodes)] // Removes duplicate nodes before storing in this.nodes
        this.nodes.sort()
        
        this.edges = [...edges]
        if (nodes === [] && edges !== []) { // Clears list of edges if there are no nodes
            this.edges = []
        }
    }
    

    /**
     * Adds a new node to the graph
     * @param {*} node - A new node being added to the graph
     * @returns {boolean}
     */
    addNode(node) {
        if (node === "") {
            console.log("Invalid node.")
            window.alert("Invalid node.")
            return false;
        }
        else if (!this.nodes.includes(node)) {
            this.nodes.push(node)
            console.log(`Node ${node} added.`)
            return true
        }
        console.log(`Node ${node} already exists.`)
        window.alert(`Node ${node} already exists.`)
        return false
    }
    

    /**
     * Removes a node from the graph along with its incident edges
     * @param {*} node - A node being removed from the graph
     * @returns {boolean}
     */
    removeNode(node) {
        if (this.nodes.includes(node)) {
            this.nodes = this.nodes.filter(n => n !== node)
            this.edges = this.edges.filter(edge => !edge.slice(0,2).includes(node))
            console.log(`Node ${node} removed.`)
            return true
        }
        console.log(`Node ${node} does not exist.`)
        window.alert(`Node ${node} does not exist.`)
        return false
    }
    

    /**
     * Updates the name of an existing node in both nodes and edges attributes of the graph
     * @param {*} old_node - The node being updated
     * @param {*} new_node - The updated node
     * @returns {boolean}
     */
    updateNode(old_node, new_node) {
        if (new_node === "") {
            console.log("Invalid new node.")
            window.alert("Invalid new node.")
            return false;
        }
        else if (this.nodes.includes(old_node) && !this.nodes.includes(new_node)) {
            this.edges.forEach(
                edge => {
                    if (edge[0] === old_node) {edge[0] = new_node}
                    if (edge[1] === old_node) {edge[1] = new_node}
                }
            )
            const index = this.nodes.indexOf(old_node)
            this.nodes[index] = new_node
            console.log(`Node ${old_node} updated to ${new_node}.`)
            return true
        }
        console.log(`Node ${old_node} does not exist or Node ${new_node} already exists.`)
        window.alert(`Node ${old_node} does not exist or Node ${new_node} already exists.`)
        return false
    }
    

    /**
     * Adds a new non-looping and non-repeating edge to the graph
     * @param {*} node_x - First incident node of the edge
     * @param {*} node_y - Second incident node of the edge
     * @param {number} weight - Positive weight of the edge
     * @returns {boolean}
     */
    addEdge(node_x, node_y, weight) {
        if (node_x === "" || node_y === "") {
            console.log("Invalid node(s).")
            window.alert("Invalid node(s).")
            return false;
        }
        else if (!this.nodes.includes(node_x) || !this.nodes.includes(node_y)) {
            console.log("One or both of the nodes do not exist.")
            window.alert("One or both of the nodes do not exist.")
            return false
        }
        else if (node_x === node_y) {
            console.log("Looping edge averted. Please provide different nodes.")
            window.alert("Looping edge averted. Please provide different nodes.")
            return false
        }
        else if (typeof weight === "number" && weight > 0) {
            const edge_exists = this.edges.some(edge => {
                return edge.slice(0, 2).includes(node_x) && edge.slice(0, 2).includes(node_y)
            })
            if (!edge_exists) {
                this.edges.push([node_x, node_y, weight])
                console.log(`Edge of weight ${weight} from Node ${node_x} to Node ${node_y} added.`)
                return true
            }
            console.log(`Edge from Node ${node_x} to Node ${node_y} already exists.`)
            window.alert(`Edge from Node ${node_x} to Node ${node_y} already exists.`)
            return false
        }
        console.log("Invalid weight.")
        window.alert("Invalid weight.")
        return false
    }
    

    /**
     * Removes an existing edge from the graph
     * @param {*} node_x - First incident node of the edge
     * @param {*} node_y - Second incident node of the edge
     * @returns {boolean}
     */
    removeEdge(node_x, node_y) {
        const edge_index = this.edges.findIndex(edge => {
            return edge.slice(0, 2).includes(node_x) && edge.slice(0, 2).includes(node_y)
        })
        if (edge_index !== -1) {
            this.edges.splice(edge_index, 1)
            console.log(`Edge from Node ${node_x} to Node ${node_y} removed.`)
            return true
        }
        console.log(`Edge from Node ${node_x} to Node ${node_y} does not exist.`)
        window.alert(`Edge from Node ${node_x} to Node ${node_y} does not exist.`)
        return false
    }


    /**
     * Updates the weight of an existing edge in the graph
     * @param {*} node_x - First incident node of the edge
     * @param {*} node_y - Second incident node of the edge
     * @param {number} weight - New weight of the edge
     * @returns {boolean}
     */
    updateEdgeWeight(node_x, node_y, weight) {
        if (typeof weight === "number" && weight > 0) {
            const edge_index = this.edges.findIndex(edge => {
                return edge.slice(0, 2).includes(node_x) && edge.slice(0, 2).includes(node_y)
            })
            if (edge_index !== -1) {
                this.edges[edge_index] = [node_x, node_y, weight]
                console.log(`Weight of edge from Node ${node_x} to Node ${node_y} updated to ${weight}.`)
                return true
            }
            console.log(`Edge from Node ${node_x} to Node ${node_y} does not exist.`)
            window.alert(`Edge from Node ${node_x} to Node ${node_y} does not exist.`)
            return false
        }
        console.log("Invalid weight.")
        window.alert("Invalid weight.")
        return false
    }

    /**
     * Removes all nodes and edges from the graph
     */
    removeAll() {
        this.nodes = [];
        this.edges = [];
    }
}
