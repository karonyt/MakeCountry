import ts from 'typescript';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, relative, resolve, sep } from 'node:path';
import { readFileSync } from 'node:fs';

const base=dirname(fileURLToPath(import.meta.url));
const japanese=/[\u3040-\u30ff\u3400-\u9fff]/u;
const formMethods=new Set(['title','body','button','button1','button2','header','label','toggle','slider','submitButton','setTitle','setActionBar','updateSubtitle','setText']);
const chatSource=/(?:domain\/chat\/|chat_translation(?:_delivery)?\.js$|chat-router\.|server-net\.|plugins\/karoearth\/chat\.ts$)/;
const lorePersistenceSource=/(?:portable-item-codec|\/transfer|virtual-storage|\/inventory\/backpack|\/compensation|item-trade|player-market|\/packaging\/storage)\.ts$/;
function keyFor(parts) { return 'game.ui.'+createHash('sha256').update(JSON.stringify(parts)).digest('hex').slice(0,16); }
function isCaptured(node) {
    return ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text==='__uiCapture';
}
function stringParts(node) {
    if(ts.isStringLiteralLike(node) || ts.isTemplateExpression(node) || isCaptured(node))return [node];
    if(ts.isParenthesizedExpression(node))return stringParts(node.expression);
    if(!ts.isBinaryExpression(node) || node.operatorToken.kind!==ts.SyntaxKind.PlusToken)return undefined;
    const left=stringParts(node.left), right=stringParts(node.right);
    return left && right ? [...left,...right] : undefined;
}
function textOf(node,source) {
    try { return node.getText(source); }
    catch { return ts.createPrinter().printNode(ts.EmitHint.Unspecified,node,source); }
}
function userData(node,source) {
    if(isCaptured(node))return false;
    const text=textOf(node,source);
    if(/^(?:name|playerName|targetName|countryName|countryLine|federationName|ownerName|authorName|horseName|newName|customName|userText|customText|reason|reasonText)(?:\??\.|$)/.test(text))return true;
    if(/\b(?:r|row)\??\.n\b/.test(text))return true;
    return /(?:\b(?:player|sender|targetPlayer|member|memberData|countryData|playerCountryData|country|record|inviter|receiver|owner|p|pl|role|roleData|plot|plotData|plotGroup|group|groupData|federation|federationData|user|userData)\??\.|\.(?:playerName|gamertag|gamerTag|authorName|displayName)\b|\blanguageName\(|\b(?:item(?:Stack)?|stack|book|current|previous|common)\??\.nameTag\b|__uiGetNameTag\((?:item(?:Stack)?|stack|book|current|previous|common)\b)/.test(text);
}

/** Restrict localization to presentation APIs; never rewrite domain/storage values. */
export function gameUiLocalization(pack) {
    const runtime=resolve(base,'..','localization',`ui-${pack}.js`);
    const catalogSource=readFileSync(resolve(base,'..','localization','catalog',pack==='lobby'?'lobby.js':'all.js'),'utf8');
    const catalog=JSON.parse(catalogSource.slice(catalogSource.indexOf('export default')+'export default'.length).trim().replace(/;$/,''));
    const knownKeys=new Set(catalog.map(entry=>entry[0]));
    return {
        name:'game-ui-localization',
        transform(code,id) {
            // Windows では id が \ 区切りで渡されるため、以降のパス判定用に / へ揃える
            id=id.replaceAll('\\','/');
            if(!/\.[cm]?[jt]s$/.test(id) || /node_modules|\/localization\//.test(id)) return null;
            const source=ts.createSourceFile(id,code,ts.ScriptTarget.Latest,true,id.endsWith('.js')?ts.ScriptKind.JS:ts.ScriptKind.TS);
            let changed=false;
            const factory=ts.factory;
            const call=(name,args)=>factory.createCallExpression(factory.createIdentifier(name),undefined,args);
            const literal=node=>call('__uiLiteral',[node]);
            function display(node) {
                if(isCaptured(node))return call('__uiRaw',[node]);
                const parts=stringParts(node);
                if(parts && parts.length>1 && parts.some(part=>isCaptured(part) || japanese.test(textOf(part,source)))) {
                    const rawtext=parts.map(part=>userData(part,source) && !japanese.test(textOf(part,source))
                        ? literal(part)
                        : factory.createObjectLiteralExpression([factory.createPropertyAssignment('text',part)]));
                    return call('__uiRaw',[factory.createObjectLiteralExpression([
                        factory.createPropertyAssignment('rawtext',factory.createArrayLiteralExpression(rawtext)),
                    ])]);
                }
                if(ts.isTemplateExpression(node)) {
                    const parts=[node.head.text,...node.templateSpans.map(span=>span.literal.text)];
                    const key=keyFor(parts);
                    if(!knownKeys.has(key) && parts.some(part=>japanese.test(part))) throw Error(`Missing UI localization template in ${id}: ${key}`);
                    if(knownKeys.has(key)) {
                    const parameters=node.templateSpans.map(span=>{
                        const expression=span.expression;
                        return userData(expression,source) ? literal(expression) : call('__uiRaw',[expression]);
                    });
                    return call('__uiTemplate',[factory.createStringLiteral(key),factory.createArrayLiteralExpression(parameters)]);
                    }
                }
                if(userData(node,source) && !japanese.test(textOf(node,source)) && !ts.isArrayLiteralExpression(node) && !ts.isObjectLiteralExpression(node)) return literal(node);
                if((ts.isStringLiteral(node)||ts.isNoSubstitutionTemplateLiteral(node)) && japanese.test(node.text) && !knownKeys.has(keyFor([node.text])))
                    throw Error(`Missing UI localization text in ${id}: ${keyFor([node.text])}`);
                return call('__uiRaw',[node]);
            }
            function visitor(node) {
                node=ts.visitEachChild(node,visitor,context);
                if(ts.isTemplateExpression(node)) {
                    const parts=[node.head.text,...node.templateSpans.map(span=>span.literal.text)],key=keyFor(parts);
                    if(knownKeys.has(key)) {
                        changed=true;
                        const values=node.templateSpans.map(span=>factory.createTemplateExpression(factory.createTemplateHead(''),[factory.createTemplateSpan(span.expression,factory.createTemplateTail(''))]));
                        return call('__uiCapture',[factory.createStringLiteral(key),factory.createArrayLiteralExpression(values),factory.createArrayLiteralExpression(node.templateSpans.map(span=>userData(span.expression,source)?factory.createFalse():factory.createTrue()))]);
                    }
                }
                if(ts.isObjectLiteralExpression(node) && node.properties.length===1 && ts.isPropertyAssignment(node.properties[0])
                    && textOf(node.properties[0].name,source)==='text' && ts.isCallExpression(node.properties[0].initializer)
                    && ts.isIdentifier(node.properties[0].initializer.expression) && node.properties[0].initializer.expression.text==='__uiGetNameTag') {
                    changed=true;return call('__uiNameTagMessage',[...node.properties[0].initializer.arguments]);
                }
                if(ts.isObjectLiteralExpression(node) && node.properties.length===1 && ts.isPropertyAssignment(node.properties[0])
                    && textOf(node.properties[0].name,source)==='text' && userData(node.properties[0].initializer,source)) {
                    changed=true;
                    return literal(node.properties[0].initializer);
                }
                if(ts.isObjectLiteralExpression(node) && node.properties.some(property=>ts.isPropertyAssignment(property)&&textOf(property.name,source)==='iconPath')) {
                    const properties=node.properties.map(property=>{
                        if(!ts.isPropertyAssignment(property)||textOf(property.name,source)!=='name')return property;
                        const value=property.initializer;
                        if(!ts.isPropertyAccessExpression(value)||!userData(value,source))return property;
                        changed=true;
                        return factory.updatePropertyAssignment(property,property.name,factory.createArrayLiteralExpression([literal(value)]));
                    });
                    node=factory.updateObjectLiteralExpression(node,properties);
                }
                if(ts.isBinaryExpression(node) && node.operatorToken.kind===ts.SyntaxKind.EqualsToken
                    && ts.isPropertyAccessExpression(node.left) && node.left.name.text==='nameTag') {
                    changed=true;
                    return call('__uiSetNameTag',[node.left.expression,display(node.right)]);
                }
                if(ts.isPropertyAccessExpression(node) && node.name.text==='nameTag') {
                    const parent=node.parent;
                    if(parent && ((ts.isBinaryExpression(parent)&&parent.left===node) || ts.isDeleteExpression(parent))) return node;
                    changed=true;
                    return call('__uiGetNameTag',[node.expression,node.questionDotToken?factory.createTrue():factory.createFalse()]);
                }
                if(ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
                    const method=node.expression.name.text;
                    if(method==='runCommand' && node.arguments.length===1 && /^[`'"](?:kick|titleraw)\s/.test(textOf(node.arguments[0],source))) {
                        changed=true;
                        const optional=!!(node.expression.questionDotToken||node.questionDotToken);
                        const argument=optional?factory.createArrowFunction(undefined,undefined,[],undefined,factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),node.arguments[0]):node.arguments[0];
                        return call('__uiRunCommand',[node.expression.expression,argument,optional?factory.createTrue():factory.createFalse()]);
                    }
                    if(method==='registerCommand' && node.arguments.length>=2) {
                        changed=true;
                        const args=[...node.arguments];args[0]=call('__uiCommandInfo',[args[0]]);args[1]=call('__uiCommandCallback',[args[1]]);
                        return factory.updateCallExpression(node,node.expression,node.typeArguments,args);
                    }
                    if(method==='getLore' && node.arguments.length===0) { changed=true;return call('__uiLiteralLore',[node]); }
                    let args=[...node.arguments];
                    if(args.length && (formMethods.has(method) || (method==='sendMessage' && (!chatSource.test(id)||isCaptured(args[0])||japanese.test(textOf(args[0],source)))))) {
                        args[0]=display(args[0]);
                        if(method==='setText')args[0]=call('__uiPrimitive',[args[0]]);
                        if(method==='setTitle' && args[1]) args[1]=call('__uiTitleOptions',[args[1]]);
                    } else if(method==='textField' && args.length>=2) { args[0]=display(args[0]);args[1]=display(args[1]); }
                    else if(method==='dropdown' && args.length>=2) { args[0]=display(args[0]);args[1]=call('__uiRaw',[args[1]]); }
                    else if(method==='setLore' && args.length && !lorePersistenceSource.test(id)) {
                        if(ts.isArrayLiteralExpression(args[0])) args[0]=factory.updateArrayLiteralExpression(args[0],args[0].elements.map(element=>
                            ts.isSpreadElement(element)?factory.updateSpreadElement(element,call('__uiLore',[element.expression])):display(element)));
                        else args[0]=call('__uiLore',[args[0]]);
                    }
                    else return node;
                    changed=true;
                    return factory.updateCallExpression(node,node.expression,node.typeArguments,args);
                }
                if(ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text==='readLiteralLore' && node.arguments.length) {
                    changed=true;
                    const args=[...node.arguments];args[0]=call('__uiLiteralLore',[args[0]]);
                    return factory.updateCallExpression(node,node.expression,node.typeArguments,args);
                }
                if(ts.isNewExpression(node) && textOf(node.expression,source)==='TextPrimitive' && node.arguments?.length>=2) {
                    throw Error(`Use localization/primitive-text.js for native text labels in ${id}; RawMessage can silently produce empty native text.`);
                }
                return node;
            }
            let context;
            const result=ts.transform(source,[ctx=>{context=ctx;return root=>ts.visitNode(root,visitor);}]);
            if(!changed) { result.dispose();return null; }
            const transformed=ts.createPrinter({newLine:ts.NewLineKind.LineFeed}).printFile(result.transformed[0]);
            result.dispose();
            let imported=relative(dirname(id),runtime).split(sep).join('/');if(!imported.startsWith('.')) imported='./'+imported;
            return {code:`import { raw as __uiRaw, primitive as __uiPrimitive, template as __uiTemplate, capture as __uiCapture, literal as __uiLiteral, lore as __uiLore, literalLore as __uiLiteralLore, setNameTag as __uiSetNameTag, getNameTag as __uiGetNameTag, getNameTagMessage as __uiNameTagMessage, titleOptions as __uiTitleOptions, commandInfo as __uiCommandInfo, commandCallback as __uiCommandCallback, runCommand as __uiRunCommand } from ${JSON.stringify(imported)};\n`+transformed,map:null};
        },
    };
}
