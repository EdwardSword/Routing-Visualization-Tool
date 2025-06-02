/**
 * Generates and updates a distance table for each step of Dijkstra's algorithm
 * @param {Dijkstras} D - Dijkstras algorithm object whose steps are displayed in the table
 */
function dijkstraTableGenerator(D) {
    document.getElementById('table-view').textContent = "";
    const tv = document.getElementById('table-view');
    const table = document.createElement('table');
    table.setAttribute('id', 'table'+D.start);
    const headerRow = document.createElement('tr'); 
    const nodeHeader = document.createElement('th');
    nodeHeader.textContent = 'Device';
    const distanceHeader = document.createElement('th');
    distanceHeader.textContent = 'Distance from '+D.start;
    headerRow.appendChild(nodeHeader);
    headerRow.appendChild(distanceHeader);
    table.appendChild(headerRow);
    tv.appendChild(table);
    
    for (const [key,value] of Object.entries(D.dijkstraDistances)) {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        nameCell.textContent = key;
        const distCell = document.createElement('td');
        distCell.textContent = value[0];
        row.appendChild(nameCell);
        row.appendChild(distCell);
        table.appendChild(row);
    };    
}

/**
 * Generates and updates node tables for each step of Bellman-Ford algorithm
 * @param {BellmanFord} B - BellmanFord algorithm object whose steps are displayed in the tables
 */
function bellmanTableGenerator(B) {
    document.getElementById('table-view').textContent = "";
    makeTables(B);
    for (const [key1,value1] of Object.entries(B.bfTable)) {
            const table = document.getElementById('table'+key1);
            for (const [key2, value2] of Object.entries(value1)){
                const row = document.createElement('tr');
                const nameCell = document.createElement('td');
                nameCell.textContent = key2;
                const distCell = document.createElement('td');
                distCell.textContent = value2[0];
                row.appendChild(nameCell);
                row.appendChild(distCell);
                table.appendChild(row);
            }
        };
}

/**
 * A helper function fo bellmanTableGenerator().
 * @param {BellmanFord} algorithm - BellmanFord algorithm object used in bellmanTableGenerator()
 */
function makeTables(algorithm) {
    const tv = document.getElementById('table-view')
    for (const iterator of algorithm.G.nodes) {
        const table = document.createElement('table');
        const title = document.createElement('caption');
        title.textContent = iterator;
        table.setAttribute('id', 'table'+iterator);
        const headerRow = document.createElement('tr'); 
        const nodeHeader = document.createElement('th');
        nodeHeader.textContent = 'Device';
        const distanceHeader = document.createElement('th');
        distanceHeader.textContent = 'Distance';
        headerRow.appendChild(nodeHeader);
        headerRow.appendChild(distanceHeader);
        table.appendChild(title);
        table.appendChild(headerRow);
        tv.appendChild(table);
    }
}

/**
 * Clears content of the 'table-view' container in view.html
 */
function clearTableView() {
    document.getElementById('table-view').textContent = "";
}