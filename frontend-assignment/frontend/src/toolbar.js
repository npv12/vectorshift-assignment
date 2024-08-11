import { DraggableNode } from "./draggableNode";
import nodeConfigs from "./nodes/nodeconfig";

export const PipelineToolbar = () => {
  return (
    <div style={{ padding: "10px" }}>
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ padding: "10px" }}>
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            {nodeConfigs.map((config) => (
              <DraggableNode type={config.key} label={config.config.name} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
