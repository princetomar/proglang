// Lexer function to generate tokens for the code
function lexer(input) {
  const tokens = [];
  let cursor = 0;

  while (cursor < input.length) {
    // get the current charachter
    let char = input[cursor];

    // if current charachter is an space -> skip it
    if (/\s/.test(char)) {
      cursor++;
      continue;
    }

    // if current charachter is an alphabet
    if (/[a-zA-Z]/.test(char)) {
      // 1. start creating a word from charachters
      let word = "";
      while (/[a-zA-Z0-9]/.test(char)) {
        word += char;
        char = input[++cursor];
      }

      // if our word is an keyword - [take / batao]
      if (word === "take" || word === "batao") {
        tokens.push({
          type: "keyword",
          value: word,
        });
      }
      // if it's not a keywords, means it's an identifier
      else {
        tokens.push({
          type: "identifier",
          value: word,
        });
      }
      continue;
    }

    // if current charachter is an number
    if (/[0-9]/.test(char)) {
      // create the complete number
      let num = "";
      while (/[0-9]/.test(char)) {
        num += char;
        char = input[++cursor];
      }
      tokens.push({
        type: "number",
        value: parseInt(num),
      });
      continue;
    }

    // if current charachter is an equals sign / assignment operator
    if (/[\+\-\*\/=]/.test(char)) {
      tokens.push({
        type: "operator",
        value: char,
      });
      cursor++;
      continue;
    }
  }

  return tokens;
}

// Parser function to create an AST
function createASTParser(tokens) {
  const ast = {
    type: "Program",
    body: [],
  };

  while (tokens.length > 0) {
    let currentToken = tokens.shift();

    // if token is an keyword and it's - take
    if (currentToken.type === "keyword" && currentToken.value === "take") {
      // it's a declaration
      let declaration = {
        type: "Declaration",
        name: tokens.shift().value,
        value: null,
      };

      // if it's an assignment operator
      if (tokens[0].type === "operator" && tokens[0].value === "=") {
        tokens.shift(); // consuming '='
        // Parse the expression now
        let expression = "";
        while (tokens.length > 0 && tokens[0].type !== "keyword") {
          expression += tokens.shift().value;
        }
        declaration.value = expression.trim();
      }

      // PUSH IT IN THE AST BODY
      ast.body.push(declaration);
    }

    if (currentToken.type === "keyword" && currentToken.value === "batao") {
      ast.body.push({
        type: "Print",
        expression: tokens.shift().value,
      });
    }
  }
  return ast;
}

// Function to generate the code from a given AST
function generateCode(node) {
  // We can have types as - [Program / Declaration / Print], so let's use swith case here
  switch (node.type) {
    // If it's a program, Generate it's body code recursively
    case "Program":
      return node.body.map(generateCode).join("\n");

    // If it's an declaration
    case "Declaration":
      return `const ${node.name} = ${node.value};`;

    // If it's an Print
    case "Print":
      return `console.log("AAPKA OUTPUT:", ${node.expression});`;
  }
}

// Function to take input source code, and compile the code
function compiler(input) {
  // 1. Get the tokens from a lexer
  const tokens = lexer(input);
  console.log("AFTER LEXER METHOD \n");
  console.log(tokens);
  // 2. Create a AST from the tokens
  console.log("\nAFTER AST CREATION \nAST\n");
  const ast = createASTParser(tokens);
  console.log(ast);

  // 3. Generate the code in any programming language, using js here
  const executableCode = generateCode(ast);
  console.log("\nEXECUTABLE CODE\n");
  console.log(executableCode, "\n\n");

  return executableCode;
}

// Function to take code generated by compiler and run it
function runner(input) {
  eval(input);
}

const code = `
take a = 20
take b = 110

take sum = a * b
batao sum
`;

const exec = compiler(code);
runner(exec);
