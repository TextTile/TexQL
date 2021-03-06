function parseQuery(ast) {
    result = parseSelection(ast.operation, ast.variableValues);
    return result;
}

function parseValue(value, variables) {
	switch (value.kind) {
		case 'ListValue':
			return value.values.map(v => parseValue(v))
		case 'ObjectValue':
			let obj = {};
			for(const field of value.fields) {
				obj[field.name.value] = parseValue(field.value)
			}
			return obj
		case 'IntValue':
		case 'StringValue':
		case 'EnumValue':
		
			return value.value;
		case 'Variable':
			return variables[value.name.value];
			
		default:
			break;
		
	}
	return true;
}

function parseSelection(selection, variables) {
    let keys = {}
	let args = {};
	if(selection.arguments && selection.arguments.length > 0) {
		for (const argument of selection.arguments) {
			args[argument.name.value] = parseValue(argument.value, variables)
		}
	}
    if (selection.selectionSet) {
        for (let child of selection.selectionSet.selections) {
            keys[child.name.value] = parseSelection(child, variables);
        }
    }
    return {keys, args};
}

module.exports = { parseQuery }