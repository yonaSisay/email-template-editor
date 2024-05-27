import React from "react";
import EmailEditor from "react-email-editor";
import { Button } from "antd";

export default class EmailEditorContainer extends React.Component {
	constructor(props) {
		super(props);
		this.fileInputRef = React.createRef();
		this.editorRef = React.createRef(); // Adding editorRef

		this.state = {
			htmlFile: null,
		};
	}

	loadTemplate = () => {
		const { htmlFile } = this.state;
		if (htmlFile) {
			try {
				this.editorRef.current.editor.loadDesign({
					html: htmlFile,
					classic: true,
				});
			} catch (err) {
				console.error(err);
			}
		} else {
			console.error("No HTML file uploaded.");
		}
	};

	handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				const htmlContent = event.target.result;
				this.setState({ htmlFile: htmlContent });
			};
			reader.readAsText(file);
		}
	};

	saveDesign = () => {
		console.log("inside saveDesign");
		try {
			this.editorRef.current.editor.saveDesign((data) => {
				console.log(data);
			});
		} catch (err) {
			console.error(err);
		}
	};

	clearDesign = () => {
		console.log("inside clearDesign", this.editorRef.current.editor);
	};

	exportHTML = () => {
		this.editorRef.current.editor.exportHtml((data) => {
			const htmlContent = data.html;
			const blob = new Blob([htmlContent], { type: "text/html" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = "exported_template.html";
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		});
	};

	render() {
		return (
			<div className="space-y-6 pb-4 flex flex-col px-4 h-full w-full py-8">
				<div className="flex justify-between">
					<div className="flex gap-x-4">
						<input
							type="file"
							accept=".html"
							onChange={this.handleFileChange}
							ref={this.fileInputRef}
							style={{ display: "none" }}
						/>
						<button
							className="text-white hover:bg-blue-800 bg-blue-900 px-6 py-3 rounded-md"
							onClick={() => this.fileInputRef.current.click()}
						>
							Upload HTML File
						</button>
						<button
							className="text-white hover:bg-blue-800 bg-blue-900 px-6 py-3 rounded-md"
							onClick={this.loadTemplate}
						>
							Load Template
						</button>
					</div>

					<button
						className="text-white hover:bg-blue-800 bg-blue-900 px-6 py-3 rounded-md"
						onClick={this.exportHTML}
					>
						Export HTML
					</button>
				</div>

				<h1 className="text-sm text-blue-900">
					Upload the Html File and Click Load the template{" "}
				</h1>
				<EmailEditor
					ref={this.editorRef}
					options={{
						tools: {
							html: {
								enabled: false,
							},
						},
					}}
				/>
			</div>
		);
	}
}
