import {createExample,validateBrief,compileBrief,toMarkdown} from './kit.js';
const $=id=>document.getElementById(id),editor=$('brief');let validated=null;
function status(text,ok){$('status').textContent=text;$('status').dataset.ok=String(ok);}
function clear(){validated=null;$('save-md').disabled=true;$('prompt').textContent='Validate a brief to see its prompt.';}
function load(){editor.value=JSON.stringify(createExample($('mode').value),null,2);clear();status('Example loaded. Edit it, then validate.',true);}
function read(){if(new TextEncoder().encode(editor.value).length>65536)throw new Error('Input exceeds 64 KiB.');return JSON.parse(editor.value);}
function download(name,text,type){const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
editor.addEventListener('input',clear);$('example').addEventListener('click',load);
$('validate').addEventListener('click',()=>{try{clear();const input=read(),result=validateBrief(input);if(!result.valid)throw new Error(result.errors.join(' '));validated=result.brief;$('prompt').textContent=compileBrief(validated).prompt;$('save-md').disabled=false;status('Valid brief.'+(result.warnings.length?' '+result.warnings.join(' '):''),true);}catch(e){status(e.message,false);}});
$('save-json').addEventListener('click',()=>{try{const result=validateBrief(read());if(!result.valid)throw new Error(result.errors.join(' '));download('creative-brief.json',JSON.stringify(result.brief,null,2)+'\n','application/json');}catch(e){status(e.message,false);}});
$('save-md').addEventListener('click',()=>{if(validated)download('creative-brief.md',toMarkdown(validated),'text/markdown');});
$('import').addEventListener('change',async e=>{try{const file=e.target.files[0];if(!file)return;if(file.size>65536)throw new Error('Input exceeds 64 KiB.');const text=await file.text();JSON.parse(text);editor.value=text;clear();status('JSON imported locally. Validate to check the brief.',true);}catch(e){status(e.message,false);}});load();
