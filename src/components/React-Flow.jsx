import React, { useState, useCallback, useEffect, useRef } from "react";
import ReactFlow, {
	MiniMap,
	Controls,
	Background,
	useNodesState,
	useEdgesState,
	addEdge,
} from "reactflow";

import "reactflow/dist/style.css";

const initialNodes = [];
const initialEdges = [];

export default function App() {
	const [nodeName, setNodeName] = useState("");
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

	const onConnect = useCallback(
		(params) => setEdges((eds) => addEdge(params, eds)),
		[setEdges]
	);

	const addNode = () => {
		if (!nodeName.trim()) {
			alert("Please enter a node name.");
			return;
		}

		const newNode = {
			id: (nodes.length + 1).toString(),
			data: { label: nodeName },
			position: { x: 100, y: 100 }, // Fixed position for the new node
		};

		setNodes((prevElements) => [...prevElements, newNode]);
		setNodeName(""); // Reset the input field after adding the node
	};

	const editNode = () => {
		if (!selectedNode) {
			alert("Please select a node to edit.");
			return;
		}

		const updatedNode = {
			...selectedNode,
			data: { label: nodeName },
		};

		setNodes((nodes) =>
			nodes.map((node) => (node.id === selectedNode.id ? updatedNode : node))
		);

		setNodeName(""); // Reset the input field after editing the node

		setSelectedNode(null);
	};

	// const onNodeEdit = (id, data) => {
	// 	setNodes((nodes) => nodes.map((node) => (node.id === id ? data : node)));
	// };
	const [selectedNode, setSelectedNode] = useState(null);

	const onNodeClicked = (e) => {
		setSelectedNode(
			nodes.find((node) => node.id == e.target.getAttribute("data-id"))
		);

		setNodeName(
			nodes.find((node) => node.id == e.target.getAttribute("data-id")).data
				.label
		);
	};

	const fileInputRef = useRef(null);

	const handleInputChange = (e) => {
		setNodeName(e.target.value);
	};

	const handleFileUpload = (event) => {
		const file = event.target.files[0];

		if (!file) {
			alert("Please select a file.");
			return;
		}

		if (file.type !== "application/json") {
			alert("Please upload a JSON file.");
			return;
		}

		const reader = new FileReader();

		reader.onload = (event) => {
			const json = JSON.parse(event.target.result);
			setNodes(json.nodes);
			setEdges(json.edges);
		};

		reader.readAsText(file);

		fileInputRef.current.value = null;
	};

	return (
		<div className="h-screen w-screen space-y-6 ">
			<div className="flex gap-x-4 rounded-lg">
				<input
					className="border rounded border-gray-300 p-2"
					type="text"
					placeholder="Enter node name"
					value={nodeName}
					onChange={handleInputChange}
				/>

				<button
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					onClick={selectedNode ? editNode : addNode}
				>
					{selectedNode ? "Update Node" : "Add Node"}
				</button>
				<button
					onClick={() => fileInputRef.current.click()}
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				>
					Load JSON
				</button>
				<input
					ref={fileInputRef}
					type="file"
					className="hidden"
					onChange={handleFileUpload}
					maxLength={1}
				/>
			</div>

			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				onNodeClick={onNodeClicked}
			>
				<Controls />
				<MiniMap />
				<Background variant="dots" gap={12} size={1} />
			</ReactFlow>
		</div>
	);
}
