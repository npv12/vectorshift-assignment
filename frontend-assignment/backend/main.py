from collections import defaultdict, deque
from typing import Dict, List
from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()


class Node(BaseModel):
    id: str
    type: str
    data: Dict


class Edge(BaseModel):
    id: str
    source: str
    target: str


class PipelineRequest(BaseModel):
    nodes: List[Node]
    edges: List[Edge]


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with your desired list of allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Ping": "Pong"}


@app.post("/pipelines/parse")
def parse_pipeline(request: PipelineRequest):
    nodes = request.nodes
    edges = request.edges

    graph = defaultdict(list)
    in_degree = defaultdict(int)

    for edge in edges:
        graph[edge.source].append(edge.target)
        in_degree[edge.target] += 1

    queue = deque([node.id for node in nodes if in_degree[node.id] == 0])
    visited_count = 0

    while queue:
        current = queue.popleft()
        visited_count += 1
        for neighbor in graph[current]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    is_dag = visited_count == len(nodes)
    return {"num_nodes": len(nodes), "num_edges": len(edges), "is_dag": is_dag}
