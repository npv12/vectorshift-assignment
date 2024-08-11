import { useState, useCallback } from "react";
import { Handle, Position } from "reactflow";
import { useUpdateNodeInternals } from "reactflow";
import { Box, TextField, Typography } from "@mui/material";

import "./select.css";

const GenericNodes = ({
  id,
  data,
  name,
  description,
  hasName,
  hasType,
  typeFormat,
  leftHandleNum,
  rightHandleNum,
}) => {
  const updateNodeInternals = useUpdateNodeInternals();

  const [currName, setCurrName] = useState(
    data?.inputName || id.replace("customInput-", "input_")
  );

  const [inputType, setInputType] = useState(
    data.inputType || typeFormat?.length ? typeFormat[0] : ""
  );

  const [customVariables, setCustomVariables] = useState([]);

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
    setCustomVariables(extractCustomVariables(e.target.value));
  };

  const handleTypeChange = (e) => {
    setInputType(e.target.value);
  };

  useCallback(() => {
    updateNodeInternals(id);
  }, [id, updateNodeInternals]);

  const extractCustomVariables = (input) => {
    const regex = /{{(.*?)}}/g;
    const matches = input.match(regex);
    if (!matches) return [];
    // remove the extra curly braces
    matches.forEach((match, index) => {
      matches[index] = match.slice(2, -2).trim();
    });
    return matches;
  };

  const nodeStyle = {
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid black",
    display: "inline-block",
    maxWidth: "100%",
    wordWrap: "break-word",
    position: "relative",
  };

  return (
    <Box sx={nodeStyle}>
      {Array.from({ length: leftHandleNum }, (_, index) => (
        <Handle
          type="target"
          position={Position.Left}
          style={{
            top: `${
              ((index + 1) * 100) / (leftHandleNum + customVariables.length + 1)
            }%`,
          }}
          id={`${id}-left-value-${index}`}
        />
      ))}
      {customVariables &&
        customVariables.map((variable, index) => (
          <div
            key={`${id}-custom-handle-${index}`}
            style={{
              position: "absolute",
              top: `${
                ((leftHandleNum + index + 1) * 100) /
                (leftHandleNum + customVariables.length + 1)
              }%`,
              left: "0px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography sx={{
              position: "absolute",
              left: `-60px`,
            }}>{variable}</Typography>
            <Handle
              type="target"
              position={Position.Left}
              id={`${id}-custom-${variable}`}
            />
          </div>
        ))}
      <Box>
        <Typography variant="h5">{name}</Typography>
      </Box>
      {description && (
        <Box
          sx={{
            px: 1,
          }}
        >
          <Typography variant="body2">{description}</Typography>
        </Box>
      )}
      {hasName && (
        <Box
          sx={{
            p: 2,
          }}
        >
          <TextField
            label="Name"
            value={currName}
            onChange={handleNameChange}
            variant="outlined"
            multiline
            size="small"
            sx={{ padding: "5px" }}
          />
        </Box>
      )}
      {hasType && typeFormat.length && (
        <Box
          sx={{
            px: 2,
            pb: 1,
          }}
        >
          <div class="select-container">
            <Typography
              variant="body2"
              sx={{
                pr: 1,
              }}
            >
              Type:
            </Typography>
            <select id="type-select" class="custom-select" defaultValue="Text">
              {typeFormat.map((type) => (
                <option
                  value={type}
                  selected={inputType === type}
                  onClick={handleTypeChange}
                >
                  {type}
                </option>
              ))}
            </select>
          </div>
        </Box>
      )}
      {Array.from({ length: rightHandleNum }, (_, index) => (
        <Handle
          type="source"
          style={{ top: `${((index + 1) * 100) / (rightHandleNum + 1)}%` }}
          position={Position.Right}
          id={`${id}-right-value-${index}`}
        />
      ))}
    </Box>
  );
};

export default GenericNodes;
