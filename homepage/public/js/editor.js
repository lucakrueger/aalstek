require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor@latest/min/vs' }});
window.MonacoEnvironment = { getWorkerUrl: () => proxy };

let proxy = URL.createObjectURL(new Blob([`
	self.MonacoEnvironment = {
		baseUrl: 'https://unpkg.com/monaco-editor@latest/min/'
	};
	importScripts('https://unpkg.com/monaco-editor@latest/min/vs/base/worker/workerMain.js');
`], { type: 'text/javascript' }));

require(["vs/editor/editor.main"], () => {
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        experimentalDecorators: true,
        allowSyntheticDefaultImports: true,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.Classic,
        allowNonTsExtensions: true,
        target: monaco.languages.typescript.ScriptTarget.ES2020,
   });

   monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
		noSemanticValidation: true,
		noSyntaxValidation: false,
	});

	// compiler options
	monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
		target: monaco.languages.typescript.ScriptTarget.ES2015,
		allowNonTsExtensions: true,
	});

	// extra libraries
	var libSource = [
		"declare class Facts {",
		"    /**",
		"     * Returns the next fact",
		"     */",
		"    static next():string",
		"}",
	].join("\n");
	var libUri = "ts:filename/facts.d.ts";
	monaco.languages.typescript.javascriptDefaults.addExtraLib(libSource, libUri);
	// When resolving definitions and references, the editor will try to use created models.
	// Creating a model for the library allows "peek definition/references" commands to work with the library.
	monaco.editor.createModel(libSource, "typescript", monaco.Uri.parse(libUri));

	let editor = monaco.editor.create(document.getElementById('monaco'), {
		value: [
			'function x() {',
			'\tconsole.log("Hello world!");',
			'}'
		].join('\n'),
		language: 'javascript',
		theme: 'vs-light'
	});
});