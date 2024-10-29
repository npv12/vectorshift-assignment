# Vectorshift Assignments

This repository contains assignments for technical roles at [Vectorshift](https://vectorshift.ai).

## Overview

This repository hosts different assignments for evaluating candidates applying for various technical positions at Vectorshift:

- Backend Engineering Role
- Frontend Engineering Role

## Assignment Structure

The repository is organized into separate directories for each assignment type:

- `/backend-assignment` - Backend development tasks
- `/frontend-assignment` - Frontend development tasks

## Backend Assignment

The backend assignment focuses on building integrations with various third-party services including:

- Notion
- Slack
- Airtable
- Hubspot

Key technologies used:
- Python
- FastAPI
- Redis
- REST APIs

## Frontend Assignment

The frontend assignment consists of four comprehensive parts that test different aspects of frontend development:

### Part 1: Node Abstraction
- Create an efficient abstraction for different types of nodes (inputs, outputs, LLMs, text)
- Implement a system that reduces code duplication
- Demonstrate the abstraction by creating five new custom nodes
- Located in `/frontend/src/nodes`

### Part 2: Styling
- Implement a cohesive and appealing design system
- Style all components following either Vectorshift's existing design or create a new design
- Freedom to use any React packages/libraries

### Part 3: Text Node Logic
- Enhance the Text node functionality with:
  - Dynamic width/height adjustment based on content
  - Variable definition system using double curly brackets
  - Automatic Handle creation for defined variables
  - Example: `{{ input }}` creates a new input Handle

### Part 4: Backend Integration
- Connect frontend with the provided Python/FastAPI backend
- Implement pipeline submission functionality in `/frontend/src/submit.js`
- Backend endpoint `/pipelines/parse` integration
- Response format: `{num_nodes: int, num_edges: int, is_dag: bool}`
- Create user-friendly alerts displaying pipeline analysis results

Key technologies used:
- React
- JavaScript
- REST APIs
- Custom node system

## Getting Started

1. Clone this repository
2. Choose the relevant assignment directory
3. Follow the specific instructions in each assignment's directory

## Submission Guidelines

Please follow the submission guidelines provided in the assignment brief sent to you.

## Contact

For any questions regarding the assignments, please reach out to the Vectorshift hiring team.
