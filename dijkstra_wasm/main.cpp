/*
 * Authored by - Austin Burden
 * Date - 02/17/2024
 * CSC 482 - HW1 Part 1
 *
 * Following requirements listed in 2 ChatGPT-Allowed Parts, I have used Copilot
 * to generate a template for a priority queue using a min heap. I have modified
 * the code to include the unique methods required for the assignment.
 *
 */

#include <algorithm>
#include <iostream>
#include <map>
#include <vector>
#include <list>
#include <iterator>
#include <fstream>
#include <sstream>
#include <string.h>

using namespace std;
#define INF 0x3f3f3f3f
#define EXTERN extern "C"

class HeapNode
{
public:
    int priority;
    vector<int> value;

    HeapNode(int priority, int value)
    {
        this->priority = priority;
        this->value = vector<int>(1, value);
    }
};

// Class to store the priority of a value in the map
// The default constructor allows us to distinguish true map values vs ones
// created by requesting map[non-existent-key]
class NodeIndex
{
public:
    int heapIndex;

    NodeIndex() { this->heapIndex = -1; }
    explicit NodeIndex(int heapIndex) { this->heapIndex = heapIndex; }
};

class PriorityQueue

{
public:
    vector<HeapNode> heap;
    int size;
    int capacity;
    map<vector<int>, NodeIndex> itemMap;

    PriorityQueue(int n)
    {
        size = 0;
        capacity = n;
    }

    void swap_nodes(int index1, int index2)
    {
        swap(heap[index1], heap[index2]);
        itemMap[heap[index1].value] = NodeIndex(index1);
        itemMap[heap[index2].value] = NodeIndex(index2);
    }

    void heapify_up(int index)
    {
        while (index > 0 && heap[index].priority < heap[index / 2].priority)
        {
            itemMap[heap[index].value] = NodeIndex(index / 2);
            swap_nodes(index, index / 2);
            index /= 2;
        }
    }

    void heapify_down(int index)
    {
        while (index * 2 < size)
        {
            int min_index = index;

            // Check if left child has a lower priority
            if (heap[index * 2].priority < heap[min_index].priority)
            {
                min_index = index * 2;
            }
            // Check if right child has a lower priority
            if (index * 2 + 1 < size && index * 2 + 1 < size &&
                heap[index * 2 + 1].priority < heap[min_index].priority)
            {
                min_index = index * 2 + 1;
            }
            // Neither child has a lower priority, node at index stays in place
            if (min_index == index)
            {
                break;
            }
            // Swap the node at index with the smaller child node
            swap_nodes(index, min_index);
            // Keep searching for the correct position
            index = min_index;
        }
    }

    // Insert a new node into the heap at last position
    // Move it up if needed
    void insert(int priority, int value)
    {
        // Check if heap is full
        if (size == capacity)
        {
            cout << "Heap is full" << endl;
            return;
        }
        heap.emplace_back(priority, value);
        itemMap[heap[size].value] = NodeIndex(size);
        size++;
        heapify_up(size - 1);
    }

    void insert(HeapNode newNode)
    {
        // Check if heap is full
        if (size == capacity)
        {
            cout << "Heap is full" << endl;
            return;
        }
        heap.emplace_back(newNode);
        itemMap[heap[size].value] = NodeIndex(size);
        size++;
        heapify_up(size - 1);
    }

    HeapNode findMin()
    {
        if (size == 0)
        {
            cout << "Heap is empty" << endl;
            return {-1, ' '};
        }
        return heap[0];
    }

    void deleteNode(int index)
    {
        if (index < 0 || index >= size)
        {
            cout << "Index out of bounds" << endl;
            return;
        }
        // Remove the item from the map
        itemMap.erase(heap[index].value);

        // Swap the node with the last node and remove it
        swap(heap[index], heap[size - 1]);
        heap.pop_back();
        size--;
        // Move the swapped node to the correct position
        heapify_down(index);
    }

    HeapNode extract_min()
    {
        if (size == 0)
        {
            cout << "Heap is empty" << endl;
            return {-1, ' '};
        }
        HeapNode min = heap[0];
        deleteNode(0);
        return min;
    }

