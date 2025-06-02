class Dijkstras {


    /**
     * Constructs a Dijkstras object by setting the graph, starting node and ending node.
     * Initializes all instance variables needed to keep track of algorithm steps.
     * @param {graph} graph - The graph object on which the algorithm is being run
     * @param {*} start - The source node of the path
     * @param {*} end - The destination node of the path
     */
    constructor(graph, start, end) {
        this.G = graph;
        this.dijkstraNodes = [start];
        this.dijkstraEdges = [];
        this.dijkstraPossibleEdges = [];
        this.dijkstraDistances = {};
        this.start = start;
        this.end = end;
        this.solved = false;
        this.firstStepDone = false;

        for (let node of graph.nodes) {
            this.dijkstraDistances[node] = [Infinity, []];
        }
        this.dijkstraDistances[start] = [0, [this.start]];
    }


    /**
     * Helper method for *stepThrough() method
     * @param {Array} tempList - The unfiltered dijkstraPossibleEdges array
     */
    filterPossibleEdges(tempList) {
        if (tempList.length === 0) {
            return;
        }
        if (tempList[0][0] in this.dijkstraNodes && tempList[0][1] in this.dijkstraNodes) {
            this.dijkstraPossibleEdges.splice(this.dijkstraPossibleEdges.indexOf(tempList[0]), 1);
        }
        this.filterPossibleEdges(tempList.slice(1));
    }


    /**
     * Generator method that runs the algorithm and yields at each step of the algorithm run
     */
    *stepThrough() {
        for (let i of this.G.edges) {
            if (i[0] === this.start) {
                this.dijkstraPossibleEdges.push(i);
                this.dijkstraDistances[i[1]] = [i[2], this.dijkstraDistances[i[0]][1].concat([i[1]])];
            } else if (i[1] === this.start) {
                this.dijkstraPossibleEdges.push(i);
                this.dijkstraDistances[i[0]] = [i[2], this.dijkstraDistances[i[1]][1].concat([i[0]])];
            }
        }
        yield;

        while (this.dijkstraPossibleEdges.length !== 0 && !this.dijkstraNodes.includes(this.end)) {
            let min = this.dijkstraPossibleEdges[0];
            for (let i of this.dijkstraPossibleEdges) {
                if (i[2] < min[2]) {
                    min = i;
                }
            }
            this.dijkstraPossibleEdges.splice(this.dijkstraPossibleEdges.indexOf(min), 1);
            let shortest = true;
            let num, other;
            if (!this.dijkstraNodes.includes(min[0])) {
                num = 0;
                other = 1;
            } else {
                num = 1;
                other = 0;
            }
            if (this.dijkstraDistances[min[num]][0] < this.dijkstraDistances[min[other]][0] + min[2]) {
                shortest = false;
            }
            if (shortest) {
                this.dijkstraEdges.push(min);
                this.dijkstraNodes.push(min[num]);
                yield {
                    'PossEdgesUpdated':true,
                    'KnownNodesUpdated':true,
                    'DistancesUpdated':false,
                    'EdgesUpdated':true,
                };

                for (let i of this.G.edges) {
                    if (i[0] === min[num] && !this.dijkstraNodes.includes(i[1])) {
                        if (this.dijkstraDistances[i[0]][0] + i[2] < this.dijkstraDistances[i[1]][0]) {
                            this.dijkstraDistances[i[1]] = [this.dijkstraDistances[i[0]][0] + i[2], this.dijkstraDistances[i[0]][1].concat([i[1]])];
                        }
                        this.dijkstraPossibleEdges.push(i);
                    } else if (i[1] === min[num] && !this.dijkstraNodes.includes(i[0])) {
                        if (this.dijkstraDistances[i[1]][0] + i[2] < this.dijkstraDistances[i[0]][0]) {
                            this.dijkstraDistances[i[0]] = [this.dijkstraDistances[i[1]][0] + i[2], this.dijkstraDistances[i[1]][1].concat([i[0]])];
                        }
                        this.dijkstraPossibleEdges.push(i);
                    }
                }
                yield;

                this.filterPossibleEdges([...this.dijkstraPossibleEdges]);
            }
        }
        this.solved = true;
    }
}