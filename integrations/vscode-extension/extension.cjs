const vscode=require('vscode');
function activate(context){
 const diagnostics=vscode.languages.createDiagnosticCollection('freeaivideo-brief');context.subscriptions.push(diagnostics);
 async function run(exportMarkdown){
  const editor=vscode.window.activeTextEditor;if(!editor){vscode.window.showWarningMessage('Open a creative brief JSON document first.');return;}
  const document=editor.document;
  try{
   const raw=document.getText();if(Buffer.byteLength(raw,'utf8')>65536)throw new Error('Input exceeds 64 KiB.');
   const kit=await import('./kit.mjs'),brief=JSON.parse(raw),result=kit.validateBrief(brief);
   if(!result.valid)throw new Error(result.errors.join(' '));diagnostics.delete(document.uri);
   if(exportMarkdown){const output=await vscode.workspace.openTextDocument({language:'markdown',content:kit.toMarkdown(result.brief)});await vscode.window.showTextDocument(output);}
   else vscode.window.showInformationMessage('Valid creative brief.'+(result.warnings.length?' '+result.warnings.join(' '):''));
  }catch(error){const diagnostic=new vscode.Diagnostic(new vscode.Range(0,0,0,1),error.message,vscode.DiagnosticSeverity.Error);diagnostic.source='Free AI Video';diagnostics.set(document.uri,[diagnostic]);vscode.window.showErrorMessage(error.message);}
 }
 context.subscriptions.push(vscode.commands.registerCommand('freeaivideo.validateBrief',()=>run(false)),vscode.commands.registerCommand('freeaivideo.exportMarkdown',()=>run(true)));
}
module.exports={activate};