    void deleteNode(vector<int> item)
    {
        int index = itemMap[item].heapIndex;
        if (index == -1)
        {
            itemMap.erase(item);
        }

        // Delete the node after finding the index
        if (index > -1 && index < size)
        {
            deleteNode(index);
        }
        else
        {
            return;
        }
    }

    void changePriority(vector<int> item, int priority)
    {
        int index = itemMap[item].heapIndex;
        if (index == -1)
        {
            itemMap.erase(item);
            return;
        }
        int old_priority = heap[index].priority;
        heap[index].priority = priority;
        if (priority < old_priority)
        {
            heapify_up(index);
        }
        else
        {
            heapify_down(index);
        }
    }
};

class Edge
{
public:
    int from, to, weight;
    Edge(int from, int to, int weight) : from(from), to(to), weight(weight) {}
};

class GraphPaths
{
public:
    vector<int> dist;
    vector<vector<Edge>> paths;
    GraphPaths(int n, int source) : dist(n, INF), paths(n, vector<Edge>(1, Edge(source, source, 0)))
    {
    }
};

class Graph
{
public:
    vector<vector<Edge>> adj;
    int n;
    int source;
    int destination;

    Graph(int n) : n(n)
    {
        adj.resize(n);
    }

    void add_edge(int from, int to, int weight)
    {
        adj[from].push_back(Edge(from, to, weight));
    }

    void remove_edge(int from, int to)
    {
        for (int i = 0; i < adj[from].size(); i++)
        {
            if (adj[from][i].to == to)
            {
                adj[from].erase(adj[from].begin() + i);
                n--;
                break;
            }
        }
    }

    void print_graph()
    {
        for (int i = 0; i < n; i++)
        {
            cout << "Node " << i << " makes an edge with:\n";
            for (auto edge : adj[i])
            {
                cout << "\tNode " << edge.to << " with weight " << edge.weight << "\n";
            }
            cout << "-----------------------------------\n";
        }
    }
};

GraphPaths dijkstra(Graph graph, int size)
{
    PriorityQueue pq(size);
    vector<int> dist(size, INF);
    vector<vector<Edge>> paths = vector<vector<Edge>>(size, vector<Edge>(0, Edge(graph.source, graph.source, 0)));

    /*
      Use this vector to store the previous nodes visited to make up the
      current distance we are entering. Give dist another field that acts as "history"
      that stores the edges that go together to make this path.
      */

    HeapNode start(0, graph.source);
    start.value.push_back(graph.source);
    pq.insert(start);
    for (int i = 0; i < size; i++)
    {
        if (i != graph.source)
            pq.insert(INF, i);
    }

    dist[graph.source] = 0;

    while (!pq.heap.empty())
    {
        // The first vertex in pair is the minimum distance
        // vertex, extract it from priority queue.

        int u = pq.extract_min().value[0];

        for (int i = 0; i < graph.adj[u].size(); i++)
        {
            // Get vertex label and weight of current
            // adjacent of u.
            int v = graph.adj[u][i].to;
            int weight = graph.adj[u][i].weight;

            // If there is shorted path to v through u.
            if (dist[v] > dist[u] + weight)
            {
                // Updating distance of v
                dist[v] = dist[u] + weight;

                // Add paths[u] to paths[v]
                paths[v] = paths[u];
                paths[v].push_back(graph.adj[u][i]);

                pq.changePriority(vector<int>(1, v), dist[v]);
            }
            else if (dist[v] == dist[u] + weight)
            {
                paths[v].push_back(graph.adj[u][i]);
            }
        }
    }

    GraphPaths gp(graph.n, graph.source);
    gp.dist = dist;
    gp.paths = paths;
    return gp;
}

