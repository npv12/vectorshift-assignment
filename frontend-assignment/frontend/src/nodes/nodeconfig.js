const nodeConfigs = [
    {
        key: "customInput",
        config: {
            name: "Input",
            hasType: true,
            hasName: true,
            typeFormat: ["Text", "File"],
            leftHandleNum: 0,
            rightHandleNum: 1,
        }
    },
    {
        key: "llm",
        config: {
            name: "LLM",
            description: "This is a LLM",
            hasType: false,
            hasName: false,
            leftHandleNum: 2,
            rightHandleNum: 1,
        }
    },
    {
        key: "text",
        config: {
            name: "Text",
            hasType: false,
            hasName: true,
            leftHandleNum: 0,
            rightHandleNum: 1,
        }
    },
    {
        key: "customOutput",
        config: {
            name: "Output",
            hasType: true,
            typeFormat: ["Text", "Image"],
            hasName: true,
            leftHandleNum: 1,
            rightHandleNum: 0,
        }
    },
    {
        key: "customInput2",
        config: {
            name: "Input with description",
            description: "This is an input with a description",
            hasType: true,
            typeFormat: ["Text", "Image"],
            hasName: true,
            leftHandleNum: 1,
            rightHandleNum: 0,
        }
    },
    {
        key: "randomNode1",
        config: {
            name: "Random Node 1",
            hasType: true,
            hasName: true,
            typeFormat: ["Text", "File"],
            leftHandleNum: 2,
            rightHandleNum: 1,
        }
    },
    {
        key: "randomNode2",
        config: {
            name: "Random Node 2",
            hasType: false,
            hasName: false,
            leftHandleNum: 0,
            rightHandleNum: 1,
        }
    },
    {
        key: "randomNode3",
        config: {
            name: "Random Node 3",
            hasType: false,
            hasName: true,
            leftHandleNum: 1,
            rightHandleNum: 3,
        }
    },
    {
        key: "randomNode4",
        config: {
            name: "Random Node 4",
            hasType: true,
            typeFormat: ["Text", "Image"],
            hasName: true,
            leftHandleNum: 4,
            rightHandleNum: 2,
        }
    },
];

export default nodeConfigs;