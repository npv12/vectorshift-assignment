// submit.js
import { Button } from "@mui/material";
import { useStore } from "./store";
import { shallow } from "zustand/shallow";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);

  const submitPipeline = (data) => {
    const url = "http://localhost:8000/pipelines/parse";
    if (!nodes || nodes.length === 0) {
      toast.error("Error: Nodes are required");
      return;
    }

    if (!edges || edges.length === 0) {
      toast.error("Error: Edges are required");
      return;
    }

    const cleanedNodes = JSON.parse(JSON.stringify(nodes));
    const cleanedEdges = JSON.parse(JSON.stringify(edges));

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nodes: cleanedNodes, edges: cleanedEdges }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.is_dag) {
          toast.success(
            `Pipeline submitted successfully with ${data.num_nodes} Nodes and ${data.num_edges} Edges`
          );
        } else {
          toast.error("Error: Pipeline is not a DAG");
        }
      })
      .catch((error) => {
        toast.error("Error:", error.message);
      });
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Button variant="contained" color="primary" onClick={submitPipeline}>
        Submit
      </Button>
      <ToastContainer />
    </div>
  );
};