vector<Graph> parseInput()
{
    vector<Graph> graphs;

    // While there are more lines to read, input line into string
    char line[8];
    cin.getline(line, 8);

    while (line[0] != '0' && line[2] != '0')
    {
        int n = line[0] - '0';
        int m = line[2] - '0';

        Graph g(n);

        cin.getline(line, 8);

        int start = line[0] - '0';
        int end = line[2] - '0';

        g.source = start;
        g.destination = end;

        for (int i = 0; i < m; i++)
        {
            cin.getline(line, 8);
            int from = line[0] - '0';
            int to = line[2] - '0';
            int weight = line[4] - '0';
            g.add_edge(from, to, weight);
        }

        cin.getline(line, 5);
        graphs.push_back(g);
    }
    return graphs;
}

vector<Graph> parseFromFile(string filename)
{
    vector<Graph> graphs;
    cout << "Parsing file: " << filename << endl;

    FILE *file = fopen("graph1.txt", "rb");
    if (!file)
    {
        printf("cannot open file\n");
        return graphs;
    }
    vector<char> line;
    int i = 0;
    char c = fgetc(file);
    while (!feof(file))
    {
        while (c != '\n' && c != EOF)
        {
            line.push_back(c);
            c = fgetc(file);
        }
        i++;
        // Convert the vector to a string
        string s(line.begin(), line.end());
        stringstream ss(s);

        if (s == "0 0")
        {
            break;
        }

        if (i == 1)
        {
            int n, m;
            ss >> n >> m;
            Graph g(n);
            graphs.push_back(g);
            line.clear();
            c = fgetc(file);
        }
        else if (i == 2)
        {
            int start, end;
            ss >> start >> end;
            graphs[graphs.size() - 1].source = start;
            graphs[graphs.size() - 1].destination = end;
            line.clear();
            c = fgetc(file);
        }
        else if (i > 2)
        {
            int from, to, weight;
            ss >> from >> to >> weight;
            graphs[graphs.size() - 1].add_edge(from, to, weight);
            line.clear();
            c = fgetc(file);
        }
    }
    fclose(file);

    return graphs;
}

char *shortest()
{
    string shortestPath = "default";
    vector<Graph> graphs = parseFromFile("graph1.txt");

    shortestPath = to_string(graphs[0].n) + " " + to_string(graphs[1].n) + "\n";
    for (auto graph : graphs)
    {
        ofstream file("shortestPath.txt");
        GraphPaths gp = dijkstra(graph, graph.n);
        if (gp.dist[graph.destination] == INF)
        {
            file << -1 << endl;
            shortestPath += "-1\n";
            char *shortestPathChar = new char[shortestPath.length() + 1];
            strcpy(shortestPathChar, shortestPath.c_str());
            return shortestPathChar;
        }

        for (auto edge : gp.paths[graph.destination])
        {
            shortestPath += to_string(edge.from) + " " + to_string(edge.to) + " " + to_string(edge.weight) + "\n";
            file << edge.from << " " << edge.to << " " << edge.weight << endl;
        }
    }
    char *shortestPathChar = new char[shortestPath.length() + 1];
    strcpy(shortestPathChar, shortestPath.c_str());
    return shortestPathChar;
}

int main()
{
    string shortestPath = "";
    vector<Graph> graphs = parseFromFile("graph1.txt");
    for (auto graph : graphs)
    {
        if (graph.source == 0 && graph.destination == 0)
        {
            break;
        }
        ofstream file("shortestPath.txt");
        GraphPaths gp = dijkstra(graph, graph.n);
        if (gp.dist[graph.destination] == INF)
        {
            file << -1 << endl;
            shortestPath += "-1\n";
            char *shortestPathChar = new char[shortestPath.length() + 1];
            strcpy(shortestPathChar, shortestPath.c_str());
            return 0;
        }

        for (auto edge : gp.paths[graph.destination])
        {
            shortestPath += to_string(edge.from) + " " + to_string(edge.to) + " " + to_string(edge.weight) + "\n";
            file << edge.from << " " << edge.to << " " << edge.weight << endl;
        }
    }
    char *shortestPathChar = new char[shortestPath.length() + 1];
    strcpy(shortestPathChar, shortestPath.c_str());
    cout << shortestPathChar;
    return 0;
}