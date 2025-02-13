import { readFileSync, writeFileSync } from 'fs'

const graph = JSON.parse(readFileSync('./graph_02.json'))

const london = {
    nodes: [
        ... new Set(
            graph['a.csv']
                .slice(1)
                .map(a => a.slice(0, 2))
                .flat()
        )
    ]
        .map(n => ({id: n, group: 1}))
        .toSorted((a, b) => a.id - b.id),
    links: graph['a.csv']
        .slice(1)
        .map(a => ({source: a[0], target: a[1], value: 1, type: a[2]}))
}

writeFileSync('./london.json', JSON.stringify(london, null, 4))