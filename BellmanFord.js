class BellmanFord {
    

    /**
     * Constructs a BellmanFord object by setting the graph, starting node and ending node.
     * Initializes all instance variables needed to keep track of algorithm steps.
     * @param {graph} graph - The graph object on which the algorithm is being run
     * @param {*} start - The source node of the path
     * @param {*} end - The destination node of the path
     */
    constructor(graph, start, end){
        this.G = graph;
        this.start = start;
        this.end = end;
        this.bfTable = {};
        this.solved = false;    
    }


    /**
     * Generator method that runs the algorithm and yields at each step of the algorithm run
     */
    *stepThrough() {
        if (this.G.nodes.includes(this.start) && this.G.nodes.includes(this.end)) {
            let propagationTable = {};
            for (let i of this.G.nodes) {
                let currTable = {};
                for (let j of this.G.nodes) {
                    if (i === j) {
                        currTable[j] = [0, [j]];
                    } else {
                        currTable[j] = [Infinity, []];
                    }
                }
                this.bfTable[i] = { ...currTable };
                propagationTable[i] = { ...currTable };
            }
            yield;
            
            let update = true;
            while (update) {
                update = false;
                for (let i of this.G.nodes) {
                    for (let j of this.G.edges) {
                        if (j[0] === i || j[1] === i) {
                            let other = j[0] === i ? j[1] : j[0];
                            for (let k of this.G.nodes) {
                                if (this.bfTable[other][k][0] + j[2] < propagationTable[i][k][0]) {
                                    propagationTable[i][k] = [this.bfTable[other][k][0] + j[2], [i].concat(this.bfTable[other][k][1])];
                                    update = true;
                                }
                            }
                        }
                    }
                }
                for (let i of this.G.nodes) {
                    let currTable = {};
                    for (let j of this.G.nodes) {
                        currTable[j] = [propagationTable[i][j][0], [...propagationTable[i][j][1]]];
                    }
                    this.bfTable[i] = { ...currTable };
                }
                yield;
            }
            this.solved = true;
        }
    }
}